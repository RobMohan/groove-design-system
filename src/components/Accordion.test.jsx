import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accordion from './Accordion';

const items = [
  { title: 'First item', content: <p>First panel content</p> },
  { title: 'Second item', content: <p>Second panel content</p> },
  { title: 'Disabled item', content: <p>Disabled panel content</p>, disabled: true },
];

describe('Accordion Component', () => {
  it('renders all item titles as buttons', () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole('button', { name: /first item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /second item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /disabled item/i })).toBeInTheDocument();
  });

  it('expands a panel when its header is clicked', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const button = screen.getByRole('button', { name: /first item/i });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('First panel content')).not.toBeInTheDocument();

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('First panel content')).toBeInTheDocument();
  });

  it('collapses the first panel when a second opens in single mode', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const first = screen.getByRole('button', { name: /first item/i });
    const second = screen.getByRole('button', { name: /second item/i });

    await user.click(first);
    expect(screen.getByText('First panel content')).toBeInTheDocument();

    await user.click(second);
    expect(screen.getByText('Second panel content')).toBeInTheDocument();
    expect(screen.queryByText('First panel content')).not.toBeInTheDocument();
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps multiple panels open with allowMultiple', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} allowMultiple />);
    const first = screen.getByRole('button', { name: /first item/i });
    const second = screen.getByRole('button', { name: /second item/i });

    await user.click(first);
    await user.click(second);

    expect(screen.getByText('First panel content')).toBeInTheDocument();
    expect(screen.getByText('Second panel content')).toBeInTheDocument();
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens the index given by defaultOpen on first render', () => {
    render(<Accordion items={items} defaultOpen={[1]} />);
    expect(screen.getByRole('button', { name: /second item/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByText('Second panel content')).toBeInTheDocument();
    expect(screen.queryByText('First panel content')).not.toBeInTheDocument();
  });

  it('does not expand a disabled item on click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const disabled = screen.getByRole('button', { name: /disabled item/i });

    expect(disabled).toBeDisabled();

    await user.click(disabled);

    expect(disabled).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Disabled panel content')).not.toBeInTheDocument();
  });
});
