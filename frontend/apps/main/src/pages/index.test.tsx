import { render, screen } from '@ncq/test-utils';
import HomePage from './index';

describe('HomePage', () => {
  it('renders welcome message', () => {
    render(<HomePage />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to NCQ Platform/i)).toBeInTheDocument();
  });

  it('renders get started button', () => {
    render(<HomePage />);
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    expect(getStartedButton).toBeInTheDocument();
  });

  it('has proper SEO meta tags', () => {
    render(<HomePage />);
    
    expect(document.title).toBe('NCQ Platform - Digital Solutions for Saudi Arabia');
  });
});