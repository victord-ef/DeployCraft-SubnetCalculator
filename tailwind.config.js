/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dc: {
          dark:   '#111827',
          card:   '#1a2233',
          border: '#2d3a4f',
          accent: '#3b82f6',
          cyan:   '#06b6d4',
          fg:     '#e2e8f0',
          muted:  '#94a3b8',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
