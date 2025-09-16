// Servicios CRM (Customers, Leads, Sales)
// QUÉ HACE: Operaciones CRUD para módulos CRM
// PARA QUÉ:
// - customers: Gestionar clientes (crear, leer, actualizar, eliminar)
// - leads: Gestionar prospectos
// - sales: Gestionar oportunidades de venta
// - convertLeadToCustomer(): Convertir lead a cliente

import { apiClient } from "./api";
import { API_CONFIG } from "@/utils/constants";

export const crmService = {
  // CUSTOMERS
  customers: {
    // Obtener todos los clientes
    async getAll(params = {}) {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CRM.CUSTOMERS, {
        params,
      });
      return response.data;
    },

    // Obtener un cliente por ID
    async getById(id) {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CRM.CUSTOMERS}/${id}`
      );
      return response.data;
    },

    // Crear un nuevo cliente
    async create(customerData) {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CRM.CUSTOMERS,
        customerData
      );
      return response.data;
    },

    // Actualizar un cliente
    async update(id, customerData) {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.CRM.CUSTOMERS}/${id}`,
        customerData
      );
      return response.data;
    },

    // Eliminar un cliente
    async delete(id) {
      const response = await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.CRM.CUSTOMERS}/${id}`
      );
      return response.data;
    },
  },

  // LEADS
  leads: {
    // Obtener todos los interesados
    async getAll(params = {}) {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CRM.LEADS, {
        params,
      });
      return response.data;
    },

    // Obtener un interesado por ID
    async getById(id) {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CRM.LEADS}/${id}`
      );
      return response.data;
    },

    // Crear un nuevo interesado
    async create(leadData) {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CRM.LEADS,
        leadData
      );
      return response.data;
    },

    // Actualizar un interesado
    async update(id, leadData) {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.CRM.LEADS}/${id}`,
        leadData
      );
      return response.data;
    },

    // Eliminar un interesado
    async delete(id) {
      const response = await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.CRM.LEADS}/${id}`
      );
      return response.data;
    },

    // Convertir lead (interesado) a cliente
    async convertToCustomer(id, customerData) {
      const response = await apiClient.post(
        `${API_CONFIG.ENDPOINTS.CRM.LEADS}/${id}/convert`,
        customerData
      );
      return response.data;
    },
  },

  // SALES
  sales: {
    // Obtener todas las ventas
    async getAll(params = {}) {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CRM.SALES, {
        params,
      });
      return response.data;
    },

    // Obtener una venta por ID
    async getById(id) {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.CRM.SALES}/${id}`
      );
      return response.data;
    },

    // Crear una nueva venta
    async create(saleData) {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CRM.SALES,
        saleData
      );
      return response.data;
    },

    // Actualizar una venta
    async update(id, saleData) {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.CRM.SALES}/${id}`,
        saleData
      );
      return response.data;
    },

    // Eliminar una venta
    async delete(id) {
      const response = await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.CRM.SALES}/${id}`
      );
      return response.data;
    },
  },
};
