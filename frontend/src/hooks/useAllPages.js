import { useCallback, useEffect, useState } from "react";

import { apiClient } from "../api/client";

/** Carga todas las páginas de un endpoint paginado de DRF. Expone setData para updates optimistas. */
export function useAllPages(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    let url = endpoint;
    let results = [];
    while (url) {
      const res = await apiClient.get(url);
      const body = res.data;
      if (Array.isArray(body)) {
        results = results.concat(body);
        url = null;
      } else {
        results = results.concat(body.results || []);
        url = body.next;
      }
    }
    setData(results);
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, reloadKey]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, setData, loading, refresh };
}
