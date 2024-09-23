/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html", // Incluye la ruta a tu index.html
    "./pages/**/*.html", // Archivos HTML en la carpeta "pages"
    "./assets/**/*.js", // Archivos JS en la carpeta "assets"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
