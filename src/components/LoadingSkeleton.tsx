import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'hero' | 'stat';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
        {items.map((_, idx) => (
          <div key={idx} className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 w-full bg-surface-container-high"></div>
            <div className="p-stack-md space-y-stack-md">
              <div className="space-y-2">
                <div className="h-6 bg-surface-container-high w-3/4 rounded"></div>
                <div className="h-4 bg-surface-container-high w-1/2 rounded"></div>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <div className="h-3 bg-surface-container-high w-1/4 rounded"></div>
                  <div className="h-3 bg-surface-container-high w-1/4 rounded"></div>
                </div>
                <div className="h-1 bg-surface-container-high w-full rounded"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-10 bg-surface-container-high flex-1 rounded"></div>
                <div className="h-10 bg-surface-container-high w-12 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low/40 animate-pulse p-4">
        <div className="h-8 bg-surface-container-high w-full mb-4 rounded"></div>
        <div className="space-y-3">
          {items.map((_, idx) => (
            <div key={idx} className="h-12 bg-surface-container-high w-full rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
        {items.map((_, idx) => (
          <div key={idx} className="bg-surface-container-low border border-outline-variant p-stack-md rounded animate-pulse">
            <div className="h-4 bg-surface-container-high w-1/2 rounded mb-4"></div>
            <div className="h-8 bg-surface-container-high w-3/4 rounded mb-2"></div>
            <div className="h-4 bg-surface-container-high w-1/3 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
