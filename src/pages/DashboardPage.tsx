import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Campaign, ContractEvent } from '../types';
import { CampaignService } from '../services/campaign';
import { ContractService, CONTRACT_ADDRESS } from '../services/contract';

import { StatCard } from '../components/StatCard';
import { ActivityFeed } from '../components/ActivityFeed';
import { ProgressBar } from '../components/ProgressBar';

import { EventStreamService } from '../services/eventStream';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [events, setEvents] = useState<ContractEvent[]>([]);

  useEffect(() => {
    // Load creator campaigns (Lumina Architects)
    const allCamps = CampaignService.getCampaigns();
    const creatorCamps = allCamps.filter((c) => c.creator === 'Lumina Architects');
    setCampaigns(creatorCamps);

    // Initial load of smart contract events
    setEvents(ContractService.getLatestEvents());

    // Start live Horizon event streaming subscription
    EventStreamService.startStreaming('GB6F242XWOD2K46N2H4JOTR65XWL2M5Q4Y7D4WZ2NTRLJO3WRXYZ9999');

    // Subscribe component state updates directly to incoming stream events
    const unsubscribe = EventStreamService.subscribeToContractEvents((newEvent) => {
      setEvents((prev) => {
        // Prevent duplicate IDs
        if (prev.some(e => e.id === newEvent.id)) return prev;
        return [newEvent, ...prev].slice(0, 15);
      });
    });

    return () => {
      unsubscribe();
      EventStreamService.stopStreaming();
    };
  }, []);

  // Aggregated Statistics
  const totalRaised = campaigns.reduce((acc, c) => acc + c.currentAmount, 0);
  const activeCount = campaigns.filter((c) => c.status === 'active').length;
  const totalBackers = campaigns.reduce((acc, c) => acc + c.backersCount, 0);
  const finishedCamps = campaigns.filter((c) => c.status === 'completed');
  const totalFinished = campaigns.filter((c) => c.status === 'completed' || c.daysLeft <= 0).length;
  
  const successRate = totalFinished > 0 
    ? Math.round((finishedCamps.length / totalFinished) * 100)
    : 100; // default 100% if none finished yet

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString();
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 border border-primary text-[10px] font-bold uppercase text-primary">Active</span>;
      case 'completed':
        return <span className="px-2 py-0.5 border border-outline text-[10px] font-bold uppercase text-on-surface-variant">Completed</span>;
      default:
        return <span className="px-2 py-0.5 border border-dashed border-outline-variant text-[10px] font-bold uppercase text-on-surface-variant/60">Draft</span>;
    }
  };

  return (
    <div className="pt-24 pb-stack-xl max-w-container-max mx-auto px-gutter text-left min-h-screen">
      {/* Header */}
      <header className="mb-stack-xl flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
        <div>
          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-stack-xs text-xs tracking-wider">
            Verified Creator
          </p>
          <h1 className="font-display-lg text-display-lg text-primary font-bold">Creator Dashboard</h1>
        </div>
        <div className="flex gap-stack-sm">
          <button 
            onClick={() => window.print()}
            className="border border-outline-variant px-stack-md py-stack-sm font-body-sm text-body-sm text-primary hover:bg-surface-variant transition-colors rounded cursor-pointer"
          >
            Download Report
          </button>
          <button
            onClick={() => navigate('/create')}
            className="bg-primary text-on-primary-fixed px-stack-lg py-stack-sm font-body-sm text-body-sm font-bold hover:opacity-90 transition-opacity rounded cursor-pointer"
          >
            Launch New Campaign
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-md mb-stack-xl">
        <StatCard
          label="Total Raised"
          value={formatLargeNumber(totalRaised)}
          suffix="XLM"
          subtext="Across all campaign targets"
          icon="payments"
        />
        <StatCard
          label="Active Campaigns"
          value={activeCount.toString().padStart(2, '0')}
          subtext="Currently funding on Stellar"
          icon="rocket_launch"
        />
        <StatCard
          label="Supporters"
          value={totalBackers.toLocaleString()}
          subtext="Individual contract contributors"
          icon="group"
        />
        <StatCard
          label="Success Rate"
          value={`${successRate}%`}
          subtext="Completed funding targets"
          icon="insights"
          progressPercent={successRate}
        />
      </section>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        
        {/* Left campaigns table */}
        <section className="lg:col-span-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded">
            <div className="p-gutter border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">My Campaigns</h2>
              <div className="flex items-center gap-stack-md">
                <span className="font-label-mono text-label-mono text-on-surface-variant text-xs">Verified Projects</span>
                <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low/20">
                    <th className="px-gutter py-stack-md font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Campaign Name</th>
                    <th className="px-gutter py-stack-md font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Status</th>
                    <th className="px-gutter py-stack-md font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Goal</th>
                    <th className="px-gutter py-stack-md font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Raised</th>
                    <th className="px-gutter py-stack-md font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {campaigns.map((camp) => {
                    const percent = camp.targetAmount > 0 
                      ? Math.min(100, Math.round((camp.currentAmount / camp.targetAmount) * 100))
                      : 0;

                    return (
                      <tr key={camp.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-gutter py-stack-lg">
                          <div className="flex items-center gap-stack-md">
                            <div className="w-10 h-10 bg-surface-variant flex items-center justify-center border border-outline-variant rounded overflow-hidden">
                              <img src={camp.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <span 
                              onClick={() => navigate(`/campaign/${camp.id}`)}
                              className="font-body-base text-body-base text-primary font-medium hover:underline cursor-pointer"
                            >
                              {camp.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-gutter py-stack-lg">
                          {getStatusBadge(camp.status)}
                        </td>
                        <td className="px-gutter py-stack-lg font-table-data text-table-data text-on-surface-variant">
                          {camp.targetAmount.toLocaleString()} XLM
                        </td>
                        <td className="px-gutter py-stack-lg">
                          <div className="flex flex-col gap-1 w-28">
                            <span className="font-table-data text-table-data text-primary">
                              {camp.currentAmount.toLocaleString()} XLM
                            </span>
                            <div className="mt-1">
                              <ProgressBar progress={percent} />
                            </div>
                            <span className="text-[10px] font-label-mono text-on-surface-variant mt-0.5">{percent}% funded</span>
                          </div>
                        </td>
                        <td className="px-gutter py-stack-lg">
                          <button
                            onClick={() => navigate(`/campaign/${camp.id}`)}
                            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          >
                            visibility
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right contract details & event logs widgets */}
        <aside className="lg:col-span-4 flex flex-col gap-stack-lg">
          
          {/* Soroban Smart Contract Info */}
          <div className="bg-surface-container border border-outline-variant p-stack-lg rounded">
            <h3 className="font-headline-md text-headline-md text-primary mb-stack-md font-semibold">
              Soroban Smart Contract
            </h3>
            <div className="space-y-stack-md text-sm">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/60">
                <span className="font-label-mono text-on-surface-variant text-xs">Contract Status</span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/60">
                <span className="font-label-mono text-on-surface-variant text-xs">Stellar Network</span>
                <span className="text-primary font-semibold">Testnet</span>
              </div>
              <div className="py-2">
                <span className="font-label-mono text-on-surface-variant text-xs block mb-1">Contract Address</span>
                <code className="font-table-data text-xs text-primary bg-surface p-2 rounded block break-all border border-outline-variant/50">
                  {CONTRACT_ADDRESS}
                </code>
              </div>
            </div>
          </div>

          {/* Smart Contract Events feed */}
          <div className="bg-surface-container border border-outline-variant p-stack-lg rounded">
            <h3 className="font-headline-md text-headline-md text-primary mb-stack-md font-semibold">
              Contract Events
            </h3>
            <ActivityFeed events={events} mode="list" />
          </div>

        </aside>
      </div>
    </div>
  );
};
