import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { AnalyticsService } from '../services/analytics';
import { Check, ArrowRight, ArrowLeft, Info, HelpCircle, X } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { walletState, setShowSelector } = useWallet();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0); // 0: Welcome, 1: Connect Wallet, 2: Explore, 3: Create, 4: Support, 5: Done

  useEffect(() => {
    const isCompleted = localStorage.getItem('fundforge_onboarding_completed');
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step === 1 && !walletState.isConnected) {
      // Prompt user to connect wallet
      setShowSelector(true);
      return;
    }
    
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('fundforge_onboarding_completed', 'true');
    AnalyticsService.trackOnboardingCompleted();
    setIsOpen(false);
    setStep(5);
  };

  const handleSkip = () => {
    localStorage.setItem('fundforge_onboarding_completed', 'true');
    AnalyticsService.trackOnboardingCompleted();
    setIsOpen(false);
  };

  // Keep a trigger on the UI or settings page to restart it
  useEffect(() => {
    const handleRestartEvent = () => {
      setStep(0);
      setIsOpen(true);
    };
    window.addEventListener('restart-onboarding', handleRestartEvent);
    return () => window.removeEventListener('restart-onboarding', handleRestartEvent);
  }, []);

  if (!isOpen) return null;

  const stepsInfo = [
    {
      title: 'Welcome to FundForge',
      desc: 'FundForge is a decentralized crowdfunding platform built on the Stellar network using Soroban Smart Contracts. Let’s get you started with a 30-second walkthrough.',
      tip: 'Stellar offers near-instant finality and low transaction fees (under 0.0001 XLM).',
    },
    {
      title: 'Step 1: Connect Wallet',
      desc: 'To interact with smart contracts, deploy escrows, or fund campaigns, you must connect a Stellar wallet (such as Freighter or Albedo).',
      tip: walletState.isConnected 
        ? `Connected address: ${walletState.address?.substring(0, 10)}...`
        : 'Clicking Next will open the wallet selector. Connect to Testnet.',
    },
    {
      title: 'Step 2: Explore Campaigns',
      desc: 'Browse campaigns by category (Tech, Impact, Art) and check their real-time progress, milestones, and on-chain escrow contracts.',
      tip: 'You can search or filter campaigns easily on the Explore page.',
      action: () => {
        navigate('/explore');
      },
      actionText: 'Go to Explore'
    },
    {
      title: 'Step 3: Create Campaign',
      desc: 'Got a stellar project? Design and launch your own campaign. When you launch, a custom smart escrow contract is automatically deployed on the Stellar testnet.',
      tip: 'The contract locks funds safely until the target goal is met or the deadline passes.',
      action: () => {
        navigate('/create');
      },
      actionText: 'Go to Create'
    },
    {
      title: 'Step 4: Support a Campaign',
      desc: 'Back campaigns using XLM. In case the campaign does not meet its target goal by the deadline, your funds are fully refundable on-chain.',
      tip: 'All contributions flow directly into transparent decentralized escrows.',
    }
  ];

  const currentStepInfo = stepsInfo[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-surface-container-high dark:bg-surface-container-highest border border-outline/30 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden transition-all duration-300">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 blur-3xl rounded-full"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <HelpCircle className="w-5 h-5" />
            </span>
            <span className="font-bold text-sm tracking-widest text-primary uppercase">User Guide</span>
          </div>
          <button 
            onClick={handleSkip}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors"
            title="Skip Onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex justify-between items-center gap-1 mb-8 relative z-10">
          {stepsInfo.map((_, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div 
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  index <= step ? 'bg-primary' : 'bg-outline-variant/30'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Content Body */}
        <div className="min-h-[220px] flex flex-col justify-between relative z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-3 flex items-center gap-2">
              {currentStepInfo.title}
              {step === 1 && walletState.isConnected && (
                <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full text-xs flex items-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </h3>
            
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-6">
              {currentStepInfo.desc}
            </p>

            {currentStepInfo.action && (
              <button
                onClick={() => {
                  currentStepInfo.action?.();
                }}
                className="mb-6 flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-primary/15 text-primary hover:bg-primary/25 rounded-lg transition-colors border border-primary/20"
              >
                {currentStepInfo.actionText}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tips Area */}
          <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-4 flex gap-3 items-start mb-6">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1">PRO TIP</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {currentStepInfo.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 relative z-10">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-outline/35 transition-colors ${
              step === 0 
                ? 'opacity-40 cursor-not-allowed text-on-surface-variant/40' 
                : 'text-on-surface hover:bg-surface-container'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-sm font-bold bg-primary text-on-primary-fixed hover:opacity-90 px-5 py-2.5 rounded-lg shadow-md transition-opacity"
              >
                {step === 1 && !walletState.isConnected ? 'Connect Wallet' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 text-sm font-bold bg-primary text-on-primary-fixed hover:opacity-90 px-5 py-2.5 rounded-lg shadow-md transition-opacity"
              >
                Get Started
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
