import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { ContractService } from '../services/contract';
import { CampaignService } from '../services/campaign';

type Step = 1 | 2 | 3 | 4;

export const CreateCampaignPage: React.FC = () => {
  const { walletState, setShowSelector } = useWallet();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(30);
  const [imageUrl, setImageUrl] = useState('');

  // Deploying animation state
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Deploying Smart Contract...');
  const [txHash, setTxHash] = useState('');
  const [deploymentError, setDeploymentError] = useState('');

  // Circular progress math
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBackStep = () => {
    if (step > 1 && step < 4) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const startDeployment = async () => {
    if (!walletState.isConnected || !walletState.address || !walletState.walletType) {
      setShowSelector(true);
      return;
    }

    setStep(4);
    setProgress(0);
    setDeploymentError('');
    setStatusText('Deploying Smart Contract...');

    const goalNum = parseFloat(goal);

    // Call service to interact on-chain
    try {
      const result = await ContractService.createCampaignOnChain(
        walletState.address,
        title,
        goalNum
      );

      // We animate the circular progress ring
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 8) + 4;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          if (result.success && result.txHash) {
            setTxHash(result.txHash);
            setStatusText('Deployment Successful');
            
            // Default image fallback if none provided
            const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop';
            
            // Save campaign locally
            CampaignService.createCampaign({
              title,
              description,
              creator: 'Lumina Architects', // verified user
              category: category.toUpperCase(),
              targetAmount: goalNum,
              daysLeft: duration,
              durationDays: duration,
              image: finalImage,
            });
          } else {
            setDeploymentError(result.error || 'Smart contract deployment failed.');
            setStatusText('Deployment Failed');
          }
        }
        setProgress(currentProgress);
      }, 100);

    } catch (err: any) {
      console.error(err);
      setProgress(100);
      setDeploymentError(err.message || 'Deployment interrupted.');
      setStatusText('Deployment Failed');
    }
  };

  const getStepIndicatorClass = (currentStep: number) => {
    if (step === currentStep) {
      return 'bg-surface-container text-primary';
    }
    if (step > currentStep) {
      return 'text-on-surface-variant';
    }
    return 'text-on-surface-variant';
  };

  const getCircleIndicatorClass = (currentStep: number) => {
    if (step === currentStep) {
      return 'border-primary text-primary';
    }
    if (step > currentStep) {
      return 'border-primary text-primary';
    }
    return 'border-outline text-on-surface-variant';
  };

  return (
    <div className="pt-24 pb-stack-xl px-gutter max-w-container-max mx-auto flex flex-col md:flex-row gap-stack-xl text-left bg-background min-h-screen">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-stack-lg">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">New Campaign</h2>
          
          <nav className="flex flex-col gap-stack-sm">
            {/* Step 1 Indicator */}
            <div className={`flex items-center gap-stack-md p-stack-sm rounded-lg transition-colors ${getStepIndicatorClass(1)}`}>
              <span className={`font-label-mono text-label-mono w-6 h-6 flex items-center justify-center border rounded-full ${getCircleIndicatorClass(1)}`}>
                {step > 1 ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  '01'
                )}
              </span>
              <span className="font-medium">Basic Info</span>
            </div>

            {/* Step 2 Indicator */}
            <div className={`flex items-center gap-stack-md p-stack-sm rounded-lg transition-colors ${getStepIndicatorClass(2)}`}>
              <span className={`font-label-mono text-label-mono w-6 h-6 flex items-center justify-center border rounded-full ${getCircleIndicatorClass(2)}`}>
                {step > 2 ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  '02'
                )}
              </span>
              <span className="font-medium">Goal & Details</span>
            </div>

            {/* Step 3 Indicator */}
            <div className={`flex items-center gap-stack-md p-stack-sm rounded-lg transition-colors ${getStepIndicatorClass(3)}`}>
              <span className={`font-label-mono text-label-mono w-6 h-6 flex items-center justify-center border rounded-full ${getCircleIndicatorClass(3)}`}>
                {step > 3 ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  '03'
                )}
              </span>
              <span className="font-medium">Review</span>
            </div>

            {/* Step 4 Indicator */}
            <div className={`flex items-center gap-stack-md p-stack-sm rounded-lg transition-colors ${getStepIndicatorClass(4)}`}>
              <span className={`font-label-mono text-label-mono w-6 h-6 flex items-center justify-center border rounded-full ${getCircleIndicatorClass(4)}`}>
                '04'
              </span>
              <span className="font-medium">Deploy</span>
            </div>
          </nav>

          <div className="p-stack-md bg-surface-container-low border border-outline-variant rounded-lg">
            <p className="text-body-sm text-on-surface-variant italic leading-relaxed">
              "Transparency is the foundation of decentralized trust."
            </p>
          </div>
        </div>
      </aside>

      {/* Form Canvas */}
      <section className="flex-grow max-w-2xl bg-surface-container/10 p-stack-lg rounded border border-outline-variant/30">
        
        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="step-transition">
            <div className="mb-stack-lg">
              <h3 className="font-headline-md text-headline-md text-primary mb-stack-xs font-semibold">
                Project Foundation
              </h3>
              <p className="text-body-base text-on-surface-variant">
                Start by defining the core identity of your crowdfunding campaign.
              </p>
            </div>
            
            <form onSubmit={handleNextStep} className="space-y-stack-lg">
              <div className="space-y-stack-sm">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
                  Campaign Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface border border-outline-variant focus:border-primary text-primary px-stack-md py-3 rounded-DEFAULT transition-colors outline-none placeholder:text-surface-variant/40"
                  placeholder="e.g. Project Solar Flare"
                  type="text"
                />
              </div>

              <div className="space-y-stack-sm">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant focus:border-primary text-primary px-stack-md py-3 rounded-DEFAULT transition-colors outline-none cursor-pointer"
                >
                  <option value="Technology">Technology</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Community Art">Community Art</option>
                </select>
              </div>

              <div className="space-y-stack-sm">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
                  Short Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface border border-outline-variant focus:border-primary text-primary px-stack-md py-3 rounded-DEFAULT transition-colors outline-none placeholder:text-surface-variant/40 leading-relaxed"
                  placeholder="Briefly describe the mission..."
                  rows={4}
                />
              </div>

              <div className="pt-stack-md flex justify-end">
                <button
                  type="submit"
                  className="bg-primary text-on-primary-fixed px-stack-lg py-stack-md font-medium rounded-DEFAULT flex items-center gap-stack-sm hover:opacity-90 transition-opacity cursor-pointer font-body-base"
                >
                  Continue to Goals
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: GOALS & DETAILS */}
        {step === 2 && (
          <div className="step-transition">
            <div className="mb-stack-lg">
              <h3 className="font-headline-md text-headline-md text-primary mb-stack-xs font-semibold">
                Funding Metrics
              </h3>
              <p className="text-body-base text-on-surface-variant">
                Set your milestones and target goals in XLM.
              </p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-stack-lg">
              <div className="space-y-stack-sm">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
                  Funding Goal (XLM)
                </label>
                <div className="relative">
                  <input
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-surface border border-outline-variant focus:border-primary text-primary font-table-data px-stack-md py-3 rounded-DEFAULT transition-colors outline-none placeholder:text-surface-variant/40"
                    placeholder="50,000"
                    type="number"
                    min="1"
                  />
                  <span className="absolute right-4 top-3.5 text-on-surface-variant font-label-mono">XLM</span>
                </div>
              </div>

              <div className="space-y-stack-sm">
                <div className="flex justify-between items-center">
                  <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
                    Duration (Days)
                  </label>
                  <span className="font-label-mono text-primary font-bold">{duration} Days</span>
                </div>
                <input
                  className="w-full accent-primary bg-outline-variant h-1 rounded-full cursor-pointer"
                  max="90"
                  min="1"
                  type="range"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-body-sm text-on-surface-variant">
                  <span>1 Day</span>
                  <span>30 Days</span>
                  <span>90 Days</span>
                </div>
              </div>

              <div className="space-y-stack-sm">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest block">
                  Campaign Banner Image URL
                </label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-surface border border-outline-variant focus:border-primary text-primary px-stack-md py-3 rounded-DEFAULT transition-colors outline-none placeholder:text-surface-variant/40"
                  placeholder="https://example.com/banner.jpg (Optional)"
                  type="url"
                />
              </div>

              <div className="pt-stack-md flex justify-between">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="text-on-surface-variant hover:text-primary flex items-center gap-stack-sm transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary-fixed px-stack-lg py-stack-md font-medium rounded-DEFAULT hover:opacity-90 transition-opacity cursor-pointer font-body-base"
                >
                  Review Campaign
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: REVIEW & LAUNCH */}
        {step === 3 && (
          <div className="step-transition">
            <div className="mb-stack-lg">
              <h3 className="font-headline-md text-headline-md text-primary mb-stack-xs font-semibold">
                Verification
              </h3>
              <p className="text-body-base text-on-surface-variant">
                Confirm all details before deploying your smart contract to Stellar.
              </p>
            </div>

            <div className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
              <div className="p-stack-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <span className="font-label-mono text-on-surface-variant text-xs font-bold tracking-wider">SUMMARY</span>
                <button 
                  onClick={() => setStep(1)} 
                  className="text-body-sm text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Edit
                </button>
              </div>
              <div className="p-stack-lg space-y-stack-md text-sm">
                <div className="grid grid-cols-2 gap-stack-md">
                  <div>
                    <span className="block text-body-sm text-on-surface-variant">Campaign Title</span>
                    <span className="font-medium text-primary text-base">{title}</span>
                  </div>
                  <div>
                    <span className="block text-body-sm text-on-surface-variant">Category</span>
                    <span className="text-primary text-base font-semibold uppercase">{category}</span>
                  </div>
                  <div>
                    <span className="block text-body-sm text-on-surface-variant">Target Goal</span>
                    <span className="font-table-data text-primary text-base">
                      {parseFloat(goal).toLocaleString()} XLM
                    </span>
                  </div>
                  <div>
                    <span className="block text-body-sm text-on-surface-variant">Duration</span>
                    <span className="text-primary text-base">{duration} Days</span>
                  </div>
                  <div>
                    <span className="block text-body-sm text-on-surface-variant">Network</span>
                    <span className="text-primary text-base font-medium">Stellar Testnet</span>
                  </div>
                  <div>
                    <span className="block text-body-sm text-on-surface-variant">Deployer Address</span>
                    <span className="text-primary font-label-mono truncate block max-w-[200px]">
                      {walletState.isConnected && walletState.address 
                        ? `${walletState.address.substring(0, 8)}...${walletState.address.substring(walletState.address.length - 8)}`
                        : 'Not Connected'}
                    </span>
                  </div>
                </div>
                <div className="border-t border-outline-variant/60 pt-4">
                  <span className="block text-body-sm text-on-surface-variant mb-1">Description</span>
                  <p className="text-on-surface-variant text-xs leading-relaxed italic">{description}</p>
                </div>
              </div>
            </div>

            <div className="mt-stack-lg pt-stack-md flex justify-between items-center">
              <button
                type="button"
                onClick={handleBackStep}
                className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Back
              </button>

              {walletState.isConnected ? (
                <button
                  onClick={startDeployment}
                  className="bg-primary text-on-primary-fixed px-stack-xl py-stack-md font-bold rounded-DEFAULT hover:opacity-90 transition-opacity flex items-center gap-stack-sm cursor-pointer font-body-base"
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
                  DEPLOY TO STELLAR
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSelector(true)}
                  className="bg-primary text-on-primary-fixed px-stack-xl py-stack-md font-bold rounded-DEFAULT hover:opacity-90 transition-opacity cursor-pointer font-body-base"
                >
                  Connect Wallet to Deploy
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: DEPLOYING & SUCCESS */}
        {step === 4 && (
          <div className="step-transition flex flex-col items-center justify-center text-center py-stack-xl">
            {deploymentError ? (
              // Error layout
              <div className="space-y-stack-md flex flex-col items-center max-w-sm">
                <span className="material-symbols-outlined text-[64px] text-red-400">error</span>
                <h3 className="font-headline-md text-headline-md text-red-400 font-semibold">Deployment Failed</h3>
                <p className="text-on-surface-variant text-body-base">
                  {deploymentError}
                </p>
                <div className="flex gap-4 w-full pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-surface border border-outline-variant text-primary py-3 rounded font-medium hover:border-primary transition-all cursor-pointer"
                  >
                    Review Settings
                  </button>
                  <button
                    onClick={startDeployment}
                    className="flex-1 bg-primary text-on-primary-fixed py-3 rounded font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              // Normal loading / success layout
              <>
                <div className="relative w-48 h-48 mb-stack-lg">
                  {/* Progress Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className="text-surface-variant"
                      cx="96"
                      cy="96"
                      fill="transparent"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <circle
                      className="progress-ring-circle text-primary"
                      cx="96"
                      cy="96"
                      fill="transparent"
                      r={radius}
                      stroke="currentColor"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="square"
                      strokeWidth="4"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-label-mono text-headline-md text-primary font-bold">
                      {progress}%
                    </span>
                  </div>
                </div>

                <h3 className="font-headline-md text-headline-md text-primary mb-stack-sm font-semibold">
                  {statusText}
                </h3>
                
                {progress < 100 ? (
                  <p className="text-body-base text-on-surface-variant max-w-md mx-auto">
                    Interacting with Stellar Soroban. Please do not close this window or disconnect your wallet.
                  </p>
                ) : (
                  <p className="text-body-base text-on-surface-variant max-w-md mx-auto">
                    Your campaign contract has been successfully initialized and registered on-chain.
                  </p>
                )}

                {/* Successful details panel */}
                {progress === 100 && txHash && (
                  <div className="mt-stack-xl w-full max-w-sm animate-fade-up">
                    <div className="bg-surface-container-high p-stack-md rounded border border-outline-variant text-left">
                      <div className="flex items-center justify-between mb-stack-sm">
                        <span className="text-body-sm text-on-surface-variant font-label-mono">Transaction Hash</span>
                        <span className="material-symbols-outlined text-body-sm text-primary">check_circle</span>
                      </div>
                      <code className="block font-table-data text-body-sm text-primary break-all bg-surface p-2 rounded">
                        {txHash}
                      </code>
                    </div>

                    <div className="flex flex-col gap-2 mt-stack-lg">
                      {!txHash.startsWith('sim_') && (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-surface border border-primary text-primary px-stack-md py-3 text-center font-medium hover:bg-surface-variant transition-colors"
                        >
                          View on Stellar Expert
                        </a>
                      )}
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-primary text-on-primary-fixed py-3 font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </section>
    </div>
  );
};
