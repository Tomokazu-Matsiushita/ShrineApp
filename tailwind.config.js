/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{jsx,ts,jsx,tsx,mdx}',
    './src/components/**/*.{jsx,ts,jsx,tsx,mdx}',
    './src/app/**/*.{jsx,ts,jsx,tsx,mdx}',
  ],

  theme: {
    container: {
      padding: {
        DEFAULT: '5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        'regal-blue': '#243c5a',
      },
      borderRadius: {
        'none': '0',
        'sm': '.125rem',
        DEFAULT: '.25rem',
        'lg': '.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [require('daisyui')],

  daisyui:{
    themes:["nord"],
  }
}
