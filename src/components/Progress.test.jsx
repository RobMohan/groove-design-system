import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Progress from './Progress';

describe('Progress Component', () => {
  it('renders a progressbar role with aria values', () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets the fill width from value', () => {
    const { container } = render(<Progress value={30} />);
    const fill = container.querySelector('[style*="width"]');
    expect(fill).toHaveStyle({ width: '30%' });
  });

  it('clamps values above max', () => {
    const { container } = render(<Progress value={150} />);
    const fill = container.querySelector('[style*="width"]');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  it('shows percentage when showLabel is set', () => {
    render(<Progress value={75} showLabel />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });
});
