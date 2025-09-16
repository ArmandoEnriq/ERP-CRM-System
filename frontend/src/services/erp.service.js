// Servicios ERP (Products, Inventory, Orders, Invoices)
// QUÉ HACE: Operaciones CRUD para módulos ERP
// PARA QUÉ:
// - products: Gestionar catálogo de productos
// - inventory: Control de stock y movimientos
// - orders: Gestionar pedidos de clientes
// - invoices: Crear y gestionar facturas
// - downloadInvoicePDF(): Descargar facturas en PDF

import { apiClient } from "./api";
import { API_CONFIG } from "@/utils/constants";

export const erpService = {
  // PRODUCTS
  products: {
    // Obtener todos los productos
    async getAll(params = {}) {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ERP.PRODUCTS, {
        params,
      });
      return response.data;
    },

    // Obtener un producto por ID
    async getById(id) {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.ERP.PRODUCTS}/${id}`
      );
      return response.data;
    },

    // Crear un nuevo producto
    async create(productData) {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.ERP.PRODUCTS,
        productData
      );
      return response.data;
    },

    // Actualizar un producto
    async update(id, productData) {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.ERP.PRODUCTS}/${id}`,
        productData
      );
      return response.data;
    },

    // Eliminar un producto
    async delete(id) {
      const response = await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.ERP.PRODUCTS}/${id}`
      );
      return response.data;
    },
  },

  // INVENTORY
  inventory: {
    // Obtener todos los inventarios
    async getAll(params = {}) {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ERP.INVENTORY, {
        params,
      });
      return response.data;
    },

    // Obtener inventario por producto
    async getByProductId(productId) {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.ERP.INVENTORY}/product/${productId}`
      );
      return response.data;
    },

    // Actualizar stock
    async updateStock(productId, quantity, type = "adjustment") {
      const response = await apiClient.post(
        `${API_CONFIG.ENDPOINTS.ERP.INVENTORY}/stock`,
        {
          productId,
          quantity,
          type,
        }
      );
      return response.data;
    },
  },

  // ORDERS
  orders: {
    // Obtener todos los pedidos
    async getAll(params = {}) {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ERP.ORDERS, {
        params,
      });
      return response.data;
    },

    // Obtener un pedido por ID
    async getById(id) {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.ERP.ORDERS}/${id}`
      );
      return response.data;
    },

    // Crear un nuevo pedido
    async create(orderData) {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.ERP.ORDERS,
        orderData
      );
      return response.data;
    },

    // Actualizar un pedido
    async update(id, orderData) {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.ERP.ORDERS}/${id}`,
        orderData
      );
      return response.data;
    },

    // Eliminar un pedido
    async delete(id) {
      const response = await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.ERP.ORDERS}/${id}`
      );
      return response.data;
    },
  },

  // INVOICES
  invoices: {
    // Obtener todas las facturas
    async getAll(params = {}) {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ERP.INVOICES, {
        params,
      });
      return response.data;
    },

    // Obtener una factura por ID
    async getById(id) {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.ERP.INVOICES}/${id}`
      );
      return response.data;
    },

    // Crear una nueva factura
    async create(invoiceData) {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.ERP.INVOICES,
        invoiceData
      );
      return response.data;
    },

    // Actualizar una factura
    async update(id, invoiceData) {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.ERP.INVOICES}/${id}`,
        invoiceData
      );
      return response.data;
    },

    // Eliminar una factura
    async delete(id) {
      const response = await apiClient.delete(
        `${API_CONFIG.ENDPOINTS.ERP.INVOICES}/${id}`
      );
      return response.data;
    },

    async downloadPDF(id) {
      return await apiClient.download(
        `${API_CONFIG.ENDPOINTS.ERP.INVOICES}/${id}/pdf`,
        `invoice-${id}.pdf`
      );
    },
  },
};
