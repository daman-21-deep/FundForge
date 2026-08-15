import React from 'react';
import { Link } from 'react-router-dom';
import type { Campaign } from '../types';
import { ProgressBar } from './ProgressBar';

interface CampaignCardProps {
  campaign: Campaign;
  onDonateClick: (campaign: Campaign) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onDonateClick }) => {
  const percentFunded = campaign.targetAmount > 0 
    ? Math.round((campaign.currentAmount / campaign.targetAmount) * 100) 
    : 0;

  return (
    <article className="bg-surface-container-low hairline-border rounded-xl overflow-hidden card-hover flex flex-col h-full">
      <div className="relative h-48 w-full">
        <img
          className="w-full h-full object-cover"
          src={campaign.image}
          alt={campaign.title}
        />
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-label-mono text-primary border border-outline-variant">
          {campaign.category}
        </div>
      </div>
      <div className="p-stack-md flex-1 flex flex-col">
        <div className="mb-stack-md">
          <h3 className="font-headline-md text-headline-md text-primary mb-1 truncate">
            {campaign.title}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            by <span className="text-primary hover:underline cursor-pointer">{campaign.creator}</span>
          </p>
        </div>
        <div className="mt-auto space-y-stack-md">
          <div className="space-y-2">
            <div className="flex justify-between font-label-mono text-label-mono text-on-surface-variant">
              <span>{percentFunded}% FUNDED</span>
              <span>
                {campaign.daysLeft > 0 ? `${campaign.daysLeft} DAYS LEFT` : 'ENDED'}
              </span>
            </div>
            <ProgressBar progress={percentFunded} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDonateClick(campaign)}
              disabled={campaign.status !== 'active'}
              className="flex-1 bg-primary text-on-primary-fixed py-2 rounded font-body-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Donate
            </button>
            <Link
              to={`/campaign/${campaign.id}`}
              className="px-4 border border-outline-variant hover:border-primary transition-colors rounded flex items-center justify-center text-primary"
              aria-label="View campaign details"
            >
              <span className="material-symbols-outlined align-middle">visibility</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
