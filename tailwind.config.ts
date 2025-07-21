// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Assuming your components are here
    './jupeta-ec-v1.global.scss', // **Important: Include your SCSS file too!**
    // Add any other paths where you use Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};