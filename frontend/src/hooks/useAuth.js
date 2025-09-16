// Hook personalizado para autenticación
// QUÉ HACE: Simplifica el uso del store de auth en componentes
// PARA QUÉ:
// - const { user, login, logout } = useAuth()
// - Helper methods: hasRole(), isAdmin(), canAccess()
// - Inicialización automática
// - Loading y error states

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    loadUser,
    initialize,
    clearError,
  } = useAuthStore();

  // Inicializar el store de auth cuando se monta el hook
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    loadUser,
    clearError,

    // Helper methods
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role),
    isAdmin: () => ["super_admin", "admin"].includes(user?.role),
    canAccess: (permission) => user?.permissions?.includes(permission),
  };
};
