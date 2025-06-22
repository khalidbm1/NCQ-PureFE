import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'Type here' },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Basic: Story = {};
