import { apiClient } from "./api";
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "@/utils/constants";

const AUTH_BASE = "/auth";

export const authService = {
  /**
   * Iniciar sesión
   */
  login: async (credentials) => {
    const response = await apiClient.post(`${AUTH_BASE}/login`, credentials);

    // Guardar tokens y datos del usuario
    if (response.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (userData) => {
    const response = await apiClient.post(`${AUTH_BASE}/register`, userData);

    // Guardar tokens y datos del usuario
    if (response.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    try {
      await apiClient.post(`${AUTH_BASE}/logout`);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Limpiar localStorage independientemente del resultado
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Cerrar todas las sesiones
   */
  logoutAll: async () => {
    try {
      await apiClient.post(`${AUTH_BASE}/logout-all`);
    } catch (error) {
      console.error("Error during logout all:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Refrescar token
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(`${AUTH_BASE}/refresh`, {
      refreshToken,
    });

    if (response.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }

    return response;
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (passwords) => {
    return await apiClient.patch(`${AUTH_BASE}/change-password`, passwords);
  },

  /**
   * Solicitar restablecimiento de contraseña
   */
  forgotPassword: async (email) => {
    return await apiClient.post(`${AUTH_BASE}/forgot-password`, { email });
  },

  /**
   * Restablecer contraseña con token
   */
  resetPassword: async (token, password) => {
    return await apiClient.post(`${AUTH_BASE}/reset-password`, {
      token,
      password,
    });
  },

  /**
   * Obtener perfil del usuario actual
   */
  getProfile: async () => {
    return await apiClient.get(`${AUTH_BASE}/profile`);
  },

  /**
   * Obtener sesiones activas
   */
  getSessions: async () => {
    return await apiClient.get(`${AUTH_BASE}/sessions`);
  },

  /**
   * Terminar una sesión específica
   */
  terminateSession: async (sessionId) => {
    return await apiClient.delete(`${AUTH_BASE}/sessions/${sessionId}`);
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  /**
   * Obtener token actual
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Obtener refresh token actual
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Obtener datos del usuario del localStorage
   */
  getCurrentUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Actualizar datos del usuario en localStorage
   */
  updateCurrentUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Limpiar autenticación
   */
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
