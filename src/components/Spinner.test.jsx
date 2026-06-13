import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  it('renders a status role', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('falls back to a "Loading" screen-reader label', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders a visible label when provided', () => {
    render(<Spinner label="Fetching" />);
    // Visible text + sr-only span both contain it
    expect(screen.getAllByText('Fetching').length).toBeGreaterThan(0);
  });

  it('applies the color class', () => {
    const { container } = render(<Spinner color="positive" />);
    expect(container.querySelector('.text-positive')).toBeInTheDocument();
  });

  it('accepts a numeric size', () => {
    const { container } = render(<Spinner size={50} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '50');
  });
});
