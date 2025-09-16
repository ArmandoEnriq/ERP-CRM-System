// Store para datos ERP
// QUÉ HACE: Maneja datos de ERP en memoria
// PARA QUÉ:
// - Cachear productos, inventario, pedidos, facturas
// - Control de stock en tiempo real
// - Estados de pedidos (draft, confirmed, shipped)
// - Generación de reportes
// - Integración con accounting

import { create } from "zustand";
import { erpService } from "@/services/erp.service";
import toast from "react-hot-toast";

export const useERPStore = create((set, get) => ({
  // State
  products: {
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

  inventory: {
    data: [],
    loading: false,
    error: null,
  },

  orders: {
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

  invoices: {
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

  // Product Actions
  fetchProducts: async (params = {}) => {
    set((state) => ({
      products: { ...state.products, loading: true, error: null },
    }));

    try {
      const response = await erpService.products.getAll(params);

      set((state) => ({
        products: {
          ...state.products,
          data: response.data,
          loading: false,
          pagination: response.pagination,
        },
      }));
    } catch (error) {
      set((state) => ({
        products: {
          ...state.products,
          loading: false,
          error: error.response?.data?.message || "Error al cargar productos",
        },
      }));
    }
  },

  createProduct: async (productData) => {
    try {
      const newProduct = await erpService.products.create(productData);

      set((state) => ({
        products: {
          ...state.products,
          data: [newProduct, ...state.products.data],
        },
      }));

      toast.success("Producto creado exitosamente");
      return newProduct;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear producto");
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const updatedProduct = await erpService.products.update(id, productData);

      set((state) => ({
        products: {
          ...state.products,
          data: state.products.data.map((product) =>
            product.id === id ? updatedProduct : product
          ),
        },
      }));

      toast.success("Producto actualizado exitosamente");
      return updatedProduct;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al actualizar producto"
      );
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await erpService.products.delete(id);

      set((state) => ({
        products: {
          ...state.products,
          data: state.products.data.filter((product) => product.id !== id),
        },
      }));

      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al eliminar producto"
      );
      throw error;
    }
  },

  // Inventory Actions
  fetchInventory: async (params = {}) => {
    set((state) => ({
      inventory: { ...state.inventory, loading: true, error: null },
    }));

    try {
      const response = await erpService.inventory.getAll(params);

      set((state) => ({
        inventory: {
          ...state.inventory,
          data: response.data,
          loading: false,
        },
      }));
    } catch (error) {
      set((state) => ({
        inventory: {
          ...state.inventory,
          loading: false,
          error: error.response?.data?.message || "Error al cargar inventario",
        },
      }));
    }
  },

  updateStock: async (productId, quantity, type = "adjustment") => {
    try {
      await erpService.inventory.updateStock(productId, quantity, type);

      // Refrescar inventario
      await get().fetchInventory();

      toast.success("Stock actualizado exitosamente");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar stock");
      throw error;
    }
  },

  // Order Actions
  fetchOrders: async (params = {}) => {
    set((state) => ({
      orders: { ...state.orders, loading: true, error: null },
    }));

    try {
      const response = await erpService.orders.getAll(params);

      set((state) => ({
        orders: {
          ...state.orders,
          data: response.data,
          loading: false,
          pagination: response.pagination,
        },
      }));
    } catch (error) {
      set((state) => ({
        orders: {
          ...state.orders,
          loading: false,
          error: error.response?.data?.message || "Error al cargar pedidos",
        },
      }));
    }
  },

  createOrder: async (orderData) => {
    try {
      const newOrder = await erpService.orders.create(orderData);

      set((state) => ({
        orders: {
          ...state.orders,
          data: [newOrder, ...state.orders.data],
        },
      }));

      toast.success("Pedido creado exitosamente");
      return newOrder;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear pedido");
      throw error;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const updatedOrder = await erpService.orders.update(id, orderData);

      set((state) => ({
        orders: {
          ...state.orders,
          data: state.orders.data.map((order) =>
            order.id === id ? updatedOrder : order
          ),
        },
      }));

      toast.success("Pedido actualizado exitosamente");
      return updatedOrder;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al actualizar pedido"
      );
      throw error;
    }
  },

  // Invoice Actions
  fetchInvoices: async (params = {}) => {
    set((state) => ({
      invoices: { ...state.invoices, loading: true, error: null },
    }));

    try {
      const response = await erpService.invoices.getAll(params);

      set((state) => ({
        invoices: {
          ...state.invoices,
          data: response.data,
          loading: false,
          pagination: response.pagination,
        },
      }));
    } catch (error) {
      set((state) => ({
        invoices: {
          ...state.invoices,
          loading: false,
          error: error.response?.data?.message || "Error al cargar facturas",
        },
      }));
    }
  },

  createInvoice: async (invoiceData) => {
    try {
      const newInvoice = await erpService.invoices.create(invoiceData);

      set((state) => ({
        invoices: {
          ...state.invoices,
          data: [newInvoice, ...state.invoices.data],
        },
      }));

      toast.success("Factura creada exitosamente");
      return newInvoice;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear factura");
      throw error;
    }
  },

  updateInvoice: async (id, invoiceData) => {
    try {
      const updatedInvoice = await erpService.invoices.update(id, invoiceData);

      set((state) => ({
        invoices: {
          ...state.invoices,
          data: state.invoices.data.map((invoice) =>
            invoice.id === id ? updatedInvoice : invoice
          ),
        },
      }));

      toast.success("Factura actualizada exitosamente");
      return updatedInvoice;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al actualizar factura"
      );
      throw error;
    }
  },

  downloadInvoicePDF: async (id) => {
    try {
      await erpService.invoices.downloadPDF(id);
      toast.success("Factura descargada exitosamente");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al descargar factura"
      );
      throw error;
    }
  },
}));
