import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  subtext?: string;
  icon?: string;
  progressPercent?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  subtext,
  icon,
  progressPercent
}) => {
  return (
    <div className="bg-surface-container-low border border-outline-variant p-stack-md hover:border-outline transition-colors group rounded">
      <div className="flex justify-between items-start mb-stack-md">
        <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">{label}</span>
        {icon && (
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-stack-xs">
        <h3 className="font-headline-md text-headline-md font-bold text-primary">{value}</h3>
        {suffix && <span className="font-label-mono text-label-mono text-on-surface-variant">{suffix}</span>}
      </div>
      {subtext && <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack-xs">{subtext}</p>}
      {progressPercent !== undefined && (
        <div className="w-full h-1 bg-outline-variant mt-stack-md overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}></div>
        </div>
      )}
    </div>
  );
};
