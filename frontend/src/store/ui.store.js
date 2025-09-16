// Store para el estado de la UI
// QUÉ HACE: Controla el estado de la UI
// PARA QUÉ:
// - Sidebar colapsado/expandido
// - Tema (light/dark)
// - Idioma de la aplicación
// - Notificaciones en tiempo real
// - Modales globales
// - Loading states por operación

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set, get) => ({
      // State
      sidebarCollapsed: false,
      theme: "light",
      language: "es",
      notifications: [],
      modals: {
        isOpen: false,
        type: null,
        data: null,
      },
      loading: {
        global: false,
        operations: {},
      },

      // Sidebar Actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Theme Actions
      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      // Language Actions
      setLanguage: (language) => set({ language }),

      // Notification Actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: Date.now().toString(),
              timestamp: new Date(),
              ...notification,
            },
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // Modal Actions
      openModal: (type, data = null) =>
        set({
          modals: {
            isOpen: true,
            type,
            data,
          },
        }),

      closeModal: () =>
        set({
          modals: {
            isOpen: false,
            type: null,
            data: null,
          },
        }),

      // Loading Actions
      setGlobalLoading: (loading) =>
        set((state) => ({
          loading: {
            ...state.loading,
            global: loading,
          },
        })),

      setOperationLoading: (operation, loading) =>
        set((state) => ({
          loading: {
            ...state.loading,
            operations: {
              ...state.loading.operations,
              [operation]: loading,
            },
          },
        })),

      clearOperationLoading: (operation) =>
        set((state) => {
          const newOperations = { ...state.loading.operations };
          delete newOperations[operation];
          return {
            loading: {
              ...state.loading,
              operations: newOperations,
            },
          };
        }),

      // Utility methods
      isOperationLoading: (operation) => {
        const state = get();
        return state.loading.operations[operation] || false;
      },
    }),
    {
      name: "ui-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
