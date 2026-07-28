import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Field, { useField } from './Field';

describe('Field', () => {
  it('ties the label to the input via the generated id', () => {
    render(
      <Field label="Email">
        {(field) => <input aria-label="email-input" {...field} />}
      </Field>
    );
    const input = screen.getByLabelText('email-input');
    const label = screen.getByText('Email');
    expect(input.id).toBeTruthy();
    expect(label).toHaveAttribute('for', input.id);
  });

  it('links the description via aria-describedby', () => {
    render(
      <Field label="Email" description="We'll never share it.">
        {(field) => <input aria-label="email-input" {...field} />}
      </Field>
    );
    const input = screen.getByLabelText('email-input');
    const desc = screen.getByText("We'll never share it.");
    expect(input.getAttribute('aria-describedby')).toContain(desc.id);
  });

  it('marks the field invalid and shows the error as an alert', () => {
    render(
      <Field label="Username" error="Taken.">
        {(field) => <input aria-label="u" {...field} />}
      </Field>
    );
    expect(screen.getByLabelText('u')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Taken.');
  });

  it('renders a required marker and sets required on the input', () => {
    render(
      <Field label="Name" required>
        {(field) => <input aria-label="n" {...field} />}
      </Field>
    );
    expect(screen.getByLabelText('n')).toBeRequired();
    expect(screen.getByText('Name').textContent).toContain('*');
  });

  it('exposes the field bundle through the useField context', () => {
    const Child = () => {
      const field = useField();
      return <input aria-label="ctx" {...field} />;
    };
    render(
      <Field label="Ctx" error="Bad">
        <Child />
      </Field>
    );
    expect(screen.getByLabelText('ctx')).toHaveAttribute('aria-invalid', 'true');
  });
});
