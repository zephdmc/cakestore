module.exports = {
    content: [
        './index.html',
        "./src/**/*.{js,jsx,ts,tsx}", // Simplified pattern
        "./src/*.{js,jsx,ts,tsx}",    // Add this to catch root files
    ],
    theme: {
        extend: {
            backgroundImage: {
                'purplegradient': 'linear-gradient(to right, #390039, #C1A5C1, #380638)',
                'purplegradientv': 'linear-gradient(to bottom, #390039, #C1A5C1, #380638)',
                'purplegradientr': 'radial-gradient(circle, #390039, #C1A5C1, #380638)',
            },
            colors: {
                'purpleDark1': '#770077',
                'purpleDark': '#390039',
                'purpleLight': '#C1A5C1',
                'purpleDark2': '#380638',
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
