import { apiClient } from "./api";
import { objectToQueryString } from "@/utils/helpers";

const COMPANIES_BASE = "/companies";

export const companiesService = {
  /**
   * Listar empresas con filtros y paginación
   */
  getAll: async (params = {}) => {
    const queryString = objectToQueryString(params);
    return await apiClient.get(`${COMPANIES_BASE}${queryString}`);
  },

  /**
   * Obtener empresa por ID
   */
  getById: async (id) => {
    return await apiClient.get(`${COMPANIES_BASE}/${id}`);
  },

  /**
   * Obtener mi empresa
   */
  getMyCompany: async () => {
    return await apiClient.get(`${COMPANIES_BASE}/my-company`);
  },

  /**
   * Crear nueva empresa
   */
  create: async (companyData) => {
    return await apiClient.post(COMPANIES_BASE, companyData);
  },

  /**
   * Actualizar empresa
   */
  update: async (id, companyData) => {
    return await apiClient.patch(`${COMPANIES_BASE}/${id}`, companyData);
  },

  /**
   * Eliminar empresa (soft delete)
   */
  delete: async (id) => {
    return await apiClient.delete(`${COMPANIES_BASE}/${id}`);
  },

  /**
   * Cambiar estado de la empresa
   */
  changeStatus: async (id, status) => {
    return await apiClient.patch(`${COMPANIES_BASE}/${id}/status`, { status });
  },

  /**
   * Buscar empresas (autocompletado)
   */
  search: async (query) => {
    return await apiClient.get(
      `${COMPANIES_BASE}/search?q=${encodeURIComponent(query)}`
    );
  },

  /**
   * Obtener contador de usuarios de una empresa
   */
  getUsersCount: async (id) => {
    return await apiClient.get(`${COMPANIES_BASE}/${id}/users-count`);
  },

  /**
   * Verificar si se pueden agregar más usuarios
   */
  canAddUser: async (id) => {
    return await apiClient.get(`${COMPANIES_BASE}/${id}/can-add-user`);
  },

  /**
   * Actualizar contador de usuarios
   */
  updateUserCount: async (id) => {
    return await apiClient.patch(`${COMPANIES_BASE}/${id}/update-user-count`);
  },

  /**
   * Obtener estadísticas de empresas
   */
  getStatistics: async () => {
    return await apiClient.get(`${COMPANIES_BASE}/statistics`);
  },

  /**
   * Obtener empresas con suscripción por vencer
   */
  getExpiringSoon: async (days = 30) => {
    return await apiClient.get(`${COMPANIES_BASE}/expiring-soon?days=${days}`);
  },

  /**
   * Obtener empresas con suscripción vencida
   */
  getExpired: async () => {
    return await apiClient.get(`${COMPANIES_BASE}/expired`);
  },

  /**
   * Renovar suscripción
   */
  renewSubscription: async (id, subscriptionData) => {
    return await apiClient.patch(
      `${COMPANIES_BASE}/${id}/subscription`,
      subscriptionData
    );
  },
};
