import React, { useState, useEffect } from 'react';
import type { Campaign } from '../types';
import { CampaignService } from '../services/campaign';
import { CampaignCard } from '../components/CampaignCard';
import { EmptyState } from '../components/EmptyState';

interface ExplorePageProps {
  onDonateClick: (campaign: Campaign) => void;
}

type CategoryFilter = 'ALL' | 'TECH' | 'IMPACT' | 'ART';
type SortOption = 'percentage' | 'time' | 'goal';

export const ExplorePage: React.FC<ExplorePageProps> = ({ onDonateClick }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('percentage');

  // Load campaigns from service
  useEffect(() => {
    const list = CampaignService.getCampaigns().filter((c) => c.status === 'active');
    setCampaigns(list);
  }, []);

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter((c) => {
      const matchesCategory = selectedCategory === 'ALL' || c.category.toUpperCase() === selectedCategory;
      const matchesSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.creator.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'percentage') {
        const percentA = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0;
        const percentB = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0;
        return percentB - percentA; // descending progress
      }
      if (sortBy === 'time') {
        return a.daysLeft - b.daysLeft; // ascending days left
      }
      if (sortBy === 'goal') {
        return b.targetAmount - a.targetAmount; // descending goal
      }
      return 0;
    });

  return (
    <div className="pt-16 pb-stack-xl max-w-container-max mx-auto px-gutter min-h-screen">
      {/* Header */}
      <header className="py-stack-lg text-left">
        <h1 className="font-display-lg text-display-lg text-primary font-bold mb-2">Explore Campaigns</h1>
        <p className="font-body-base text-on-surface-variant max-w-xl">
          Discover and support groundbreaking decentralized initiatives secured by Soroban smart contracts on Stellar.
        </p>
      </header>

      {/* Search and Filters Bar */}
      <section className="flex flex-col md:flex-row gap-stack-md justify-between items-stretch md:items-center py-stack-md border-b border-outline-variant mb-stack-lg">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {(['ALL', 'TECH', 'IMPACT', 'ART'] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-label-mono text-xs uppercase border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'border-primary bg-primary text-on-primary-fixed'
                  : 'border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-stack-sm flex-1 max-w-2xl justify-end">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant pl-10 pr-4 py-2 text-sm text-primary focus:outline-none focus:border-primary transition-colors font-body-base rounded"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-primary text-sm"
              >
                close
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm text-primary focus:outline-none focus:border-primary transition-colors font-body-base rounded appearance-none cursor-pointer"
            >
              <option value="percentage">Sort by: Funding %</option>
              <option value="time">Sort by: Time Left</option>
              <option value="goal">Sort by: Target Goal</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
              unfold_more
            </span>
          </div>
        </div>
      </section>

      {/* Campaigns Listing */}
      <main className="py-stack-md text-left">
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredCampaigns.map((camp) => (
              <div key={camp.id} className="animate-fade-up">
                <CampaignCard campaign={camp} onDonateClick={onDonateClick} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No campaigns match your search"
            message="Try clearing your filters or typing another query to discover projects on FundForge."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
              setSortBy('percentage');
            }}
          />
        )}
      </main>
    </div>
  );
};
