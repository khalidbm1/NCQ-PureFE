import { render, screen } from '@testing-library/react';
import { Table } from './Table';

describe('Table', () => {
  it('renders headers and rows', () => {
    render(<Table headers={['Col']} rows={[['Val']]} />);
    expect(screen.getByText('Col')).toBeInTheDocument();
    expect(screen.getByText('Val')).toBeInTheDocument();
  });
});
