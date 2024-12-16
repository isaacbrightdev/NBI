import typography from '@tailwindcss/typography';

export default {
  mode: 'jit', // Enable JIT mode
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    listStyleTypes:{
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      roman: 'upper-roman'
    },
    fontFamily: {
      sans: "'Poppins', sans-serif"
    },
    fontSize: {
      h1: '3.125rem',
      h2: '2.5rem',
      'h2-mobile': '1.563rem',
      h3: [
        '1.563rem',
        {
          fontWeight: 500
        }
      ],
      'h3-mobile': '1.25rem',
      h4: [
        '1.25rem',
        {
          fontWeight: 500
        }
      ],
      'h4-mobile': '1rem',
      base: '1rem',
      callout: [
        '14px',
        {
          fontWeight: 500,
          textTransform: 'uppercase'
        }
      ],
      'sm-body': '14px',
      'fine-print': [
        '12px',
        {
          fontWeight: 500
        }
      ]
    },
    screens: {
      sm: '640px',
      md: '768px',
      'lg-max': { max: '1023.98px' },
      lg: '1024px',
      'xl-max': { max: '1199.98px' },
      xl: '1200px',
      '2xl-max': { max: '1439.98px' },
      '2xl': '1440px'
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--tw-primary)',
          light: 'var(--tw-primary-light)'
        },
        secondary: {
          DEFAULT: 'var(--tw-secondary)'
        },
        accent: {
          DEFAULT: 'var(--tw-accent)',
          light: 'var(--tw-accent-light)',
          dark: 'var(--tw-accent-dark)',
          'text-color': 'var(--tw-accent-text-color)'
        },
        white: '#FFFFFF',
        grey: {
          DEFAULT: 'var(--tw-grey)',
          dark: 'var(--tw-grey-dark)',
          light: 'var(--tw-grey-light)'
        },
        warn: {
          DEFAULT: 'var(--tw-warn)',
          light: 'var(--tw-warn-light)'
        },
        active: {
          DEFAULT: 'var(--tw-active)',
          light: 'var(--tw-active-light)'
        },
        error: {
          DEFAULT: 'var(--tw-error)',
          light: 'var(--tw-error-light)',
          dark: 'var(--tw-error-dark)'
        },
        gradient: {
          'light-stop': 'var(--tw-gradient-light-stop)',
          'light-stop-end': 'var(--tw-gradient-light-stop-end)'
        }
      },
      boxShadow: {
        dropdown: '0 1px 15px 0 rgba(9, 34, 84, 0.20)'
      },
      aspectRatio: {
        '7/5': '7 / 5',
        '5/3': '5 / 3',
        '7/4': '7 / 4'
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-counters': 'var(--tw-primary)',
            '--tw-prose-bullets': 'var(--tw-primary)'
          }
        }
      })
    }
  },
  plugins: [
    typography,
    require('@tailwindcss/forms'),
    require('tailwind-bootstrap-grid')({
      gridGutterWidth: '1.5rem',
      gridGutters: {
        0: '0',
        sm: '1rem',
        xl: '6rem'
      },
      containerMaxWidths: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1440px'
      }
    })
  ],
  corePlugins: {
    container: false
  }
};
