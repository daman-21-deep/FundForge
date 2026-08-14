import React from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  message,
  actionLabel,
  onAction,
  icon = 'folder_open'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-stack-xl border border-outline-variant border-dashed text-center rounded-xl my-stack-lg max-w-lg mx-auto bg-surface-container-low/20">
      <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-stack-md">{icon}</span>
      <h3 className="font-headline-md text-headline-md text-primary mb-2">{title}</h3>
      <p className="font-body-base text-on-surface-variant mb-stack-lg leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-on-primary-fixed px-stack-lg py-2 font-semibold hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
