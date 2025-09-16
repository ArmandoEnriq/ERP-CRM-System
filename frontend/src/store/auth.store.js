// Store de autenticación con Zustand
// QUÉ HACE: Maneja el estado del usuario logueado
// PARA QUÉ:
// - Guardar datos del usuario (name, email, role)
// - Persistir sesión en localStorage
// - Actions: login, logout, updateProfile
// - Loading states para operaciones async
// - Inicialización automática al cargar la app

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "@/services/auth.service";
import { STORAGE_KEYS } from "@/utils/constants";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`¡Bienvenido, ${response.user.firstName}!`);
          return response;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.response?.data?.message || "Error de autenticación",
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(userData);

          set({
            isLoading: false,
            error: null,
          });

          toast.success("Cuenta creada exitosamente. Por favor inicia sesión.");
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Error al crear la cuenta",
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error("Error durante logout:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          toast.success("Sesión cerrada correctamente");
        }
      },

      loadUser: async () => {
        if (!authService.isAuthenticated()) {
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authService.getProfile();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error loading user:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });

        try {
          const updatedUser = await authService.updateProfile(profileData);

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          toast.success("Perfil actualizado correctamente");
          return updatedUser;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message || "Error al actualizar perfil",
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      // Initialize auth state
      initialize: async () => {
        if (authService.isAuthenticated()) {
          await get().loadUser();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
