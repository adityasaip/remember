/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false, // while tailwind by default removes all html's default styles like lists, headers(h1, h2 etc), setting preflight: false brings back html defaults
  }
}

