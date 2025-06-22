import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import '../styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: themes.light,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'ncq-light',
          value: '#f0f9ff',
        },
        {
          name: 'saudi-green',
          value: '#f0fdf4',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        widescreen: {
          name: 'Widescreen',
          styles: {
            width: '1600px',
            height: '900px',
          },
        },
      },
    },
    // RTL support
    rtl: {
      direction: 'ltr',
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    rtl: {
      description: 'Text direction',
      defaultValue: 'ltr',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR', icon: 'arrowleftalt' },
          { value: 'rtl', title: 'RTL', icon: 'arrowrightalt' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English', right: '🇺🇸' },
          { value: 'ar', title: 'العربية', right: '🇸🇦' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { theme, rtl } = context.globals
      
      // Apply theme
      document.documentElement.classList.toggle('dark', theme === 'dark')
      
      // Apply RTL
      document.documentElement.dir = rtl
      document.documentElement.classList.toggle('rtl', rtl === 'rtl')
      
      return Story()
    },
  ],
}

export default preview