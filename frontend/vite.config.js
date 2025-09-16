import { defineConfig } from "vite"; // Funcion de vite que nos permite configurar el proyecto
import react from "@vitejs/plugin-react"; // Plugin (paquete complementario) para soporte de react
import path from "path"; // Modulo nativo de node.js para trabajar con rutas

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // habilitamos el soporte de react (hot reload, jsx, etc)
  resolve: {
    alias: {
      // Alias de rutas para facilitar la navegación
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  server: {
    // Configuraciones del servidor de desarrollo
    port: 5173, // Puerto de desarrollo
    host: true, // Permite que el servidor se pueda acceder desde cualquier dirección
    open: true, // Abre el navegador automáticamente
    proxy: {
      // Configuraciones de proxy (penticion al servidor backend)
      "/api": {
        // Si las rutas empiezan con /api, se enviarán a al target
        target: "http://localhost:3000", // Dirección del servidor
        changeOrigin: true, // Habilita el cambio de origen (en el caso de que el servidor backend esté en otra dirección)
        secure: false, // Desactiva la verificación de certificados SSL
      },
    },
  },
  build: {
    // Configuraciones del servidor de producción
    outDir: "dist", // carpeta donde se guardarán los archivos de producción
    sourcemap: false, // Desactiva la generación de mapas de origen
    minify: "terser", // Minifica el código con Terser (elimina comentarios y optimiza el código)
    target: "esnext", // Establece la versión de JavaScript, esnext para usar la versión más reciente
    rollupOptions: {
      // Configuraciones para empaquetar el código con Rollup
      output: {
        // Configuraciones para el archivo de salida
        manualChunks: {
          // Divide el código en chunks (paquetes)
          vendor: ["react", "react-dom"], // Paquetes de terceros
          router: ["react-router-dom"], // Paquete de enrutamiento
          ui: ["@headlessui/react", "@heroicons/react"], // Paquetes de interfaz de usuario
          charts: ["recharts"], // Paquete de gráficos
          forms: ["react-hook-form"], // Paquete de formularios
          utils: ["lodash", "date-fns", "clsx"], // Paquetes de utilidades
        },
      },
    },
    chunkSizeWarningLimit: 1000, // avisa si el tamaño de los chunks supera el límite
  }, // Sirve para que solo el usuario descargue el código necesario y use memmoria de la cache para paquetes que no se acualicen
  css: {
    // Configuraciones para el preprocesador de CSS ** Solo si se usa scss
    devSourcemap: true, // Habilita la generación de mapas de origen
    preprocessorOptions: {
      // Creación de variables globales
      scss: {
        // Permite el uso de variables globales para no declararlas en cada componente
        additionalData: '@import "@/styles/variables.scss";',
      },
    },
  },
});
