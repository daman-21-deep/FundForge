import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { WalletCenterPage } from '../pages/WalletCenterPage';

// Mock the useWallet hook
vi.mock('../contexts/WalletContext', () => ({
  useWallet: () => ({
    walletState: {
      isConnected: true,
      address: 'GD6F242XWOD2K46N2H4JOTR65XWL2M5Q4Y7D4WZ2NTRLJO3WRXYZ9999',
      walletType: 'Freighter',
      balance: '120.5',
    },
    disconnect: vi.fn(),
    refreshBalance: vi.fn(),
  }),
}));

describe('WalletCenterPage Component', () => {
  it('renders wallet details and balance displays', () => {
    render(
      <MemoryRouter>
        <WalletCenterPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Transaction & Wallet Center')).toBeInTheDocument();
    expect(screen.getByText('120.5')).toBeInTheDocument();
    expect(screen.getAllByText(/GD6F242XW/i)[0]).toBeInTheDocument();
  });
});
