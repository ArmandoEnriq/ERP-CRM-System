// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // para uso de rutas
import { Toaster } from "react-hot-toast"; // para uso de notificaciones
import "./index.css"; // hoja de estilos

// Importar páginas
import LandingPage from "./pages/LandingPage"; // página de inicio
import NotFoundPage from "./pages/NotFoundPage"; // página no encontrada

function App() {
  return (
    <Router>
      {" "}
      {/* Configuración de rutas */}
      <div className="App min-h-screen bg-gray-50">
        {/* Configuración de notificaciones globales */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#10B981",
              },
            },
            error: {
              style: {
                background: "#EF4444",
              },
            },
          }}
        />

        {/* Rutas principales */}
        <Routes>
          {/* Ruta de inicio temporal */}
          <Route path="/" element={<LandingPage />} />

          {/* Rutas que agregaremos más adelante */}
          {/* <Route path="/auth/*" element={<AuthRoutes />} /> */}
          {/* <Route path="/dashboard/*" element={<DashboardRoutes />} /> */}

          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
