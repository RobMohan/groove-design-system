import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar, { AvatarGroup } from './Avatar';

describe('Avatar Component', () => {
  it('renders initials from a name', () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders an img with alt when src is provided', () => {
    render(<Avatar src="https://i.pravatar.cc/150?img=12" alt="Jane's photo" name="Jane Doe" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://i.pravatar.cc/150?img=12');
    expect(img).toHaveAttribute('alt', "Jane's photo");
  });

  it('falls back to initials when only a name is given', () => {
    const { container } = render(<Avatar name="Amy Lee" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders a generic glyph and sr-only text when neither name nor src given', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('User avatar')).toBeInTheDocument();
  });

  it('applies a status dot when status is set', () => {
    render(<Avatar name="Jane Doe" status="online" />);
    expect(screen.getByLabelText('online')).toBeInTheDocument();
  });

  it('does not render a status dot by default', () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.queryByLabelText('online')).not.toBeInTheDocument();
  });
});

describe('AvatarGroup Component', () => {
  it('renders a "+N" overflow chip when items exceed max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Jane Doe" />
        <Avatar name="John Smith" />
        <Avatar name="Amy Lee" />
        <Avatar name="Carlos Ruiz" />
      </AvatarGroup>
    );
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('does not render an overflow chip when within max', () => {
    render(
      <AvatarGroup max={3}>
        <Avatar name="Jane Doe" />
        <Avatar name="John Smith" />
      </AvatarGroup>
    );
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });
});
