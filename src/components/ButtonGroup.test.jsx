import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ButtonGroup from './ButtonGroup';
import Button from './Button';

describe('ButtonGroup', () => {
  it('renders a group containing its buttons', () => {
    render(
      <ButtonGroup>
        <Button>Day</Button>
        <Button>Week</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument();
  });

  it('applies a shared size to children without their own', () => {
    render(
      <ButtonGroup size="large">
        <Button>A</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole('button', { name: 'A' }).className).toContain('text-lg');
  });

  it('lets a child keep its own explicit size', () => {
    render(
      <ButtonGroup size="large">
        <Button size="small">A</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole('button', { name: 'A' }).className).toContain('text-sm');
  });
});
