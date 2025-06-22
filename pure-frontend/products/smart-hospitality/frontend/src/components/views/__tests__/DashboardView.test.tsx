import { render, screen } from '@testing-library/react';
import { DashboardView } from '../DashboardView';
import '@testing-library/jest-dom';

describe('DashboardView', () => {
  it('renders greeting text', () => {
    render(<DashboardView />);
    expect(screen.getByText(/Good Morning/i)).toBeInTheDocument();
  });
});
