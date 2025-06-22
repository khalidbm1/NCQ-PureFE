import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Message');
  });

  it('applies variant class', () => {
    render(<Alert variant="success">Ok</Alert>);
    expect(screen.getByRole('alert').className).toMatch(/green/);
  });
});
