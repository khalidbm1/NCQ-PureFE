import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  args: {
    children: 'Info alert',
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Info: Story = { args: { variant: 'info' } };
export const Success: Story = { args: { variant: 'success', children: 'Success alert' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Warning alert' } };
export const Error: Story = { args: { variant: 'error', children: 'Error alert' } };
