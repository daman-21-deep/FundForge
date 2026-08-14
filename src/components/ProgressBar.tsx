import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const cappedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  return (
    <div className="w-full h-1 bg-surface-container-highest">
      <div
        className="bg-primary h-full transition-all duration-700"
        style={{ width: `${cappedProgress}%` }}
      ></div>
    </div>
  );
};
