import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  args: {
    headers: ['Name', 'Age'],
    rows: [
      ['Alice', 30],
      ['Bob', 25],
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Table>;

export const Basic: Story = {};
