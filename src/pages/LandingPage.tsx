import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [funds, setFunds] = useState(0);
  const [campaigns, setCampaigns] = useState(0);
  const [backers, setBackers] = useState(0);

  useEffect(() => {
    // Animate stats counters on load
    const fundsTarget = 12482901;
    const campaignsTarget = 842;
    const backersTarget = 52100; // Represents 52.1k

    const duration = 1500; // 1.5 seconds
    const intervalTime = 15;
    const steps = duration / intervalTime;

    const fundsInc = fundsTarget / steps;
    const campaignsInc = campaignsTarget / steps;
    const backersInc = backersTarget / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setFunds(fundsTarget);
        setCampaigns(campaignsTarget);
        setBackers(backersTarget);
        clearInterval(timer);
      } else {
        setFunds((prev) => Math.min(fundsTarget, Math.floor(prev + fundsInc)));
        setCampaigns((prev) => Math.min(campaignsTarget, Math.floor(prev + campaignsInc)));
        setBackers((prev) => Math.min(backersTarget, Math.floor(prev + backersInc)));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const formatBackers = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="pt-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center justify-center border-b border-outline-variant">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        
        <div className="container max-w-container-max mx-auto px-gutter relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 glass-card text-label-mono mb-stack-lg animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            POWERED BY STELLAR SOROBAN
          </div>
          
          <h1 className="font-display-lg text-display-lg mb-stack-md tracking-tight leading-none animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Fund Ideas. <br className="md:hidden"/> <span className="text-on-surface-variant">Forge Impact.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto font-body-base text-on-surface-variant mb-stack-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            The premier institutional-grade crowdfunding platform built on the Stellar network. Secure your vision with Soroban smart contracts and global liquidity.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-stack-md animate-fade-up max-w-md mx-auto md:max-w-none" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/create')}
              className="w-full md:w-auto bg-primary text-on-primary-fixed px-stack-xl py-4 font-bold text-body-base mono-glow transition-all active:scale-95 cursor-pointer"
            >
              Launch Campaign
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="w-full md:w-auto bg-transparent border border-outline-variant hover:border-primary text-primary px-stack-xl py-4 font-bold text-body-base transition-all active:scale-95 cursor-pointer"
            >
              Explore Projects
            </button>
          </div>
        </div>

        {/* Hero Image Preview */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1200px] h-[400px] glass-card border-b-0 hidden xl:block opacity-40 rounded-t-xl overflow-hidden z-0">
          <div
            className="w-full h-full bg-cover bg-center grayscale opacity-30"
            style={{
              backgroundImage: `url('/hero_preview.png')`,
            }}
          ></div>
        </div>
      </section>

      {/* Statistics */}
      <section className="relative z-10 py-stack-xl border-b border-outline-variant bg-surface-container-lowest">
        <div className="container max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-xl">
            <div className="flex flex-col gap-stack-sm text-center md:text-left">
              <span className="font-label-mono text-on-surface-variant uppercase tracking-widest text-xs">Total Funds Raised</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="font-display-lg text-primary text-[40px] font-bold">
                  {funds.toLocaleString()}
                </span>
                <span className="font-label-mono text-on-surface-variant">XLM</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-stack-sm text-center md:text-left">
              <span className="font-label-mono text-on-surface-variant uppercase tracking-widest text-xs">Total Campaigns</span>
              <span className="font-display-lg text-primary text-[40px] font-bold">
                {campaigns.toLocaleString()}
              </span>
            </div>
            
            <div className="flex flex-col gap-stack-sm text-center md:text-left">
              <span className="font-label-mono text-on-surface-variant uppercase tracking-widest text-xs">Active Backers</span>
              <span className="font-display-lg text-primary text-[40px] font-bold">
                {formatBackers(backers)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights (Bento Grid) */}
      <section className="py-stack-xl bg-background">
        <div className="container max-w-container-max mx-auto px-gutter">
          <div className="mb-stack-xl text-left">
            <span className="font-label-mono text-on-surface-variant uppercase tracking-widest text-xs">Infrastructure</span>
            <h2 className="font-headline-md text-display-lg-mobile md:text-headline-md mt-2 text-primary font-bold">
              Engineered for Trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter text-left">
            {/* Feature 1 */}
            <div className="md:col-span-8 glass-card p-stack-lg flex flex-col justify-between group cursor-default mono-glow transition-all rounded-xl">
              <div>
                <span className="material-symbols-outlined text-primary mb-stack-md" style={{ fontSize: '32px' }}>
                  verified_user
                </span>
                <h3 className="font-headline-md mb-stack-sm text-primary font-semibold">Soroban Smart Contracts</h3>
                <p className="text-on-surface-variant max-w-md font-body-base">
                  Non-custodial assurance. Funds are only released when milestones are verified by the network, ensuring total backer protection.
                </p>
              </div>
              <div className="mt-stack-xl overflow-hidden rounded-lg">
                <div
                  className="h-48 w-full bg-cover bg-center grayscale opacity-70 group-hover:scale-[1.02] group-hover:grayscale-0 transition-all duration-700"
                  style={{
                    backgroundImage: `url('/feature_soroban.png')`,
                  }}
                ></div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="md:col-span-4 glass-card p-stack-lg flex flex-col justify-center mono-glow transition-all rounded-xl">
              <span className="material-symbols-outlined text-primary mb-stack-md" style={{ fontSize: '32px' }}>
                bolt
              </span>
              <h3 className="font-headline-md mb-stack-sm text-primary font-semibold">Instant XLM Settling</h3>
              <p className="text-on-surface-variant font-body-base">
                Global payments with near-zero fees. Stellar's 5-second finality means your capital is ready the moment you need it.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-4 glass-card p-stack-lg flex flex-col justify-center mono-glow transition-all rounded-xl">
              <span className="material-symbols-outlined text-primary mb-stack-md" style={{ fontSize: '32px' }}>
                language
              </span>
              <h3 className="font-headline-md mb-stack-sm text-primary font-semibold">Global On-Ramps</h3>
              <p className="text-on-surface-variant font-body-base">
                Backers from anywhere can contribute using USDC, XLM, or local fiat through Stellar's anchor network.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-8 glass-card p-stack-lg flex flex-col md:flex-row gap-stack-lg items-center mono-glow transition-all rounded-xl">
              <div className="md:w-1/2">
                <span className="material-symbols-outlined text-primary mb-stack-md" style={{ fontSize: '32px' }}>
                  account_tree
                </span>
                <h3 className="font-headline-md mb-stack-sm text-primary font-semibold">Native Assets</h3>
                <p className="text-on-surface-variant font-body-base font-normal">
                  Issue project-specific tokens or NFTs directly upon funding completion. Integrated secondary market compatibility from day one.
                </p>
              </div>
              <div className="md:w-1/2 w-full h-full min-h-[200px] bg-surface-variant/20 rounded-lg overflow-hidden flex items-center justify-center">
                <div
                  className="w-full h-full min-h-[200px] bg-cover bg-center grayscale opacity-80"
                  style={{
                    backgroundImage: `url('/feature_assets.png')`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
