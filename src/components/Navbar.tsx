import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

interface NavbarProps {
  toggleTheme: () => void;
  isDark: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDark }) => {
  const { walletState, setShowSelector } = useWallet();

  const getAddressDisplay = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant h-16">
      <div className="max-w-container-max mx-auto px-gutter h-full flex justify-between items-center">
        <div className="flex items-center gap-stack-lg">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tighter hover:opacity-90 transition-opacity">
            FundForge
          </Link>
          <div className="hidden md:flex gap-stack-md">
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Explore
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Create
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Analytics
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Settings
            </NavLink>
            <NavLink
              to="/feedback"
              className={({ isActive }) =>
                `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Feedback
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Admin
            </NavLink>
            {walletState.isConnected && (
              <NavLink
                to="/wallet"
                className={({ isActive }) =>
                  `font-body-base text-body-base pb-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                Wallet
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-stack-md">
          <button
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          {walletState.isConnected ? (
            <Link
              to="/wallet"
              className="bg-surface-container-high border border-outline-variant hover:border-primary text-primary px-stack-md py-2 font-body-base font-semibold transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {walletState.address ? getAddressDisplay(walletState.address) : 'Connected'}
            </Link>
          ) : (
            <button
              onClick={() => setShowSelector(true)}
              className="bg-primary text-on-primary-fixed px-stack-md py-2 font-body-base font-semibold hover:opacity-90 transition-opacity active:opacity-100"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
