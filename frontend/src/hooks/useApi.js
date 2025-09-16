// Hook genérico para llamadas a la API
// QUÉ HACE: Patrón reutilizable para llamadas API
// PARA QUÉ:
// - const { data, loading, error, execute } = useApi(apiFunction)
// - Auto-execute o manual
// - Loading y error states automáticos
// - Refetch functionality

import { useState, useEffect, useCallback } from "react";

export const useApi = (apiFunction, immediate = true, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...params);
        setData(result);

        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};
