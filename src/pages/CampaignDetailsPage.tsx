import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Campaign } from '../types';
import { CampaignService } from '../services/campaign';
import { ErrorState } from '../components/ErrorState';
import { ProgressBar } from '../components/ProgressBar';
import { useWallet } from '../contexts/WalletContext';
import { DonationModal } from '../components/DonationModal';

interface CampaignDetailsPageProps {
  onDonateSuccess: () => void;
}

export const CampaignDetailsPage: React.FC<CampaignDetailsPageProps> = ({ onDonateSuccess }) => {
  const { id } = useParams<{ id: string }>();
  const { walletState, setShowSelector } = useWallet();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Array<{ address: string; time: string; amount: number }>>([]);

  const loadCampaign = () => {
    if (id) {
      const camp = CampaignService.getCampaignById(id);
      if (camp) {
        setCampaign(camp);
        
        // Mock some dynamic live activity for this campaign
        setActivities([
          { address: 'GBD7...3C8N', time: '2 mins ago', amount: 500 },
          { address: 'GAW9...2K46', time: '12 mins ago', amount: 25 },
          { address: 'GCO3...ZXYZ', time: '45 mins ago', amount: 1200 },
          { address: 'GDU4...2NTR', time: '1 hour ago', amount: 100 },
        ]);
      }
    }
  };

  useEffect(() => {
    loadCampaign();
  }, [id]);

  if (!campaign) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <ErrorState
          title="Campaign Not Found"
          message="The campaign you are trying to view does not exist or has been removed."
        />
      </div>
    );
  }

  const percentFunded = campaign.targetAmount > 0 
    ? Math.round((campaign.currentAmount / campaign.targetAmount) * 100) 
    : 0;

  const handleSupportClick = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    if (!walletState.isConnected) {
      setShowSelector(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleSuccess = (donatedAmount: number, _txHash: string) => {
    // Update local view state
    loadCampaign();
    setAmount('');
    onDonateSuccess();
    
    // Add transaction to activity timeline
    if (walletState.address) {
      const shortAddress = `${walletState.address.substring(0, 4)}...${walletState.address.substring(walletState.address.length - 4)}`;
      setActivities((prev) => [
        { address: shortAddress, time: 'Just now', amount: donatedAmount },
        ...prev
      ]);
    }
  };

  return (
    <div className="pt-16 pb-stack-xl text-left bg-background min-h-screen">
      {/* Hero Section Banner */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center grayscale opacity-80"
          style={{ backgroundImage: `url('${campaign.image}')` }}
        ></div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute bottom-0 left-0 w-full p-gutter z-10">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col gap-stack-sm">
              <div className="flex items-center gap-stack-sm">
                <span className="bg-primary text-on-primary-fixed text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold">
                  {campaign.category}
                </span>
                <span className="text-on-surface-variant text-body-sm">• Verified Campaign</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-primary max-w-3xl font-bold tracking-tight">
                {campaign.title}
              </h1>
              <div className="flex items-center gap-stack-sm mt-stack-md">
                <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-primary">person</span>
                </div>
                <span className="font-body-sm text-on-surface-variant">
                  Created by <span className="text-primary font-medium">{campaign.creator}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-12 gap-stack-xl mt-stack-xl">
        
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-stack-xl">
          
          {/* Progress stats panel */}
          <div className="bg-surface-container-low border border-outline-variant p-stack-lg rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-xl">
              <div className="flex flex-col gap-stack-xs">
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Raised</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold">
                    {campaign.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </span>
                  <span className="font-label-mono text-label-mono text-on-surface-variant">XLM</span>
                </div>
                <div className="mt-2">
                  <ProgressBar progress={percentFunded} />
                </div>
                <span className="font-label-mono text-[11px] text-on-surface-variant mt-1">
                  {percentFunded}% of {campaign.targetAmount.toLocaleString()} XLM goal
                </span>
              </div>
              
              <div className="flex flex-col gap-stack-xs">
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Backers</span>
                <span className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold">
                  {campaign.backersCount}
                </span>
                <span className="font-label-mono text-label-mono text-on-surface-variant">
                  Individual supporters
                </span>
              </div>
              
              <div className="flex flex-col gap-stack-xs">
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Time Left</span>
                <span className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold">
                  {campaign.daysLeft > 0 ? `${campaign.daysLeft} Days` : 'Ended'}
                </span>
                <span className="font-label-mono text-label-mono text-on-surface-variant">
                  Campaign funding phase
                </span>
              </div>
            </div>
          </div>

          {/* Vision description */}
          <article className="prose prose-invert max-w-none">
            <h2 className="font-headline-md text-headline-md text-primary mb-stack-md font-semibold border-b border-outline-variant pb-2">
              The Vision
            </h2>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed mb-stack-md">
              {campaign.description}
            </p>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed mb-stack-md">
              By leveraging the Stellar network for transparent, cross-border funding, we are ensuring that every XLM contributed is tracked directly to structural milestones. This isn't just a project; it's a blueprint for the future of decentralized development.
            </p>

            {/* Video preview */}
            <div className="my-stack-xl aspect-video bg-surface-container-highest border border-outline-variant flex items-center justify-center relative group cursor-pointer overflow-hidden rounded-lg">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center grayscale transition-all duration-750 group-hover:scale-105 group-hover:grayscale-0 opacity-60" 
                style={{ backgroundImage: `url('${campaign.image}')` }}
              ></div>
              <div className="z-10 w-16 h-16 rounded-full bg-primary text-on-primary-fixed flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-on-primary-fixed">play_arrow</span>
              </div>
            </div>

            {/* Roadmap */}
            <h3 className="font-headline-md text-headline-md text-primary mt-stack-xl mb-stack-md font-semibold">
              Technical Roadmap
            </h3>
            <ul className="space-y-stack-md list-none p-0">
              <li className="flex gap-stack-md border-l border-outline-variant pl-stack-md">
                <div>
                  <span className="font-label-mono text-label-mono text-primary font-bold">PHASE 1</span>
                  <p className="text-on-surface-variant font-body-base mt-1">
                    Final structural blueprints and site acquisition for deployment.
                  </p>
                </div>
              </li>
              <li className="flex gap-stack-md border-l border-outline-variant pl-stack-md">
                <div>
                  <span className="font-label-mono text-label-mono text-on-surface-variant">PHASE 2</span>
                  <p className="text-on-surface-variant font-body-base mt-1">
                    Smart contract deployment for automated stakeholder distribution and phase-one groundbreaking.
                  </p>
                </div>
              </li>
            </ul>
          </article>
        </div>

        {/* Right Column (Donation Panel) */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-stack-lg">
          <div className="bg-surface-container border border-outline-variant p-stack-lg sticky top-24 rounded">
            <h3 className="font-headline-md text-headline-md text-primary mb-stack-md font-semibold">
              Support Project
            </h3>
            
            <div className="flex flex-col gap-stack-md">
              <div className="relative">
                <input
                  className="w-full bg-surface-container-high border border-outline-variant p-4 font-table-data text-xl text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={campaign.status !== 'active'}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label-mono text-on-surface-variant">XLM</span>
              </div>
              
              <div className="grid grid-cols-4 gap-stack-sm">
                <button
                  onClick={() => setAmount('10')}
                  disabled={campaign.status !== 'active'}
                  className="border border-outline-variant py-2 font-label-mono text-sm hover:border-primary text-primary transition-colors disabled:opacity-50"
                >
                  10
                </button>
                <button
                  onClick={() => setAmount('25')}
                  disabled={campaign.status !== 'active'}
                  className="border border-outline-variant py-2 font-label-mono text-sm hover:border-primary text-primary transition-colors disabled:opacity-50"
                >
                  25
                </button>
                <button
                  onClick={() => setAmount('50')}
                  disabled={campaign.status !== 'active'}
                  className="border border-outline-variant py-2 font-label-mono text-sm hover:border-primary text-primary transition-colors disabled:opacity-50"
                >
                  50
                </button>
                <button
                  onClick={() => setAmount('100')}
                  disabled={campaign.status !== 'active'}
                  className="border border-outline-variant py-2 font-label-mono text-sm hover:border-primary text-primary transition-colors disabled:opacity-50"
                >
                  100
                </button>
              </div>

              {walletState.isConnected ? (
                <button
                  onClick={handleSupportClick}
                  disabled={campaign.status !== 'active'}
                  className="w-full bg-primary text-on-primary-fixed py-4 font-bold text-lg flex items-center justify-center gap-stack-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Support with {walletState.walletType === 'freighter' ? 'Freighter' : 'Albedo'}
                </button>
              ) : (
                <button
                  onClick={() => setShowSelector(true)}
                  disabled={campaign.status !== 'active'}
                  className="w-full bg-primary text-on-primary-fixed py-4 font-bold text-lg flex items-center justify-center gap-stack-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Connect Wallet to Support
                </button>
              )}
              
              <p className="font-body-sm text-xs text-on-surface-variant text-center px-4">
                By contributing, you agree to the project's Terms of Governance and Milestone Release schedule.
              </p>
            </div>

            {/* Live Activity timeline for this campaign */}
            <div className="mt-stack-xl border-t border-outline-variant pt-stack-lg">
              <div className="flex justify-between items-center mb-stack-md">
                <h4 className="font-label-mono text-label-mono text-primary uppercase font-bold text-xs tracking-wider">
                  Live Activity
                </h4>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              </div>
              
              <div className="space-y-stack-md max-h-64 overflow-y-auto pr-2">
                {activities.map((act, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-table-data text-primary font-medium">{act.address}</p>
                      <p className="font-body-sm text-[12px] text-on-surface-variant">{act.time}</p>
                    </div>
                    <span className="font-table-data text-primary font-semibold">
                      +{act.amount.toLocaleString()} XLM
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>

      {/* Donation Modal overlay for handling on-chain transaction execution */}
      <DonationModal
        campaign={campaign}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
