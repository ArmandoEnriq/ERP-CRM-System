import { create } from "zustand";

export const useUIStore = create((set) => ({
  // Sidebar
  sidebarOpen: true,
  sidebarCollapsed: false,

  // Modales
  modals: {},

  // Loading global
  globalLoading: false,

  // Theme
  theme: localStorage.getItem("theme") || "light",

  // Breadcrumbs
  breadcrumbs: [],

  // Page title
  pageTitle: "",

  // Acciones

  /**
   * Toggle sidebar
   */
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  /**
   * Cerrar sidebar
   */
  closeSidebar: () => set({ sidebarOpen: false }),

  /**
   * Abrir sidebar
   */
  openSidebar: () => set({ sidebarOpen: true }),

  /**
   * Toggle sidebar collapsed
   */
  toggleSidebarCollapsed: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  /**
   * Abrir modal
   */
  openModal: (modalId, data = null) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { open: true, data },
      },
    })),

  /**
   * Cerrar modal
   */
  closeModal: (modalId) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: { open: false, data: null },
      },
    })),

  /**
   * Verificar si modal está abierto
   */
  isModalOpen: (modalId) => {
    const state = useUIStore.getState();
    return state.modals[modalId]?.open || false;
  },

  /**
   * Obtener datos del modal
   */
  getModalData: (modalId) => {
    const state = useUIStore.getState();
    return state.modals[modalId]?.data || null;
  },

  /**
   * Mostrar loading global
   */
  showGlobalLoading: () => set({ globalLoading: true }),

  /**
   * Ocultar loading global
   */
  hideGlobalLoading: () => set({ globalLoading: false }),

  /**
   * Cambiar tema
   */
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
    document.documentElement.classList.toggle("dark", theme === "dark");
  },

  /**
   * Toggle tema
   */
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return { theme: newTheme };
    }),

  /**
   * Establecer breadcrumbs
   */
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  /**
   * Establecer título de página
   */
  setPageTitle: (title) => {
    set({ pageTitle: title });
    document.title = title ? `${title} - ERP/CRM System` : "ERP/CRM System";
  },
}));
