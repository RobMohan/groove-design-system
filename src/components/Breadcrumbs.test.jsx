import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs Component', () => {
  const items = [
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumbs' },
  ];

  it('renders inside a nav with an accessible name of "Breadcrumb"', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('renders all labels', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('Breadcrumbs')).toBeInTheDocument();
  });

  it('renders intermediate items as links', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Components' })).toBeInTheDocument();
  });

  it('renders the last item as the current page and not a link', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.queryByRole('link', { name: 'Breadcrumbs' })).not.toBeInTheDocument();
    const current = screen.getByText('Breadcrumbs');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders a custom separator string', () => {
    render(<Breadcrumbs items={items} separator="/" />);
    expect(screen.getAllByText('/').length).toBeGreaterThan(0);
  });

  it('collapses middle items when maxItems is exceeded', () => {
    const longItems = [
      { label: 'Home', href: '#' },
      { label: 'Library', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Navigation', href: '#' },
      { label: 'Breadcrumbs' },
    ];
    render(<Breadcrumbs items={longItems} maxItems={3} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Breadcrumbs')).toBeInTheDocument();
    expect(screen.queryByText('Components')).not.toBeInTheDocument();
  });
});
