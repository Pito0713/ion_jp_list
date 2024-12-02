/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#313a4a',
      },
      keyframes: {
        modalUpDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '20%': { transform: 'translateY(0px)', opacity: 1 },
          '80%': { transform: 'translateY(0px)', opacity: 1 },
          '100%': { transform: 'translateY(-20px)', opacity: 0 },
        },
      },
      animation: {
        modalUpDown: 'modalUpDown 2s ease-in-out',
      },
    },
  },
  plugins: [],
}

