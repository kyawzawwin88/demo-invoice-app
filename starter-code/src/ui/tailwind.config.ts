import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["index.html", "./ui/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          default: 'var(--color-primary-default)',
          light: 'var(--color-primary-light)',
        },
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        destructive: 'var(--color-destructive)',
        muted: 'var(--color-muted)',
        surface: {
          light: 'var(--color-surface-light)',
          dark: 'var(--color-surface-dark)',
          darker: 'var(--color-surface-darker)',
        },
        background: {
          light: 'var(--color-background-light)',
          dark: 'var(--color-background-dark)',
        },
        text: {
          light: 'var(--color-text-light)',
          dark: 'var(--color-text-dark)',
        },
        status: {
          paid: 'var(--color-status-paid)',
          paidBg: 'var(--color-status-paid-bg)',
          paidIndicator: 'var(--color-status-paid-indicator)',
          pending: 'var(--color-status-pending)',
          pendingBg: 'var(--color-status-pending-bg)',
          pendingIndicator: 'var(--color-status-pending-indicator)',
          draft: 'var(--color-status-draft)',
          draftBg: 'var(--color-status-draft-bg)',
          draftIndicator: 'var(--color-status-draft-indicator)',
        }
      },
      fontFamily: {
        sans: ['"League Spartan"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
