/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // ---- Brand color scales (static) ----
          primary: {
            DEFAULT: '#588ae0', // Blue 500
            hover: '#a3b9ed', // Blue 300
            pressed: '#30528a', // Blue 700
            disabled: '#B5AAC8',
          },
          secondary: {
            DEFAULT: '#7c3aed', // Purple 600
            hover: '#9333ea', // Purple 700
            pressed: '#6b21a8', // Purple 800
            disabled: '#DDE4BA',
          },
          destructive: {
            DEFAULT: '#dc2626', // Red 600
            hover: '#ef4444', // Red 500
            pressed: '#991b1b', // Red 800
            disabled: '#E89999',
          },
          positive: {
            DEFAULT: '#16a34a', // Green 600
            hover: '#22c55e', // Green 500
            pressed: '#15803d', // Green 700
            disabled: '#86efac',
          },
          // ---- Semantic tokens (theme-aware via CSS variables) ----
          // Surfaces (use with bg-*)
          surface: {
            DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
            raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
            muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
            inverse: 'rgb(var(--color-surface-inverse) / <alpha-value>)',
          },
          // Text / foreground (use with text-*)
          ink: {
            DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
            muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
            subtle: 'rgb(var(--color-ink-subtle) / <alpha-value>)',
            inverse: 'rgb(var(--color-ink-inverse) / <alpha-value>)',
          },
          // Borders / dividers (use with border-*)
          line: {
            DEFAULT: 'rgb(var(--color-line) / <alpha-value>)',
            strong: 'rgb(var(--color-line-strong) / <alpha-value>)',
          },
        },
        // ---- Elevation scale (shadow-elevation-*) ----
        boxShadow: {
          'elevation-1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          'elevation-2': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          'elevation-3': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          'elevation-4': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          'elevation-5': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
        // ---- Radius scale (rounded-*) ----
        borderRadius: {
          'control': '0.5rem',  // 8px  - buttons, inputs, small controls
          'card': '0.75rem',    // 12px - cards, panels
          'modal': '1rem',      // 16px - dialogs, large surfaces
          'pill': '9999px',     // fully rounded - tags, avatars
        },
        // ---- Motion ----
        keyframes: {
          'progress-indeterminate': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(400%)' },
          },
          'fade-in': {
            from: { opacity: '0' },
            to: { opacity: '1' },
          },
          'scale-in': {
            from: { opacity: '0', transform: 'scale(0.96)' },
            to: { opacity: '1', transform: 'scale(1)' },
          },
          'slide-in-right': {
            from: { opacity: '0', transform: 'translateX(1rem)' },
            to: { opacity: '1', transform: 'translateX(0)' },
          },
        },
        animation: {
          'progress-indeterminate': 'progress-indeterminate 1.2s ease-in-out infinite',
          'fade-in': 'fade-in 0.15s ease-out',
          'scale-in': 'scale-in 0.15s ease-out',
          'slide-in-right': 'slide-in-right 0.2s ease-out',
        },
      },
    },
    plugins: [],
  }
