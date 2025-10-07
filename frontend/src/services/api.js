import axios from "axios";
import {
  API_BASE_URL,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  HTTP_STATUS,
} from "@/utils/constants";

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable para controlar la renovación del token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor de request - Agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejar errores y renovar tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si no hay error de respuesta
    if (!error.response) {
      return Promise.reject({
        message: "Error de conexión. Verifica tu internet.",
        type: "NETWORK_ERROR",
      });
    }

    const { status } = error.response;

    // Token expirado - Intentar renovar
    if (status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        // No hay refresh token, cerrar sesión
        handleLogout();
        return Promise.reject({
          message: "Sesión expirada. Inicia sesión nuevamente.",
          type: "SESSION_EXPIRED",
        });
      }

      try {
        // Intentar renovar el token
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken: newRefreshToken } = data;

        // Guardar nuevos tokens
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

        // Actualizar header de autorización
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        // Reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Error al renovar token, cerrar sesión
        handleLogout();

        return Promise.reject({
          message: "Sesión expirada. Inicia sesión nuevamente.",
          type: "SESSION_EXPIRED",
        });
      }
    }

    // Otros errores HTTP
    const errorResponse = {
      message: "Ha ocurrido un error",
      type: "API_ERROR",
      status,
      data: error.response.data,
    };

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        errorResponse.message =
          error.response.data.message || "Solicitud inválida";
        errorResponse.type = "BAD_REQUEST";
        break;

      case HTTP_STATUS.FORBIDDEN:
        errorResponse.message = "No tienes permisos para realizar esta acción";
        errorResponse.type = "FORBIDDEN";
        break;

      case HTTP_STATUS.NOT_FOUND:
        errorResponse.message = "Recurso no encontrado";
        errorResponse.type = "NOT_FOUND";
        break;

      case HTTP_STATUS.CONFLICT:
        errorResponse.message =
          error.response.data.message || "Conflicto en la solicitud";
        errorResponse.type = "CONFLICT";
        break;

      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        errorResponse.message = "Datos de entrada inválidos";
        errorResponse.type = "VALIDATION_ERROR";
        errorResponse.errors = error.response.data.errors || {};
        break;

      case HTTP_STATUS.TOO_MANY_REQUESTS:
        errorResponse.message = "Demasiadas solicitudes. Intenta más tarde.";
        errorResponse.type = "RATE_LIMIT";
        break;

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        errorResponse.message = "Error del servidor. Intenta más tarde.";
        errorResponse.type = "SERVER_ERROR";
        break;

      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        errorResponse.message = "Servicio no disponible. Intenta más tarde.";
        errorResponse.type = "SERVICE_UNAVAILABLE";
        break;

      default:
        errorResponse.message =
          error.response.data.message || "Ha ocurrido un error inesperado";
    }

    return Promise.reject(errorResponse);
  }
);

// Función para cerrar sesión
const handleLogout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("user_data");

  // Redirigir al login
  if (window.location.pathname !== "/login") {
    window.location.href = "/login?session=expired";
  }
};

// Función helper para manejar respuestas
const handleResponse = (response) => {
  return response.data;
};

// Función helper para manejar errores
const handleError = (error) => {
  console.error("API Error:", error);
  throw error;
};

// Métodos HTTP
export const apiClient = {
  get: (url, config = {}) =>
    api.get(url, config).then(handleResponse).catch(handleError),

  post: (url, data = {}, config = {}) =>
    api.post(url, data, config).then(handleResponse).catch(handleError),

  put: (url, data = {}, config = {}) =>
    api.put(url, data, config).then(handleResponse).catch(handleError),

  patch: (url, data = {}, config = {}) =>
    api.patch(url, data, config).then(handleResponse).catch(handleError),

  delete: (url, config = {}) =>
    api.delete(url, config).then(handleResponse).catch(handleError),
};

// Función para establecer el token manualmente
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Función para eliminar el token
export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("user_data");
};

export default api;
