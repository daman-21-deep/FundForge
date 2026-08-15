import React from 'react';
import type { Transaction, ContractEvent } from '../types';

interface ActivityFeedProps {
  transactions?: Transaction[];
  events?: ContractEvent[];
  mode?: 'table' | 'list';
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  transactions,
  events,
  mode = 'table'
}) => {
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    if (addr.startsWith('sim_') || addr.startsWith('0x')) {
      return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    }
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.max(0, Math.floor(diffMs / 60000));
      
      if (diffMins < 1) return 'just now';
      if (diffMins === 1) return '1 min ago';
      if (diffMins < 60) return `${diffMins} mins ago`;
      
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs === 1) return '1 hour ago';
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      
      return date.toLocaleDateString();
    } catch {
      return 'recent';
    }
  };

  if (mode === 'table' && transactions) {
    return (
      <div className="glass-panel rounded-xl overflow-hidden bg-surface-container-low/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low/80">
                <th className="p-gutter font-label-mono text-label-mono text-on-surface-variant uppercase">Transaction Hash</th>
                <th className="p-gutter font-label-mono text-label-mono text-on-surface-variant uppercase">Method</th>
                <th className="p-gutter font-label-mono text-label-mono text-on-surface-variant uppercase">Status</th>
                <th className="p-gutter font-label-mono text-label-mono text-on-surface-variant uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-table-data text-table-data">
              {transactions.map((tx) => (
                <tr key={tx.hash} className="hover:bg-surface-container/60 transition-colors">
                  <td className="p-gutter text-primary font-label-mono">
                    {tx.hash.startsWith('sim_') ? (
                      <span className="flex items-center gap-1">
                        <span className="text-[10px] px-1 bg-surface-variant text-on-surface-variant uppercase rounded border border-outline-variant">Sim</span>
                        {formatAddress(tx.hash)}
                      </span>
                    ) : (
                      formatAddress(tx.hash)
                    )}
                  </td>
                  <td className="p-gutter text-on-surface">{tx.method}</td>
                  <td className="p-gutter">
                    <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${
                      tx.status === 'Success' 
                        ? 'border-outline-variant text-on-surface-variant' 
                        : tx.status === 'Pending'
                        ? 'border-primary text-primary animate-pulse'
                        : 'border-red-800 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`p-gutter text-right font-label-mono ${tx.amount < 0 ? 'text-primary' : 'text-primary'}`}>
                    {tx.amount > 0 ? `+ ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} XLM` : `- ${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} XLM`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render list mode (for contract events on dashboards)
  if (events) {
    return (
      <div className="space-y-stack-sm max-h-[300px] overflow-y-auto pr-2">
        {events.map((evt) => (
          <div key={evt.id} className="p-stack-md bg-surface border border-outline-variant hover:border-outline transition-colors flex flex-col gap-1 rounded">
            <div className="flex justify-between items-start">
              <span className="font-table-data text-table-data text-primary font-medium">{evt.type}</span>
              <span className="font-label-mono text-[10px] text-on-surface-variant">{getRelativeTime(evt.timestamp)}</span>
            </div>
            <p className="font-table-data text-xs text-on-surface-variant leading-relaxed">
              {evt.data}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
