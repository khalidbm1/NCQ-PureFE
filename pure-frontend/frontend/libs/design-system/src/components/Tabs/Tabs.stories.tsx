import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    tabs: [
      { label: 'Tab 1', content: <div>First</div> },
      { label: 'Tab 2', content: <div>Second</div> },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Basic: Story = {};
