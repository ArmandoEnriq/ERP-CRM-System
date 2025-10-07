import { format, parseISO, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import clsx from "clsx";

/**
 * Combina clases de CSS de forma condicional
 * @param {...any} classes - Clases a combinar
 * @returns {string} Clases combinadas
 */
export const cn = (...classes) => {
  /* recibe cualquier cantidad de argumentos */
  return clsx(...classes); /* sirve para combinar clases */
};

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} formatStr - Formato deseado
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, formatStr = "dd/MM/yyyy") => {
  if (!date) return "-";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
};

/**
 * Formatea fecha y hora
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
  return formatDate(date, "dd/MM/yyyy HH:mm");
};

/**
 * Formatea fecha relativa (hace X tiempo)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha relativa
 */
export const formatRelativeDate = (date) => {
  if (!date) return "-";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "-";
  }
};

/**
 * Formatea un número como moneda MXN
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return "0";
  return new Intl.NumberFormat("es-MX").format(number);
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return "0%";
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza todas las palabras de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Genera iniciales de un nombre
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @returns {string} Iniciales
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${first}${last}`;
};

/**
 * Obtiene el nombre completo
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @returns {string} Nombre completo
 */
export const getFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(" ");
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} Es válido
 */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Valida un RFC mexicano
 * @param {string} rfc - RFC a validar
 * @returns {boolean} Es válido
 */
export const isValidRFC = (rfc) => {
  const pattern = /^([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3})$/;
  return pattern.test(rfc);
};

/**
 * Valida un teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} Es válido
 */
export const isValidPhone = (phone) => {
  const pattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return pattern.test(phone);
};

/**
 * Valida un código postal mexicano
 * @param {string} postalCode - Código postal a validar
 * @returns {boolean} Es válido
 */
export const isValidPostalCode = (postalCode) => {
  const pattern = /^\d{5}$/;
  return pattern.test(postalCode);
};

/**
 * Genera un color aleatorio para avatares
 * @param {string} str - String base para generar el color
 * @returns {string} Color en formato hex
 */
export const generateColorFromString = (str) => {
  if (!str) return "#6B7280";

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
    "#84CC16",
  ];

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Descarga un archivo
 * @param {string} url - URL del archivo
 * @param {string} filename - Nombre del archivo
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} Si se copió correctamente
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};

/**
 * Parsea parámetros de URL
 * @param {string} search - String de búsqueda de la URL
 * @returns {Object} Objeto con los parámetros
 */
export const parseQueryParams = (search) => {
  const params = new URLSearchParams(search);
  const result = {};

  for (const [key, value] of params) {
    result[key] = value;
  }

  return result;
};

/**
 * Convierte un objeto a query string
 * @param {Object} params - Parámetros
 * @returns {string} Query string
 */
export const objectToQueryString = (params) => {
  const filtered = Object.entries(params)
    .filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return filtered ? `?${filtered}` : "";
};

/**
 * Debounce de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Tiempo límite en ms
 * @returns {Function} Función con throttle
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Obtiene el tamaño de archivo legible
 * @param {number} bytes - Bytes
 * @returns {string} Tamaño formateado
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Ordena un array de objetos por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad por la que ordenar
 * @param {string} direction - Dirección (asc/desc)
 * @returns {Array} Array ordenado
 */
export const sortByKey = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Agrupa un array por una propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} key - Propiedad por la que agrupar
 * @returns {Object} Objeto agrupado
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Elimina duplicados de un array
 * @param {Array} array - Array con duplicados
 * @param {string} key - Propiedad única (opcional)
 * @returns {Array} Array sin duplicados
 */
export const removeDuplicates = (array, key = null) => {
  if (key) {
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
  }
  return [...new Set(array)];
};

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del tiempo
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Verifica si un objeto está vacío
 * @param {Object} obj - Objeto a verificar
 * @returns {boolean} Si está vacío
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
};

/**
 * Deep clone de un objeto
 * @param {any} obj - Objeto a clonar
 * @returns {any} Clon del objeto
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calcula el porcentaje
 * @param {number} value - Valor
 * @param {number} total - Total
 * @returns {number} Porcentaje
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Obtiene el color del badge según el estado
 * @param {string} status - Estado
 * @param {Object} colors - Mapa de colores
 * @returns {string} Clase de color
 */
export const getStatusColor = (status, colors = {}) => {
  return colors[status] || "gray";
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} userRole - Rol del usuario
 * @param {string|Array} requiredRole - Rol(es) requerido(s)
 * @returns {boolean} Si tiene el rol
 */
export const hasRole = (userRole, requiredRole) => {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
};

/**
 * Verifica si el usuario tiene un rol con jerarquía mayor o igual
 * @param {string} userRole - Rol del usuario
 * @param {string} requiredRole - Rol requerido
 * @param {Object} hierarchy - Jerarquía de roles
 * @returns {boolean} Si tiene el rol o superior
 */
export const hasRoleOrHigher = (userRole, requiredRole, hierarchy) => {
  const userLevel = hierarchy[userRole] || 0;
  const requiredLevel = hierarchy[requiredRole] || 0;
  return userLevel >= requiredLevel;
};
