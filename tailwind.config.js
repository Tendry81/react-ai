/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'typing': 'typing 1.5s steps(20) infinite'
            },
            keyframes: {
                typing: {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0' }
                }
            }
        },
    },
    plugins: [],
}