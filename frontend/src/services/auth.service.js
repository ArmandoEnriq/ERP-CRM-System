// Servicio de autenticación
// QUÉ HACE: Maneja todas las operaciones de autenticación
// PARA QUÉ:
// - login(): Iniciar sesión y guardar tokens
// - register(): Crear nuevas cuentas
// - logout(): Cerrar sesión y limpiar tokens
// - getProfile(): Obtener datos del usuario actual
// - forgotPassword(): Recuperar contraseña
// - refreshToken(): Renovar tokens expirados

import { apiClient } from "./api";
import { API_CONFIG, STORAGE_KEYS } from "@/utils/constants";

export const authService = {
  // Login
  async login(credentials) {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.data.access_token) {
      localStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        response.data.access_token
      );
      if (response.data.refresh_token) {
        localStorage.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          response.data.refresh_token
        );
      }
    }

    return response.data;
  },

  // Register
  async register(userData) {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  // Get current user profile
  async getProfile() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  // Update profile
  async updateProfile(profileData) {
    const response = await apiClient.put(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE,
      profileData
    );
    return response.data;
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  },

  // Reset password
  async resetPassword(token, newPassword) {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        token,
        password: newPassword,
      }
    );
    return response.data;
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });

    if (response.data.access_token) {
      localStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        response.data.access_token
      );
    }

    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Get stored token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
};
