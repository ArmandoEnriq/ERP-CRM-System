// Con este archivo procesamos los css creados con tailwindcss antes de enviarlos al navegador
module.exports = {
  plugins: {
    // plugins de postcss (librerias)
    "@tailwindcss/postcss": {}, // este plugin primero toma el css generado por tailwind y le aplica las clases de tailwind.config.js
    autoprefixer: {}, // agregamos compatibilidad con navegadores antiguos
  },
};
