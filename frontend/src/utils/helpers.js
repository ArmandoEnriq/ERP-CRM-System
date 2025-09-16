// QUÉ HACE: Funciones reutilizables en toda la aplicación
// PARA QUÉ:
// - formatCurrency(): Formatear precios ($1,234.56 MXN)
// - formatDate(): Fechas en español (15 de septiembre de 2024)
// - capitalize(): Capitalizar texto
// - truncate(): Cortar texto largo con "..."
// - debounce(): Evitar múltiples llamadas API
// - copyToClipboard(): Copiar al portapapeles
// - downloadFile(): Descargar archivos (PDFs, Excel)

// Funciones auxiliares generales

import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { clsx } from "clsx";

/**
 * Combina clases CSS de forma condicional
 */
export const cn = (...args) => clsx(...args);

/**
 * Formatea fechas
 */
export const formatDate = (date, formatStr = "dd/MM/yyyy") => {
  if (!date) return "";
  return format(new Date(date), formatStr, { locale: es });
};

/**
 * Formatea fecha relativa (ej: "hace 2 horas")
 */
export const formatRelativeDate = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
  });
};

/**
 * Formatea números como moneda
 */
export const formatCurrency = (amount, currency = "MXN") => {
  if (amount == null) return "$0.00";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Formatea números con separadores de miles
 */
export const formatNumber = (number, decimals = 0) => {
  if (number == null) return "0";

  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Formatea porcentajes
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value == null) return "0%";
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Capitaliza la primera letra
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convierte a título (Primera Letra De Cada Palabra)
 */
export const toTitle = (str) => {
  if (!str) return "";
  return str.split(" ").map(capitalize).join(" ");
};

/**
 * Trunca texto con elipsis
 */
export const truncate = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + "...";
};

/**
 * Genera ID único simple
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Valida email
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Valida teléfono
 */
export const isValidPhone = (phone) => {
  return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
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
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Obtiene valor anidado de objeto
 */
export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

/**
 * Convierte bytes a formato legible
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Sleep/wait function
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Copia texto al clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Error copying to clipboard:", err);
    return false;
  }
};

/**
 * Descarga archivo como blob
 */
export const downloadFile = (
  data,
  filename,
  type = "application/octet-stream"
) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
