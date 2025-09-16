// Configuración base para axios
// QUÉ HACE: Configura el cliente HTTP para el backend
// PARA QUÉ:
// - Interceptors para añadir token JWT automáticamente
// - Manejo global de errores (401, 403, 404, 500)
// - Timeout y retry automático
// - Logging para debugging
// - Métodos helper: get, post, put, delete, upload, download

import axios from "axios"; // importar axios para realizar solicitudes HTTP
import toast from "react-hot-toast"; // importar toast para mostrar notificaciones
import { API_CONFIG, STORAGE_KEYS } from "@/utils/constants"; // importar constantes

// Crear instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - agregar token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log para desarrollo
    if (import.meta.env.VITE_DEBUG === "true") {
      console.log("API Request:", {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - manejar errores globales
api.interceptors.response.use(
  (response) => {
    // Log para desarrollo
    if (import.meta.env.VITE_DEBUG === "true") {
      console.log("API Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Log de errores
    console.error("API Error:", {
      url: config?.url,
      status: response?.status,
      message: error.message,
      data: response?.data,
    });

    // Manejar diferentes tipos de errores
    switch (response?.status) {
      case 401:
        // Token expirado o no válido
        handleAuthError();
        break;

      case 403:
        toast.error("No tienes permisos para realizar esta acción");
        break;

      case 404:
        toast.error("Recurso no encontrado");
        break;

      case 422:
        // Errores de validación
        handleValidationErrors(response.data);
        break;

      case 429:
        toast.error("Demasiadas solicitudes. Intenta más tarde");
        break;

      case 500:
        toast.error("Error interno del servidor");
        break;

      default:
        if (!response) {
          toast.error("Error de conexión. Verifica tu internet");
        } else {
          toast.error(response.data?.message || "Error inesperado");
        }
    }

    return Promise.reject(error);
  }
);

// Manejar errores de autenticación
const handleAuthError = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

  // Solo mostrar toast si no estamos ya en login
  if (!window.location.pathname.includes("/auth/login")) {
    toast.error("Sesión expirada. Por favor inicia sesión nuevamente");
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 1500);
  }
};

// Manejar errores de validación
const handleValidationErrors = (errorData) => {
  if (errorData.errors && Array.isArray(errorData.errors)) {
    errorData.errors.forEach((error) => {
      toast.error(error.message || error);
    });
  } else if (errorData.message) {
    toast.error(errorData.message);
  }
};

// Métodos de API
export const apiClient = {
  // GET request
  get: (url, config = {}) => api.get(url, config),

  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),

  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),

  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),

  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),

  // Upload file
  upload: (url, formData, onUploadProgress = null) => {
    return api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  // Download file
  download: (url, filename, config = {}) => {
    return api
      .get(url, {
        ...config,
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      });
  },
};

// Función para actualizar el token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    delete api.defaults.headers.Authorization;
  }
};

// Función para limpiar la autenticación
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  delete api.defaults.headers.Authorization;
};

export default api;
