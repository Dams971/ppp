/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{html,js,ts,jsx,tsx}", // Ajustez selon la structure de votre projet
        "./pages/*.{html,js,ts,jsx,tsx}",
        "./public/css/*.css"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    variants: {
        display: ['group-hover']
    }
};