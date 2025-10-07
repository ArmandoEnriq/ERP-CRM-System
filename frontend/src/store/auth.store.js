import { create } from "zustand";
import { authService } from "@/services/auth.service";

export const useAuthStore = create((set, get) => ({
  // Estado
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  // Acciones

  /**
   * Iniciar sesión
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Error al iniciar sesión",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Registrarse
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Error al registrarse",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      // Limpiar estado de todos modos
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Cerrar todas las sesiones
   */
  logoutAll: async () => {
    set({ isLoading: true });
    try {
      await authService.logoutAll();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error during logout all:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Actualizar perfil
   */
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authService.getProfile();
      authService.updateCurrentUser(updatedUser);
      set({
        user: updatedUser,
        isLoading: false,
      });
      return updatedUser;
    } catch (error) {
      set({
        error: error.message || "Error al actualizar perfil",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Refrescar datos del usuario
   */
  refreshUser: async () => {
    try {
      const user = await authService.getProfile();
      authService.updateCurrentUser(user);
      set({ user });
      return user;
    } catch (error) {
      console.error("Error refreshing user:", error);
      throw error;
    }
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (passwords) => {
    set({ isLoading: true, error: null });
    try {
      await authService.changePassword(passwords);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error.message || "Error al cambiar contraseña",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Limpiar error
   */
  clearError: () => set({ error: null }),

  /**
   * Verificar autenticación
   */
  checkAuth: () => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    set({ isAuthenticated, user });
    return isAuthenticated;
  },

  /**
   * Obtener usuario actual
   */
  getUser: () => get().user,

  /**
   * Verificar si tiene un rol específico
   */
  hasRole: (role) => {
    const user = get().user;
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  },

  /**
   * Verificar si tiene un rol o superior
   */
  hasRoleOrHigher: (requiredRole, hierarchy) => {
    const user = get().user;
    if (!user) return false;
    const userLevel = hierarchy[user.role] || 0;
    const requiredLevel = hierarchy[requiredRole] || 0;
    return userLevel >= requiredLevel;
  },
}));
