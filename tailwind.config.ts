import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'reddit-dark': '#1a1a1b',
        'reddit-border': '#343435',
        'reddit-orange': '#ff4500',
        'reddit-gray': '#272729',
        'reddit-placeholder-gray': '#757575',
        'reddit-hover-gray': '#2d2d2e',
        'reddit-comment-line': '#343536',
        'reddit-white': '#d7dadc',
        'reddit-blue': '#2d97e5',
        'reddit-dark-blue': '#17232d'
      }
    },
  },
  plugins: [],
}
export default config
