import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import type { Transaction } from '../types';
import { ActivityFeed } from '../components/ActivityFeed';
import { EmptyState } from '../components/EmptyState';
import { useTransactionStore } from '../services/transactionStore';

export const WalletCenterPage: React.FC = () => {
  const { walletState, disconnect, refreshBalance } = useWallet();
  const liveTxs = useTransactionStore((state) => state.transactions);
  const [horizonTxs, setHorizonTxs] = useState<Transaction[]>([]);
  
  // Friendbot faucet states
  const [isFunding, setIsFunding] = useState(false);
  const [fundingStatus, setFundingStatus] = useState('');
  const [copied, setCopied] = useState(false);

  // Load and sync historical transactions from local storage
  const loadHorizonTransactions = () => {
    const stored = localStorage.getItem('fundforge_transactions');
    if (stored) {
      setHorizonTxs(JSON.parse(stored));
    } else {
      const defaultTxs: Transaction[] = [
        {
          hash: 'sim_tx_' + Math.random().toString(36).substring(2, 10),
          method: 'Project Backing',
          status: 'Success',
          amount: -500,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          sender: walletState.address || '',
        },
        {
          hash: 'sim_tx_' + Math.random().toString(36).substring(2, 10),
          method: 'Network Deposit',
          status: 'Success',
          amount: 1200,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          sender: walletState.address || '',
        },
      ];
      localStorage.setItem('fundforge_transactions', JSON.stringify(defaultTxs));
      setHorizonTxs(defaultTxs);
    }
  };

  useEffect(() => {
    if (walletState.isConnected) {
      loadHorizonTransactions();
    }
  }, [walletState.isConnected, walletState.address]);

  // Copy address to clipboard
  const handleCopy = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fund account using Friendbot on Stellar Testnet
  const handleFriendbotFund = async () => {
    if (!walletState.address) return;
    setIsFunding(true);
    setFundingStatus('Requesting 10,000 XLM from Testnet Friendbot...');
    
    try {
      const response = await fetch(`https://friendbot.stellar.org/?addr=${walletState.address}`);
      if (!response.ok) {
        throw new Error('Friendbot returned an error status.');
      }
      
      const result = await response.json();
      setFundingStatus('Horizon sequencing confirmed! Account funded.');
      
      // Add transaction to history
      const newTx: Transaction = {
        hash: result.hash || 'sim_fb_' + Math.random().toString(36).substring(2, 15),
        method: 'Friendbot Deposit',
        status: 'Success',
        amount: 10000,
        timestamp: new Date().toISOString(),
        sender: 'Friendbot Faucet',
      };

      const updatedTxs = [newTx, ...horizonTxs];
      localStorage.setItem('fundforge_transactions', JSON.stringify(updatedTxs));
      setHorizonTxs(updatedTxs);

      // Refresh balance
      await refreshBalance();
    } catch (err: any) {
      console.error(err);
      alert('Friendbot funding request failed. Try again in a few moments or use an external faucet.');
    } finally {
      setIsFunding(false);
      setFundingStatus('');
    }
  };

  if (!walletState.isConnected) {
    return (
      <div className="pt-24 pb-stack-xl max-w-container-max mx-auto px-gutter min-h-screen flex items-center justify-center">
        <EmptyState
          title="Wallet Not Connected"
          message="Connect your Freighter or Albedo wallet using the button in the top right to access your wallet center."
          icon="account_balance_wallet"
        />
      </div>
    );
  }

  // Parse balance string to number for conversion calculation
  const balanceVal = parseFloat(walletState.balance.replace(/,/g, ''));
  const usdEquivalent = balanceVal * 0.12; // simulated XLM price ~ $0.12 USD

  return (
    <div className="pt-24 pb-stack-xl max-w-container-max mx-auto px-gutter w-full min-h-screen text-left">
      <div className="space-y-stack-xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
          <div className="space-y-stack-xs">
            <h1 className="font-display-lg text-display-lg font-bold tracking-tight text-primary">Transaction & Wallet Center</h1>
            <p className="text-on-surface-variant max-w-xl font-body-base">
              Track the live transaction lifecycle, request testnet tokens, and inspect your on-chain credentials.
            </p>
          </div>
          <div className="flex items-center gap-stack-sm px-stack-md py-stack-sm glass-panel rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant text-xs">
              Stellar Testnet
            </span>
          </div>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          
          {/* Balance Card */}
          <div className="glass-panel p-stack-lg rounded-xl flex flex-col justify-between h-48 group hover:border-primary transition-colors bg-surface-container/20">
            <div className="flex justify-between items-start">
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant text-xs">Total Balance</span>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                account_balance_wallet
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md leading-none text-primary font-bold">
                {walletState.balance}
              </h2>
              <p className="font-label-mono text-label-mono text-on-surface-variant text-xs mt-1">
                XLM (~${usdEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)
              </p>
            </div>
          </div>

          {/* Address Card */}
          <div className="glass-panel p-stack-lg rounded-xl flex flex-col justify-between h-48 md:col-span-2 group hover:border-primary transition-colors bg-surface-container/20">
            <div className="flex justify-between items-start">
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant text-xs">Wallet Identity</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-stack-xs font-label-mono text-label-mono text-primary hover:underline hover:opacity-85 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'done' : 'content_copy'}
                </span>
                {copied ? 'Copied' : 'Copy Address'}
              </button>
            </div>
            <div>
              <code className="font-label-mono text-sm md:text-base break-all leading-tight text-primary font-semibold select-all block bg-surface/50 p-2 rounded border border-outline-variant/35 mb-2">
                {walletState.address}
              </code>
              <div className="flex justify-between items-center mt-stack-sm flex-wrap gap-2">
                <p className="text-on-surface-variant font-body-sm flex items-center gap-stack-xs text-xs">
                  <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                  Verified via {walletState.walletType === 'freighter' ? 'Freighter Extension' : 'Albedo Signer'}
                </p>
                <button
                  onClick={disconnect}
                  className="font-label-mono text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Live Transaction Tracker Queue */}
        <section className="space-y-stack-md">
          <h3 className="font-headline-md text-headline-md text-primary font-bold">Live Transaction Center</h3>
          {liveTxs.length === 0 ? (
            <div className="p-stack-lg border border-outline-variant border-dashed rounded-lg text-center text-on-surface-variant font-body-sm bg-surface-container-low/20">
              No transactions triggered in this session. Create campaigns or donate to track real-time blockchain telemetry.
            </div>
          ) : (
            <div className="space-y-stack-sm">
              {liveTxs.map((tx) => (
                <div 
                  key={tx.id} 
                  className={`p-stack-md border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-stack-sm transition-colors ${
                    tx.status === 'confirmed' 
                      ? 'border-outline-variant bg-surface-container-low/30' 
                      : tx.status === 'failed'
                      ? 'border-red-900/50 bg-red-950/10'
                      : 'border-primary/50 bg-surface-container-high/40 animate-pulse'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-stack-sm">
                      <h4 className="font-semibold text-primary text-sm">{tx.title}</h4>
                      <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${
                        tx.status === 'confirmed' 
                          ? 'border-outline-variant text-on-surface-variant' 
                          : tx.status === 'failed'
                          ? 'border-red-800 text-red-400'
                          : 'border-primary text-primary'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Initiated: {new Date(tx.timestamp).toLocaleTimeString()}
                    </p>
                    {tx.error && (
                      <p className="text-xs text-red-400 font-label-mono mt-1">
                        Error: {tx.error}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-stack-md self-start md:self-center">
                    {tx.hash && (
                      <a
                        href={tx.explorerLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-label-mono"
                      >
                        Inspect Hash <span className="material-symbols-outlined text-xs">north_east</span>
                      </a>
                    )}
                    {tx.status === 'failed' && (
                      <button
                        onClick={() => {
                          alert(`Please re-submit the creation or contribution sequence to retry.`);
                        }}
                        className="text-xs px-stack-md py-1 bg-surface-variant hover:bg-surface border border-outline-variant text-primary rounded"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Faucet Box widget */}
        <section className="bg-surface-container-low border border-outline-variant p-stack-lg rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
            <div>
              <h3 className="font-headline-md text-base font-semibold text-primary mb-1">
                Need Testnet XLM?
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Request a 10,000 XLM funding deposit from the official Stellar Friendbot faucet to perform testing.
              </p>
            </div>
            <button
              onClick={handleFriendbotFund}
              disabled={isFunding}
              className="bg-primary text-on-primary-fixed px-stack-lg py-3 font-semibold hover:opacity-90 transition-opacity rounded flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isFunding ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin"></span>
                  Funding...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">local_gas_station</span>
                  Fund with Friendbot
                </>
              )}
            </button>
          </div>
          {isFunding && (
            <p className="text-xs font-label-mono text-primary animate-pulse mt-4">
              {fundingStatus}
            </p>
          )}
        </section>

        {/* Activity Table Section */}
        <div className="space-y-stack-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-primary font-bold">Historical Activity</h3>
            {walletState.address && !walletState.address.startsWith('sim_') && (
              <a
                href={`https://stellar.expert/explorer/testnet/address/${walletState.address}`}
                target="_blank"
                rel="noreferrer"
                className="text-on-surface-variant hover:text-primary font-label-mono text-label-mono text-xs flex items-center gap-1"
              >
                View on Stellar Expert <span className="material-symbols-outlined text-sm">north_east</span>
              </a>
            )}
          </div>
          
          <ActivityFeed transactions={horizonTxs} mode="table" />
        </div>

      </div>
    </div>
  );
};
