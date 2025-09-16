// Store para datos CRM
// QUÚ HACE: Maneja datos de CRM en memoria
// PARA QUÉ:
// - Cachear listas de customers, leads, sales
// - Operaciones CRUD con actualización optimista
// - Paginación y filtros
// - Error handling por módulo
// - Sync automático con el backend

import { create } from "zustand";
import { crmService } from "@/services/crm.service";
import toast from "react-hot-toast";

export const useCRMStore = create((set, get) => ({
  // State
  customers: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },

  leads: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },

  sales: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },

  // Customer Actions
  fetchCustomers: async (params = {}) => {
    set((state) => ({
      customers: { ...state.customers, loading: true, error: null },
    }));

    try {
      const response = await crmService.customers.getAll(params);

      set((state) => ({
        customers: {
          ...state.customers,
          data: response.data,
          loading: false,
          pagination: response.pagination,
        },
      }));
    } catch (error) {
      set((state) => ({
        customers: {
          ...state.customers,
          loading: false,
          error: error.response?.data?.message || "Error al cargar clientes",
        },
      }));
    }
  },

  createCustomer: async (customerData) => {
    try {
      const newCustomer = await crmService.customers.create(customerData);

      set((state) => ({
        customers: {
          ...state.customers,
          data: [newCustomer, ...state.customers.data],
        },
      }));

      toast.success("Cliente creado exitosamente");
      return newCustomer;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear cliente");
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const updatedCustomer = await crmService.customers.update(
        id,
        customerData
      );

      set((state) => ({
        customers: {
          ...state.customers,
          data: state.customers.data.map((customer) =>
            customer.id === id ? updatedCustomer : customer
          ),
        },
      }));

      toast.success("Cliente actualizado exitosamente");
      return updatedCustomer;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al actualizar cliente"
      );
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      await crmService.customers.delete(id);

      set((state) => ({
        customers: {
          ...state.customers,
          data: state.customers.data.filter((customer) => customer.id !== id),
        },
      }));

      toast.success("Cliente eliminado exitosamente");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al eliminar cliente");
      throw error;
    }
  },

  // Lead Actions
  fetchLeads: async (params = {}) => {
    set((state) => ({
      leads: { ...state.leads, loading: true, error: null },
    }));

    try {
      const response = await crmService.leads.getAll(params);

      set((state) => ({
        leads: {
          ...state.leads,
          data: response.data,
          loading: false,
          pagination: response.pagination,
        },
      }));
    } catch (error) {
      set((state) => ({
        leads: {
          ...state.leads,
          loading: false,
          error: error.response?.data?.message || "Error al cargar leads",
        },
      }));
    }
  },

  createLead: async (leadData) => {
    try {
      const newLead = await crmService.leads.create(leadData);

      set((state) => ({
        leads: {
          ...state.leads,
          data: [newLead, ...state.leads.data],
        },
      }));

      toast.success("Lead creado exitosamente");
      return newLead;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear lead");
      throw error;
    }
  },

  updateLead: async (id, leadData) => {
    try {
      const updatedLead = await crmService.leads.update(id, leadData);

      set((state) => ({
        leads: {
          ...state.leads,
          data: state.leads.data.map((lead) =>
            lead.id === id ? updatedLead : lead
          ),
        },
      }));

      toast.success("Lead actualizado exitosamente");
      return updatedLead;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar lead");
      throw error;
    }
  },

  deleteLead: async (id) => {
    try {
      await crmService.leads.delete(id);

      set((state) => ({
        leads: {
          ...state.leads,
          data: state.leads.data.filter((lead) => lead.id !== id),
        },
      }));

      toast.success("Lead eliminado exitosamente");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al eliminar lead");
      throw error;
    }
  },

  convertLeadToCustomer: async (id, customerData) => {
    try {
      const customer = await crmService.leads.convertToCustomer(
        id,
        customerData
      );

      // Remover el lead de la lista
      set((state) => ({
        leads: {
          ...state.leads,
          data: state.leads.data.filter((lead) => lead.id !== id),
        },
        customers: {
          ...state.customers,
          data: [customer, ...state.customers.data],
        },
      }));

      toast.success("Lead convertido a cliente exitosamente");
      return customer;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al convertir lead");
      throw error;
    }
  },
}));
