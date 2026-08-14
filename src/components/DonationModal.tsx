import React, { useState } from 'react';
import type { Campaign } from '../types';
import { useWallet } from '../contexts/WalletContext';
import { ContractService } from '../services/contract';
import { CampaignService } from '../services/campaign';

interface DonationModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, txHash: string) => void;
}

type DonationStep = 'input' | 'pending' | 'success' | 'failure';

export const DonationModal: React.FC<DonationModalProps> = ({ campaign, isOpen, onClose, onSuccess }) => {
  const { walletState, setShowSelector } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<DonationStep>('input');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen || !campaign) return null;

  const handlePreset = (val: number) => {
    setAmount(val.toString());
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    if (!walletState.isConnected || !walletState.address || !walletState.walletType) {
      setShowSelector(true);
      return;
    }

    setStep('pending');
    setErrorMessage('');

    try {
      const result = await ContractService.donateOnChain(
        walletState.address,
        campaign.title,
        parsedAmount,
        campaign.creator === 'Lumina Architects' 
          ? 'GB6F242XWOD2K46N2H4JOTR65XWL2M5Q4Y7D4WZ2NTRLJO3WRXYZ9999' 
          : undefined
      );

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
        // Persist donation locally
        CampaignService.addDonation(campaign.id, parsedAmount);
        setStep('success');
        onSuccess(parsedAmount, result.txHash);
      } else {
        setErrorMessage(result.error || 'The transaction was rejected or failed on-chain.');
        setStep('failure');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setStep('failure');
    }
  };

  const handleClose = () => {
    setAmount('');
    setStep('input');
    setTxHash('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-margin-mobile">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={step !== 'pending' ? handleClose : undefined}></div>

      {/* Modal Container */}
      <div className="relative glass-panel w-full max-w-md rounded-xl p-stack-lg shadow-2xl z-10 border border-outline-variant bg-surface/95 text-left">
        
        {/* Close Button */}
        {step !== 'pending' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
          >
            close
          </button>
        )}

        {/* INPUT STEP */}
        {step === 'input' && (
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">Support Project</h3>
            <p className="font-body-sm text-on-surface-variant mb-stack-md">
              Contributing to <span className="text-primary font-semibold">{campaign.title}</span>.
            </p>

            <form onSubmit={handleDonate} className="space-y-stack-md">
              <div className="space-y-stack-sm">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
                  Donation Amount
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-high border border-outline-variant p-4 font-table-data text-xl text-primary focus:outline-none focus:border-primary transition-colors"
                    placeholder="0.00"
                    type="number"
                    step="any"
                    min="0.0000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-mono text-on-surface-variant">XLM</span>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-stack-sm">
                <button
                  type="button"
                  className="border border-outline-variant py-2 font-label-mono text-body-sm hover:border-primary text-primary transition-colors"
                  onClick={() => handlePreset(10)}
                >
                  10
                </button>
                <button
                  type="button"
                  className="border border-outline-variant py-2 font-label-mono text-body-sm hover:border-primary text-primary transition-colors"
                  onClick={() => handlePreset(25)}
                >
                  25
                </button>
                <button
                  type="button"
                  className="border border-outline-variant py-2 font-label-mono text-body-sm hover:border-primary text-primary transition-colors"
                  onClick={() => handlePreset(50)}
                >
                  50
                </button>
                <button
                  type="button"
                  className="border border-outline-variant py-2 font-label-mono text-body-sm hover:border-primary text-primary transition-colors"
                  onClick={() => handlePreset(100)}
                >
                  100
                </button>
              </div>

              {walletState.isConnected ? (
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary py-4 font-bold text-lg flex items-center justify-center gap-stack-sm hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  Support with {walletState.walletType === 'freighter' ? 'Freighter' : 'Albedo'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSelector(true)}
                  className="w-full bg-primary text-on-primary py-4 font-bold text-lg flex items-center justify-center gap-stack-sm hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  Connect Wallet
                </button>
              )}

              <p className="font-body-sm text-xs text-on-surface-variant text-center px-4">
                By contributing, you agree to the project's Terms of Governance and Milestone Release schedule.
              </p>
            </form>
          </div>
        )}

        {/* PENDING STEP */}
        {step === 'pending' && (
          <div className="flex flex-col items-center gap-stack-lg py-stack-lg text-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-outline-variant rounded-full"></div>
              <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-2">Transaction Pending</h3>
              <p className="font-body-base text-body-base text-on-surface-variant">
                Confirming your support on the Stellar network. Please approve the prompt in your wallet...
              </p>
            </div>
            <div className="w-full bg-surface-container-high p-4 flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-label-mono uppercase text-on-surface-variant">
                <span>Status</span>
                <span className="text-primary animate-pulse">Sequencing</span>
              </div>
              <div className="h-1 bg-outline-variant w-full overflow-hidden relative">
                <div className="h-full bg-primary w-1/2 absolute left-0 animate-shimmer"></div>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-stack-md py-stack-md text-center">
            <span className="material-symbols-outlined text-[64px] text-primary">check_circle</span>
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-2">Transaction Success</h3>
              <p className="font-body-base text-on-surface-variant">
                Thank you! Your contribution of <span className="text-primary font-bold">{amount} XLM</span> has been recorded.
              </p>
            </div>
            
            {txHash && (
              <div className="w-full bg-surface-container-high p-4 rounded border border-outline-variant mt-stack-md text-left">
                <span className="text-xs font-label-mono text-on-surface-variant block mb-1">Transaction Hash</span>
                <code className="block font-table-data text-xs text-primary break-all bg-surface p-2 rounded">
                  {txHash}
                </code>
              </div>
            )}

            <div className="flex flex-col gap-2 w-full mt-stack-md">
              {txHash && !txHash.startsWith('sim_') && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-surface border border-primary text-primary px-stack-md py-3 text-center font-body-sm font-semibold rounded hover:bg-surface-variant transition-colors"
                >
                  View on Stellar Expert
                </a>
              )}
              <button
                onClick={handleClose}
                className="w-full bg-primary text-on-primary-fixed py-3 font-semibold rounded hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* FAILURE STEP */}
        {step === 'failure' && (
          <div className="flex flex-col items-center gap-stack-md py-stack-md text-center">
            <span className="material-symbols-outlined text-[64px] text-red-400">error</span>
            <div>
              <h3 className="font-headline-md text-headline-md text-red-400 mb-2">Transaction Failed</h3>
              <p className="font-body-base text-on-surface-variant">
                Something went wrong while deploying your contribution on-chain.
              </p>
            </div>

            <div className="w-full bg-red-950/10 border border-red-900/50 p-4 rounded mt-stack-md text-left">
              <span className="text-xs font-label-mono text-red-300 block mb-1">Error Message</span>
              <p className="font-body-sm text-red-200 text-sm">
                {errorMessage}
              </p>
            </div>

            <div className="flex gap-stack-md w-full mt-stack-md">
              <button
                onClick={() => setStep('input')}
                className="flex-1 bg-surface border border-outline-variant text-primary py-3 font-semibold rounded hover:border-primary transition-all"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-primary text-on-primary-fixed py-3 font-semibold rounded hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
