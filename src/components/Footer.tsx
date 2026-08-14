import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-stack-xl px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md border-t border-outline-variant bg-surface mt-auto">
      <div className="flex flex-col gap-2 items-center md:items-start">
        <span className="font-headline-md text-headline-md font-bold text-primary">FundForge</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 FundForge. Built on Stellar.</p>
      </div>
      <div className="flex gap-stack-lg">
        <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
        <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
        <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Docs</a>
        <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Status</a>
      </div>
    </footer>
  );
};
