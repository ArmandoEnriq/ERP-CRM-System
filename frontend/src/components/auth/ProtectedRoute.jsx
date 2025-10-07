import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/utils/constants";
import Spinner from "@/components/ui/Spinner";
import { useEffect } from "react";

const ProtectedRoute = ({
  children,
  requiredRole = null,
  requiredRoles = null,
}) => {
  const location = useLocation();

  // ✅ CORRECTO: Lee el estado directamente sin llamar funciones
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  // ✅ Llama a checkAuth dentro de useEffect, no durante el render
  useEffect(() => {
    checkAuth();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Si está cargando el usuario (aún no hay datos)
  if (!user) {
    return <Spinner fullScreen text="Cargando..." />;
  }

  // Verificar rol si es requerido
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Verificar roles múltiples si son requeridos
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
