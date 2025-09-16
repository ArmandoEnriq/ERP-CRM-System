// Servicio de usuarios
// QUÉ HACE: Maneja todas las operaciones relacionadas con empresas/organizaciones
// PARA QUÉ:
// - Multi-tenancy: Cada usuario puede pertenecer a una/varias empresas
// - Configuración empresarial (datos fiscales, logos, configuraciones)
// - Gestión de sucursales o departamentos
// - Permisos y roles por empresa

import { apiClient } from "./api";
import { API_CONFIG } from "@/utils/constants";

export const usersService = {
  // Get all users with pagination
  async getUsers(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USERS.BASE, {
      params,
    });
    return response.data;
  },

  // Get user by ID
  async getUserById(id) {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`
    );
    return response.data;
  },

  // Create new user
  async createUser(userData) {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      userData
    );
    return response.data;
  },

  // Update user
  async updateUser(id, userData) {
    const response = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`,
      userData
    );
    return response.data;
  },

  // Delete user
  async deleteUser(id) {
    const response = await apiClient.delete(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`
    );
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.upload(
      API_CONFIG.ENDPOINTS.USERS.AVATAR,
      formData
    );
    return response.data;
  },

  // Get user profile
  async getProfile() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await apiClient.put(
      API_CONFIG.ENDPOINTS.USERS.PROFILE,
      profileData
    );
    return response.data;
  },
};
