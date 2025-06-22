import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('renders options', () => {
    render(<Dropdown options={[{ label: 'A', value: 'a' }]} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const onChange = jest.fn();
    render(
      <Dropdown
        options={[{ label: 'A', value: 'a' }]}
        onChange={onChange}
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalled();
  });
});
