import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Inbox } from 'lucide-react';
import EmptyState from './EmptyState';
import Button from './Button';

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(<EmptyState icon={Inbox} title="No projects" description="Create one to start." />);
    expect(screen.getByRole('heading', { name: 'No projects' })).toBeInTheDocument();
    expect(screen.getByText('Create one to start.')).toBeInTheDocument();
  });

  it('renders primary and secondary actions', () => {
    render(
      <EmptyState
        title="Empty"
        primaryAction={<Button>New</Button>}
        secondaryAction={<Button variant="ghost">Import</Button>}
      />
    );
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import' })).toBeInTheDocument();
  });
});
