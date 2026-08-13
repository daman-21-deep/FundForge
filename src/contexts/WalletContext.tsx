import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import type { WalletState, WalletType } from '../types';
import { fetchXLMBalance } from '../services/stellar';
import { AnalyticsService } from '../services/analytics';
import { MonitoringService } from '../services/monitoring';

interface WalletContextType {
  walletState: WalletState;
  isConnecting: boolean;
  error: string | null;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
  connect: (type: WalletType) => Promise<boolean>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const initialWalletState: WalletState = {
  isConnected: false,
  address: null,
  network: 'TESTNET',
  balance: '0.00',
  walletType: null,
};

// Initialize the static StellarWalletsKit client once at module load
StellarWalletsKit.init({
  network: Networks.TESTNET,
  modules: [
    new FreighterModule(),
    new AlbedoModule(),
  ],
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>(initialWalletState);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (walletState.isConnected && walletState.address) {
      try {
        const bal = await fetchXLMBalance(walletState.address, walletState.network || 'TESTNET');
        setWalletState((prev) => ({
          ...prev,
          balance: parseFloat(bal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 }),
        }));
      } catch (err) {
        console.error('Failed to refresh balance:', err);
      }
    }
  }, [walletState.isConnected, walletState.address, walletState.network]);

  // Connect wallet using StellarWalletsKit
  const connect = async (type: WalletType): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    try {
      let walletId: string;
      if (type === 'freighter') {
        walletId = 'freighter';
      } else if (type === 'albedo') {
        walletId = 'albedo';
      } else {
        throw new Error('Unsupported wallet type');
      }

      // Configure selected wallet ID and connect static kit
      StellarWalletsKit.setWallet(walletId);
      const { address } = await StellarWalletsKit.fetchAddress();
      
      if (!address) {
        throw new Error(`Could not retrieve address from ${type} wallet.`);
      }

      const newState: WalletState = {
        isConnected: true,
        address,
        network: 'TESTNET',
        balance: '0.00',
        walletType: type,
      };
      setWalletState(newState);
      localStorage.setItem('fundforge_wallet_type', type);
      localStorage.setItem('fundforge_wallet_address', address);
      AnalyticsService.trackWalletConnected(type, address);
      
      // Fetch balance immediately
      const bal = await fetchXLMBalance(address, 'TESTNET');
      setWalletState((prev) => ({
        ...prev,
        balance: parseFloat(bal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 }),
      }));
      
      setShowSelector(false);
      return true;
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      let friendlyError = err?.message || 'Failed to connect wallet.';
      if (friendlyError.includes('User decline') || friendlyError.includes('decline')) {
        friendlyError = 'Connection request declined by user.';
      } else if (friendlyError.includes('install') || friendlyError.includes('extension')) {
        friendlyError = `Please install the ${type} browser extension.`;
      }
      setError(friendlyError);
      MonitoringService.trackWalletFailure(type || 'unknown', 'connect', friendlyError);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setWalletState(initialWalletState);
    localStorage.removeItem('fundforge_wallet_type');
    localStorage.removeItem('fundforge_wallet_address');
    StellarWalletsKit.disconnect().catch(err => {
      console.error('Failed to disconnect kit:', err);
    });
  };

  // Clear errors
  const clearError = () => setError(null);

  // Auto reconnect
  useEffect(() => {
    const savedType = localStorage.getItem('fundforge_wallet_type') as WalletType;
    const savedAddress = localStorage.getItem('fundforge_wallet_address');

    if (savedType && savedAddress) {
      setWalletState({
        isConnected: true,
        address: savedAddress,
        network: 'TESTNET',
        balance: '0.00',
        walletType: savedType,
      });

      // Reconfigure static kit to saved wallet
      try {
        StellarWalletsKit.setWallet(savedType === 'freighter' ? 'freighter' : 'albedo');
      } catch (e) {
        console.error('Failed to re-initialize wallet kit state:', e);
      }

      // Fetch fresh balance
      fetchXLMBalance(savedAddress, 'TESTNET').then((bal) => {
        setWalletState((prev) => ({
          ...prev,
          balance: parseFloat(bal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 }),
        }));
      }).catch(err => {
        console.error('Auto-reconnect balance check failed:', err);
      });
    }
  }, []);

  // Poll balance update every 15 seconds
  useEffect(() => {
    if (walletState.isConnected) {
      const interval = setInterval(() => {
        refreshBalance();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [walletState.isConnected, refreshBalance]);

  return (
    <WalletContext.Provider
      value={{
        walletState,
        isConnecting,
        error,
        showSelector,
        setShowSelector,
        connect,
        disconnect,
        refreshBalance,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
