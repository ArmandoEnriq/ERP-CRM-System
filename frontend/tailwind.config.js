/** @type {import('tailwindcss').Config} */ // le indico que es un archivo de configuración de tailwind para que me de sugerencias en base a las librerias de tailwind
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // solo busca los archivos de js, ts, jsx y tsx y index para crear el css de las clases
  plugins: [require("@tailwindcss/forms")], // plugin (libreria) de tailwind para formularios
  theme: {
    // configuración de temas
    extend: {
      // agregamos nuevos temas ya sea colores, tamanos, etc
      colors: {
        // definimos temas de colores
        primary: {
          // color primario azul y derivados
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          // color secundario gris y derivados (texto y fondo)
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        success: {
          // color de exito verde
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        warning: {
          // color de advertencia amarillo
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        danger: {
          // color de error rojo
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        // configuración de fuentes
        sans: ["Inter", "ui-sans-serif", "system-ui"], // fuente principal familia inter
        mono: ["JetBrains Mono", "ui-monospace", "monospace"], // fuente secundaria familia jetbrains mono para codigos
      },
      animation: {
        // configuración de animaciones
        "fade-in": "fadeIn 0.5s ease-in-out", // animacion de entrada aparicion suave
        "slide-in": "slideIn 0.3s ease-out", // animacion deslizamiento suave desde arriba
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }, // pulsacion lenta
      keyframes: {
        // configuración de keyframes para animaciones
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
};
