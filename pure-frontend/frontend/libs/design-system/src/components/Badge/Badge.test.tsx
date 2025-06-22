import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Badge variant="error">Err</Badge>);
    expect(screen.getByText('Err').className).toMatch(/red/);
  });
});
