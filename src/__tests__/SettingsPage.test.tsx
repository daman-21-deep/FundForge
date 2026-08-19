import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsPage } from '../pages/SettingsPage';

// Mock useWallet
vi.mock('../contexts/WalletContext', () => ({
  useWallet: () => ({
    walletState: {
      isConnected: false,
      address: '',
      walletType: '',
      balance: '0',
    },
    disconnect: vi.fn(),
  }),
}));

describe('SettingsPage Component', () => {
  it('renders preferences options and contract details lists correctly', () => {
    render(<SettingsPage />);

    expect(screen.getByText('Preferences & Settings')).toBeInTheDocument();
    expect(screen.getByText('Visual Theme Settings')).toBeInTheDocument();
    expect(screen.getByText('Developer Network Settings')).toBeInTheDocument();
  });
});
