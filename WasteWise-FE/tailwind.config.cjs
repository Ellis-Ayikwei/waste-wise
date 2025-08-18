/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                // wasgo Brand Colors with full scale
                primary: {
                    50: '#e8f5e9',  // Lightest eco green
                    100: '#c8e6c9', // Very light green
                    200: '#a5d6a7', // Fresh Mint (background sections)
                    300: '#81c784', // Light green
                    400: '#66bb6a', // Leaf Green (hover states)
                    500: '#2e7d32', // Eco Green (primary buttons, headings)
                    600: '#388e3c', // Slightly lighter than default
                    700: '#2e7d32', // DEFAULT
                    800: '#1b5e20', // Darker green
                    900: '#0d3e10', // Darkest green
                    DEFAULT: '#2e7d32',
                    light: '#a5d6a7',
                    'dark-light': 'rgba(46, 125, 50, 0.15)',
                },
                
                // Secondary colors for accents
                secondary: {
                    50: '#e3f2fd',  // Lightest blue
                    100: '#bbdefb', // Very light blue
                    200: '#90caf9', // Light blue
                    300: '#64b5f6', // Medium light blue
                    400: '#42a5f5', // Medium blue
                    500: '#0288d1', // Smart Blue (IoT icons, active states)
                    600: '#0277bd', // Darker blue
                    700: '#01579b', // Dark blue
                    800: '#014170', // Very dark blue
                    900: '#002845', // Darkest blue
                    DEFAULT: '#0288d1',
                    light: '#90caf9',
                    'dark-light': 'rgba(2, 136, 209, 0.15)',
                },

                // Accent colors
                accent: {
                    yellow: {
                        50: '#fffde7',
                        100: '#fff9c4',
                        200: '#fff59d',
                        300: '#fff176',
                        400: '#ffee58',
                        500: '#ffeb3b', // Accent Yellow (alerts, warnings)
                        600: '#fdd835',
                        700: '#fbc02d',
                        800: '#f9a825',
                        900: '#f57f17',
                        DEFAULT: '#ffeb3b',
                    },
                },

                // Semantic colors with wasgo theme
                success: {
                    50: '#e8f5e9',
                    100: '#c8e6c9',
                    200: '#a5d6a7',
                    300: '#81c784',
                    400: '#66bb6a',
                    500: '#4caf50', // Success green
                    600: '#43a047',
                    700: '#388e3c',
                    800: '#2e7d32',
                    900: '#1b5e20',
                    DEFAULT: '#4caf50',
                    light: '#c8e6c9',
                    'dark-light': 'rgba(76, 175, 80, 0.15)',
                },

                warning: {
                    50: '#fffde7',
                    100: '#fff9c4',
                    200: '#fff59d',
                    300: '#fff176',
                    400: '#ffee58',
                    500: '#ffeb3b', // Warning yellow
                    600: '#fdd835',
                    700: '#fbc02d',
                    800: '#f9a825',
                    900: '#f57f17',
                    DEFAULT: '#ffeb3b',
                    light: '#fff9c4',
                    'dark-light': 'rgba(255, 235, 59, 0.15)',
                },

                danger: {
                    50: '#ffebee',
                    100: '#ffcdd2',
                    200: '#ef9a9a',
                    300: '#e57373',
                    400: '#ef5350',
                    500: '#f44336', // Danger red
                    600: '#e53935',
                    700: '#d32f2f',
                    800: '#c62828',
                    900: '#b71c1c',
                    DEFAULT: '#f44336',
                    light: '#ffcdd2',
                    'dark-light': 'rgba(244, 67, 54, 0.15)',
                },

                info: {
                    50: '#e3f2fd',
                    100: '#bbdefb',
                    200: '#90caf9',
                    300: '#64b5f6',
                    400: '#42a5f5',
                    500: '#2196f3', // Info blue
                    600: '#1e88e5',
                    700: '#1976d2',
                    800: '#1565c0',
                    900: '#0d47a1',
                    DEFAULT: '#2196f3',
                    light: '#bbdefb',
                    'dark-light': 'rgba(33, 150, 243, 0.15)',
                },

                // Dark mode specific colors
                dark: {
                    DEFAULT: '#263238', // Deep Charcoal
                    100: '#37474f',
                    200: '#455a64',
                    300: '#546e7a',
                    400: '#607d8b',
                    500: '#78909c',
                    600: '#90a4ae',
                    700: '#b0bec5',
                    800: '#cfd8dc',
                    900: '#eceff1', // Tech Gray
                    // Provide a proper "light" shade so classes like bg-dark-light work
                    light: 'rgba(38, 50, 56, 0.15)',
                    // Keep legacy key for backward compatibility (generates bg-dark-dark-light)
                    'dark-light': 'rgba(38, 50, 56, 0.15)',
                },

                // wasgo specific status colors
                waste: {
                    empty: '#4caf50',     // Green - empty bin
                    low: '#8bc34a',       // Light green - low fill
                    medium: '#ffeb3b',    // Yellow - medium fill
                    high: '#ff9800',      // Orange - high fill
                    full: '#f44336',      // Red - full bin
                    overflow: '#b71c1c',  // Dark red - overflow
                },

                // Background colors
                background: {
                    light: '#ffffff',
                    DEFAULT: '#f5f5f5',
                    dark: '#263238',
                    section: '#a5d6a7', // Fresh Mint for sections
                    card: '#eceff1',    // Tech Gray for cards
                },

                // Text colors
                text: {
                    light: '#607d8b',
                    DEFAULT: '#263238',
                    dark: '#ffffff',
                    muted: '#90a4ae',
                },

                // Additional UI colors
                border: {
                    light: '#e0e0e0',
                    DEFAULT: '#bdbdbd',
                    dark: '#424242',
                },

                // Legacy colors (for gradual migration)
                black: '#263238',
                white: '#ffffff',
                // Custom white variants used across styles
                // "white-light" is a very light off-white for borders/background accents
                'white-light': '#f6f6f6',
                // "white-dark" is a soft light gray used as text on dark surfaces
                'white-dark': '#cfd8dc',
                transparent: 'transparent',
            },
            
            fontFamily: {
                satoshi: ['Satoshi', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                // Add professional fonts for wasgo
                poppins: ['Poppins', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            
            spacing: {
                4.5: '18px',
            },
            
            boxShadow: {
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'eco': '0 4px 14px 0 rgba(46, 125, 50, 0.15)',
                'smart': '0 4px 14px 0 rgba(2, 136, 209, 0.15)',
            },
            
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.text.DEFAULT'),
                        h1: { color: theme('colors.primary.700') },
                        h2: { color: theme('colors.primary.700') },
                        h3: { color: theme('colors.primary.600') },
                        h4: { color: theme('colors.primary.600') },
                        strong: { color: theme('colors.text.DEFAULT') },
                        a: {
                            color: theme('colors.secondary.500'),
                            '&:hover': {
                                color: theme('colors.secondary.600'),
                            },
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
    ],
};
