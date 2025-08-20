/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
       backgroundImage: {
                'purplegradient': 'linear-gradient(to right, #FF7EE3, #F4EAFA, #FF7EE3)',
                'purplegradientv': 'linear-gradient(to bottom, #F4EAFA, #FF7EE3, #F4EAFA)',
                'purplegradientr': 'radial-gradient(circle, #FF7EE3, #F4EAFA, #FF7EE3)',
                           'greengrade': 'radial-gradient(to right, #A5d707, #FFFFFF)',

            },
            colors: {
                'purpleDark1': '#BB2A8F',
                'purpleDark': '#4F2EAA',
                'purpleLight': '#F4EAFA',
                'purpleDark2': '#BB2A8F',
              'purpleLighter': '#F4EAFA',
               'purpleLighter1': '#ede7f6',
              'white': '#FFFFFF',
              'red': '#e91e63',
               'greengrade': 'radial-gradient(to right, #A5d707, #FFFFFF)',
               'green': 'radial-gradient(to right, #A5d707, #FFFFFF)',
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
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
