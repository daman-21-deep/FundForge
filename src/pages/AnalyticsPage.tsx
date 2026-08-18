import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { CampaignService } from '../services/campaign';

const COLORS = ['#888888', '#555555', '#333333', '#aaaaaa'];

export const AnalyticsPage: React.FC = () => {
  const campaigns = CampaignService.getCampaigns();

  // Stats computation
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const successfulCampaigns = campaigns.filter(c => c.status === 'completed' || c.currentAmount >= c.targetAmount).length;
  const failedCampaigns = campaigns.filter(c => c.daysLeft <= 0 && c.currentAmount < c.targetAmount).length;
  
  const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
  
  // Total contributors based on campaign metrics
  const totalBackers = campaigns.reduce((sum, c) => sum + c.backersCount, 0);
  
  const averageContribution = totalBackers > 0 
    ? parseFloat((totalRaised / totalBackers).toFixed(2))
    : 0;

  const successRate = totalCampaigns > 0
    ? Math.round((successfulCampaigns / totalCampaigns) * 100)
    : 100;

  // Chart 1: Funding growth chart (historical mock timeline)
  const growthData = [
    { name: 'Jan', raised: totalRaised * 0.1 },
    { name: 'Feb', raised: totalRaised * 0.25 },
    { name: 'Mar', raised: totalRaised * 0.45 },
    { name: 'Apr', raised: totalRaised * 0.65 },
    { name: 'May', raised: totalRaised * 0.85 },
    { name: 'Jun', raised: totalRaised },
  ];

  // Chart 2: Daily contributions
  const dailyContributionData = [
    { day: 'Mon', contributions: Math.round(totalRaised * 0.05) },
    { day: 'Tue', contributions: Math.round(totalRaised * 0.08) },
    { day: 'Wed', contributions: Math.round(totalRaised * 0.12) },
    { day: 'Thu', contributions: Math.round(totalRaised * 0.07) },
    { day: 'Fri', contributions: Math.round(totalRaised * 0.15) },
    { day: 'Sat', contributions: Math.round(totalRaised * 0.22) },
    { day: 'Sun', contributions: Math.round(totalRaised * 0.31) },
  ];

  // Chart 3: Campaign status distribution
  const statusData = [
    { name: 'Active', value: activeCampaigns },
    { name: 'Successful', value: successfulCampaigns },
    { name: 'Failed', value: failedCampaigns },
  ].filter(d => d.value > 0);

  // Chart 4: Top campaigns leaderboard
  const topCampaigns = [...campaigns]
    .sort((a, b) => b.currentAmount - a.currentAmount)
    .slice(0, 4);

  return (
    <div className="pt-24 pb-stack-xl max-w-container-max mx-auto px-gutter text-left min-h-screen">
      <header className="mb-stack-xl">
        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-stack-xs text-xs tracking-wider">
          System Analytics
        </p>
        <h1 className="font-display-lg text-display-lg text-primary font-bold">Platform Metrics</h1>
        <p className="text-on-surface-variant max-w-xl font-body-base mt-2">
          Real-time on-chain crowdfunding performance statistics, donor distributions, and contract activity.
        </p>
      </header>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-stack-md mb-stack-xl">
        <div className="glass-panel p-stack-md rounded bg-surface-container/20 border border-outline-variant">
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant text-[10px]">Total Campaigns</span>
          <h2 className="font-headline-md text-2xl text-primary font-bold mt-2">{totalCampaigns}</h2>
        </div>
        <div className="glass-panel p-stack-md rounded bg-surface-container/20 border border-outline-variant">
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant text-[10px]">Total XLM Raised</span>
          <h2 className="font-headline-md text-2xl text-primary font-bold mt-2">{totalRaised.toLocaleString()}</h2>
        </div>
        <div className="glass-panel p-stack-md rounded bg-surface-container/20 border border-outline-variant">
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant text-[10px]">Avg Contribution</span>
          <h2 className="font-headline-md text-2xl text-primary font-bold mt-2">{averageContribution} XLM</h2>
        </div>
        <div className="glass-panel p-stack-md rounded bg-surface-container/20 border border-outline-variant">
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant text-[10px]">Success Rate</span>
          <h2 className="font-headline-md text-2xl text-primary font-bold mt-2">{successRate}%</h2>
        </div>
      </section>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg">
        
        {/* Growth Chart */}
        <div className="glass-panel p-stack-lg rounded border border-outline-variant bg-surface-container-low/40">
          <h3 className="font-label-mono text-label-mono uppercase text-primary text-xs font-semibold mb-stack-md">Funding Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="raisedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#888888" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#888888" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                  labelStyle={{ color: '#888' }}
                />
                <Area type="monotone" dataKey="raised" stroke="#ffffff" fillOpacity={1} fill="url(#raisedGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Contribution */}
        <div className="glass-panel p-stack-lg rounded border border-outline-variant bg-surface-container-low/40">
          <h3 className="font-label-mono text-label-mono uppercase text-primary text-xs font-semibold mb-stack-md">Weekly Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyContributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                  labelStyle={{ color: '#888' }}
                />
                <Bar dataKey="contributions" fill="#aaaaaa" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status distribution */}
        <div className="glass-panel p-stack-lg rounded border border-outline-variant bg-surface-container-low/40">
          <h3 className="font-label-mono text-label-mono uppercase text-primary text-xs font-semibold mb-stack-md">Campaign Status Distribution</h3>
          <div className="h-64 flex flex-col sm:flex-row items-center justify-around">
            {statusData.length > 0 ? (
              <>
                <div className="w-full sm:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2">
                  {statusData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-xs font-label-mono text-on-surface-variant">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-on-surface-variant text-xs">No project status telemetry found.</div>
            )}
          </div>
        </div>

        {/* Top campaigns leaderboard */}
        <div className="glass-panel p-stack-lg rounded border border-outline-variant bg-surface-container-low/40 flex flex-col justify-between">
          <div>
            <h3 className="font-label-mono text-label-mono uppercase text-primary text-xs font-semibold mb-stack-md">Top Performing Campaigns</h3>
            <div className="space-y-stack-sm">
              {topCampaigns.map((camp, idx) => (
                <div key={camp.id} className="flex justify-between items-center py-2 border-b border-outline-variant/40 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-label-mono text-xs text-on-surface-variant font-bold">#{idx + 1}</span>
                    <span className="text-sm font-semibold text-primary">{camp.title}</span>
                  </div>
                  <span className="font-label-mono text-xs text-on-surface-variant">{camp.currentAmount.toLocaleString()} / {camp.targetAmount.toLocaleString()} XLM</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
