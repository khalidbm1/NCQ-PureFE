import { render, screen } from '@testing-library/react';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders content', () => {
    render(
      <Card>
        <CardHeader>Head</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Foot</CardFooter>
      </Card>
    );
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
