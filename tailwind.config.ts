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
        'reddit-hover-gray': '#2d2d2e'
      }
    },
  },
  plugins: [],
}
export default config
