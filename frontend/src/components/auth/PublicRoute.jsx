/**
 * Componente para rutas públicas (solo para usuarios no autenticados)
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../store/auth.store";

const PublicRoute = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    // Intentar ir a la página desde donde vino o al dashboard
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // No está autenticado, renderizar rutas públicas
  return <Outlet />;
};

export default PublicRoute;
