import React from 'react';
import { useWallet } from '../contexts/WalletContext';

export const SettingsPage: React.FC = () => {
  const { walletState, disconnect } = useWallet();

  // Load static addresses from env/variables
  const registryContract = import.meta.env.VITE_REGISTRY_CONTRACT || 'CDWPVCSLCR47WGD32R2V4OEXEXEXEXEXEXEXEXEXEXEXEXEXEXEXEXEX';
  const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org';
  const horizonUrl = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';

  // Toggle local theme preferences
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('fundforge_theme', 'dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      localStorage.setItem('fundforge_theme', 'light');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.removeItem('fundforge_theme');
    }
  };

  return (
    <div className="pt-24 pb-stack-xl max-w-container-max mx-auto px-gutter text-left min-h-screen">
      <header className="mb-stack-xl">
        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-stack-xs text-xs tracking-wider">
          Configuration
        </p>
        <h1 className="font-display-lg text-display-lg text-primary font-bold">Preferences & Settings</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        
        {/* Left column: wallet & themes settings */}
        <div className="lg:col-span-2 space-y-stack-lg">
          
          {/* Wallet connection settings card */}
          <section className="glass-panel p-stack-lg rounded border border-outline-variant bg-surface-container/20">
            <h3 className="font-headline-md text-base font-semibold text-primary mb-1">Stellar Wallet Settings</h3>
            <p className="text-xs text-on-surface-variant mb-6">Manage connected extensions and authorization rules.</p>
            
            {walletState.isConnected ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-surface/50 p-stack-md rounded border border-outline-variant/45">
                  <div>
                    <p className="text-xs font-label-mono text-on-surface-variant">Connected Address</p>
                    <code className="text-sm font-semibold text-primary block break-all mt-1">{walletState.address}</code>
                  </div>
                  <span className="px-2 py-0.5 border border-outline text-[9px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container rounded ml-2 shrink-0">
                    {walletState.walletType}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="bg-red-800/15 border border-red-900/50 hover:bg-red-950/20 text-red-400 font-label-mono text-xs px-stack-md py-2 rounded transition-colors"
                >
                  Disconnect Wallet session
                </button>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant">No active wallet session. Please connect using the trigger in the navigation bar.</p>
            )}
          </section>

          {/* Theme Settings card */}
          <section className="glass-panel p-stack-lg rounded border border-outline-variant bg-surface-container/20">
            <h3 className="font-headline-md text-base font-semibold text-primary mb-1">Visual Theme Settings</h3>
            <p className="text-xs text-on-surface-variant mb-6">Configure the default visual mode settings of FundForge.</p>
            
            <div className="flex flex-wrap gap-stack-sm">
              <button 
                onClick={() => handleThemeChange('light')}
                className="px-stack-lg py-2 border border-outline-variant hover:border-outline text-xs rounded transition-colors bg-surface-container-low text-primary font-semibold"
              >
                Light Theme
              </button>
              <button 
                onClick={() => handleThemeChange('dark')}
                className="px-stack-lg py-2 border border-outline-variant hover:border-outline text-xs rounded transition-colors bg-surface-container-low text-primary font-semibold"
              >
                Dark Theme
              </button>
              <button 
                onClick={() => handleThemeChange('system')}
                className="px-stack-lg py-2 border border-outline-variant hover:border-outline text-xs rounded transition-colors bg-surface-container-low text-primary font-semibold"
              >
                System Theme preference
              </button>
            </div>
          </section>

        </div>

        {/* Right column: developer network parameters */}
        <aside className="space-y-stack-lg">
          <section className="glass-panel p-stack-lg rounded border border-outline-variant bg-surface-container/20">
            <h3 className="font-headline-md text-base font-semibold text-primary mb-1">Developer Network Settings</h3>
            <p className="text-xs text-on-surface-variant mb-6">Inspect smart contract addresses, networks, and RPC interfaces.</p>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-label-mono text-on-surface-variant text-[10px] block mb-1">ACTIVE STELLAR NETWORK</span>
                <span className="text-primary font-bold bg-surface-container px-2 py-1 border border-outline-variant/65 rounded">
                  Stellar Testnet
                </span>
              </div>

              <div>
                <span className="font-label-mono text-on-surface-variant text-[10px] block mb-1">REGISTRY CONTRACT ADDRESS</span>
                <code className="text-[10px] text-primary block break-all bg-surface/50 p-2 border border-outline-variant/40 rounded">
                  {registryContract}
                </code>
              </div>

              <div>
                <span className="font-label-mono text-on-surface-variant text-[10px] block mb-1">SOROBAN RPC ENDPOINT</span>
                <code className="text-[10px] text-primary block break-all bg-surface/50 p-2 border border-outline-variant/40 rounded">
                  {rpcUrl}
                </code>
              </div>

              <div>
                <span className="font-label-mono text-on-surface-variant text-[10px] block mb-1">HORIZON SERVER URL</span>
                <code className="text-[10px] text-primary block break-all bg-surface/50 p-2 border border-outline-variant/40 rounded">
                  {horizonUrl}
                </code>
              </div>

              <div className="pt-2">
                <a
                  href={`https://stellar.expert/explorer/testnet/contract/${registryContract}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-label-mono text-[10px] text-primary hover:underline flex items-center gap-1"
                >
                  Inspect Contract on Stellar Expert <span className="material-symbols-outlined text-[10px]">north_east</span>
                </a>
              </div>
            </div>
          </section>
        </aside>

      </div>
    </div>
  );
};
