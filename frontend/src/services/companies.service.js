// Servicio de empresas
// QUÉ HACE: Maneja todas las operaciones relacionadas con empresas/organizaciones
// PARA QUÉ:
// - Multi-tenancy: Cada usuario puede pertenecer a una/varias empresas
// - Configuración empresarial (datos fiscales, logos, configuraciones)
// - Gestión de sucursales o departamentos
// - Permisos y roles por empresa

import { apiClient } from "./api";
import { API_CONFIG } from "@/utils/constants";

export const companiesService = {
  // Get all companies
  async getCompanies(params = {}) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMPANIES.BASE, {
      params,
    });
    return response.data;
  },

  // Get company by ID
  async getCompanyById(id) {
    const response = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.COMPANIES.BASE}/${id}`
    );
    return response.data;
  },

  // Get current user's company
  async getCurrentCompany() {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.COMPANIES.CURRENT
    );
    return response.data;
  },

  // Create new company
  async createCompany(companyData) {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.COMPANIES.BASE,
      companyData
    );
    return response.data;
  },

  // Update company
  async updateCompany(id, companyData) {
    const response = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.COMPANIES.BASE}/${id}`,
      companyData
    );
    return response.data;
  },

  // Delete company
  async deleteCompany(id) {
    const response = await apiClient.delete(
      `${API_CONFIG.ENDPOINTS.COMPANIES.BASE}/${id}`
    );
    return response.data;
  },

  // Update current company
  async updateCurrentCompany(companyData) {
    const response = await apiClient.put(
      API_CONFIG.ENDPOINTS.COMPANIES.CURRENT,
      companyData
    );
    return response.data;
  },
};
