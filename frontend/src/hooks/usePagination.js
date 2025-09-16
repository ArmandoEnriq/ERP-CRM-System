// Hook para manejo de paginación
// QUÉ HACE: Maneja la lógica de paginación para listas grandes de datos
// PARA QUÉ:
// - Dividir listas grandes en páginas (productos, clientes, pedidos)
// - Navegación entre páginas (siguiente, anterior, primera, última)
// - Cálculos automáticos (total páginas, índices, rangos)
// - Optimizar rendimiento mostrando solo datos visibles

import { useState, useMemo } from "react";

export const usePagination = ({
  data = [],
  itemsPerPage = 10,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      currentData: data.slice(startIndex, endIndex),
      currentPage,
      totalPages: Math.ceil(data.length / itemsPerPage),
      totalItems: data.length,
      hasNextPage: currentPage < Math.ceil(data.length / itemsPerPage),
      hasPreviousPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, data.length),
    };
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback(
    (page) => {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [data.length, itemsPerPage]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    goToPage(totalPages);
  }, [data.length, itemsPerPage, goToPage]);

  return {
    ...paginationData,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setItemsPerPage: (newItemsPerPage) => {
      setCurrentPage(1);
      // Note: itemsPerPage se debería manejar externamente
    },
  };
};
