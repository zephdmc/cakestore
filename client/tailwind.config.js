/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'purplegradient': 'linear-gradient(to right, #FF7EE3, #c6c6c6, #FF7EE3)',
        'purplegradientv': 'linear-gradient(to bottom, #F4EAFA, #c6c6c6, #F4EAFA)',
        'purplegradientr': 'radial-gradient(circle, #FF7EE3, #c6c6c6, #FF7EE3)',
        'greengrade': 'linear-gradient(to right, #6ab6b6, #c6c6c6)',
      },
      colors: {
        'purpleDark1': '#BB2A8F',
        'purpleDark': '#BB2A8F',
        'purpleLight': '#F4EAFA',
        'purpleDark2': '#BB2A8F',
        'purpleLighter': '#F4EAFA',
        'purpleLighter1': '#ede7f6',
        'white': '#6ab6b6',
        'gray': '#ffffff',
        'red': '#e91e63',
        'greengrade': '#6ab6b6', // Removed gradient from colors (gradients belong in backgroundImage)
        'green': '#6ab6b6', // Removed gradient from colors
        primary: {
          DEFAULT: '#4A2BA0',
          light: '#ede7f6',
          dark: '#4A2BA0',
        },
        // secondary: {
        //     DEFAULT: '#10B981',
        //     light: '#34D399',
        //     dark: '#059669',
        // },
        // danger: {
        //     DEFAULT: '#380638',
        //     light: '#C1A5c1',
        //     dark: '#380638',
        // },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
