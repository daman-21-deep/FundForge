import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia for responsive UI checks
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock Freighter API
vi.mock('@stellar/freighter-api', () => ({
  default: {
    isConnected: () => true,
    getAddress: () => Promise.resolve('GD6F242XWOD2K46N2H4JOTR65XWL2M5Q4Y7D4WZ2NTRLJO3WRXYZ9999'),
    signTransaction: () => Promise.resolve('mock_signed_tx_xdr'),
  },
  isConnected: () => true,
  getAddress: () => Promise.resolve('GD6F242XWOD2K46N2H4JOTR65XWL2M5Q4Y7D4WZ2NTRLJO3WRXYZ9999'),
  signTransaction: () => Promise.resolve('mock_signed_tx_xdr'),
}));

// Mock Stellar Wallets Kit
vi.mock('@creit.tech/stellar-wallets-kit', () => {
  const MockStellarWalletsKit = vi.fn().mockImplementation(() => ({
    openModal: vi.fn(),
    signTransaction: vi.fn().mockResolvedValue('mock_signed_tx'),
  }));

  (MockStellarWalletsKit as any).init = vi.fn();

  return {
    StellarWalletsKit: MockStellarWalletsKit,
    Networks: {
      TESTNET: 'TESTNET',
      PUBLIC: 'PUBLIC',
    },
    WalletType: {
      Freighter: 'Freighter',
      Albedo: 'Albedo',
    },
  };
});

vi.mock('@creit.tech/stellar-wallets-kit/modules/freighter', () => {
  return {
    FreighterModule: vi.fn(),
  };
});

vi.mock('@creit.tech/stellar-wallets-kit/modules/albedo', () => {
  return {
    AlbedoModule: vi.fn(),
  };
});
