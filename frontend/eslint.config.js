// Archivo de configuración de eslint herramienta que revisa el código del proyecto para detectar posibles errores y mantener limpio el código tambien se puede arreglar el codigo automaticamente

import js from "@eslint/js"; // configuraciones de eslint para js (reglas recomendadas)
import globals from "globals"; // configuraciones de variables globales
import reactHooks from "eslint-plugin-react-hooks"; // configuraciones de react hooks (revisa que los hooks sean usados correctamente useEffect, useState, etc)
import reactRefresh from "eslint-plugin-react-refresh"; // configuraciones de react refresh para que funcione bien el hot reload
import { defineConfig, globalIgnores } from "eslint/config"; // defineConfig para configuracion eslint con tipado y validacion y globalIgnores para ignorar archivos

export default defineConfig([
  // defineConfig para configuracion eslint
  globalIgnores(["dist"]), // ignorar archivos en la carpeta dist
  {
    files: ["**/*.{js,jsx}"], // aplicar configuraciones solo a los archivos js y jsx
    extends: [
      // extends para heredar configuraciones
      js.configs.recommended, // conf. recomendadas de eslint para js
      reactHooks.configs["recommended-latest"], // conf. recomendadas de react hooks mas recientes
      reactRefresh.configs.vite, // conf. recomendadas de react refresh en vite
    ],
    languageOptions: {
      // configuraciones de lenguaje
      ecmaVersion: 2020, // version de ecma (estandar del lenguaje de js)
      globals: globals.browser, // configuraciones de variables globales para el navegador (window, document, etc)
      parserOptions: {
        // configuraciones de parser (analizador sintactico del lenguaje de js)
        ecmaVersion: "latest", // usar la version mas reciente
        ecmaFeatures: { jsx: true }, // habilitar el uso de jsx (react)
        sourceType: "module", // usar modulos (import y export)
      },
    },
    rules: {
      // reglas de eslint personalizadas
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }], // Marca como errores las variables que no se usan en el codigo
    },
  },
]);
