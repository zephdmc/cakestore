module.exports = {
    content: [
        './index.html',
        "./src/**/*.{js,jsx,ts,tsx}", // Simplified pattern
        "./src/*.{js,jsx,ts,tsx}",    // Add this to catch root files
    ],
    theme: {
        extend: {
            backgroundImage: {
                'purplegradient': 'linear-gradient(to right, #390039, #c6c6c6, #380638)',
                'purplegradientv': 'linear-gradient(to bottom, #390039, #c6c6c6, #380638)',
                'purplegradientr': 'radial-gradient(circle, #390039, #c6c6c6, #380638)',
                  'greengrade': 'linear-gradient(to right, #6ab6b6, #c6c6c6)',
            },
            colors: {
                'purpleDark1': '#770077',
                'purpleDark': '#770077',
                'purpleLight': '#C1A5C1',
                'purpleDark2': '#380638',
                'white': '#ffffff',
                'Dark': '#000000',
                'green': 'radial-gradient(to right, #6ab6b6, #c6c6c6)',
                 'greengrade': 'linear-gradient(to right, #6ab6b6, #c6c6c6)',
                primary: {
                    DEFAULT: '#770077',
                    light: '#C1A5C1',
                    dark: '#390039',
                },
                secondary: {
                    DEFAULT: '#380638',
                    light: '#C1A5C1',
                    dark: '#380638',
                },
                danger: {
                    DEFAULT: '#380638',
                    light: '#C1A5c1',
                    dark: '#380638',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
};
