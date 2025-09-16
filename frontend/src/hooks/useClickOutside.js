// Hook para detectar clicks fuera de un elemento
// QUÉ HACE: Detecta clicks fuera de un elemento
// PARA QUÉ:
// - Cerrar dropdowns cuando se hace click afuera
// - Cerrar modales
// - UX mejorada en componentes overlay

import { useEffect, useRef } from "react";

export const useClickOutside = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback]);

  return ref;
};
