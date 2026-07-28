import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Portal from './Portal';

describe('Portal', () => {
  it('renders children into document.body by default', () => {
    render(
      <div data-testid="host">
        <Portal>
          <span data-testid="portaled">Hello</span>
        </Portal>
      </div>
    );
    const portaled = screen.getByTestId('portaled');
    const host = screen.getByTestId('host');
    expect(portaled).toBeInTheDocument();
    // Portaled content escapes its parent host node.
    expect(host.contains(portaled)).toBe(false);
    expect(document.body.contains(portaled)).toBe(true);
  });

  it('renders into a custom container when provided', () => {
    const container = document.createElement('div');
    container.id = 'custom-container';
    document.body.appendChild(container);
    render(
      <Portal container={container}>
        <span data-testid="portaled">Hi</span>
      </Portal>
    );
    expect(container.querySelector('[data-testid="portaled"]')).not.toBeNull();
    document.body.removeChild(container);
  });
});
