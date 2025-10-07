import { apiClient } from "./api";
import { objectToQueryString } from "@/utils/helpers";

const USERS_BASE = "/users";

export const usersService = {
  /**
   * Listar usuarios con filtros y paginación
   */
  getAll: async (params = {}) => {
    const queryString = objectToQueryString(params);
    return await apiClient.get(`${USERS_BASE}${queryString}`);
  },

  /**
   * Obtener usuario por ID
   */
  getById: async (id) => {
    return await apiClient.get(`${USERS_BASE}/${id}`);
  },

  /**
   * Obtener perfil del usuario actual
   */
  getProfile: async () => {
    return await apiClient.get(`${USERS_BASE}/profile`);
  },

  /**
   * Crear nuevo usuario
   */
  create: async (userData) => {
    return await apiClient.post(USERS_BASE, userData);
  },

  /**
   * Actualizar usuario
   */
  update: async (id, userData) => {
    return await apiClient.patch(`${USERS_BASE}/${id}`, userData);
  },

  /**
   * Actualizar perfil propio
   */
  updateProfile: async (userData) => {
    return await apiClient.patch(`${USERS_BASE}/profile`, userData);
  },

  /**
   * Eliminar usuario (soft delete)
   */
  delete: async (id) => {
    return await apiClient.delete(`${USERS_BASE}/${id}`);
  },

  /**
   * Cambiar estado del usuario
   */
  changeStatus: async (id, status) => {
    return await apiClient.patch(`${USERS_BASE}/${id}/status`, { status });
  },

  /**
   * Bloquear/Desbloquear usuario
   */
  toggleLock: async (id, isLocked) => {
    return await apiClient.patch(`${USERS_BASE}/${id}/lock`, { isLocked });
  },

  /**
   * Resetear contraseña de usuario
   */
  resetPassword: async (id) => {
    return await apiClient.patch(`${USERS_BASE}/${id}/reset-password`);
  },

  /**
   * Buscar usuarios (autocompletado)
   */
  search: async (query) => {
    return await apiClient.get(
      `${USERS_BASE}/search?q=${encodeURIComponent(query)}`
    );
  },

  /**
   * Obtener subordinados de un usuario
   */
  getSubordinates: async (id) => {
    return await apiClient.get(`${USERS_BASE}/${id}/subordinates`);
  },

  /**
   * Obtener estadísticas de usuarios
   */
  getStatistics: async () => {
    return await apiClient.get(`${USERS_BASE}/statistics`);
  },
};
