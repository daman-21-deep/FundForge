import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnalyticsPage } from '../pages/AnalyticsPage';

// Mock Recharts ResponsiveContainer to just render children directly
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts') as any;
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('AnalyticsPage Component', () => {
  it('renders bento stats bento grid labels correctly', () => {
    render(<AnalyticsPage />);

    expect(screen.getByText('Platform Metrics')).toBeInTheDocument();
    expect(screen.getByText('System Analytics')).toBeInTheDocument();
    expect(screen.getByText('Total Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });
});
