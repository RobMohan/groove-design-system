import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton, { SkeletonText } from './Skeleton';

describe('Skeleton Component', () => {
  it('renders an element with the animate-pulse class', () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('applies inline width and height styles from props', () => {
    const { container } = render(<Skeleton width="48px" height="120px" />);
    const el = container.querySelector('.animate-pulse');
    expect(el).toHaveStyle({ width: '48px', height: '120px' });
  });

  it('applies the rounded-pill class for the circle variant', () => {
    const { container } = render(<Skeleton variant="circle" width="48px" height="48px" />);
    expect(container.querySelector('.rounded-pill')).toBeInTheDocument();
  });

  it('applies the rounded-control class for the rect variant', () => {
    const { container } = render(<Skeleton variant="rect" width="100%" height="120px" />);
    expect(container.querySelector('.rounded-control')).toBeInTheDocument();
  });

  it('renders the requested number of lines via SkeletonText', () => {
    const { container } = render(<SkeletonText lines={3} />);
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
  });
});
