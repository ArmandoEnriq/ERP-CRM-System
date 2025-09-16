// Hook para debounce
// QUÉ HACE: Retrasa la ejecución de una función hasta que pare la actividad
// PARA QUÉ:
// - Búsquedas en tiempo real: esperar que el usuario termine de escribir
// - Evitar múltiples llamadas API mientras se escribe
// - Optimizar performance en inputs de filtros
// - Ejemplo: buscar productos mientras se escribe en el campo de búsqueda

import { useState, useEffect } from "react";

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
