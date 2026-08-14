import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-stack-xl border border-outline-variant bg-surface-container-low text-center rounded-xl my-stack-lg max-w-lg mx-auto">
      <span className="material-symbols-outlined text-[48px] text-red-400 mb-stack-md">error</span>
      <h3 className="font-headline-md text-headline-md text-primary mb-2">{title}</h3>
      <p className="font-body-base text-on-surface-variant mb-stack-lg leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-on-primary-fixed px-stack-lg py-2 font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
