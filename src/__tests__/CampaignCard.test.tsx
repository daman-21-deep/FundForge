import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { CampaignCard } from '../components/CampaignCard';
import type { Campaign } from '../types';

const mockCampaign: Campaign = {
  id: '1',
  title: 'Sustainable Energy Grid',
  description: 'Building local solar battery storage stations.',
  targetAmount: 50000,
  currentAmount: 25000,
  backersCount: 120,
  daysLeft: 12,
  durationDays: 30,
  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop',
  creator: 'Lumina Architects',
  category: 'Infrastructure',
  status: 'active',
};

describe('CampaignCard Component', () => {
  it('renders campaign metadata, title, and target stats correctly', () => {
    const handleDonate = vi.fn();
    render(
      <MemoryRouter>
        <CampaignCard campaign={mockCampaign} onDonateClick={handleDonate} />
      </MemoryRouter>
    );

    expect(screen.getByText('Sustainable Energy Grid')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    expect(screen.getByText('50% FUNDED')).toBeInTheDocument();
    expect(screen.getByText('12 DAYS LEFT')).toBeInTheDocument();
  });
});
