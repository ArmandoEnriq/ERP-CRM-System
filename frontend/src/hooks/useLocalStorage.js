// Hook para manejar localStorage
// QUÉ HACE: Sincroniza estado de React con localStorage automáticamente
// PARA QUÉ:
// - Persistir preferencias del usuario (tema, idioma, configuraciones)
// - Guardar datos temporales (formularios sin enviar, filtros aplicados)
// - Sincronización entre pestañas del navegador
// - Estado que sobrevive a recargas de página

import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
  // Función para obtener el valor inicial
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Función para actualizar el valor
  const setValue = (value) => {
    try {
      // Permitir que value sea una función para la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Guardar en localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Escuchar cambios en localStorage desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};
