import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { DashboardPage } from '../pages/DashboardPage';

// Mock EventStreamService
vi.mock('../services/eventStream', () => ({
  EventStreamService: {
    startStreaming: vi.fn(),
    subscribeToContractEvents: () => () => {},
    stopStreaming: vi.fn(),
  },
}));

describe('DashboardPage Component', () => {
  it('renders stats overview and headers correctly', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Creator Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Total Raised')).toBeInTheDocument();
  });
});
