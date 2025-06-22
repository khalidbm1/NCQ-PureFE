import { fireEvent, render, screen } from '@testing-library/react';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('switches tabs on click', () => {
    render(
      <Tabs
        tabs={[
          { label: 'Tab1', content: <div>One</div> },
          { label: 'Tab2', content: <div>Two</div> },
        ]}
      />
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Tab2'));
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
