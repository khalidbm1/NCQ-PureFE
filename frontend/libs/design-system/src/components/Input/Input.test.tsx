import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders input', () => {
    render(<Input placeholder="test" />);
    expect(screen.getByPlaceholderText('test')).toBeInTheDocument();
  });
});
