import React from 'react';
import { useWallet } from '../contexts/WalletContext';

export const WalletSelectorModal: React.FC = () => {
  const { showSelector, setShowSelector, connect, isConnecting, error, clearError } = useWallet();

  if (!showSelector) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-margin-mobile animate-fade-up">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer" 
        onClick={() => {
          if (!isConnecting) {
            setShowSelector(false);
            clearError();
          }
        }}
      ></div>

      {/* Content */}
      <div className="relative glass-panel w-full max-w-md rounded-xl p-stack-lg shadow-2xl z-10 border border-outline-variant bg-surface/95">
        <div className="flex justify-between items-center mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-primary">Connect Wallet</h2>
          <button 
            disabled={isConnecting}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
            onClick={() => {
              setShowSelector(false);
              clearError();
            }}
          >
            close
          </button>
        </div>

        <p className="text-on-surface-variant font-body-sm mb-stack-lg">
          Choose your preferred Stellar wallet extension or application to interact with FundForge.
        </p>

        {error && (
          <div className="mb-stack-md p-stack-md bg-red-950/20 border border-red-800 text-red-300 text-body-sm rounded">
            <div className="flex justify-between items-start">
              <span>{error}</span>
              <button onClick={clearError} className="material-symbols-outlined text-sm hover:text-white ml-2">close</button>
            </div>
          </div>
        )}

        <div className="space-y-stack-sm">
          {/* Freighter */}
          <button 
            onClick={() => connect('freighter')}
            disabled={isConnecting}
            className="w-full flex items-center justify-between p-stack-md border border-outline-variant rounded-lg hover:border-primary hover:bg-surface-container-high transition-all group disabled:opacity-50"
          >
            <div className="flex items-center gap-stack-md">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-primary-fixed text-[24px]">sailing</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary">Freighter Wallet</p>
                <p className="text-xs text-on-surface-variant">Stellar.org official extension</p>
              </div>
            </div>
            {isConnecting ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            )}
          </button>

          {/* Albedo */}
          <button 
            onClick={() => connect('albedo')}
            disabled={isConnecting}
            className="w-full flex items-center justify-between p-stack-md border border-outline-variant rounded-lg hover:border-primary hover:bg-surface-container-high transition-all group disabled:opacity-50"
          >
            <div className="flex items-center gap-stack-md">
              <div className="w-10 h-10 bg-surface-variant flex items-center justify-center rounded border border-outline-variant">
                <span className="material-symbols-outlined text-primary text-[24px]">token</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary">Albedo</p>
                <p className="text-xs text-on-surface-variant">Delegated signing & multi-sig</p>
              </div>
            </div>
            {isConnecting ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            )}
          </button>

          {/* Future wallets */}
          <div className="w-full flex items-center justify-between p-stack-md border border-outline-variant border-dashed rounded-lg opacity-50 grayscale cursor-not-allowed">
            <div className="flex items-center gap-stack-md">
              <div className="w-10 h-10 bg-surface-variant flex items-center justify-center rounded">
                <span className="material-symbols-outlined text-on-surface-variant">hourglass_empty</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-on-surface-variant">Future Wallets</p>
                <p className="text-xs text-on-surface-variant">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant text-center">
          <p className="text-xs text-on-surface-variant">
            By connecting, you agree to FundForge's <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
