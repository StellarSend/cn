import { render, screen } from '@testing-library/react';
import { StreamCard } from './StreamCard';

const props = {
  id: '42', recipient: 'GBOB1234567890123456789012345678901234567890123456789012',
  token: 'native', ratePerSecond: 116n,
  startTime: 1000, stopTime: 2000,
  withdrawn: 0n, cancelled: false,
};

describe('StreamCard', () => {
  it('renders stream id', () => {
    render(<StreamCard {...props} />);
    expect(screen.getByText(/Stream #42/)).toBeInTheDocument();
  });

  it('shows active badge when not cancelled', () => {
    render(<StreamCard {...props} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows cancelled badge when cancelled', () => {
    render(<StreamCard {...props} cancelled={true} />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });
});
