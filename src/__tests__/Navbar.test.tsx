import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../components/Navbar';
import { WalletProvider } from '../contexts/WalletContext';

// Mock matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

describe('Navbar Component', () => {
  it('renders branding and primary links correctly', () => {
    render(
      <MemoryRouter>
        <WalletProvider>
          <Navbar toggleTheme={() => {}} isDark={false} />
        </WalletProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('FundForge')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });
});
