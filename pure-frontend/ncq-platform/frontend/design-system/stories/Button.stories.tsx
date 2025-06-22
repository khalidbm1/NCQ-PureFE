import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../src/components/Button/Button'
import { Download, Plus, ArrowRight, Heart, Star } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Includes NCQ and Saudi-specific styling options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'ncq',
        'ncq-outline',
        'ncq-ghost',
        'saudi',
        'saudi-outline',
        'success',
        'warning',
        'error',
        'gradient',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
      description: 'The size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
    },
    asChild: {
      control: 'boolean',
      description: 'Change the default rendered element for the one passed as a child',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Basic Examples
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const NCQPrimary: Story = {
  args: {
    variant: 'ncq',
    children: 'NCQ Button',
  },
}

export const SaudiThemed: Story = {
  args: {
    variant: 'saudi',
    children: 'Saudi Button',
  },
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants of the button component.',
      },
    },
  },
}

export const NCQVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="ncq">NCQ Primary</Button>
      <Button variant="ncq-outline">NCQ Outline</Button>
      <Button variant="ncq-ghost">NCQ Ghost</Button>
      <Button variant="gradient">Gradient</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'NCQ-specific button variants with brand colors.',
      },
    },
  },
}

export const SaudiVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="saudi">Saudi Primary</Button>
      <Button variant="saudi-outline">Saudi Outline</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Saudi-themed button variants using green and gold colors.',
      },
    },
  },
}

export const StatusVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="error">Error</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status-specific button variants for different states.',
      },
    },
  },
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes available for the button component.',
      },
    },
  },
}

export const IconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon-sm" variant="outline">
        <Plus className="h-3 w-3" />
      </Button>
      <Button size="icon" variant="outline">
        <Plus className="h-4 w-4" />
      </Button>
      <Button size="icon-lg" variant="outline">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons in different sizes.',
      },
    },
  },
}

// With Icons
export const WithLeftIcon: Story = {
  args: {
    children: 'Download',
    leftIcon: <Download className="h-4 w-4" />,
  },
}

export const WithRightIcon: Story = {
  args: {
    children: 'Continue',
    rightIcon: <ArrowRight className="h-4 w-4" />,
  },
}

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Heart className="h-4 w-4" />,
    'aria-label': 'Like',
  },
}

export const WithBothIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button
        variant="ncq"
        leftIcon={<Star className="h-4 w-4" />}
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Featured Action
      </Button>
      <Button
        variant="saudi-outline"
        leftIcon={<Download className="h-4 w-4" />}
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Download & Continue
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with both left and right icons.',
      },
    },
  },
}

// States
export const LoadingState: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading>Loading</Button>
      <Button loading loadingText="Saving...">
        Save
      </Button>
      <Button variant="ncq" loading>
        Processing
      </Button>
      <Button variant="saudi" loading loadingText="جاري التحميل...">
        Submit
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons in loading state with spinner animation.',
      },
    },
  },
}

export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="ncq" disabled>
        NCQ Disabled
      </Button>
      <Button variant="outline" disabled>
        Outline Disabled
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons in disabled state.',
      },
    },
  },
}

// Layout
export const FullWidth: Story = {
  render: () => (
    <div className="w-96">
      <div className="space-y-4">
        <Button fullWidth>Full Width Button</Button>
        <Button variant="ncq" fullWidth>
          NCQ Full Width
        </Button>
        <Button variant="outline" fullWidth>
          Outline Full Width
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons that take the full width of their container.',
      },
    },
  },
}

// Interactive Examples
export const InteractiveExample: Story = {
  render: () => {
    const handleClick = () => {
      alert('Button clicked!')
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleClick}>Click Me</Button>
          <Button variant="ncq" onClick={handleClick}>
            NCQ Action
          </Button>
          <Button variant="saudi" onClick={handleClick}>
            Saudi Action
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleClick}
          >
            Download
          </Button>
          <Button
            variant="ghost"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={handleClick}
          >
            Next
          </Button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive buttons with click handlers.',
      },
    },
  },
}

// RTL Example
export const RTLExample: Story = {
  render: () => (
    <div dir="rtl" className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}>
          التالي
        </Button>
        <Button variant="saudi" leftIcon={<Download className="h-4 w-4" />}>
          تحميل
        </Button>
      </div>
      <Button variant="ncq" fullWidth>
        زر كامل العرض
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with Arabic text and RTL layout support.',
      },
    },
  },
}

// Complex Example
export const ComplexExample: Story = {
  render: () => (
    <div className="max-w-md mx-auto space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Payment Options</h3>
      
      <div className="space-y-3">
        <Button
          variant="ncq"
          fullWidth
          size="lg"
          leftIcon={<Star className="h-5 w-5" />}
        >
          Premium Plan - $99/month
        </Button>
        
        <Button
          variant="saudi"
          fullWidth
          leftIcon={<Heart className="h-4 w-4" />}
        >
          Support Local Business
        </Button>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button variant="ncq" className="flex-1">
            Continue
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Secure payment powered by NCQ Platform
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complex example showing buttons in a payment interface context.',
      },
    },
  },
}