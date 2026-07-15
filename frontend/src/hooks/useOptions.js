import { useEffect, useState } from "react";

import { apiClient } from "../api/client";

/** Carga una lista completa (todas las páginas) de un endpoint para usarla como opciones de un <select>. */
export function useOptions(endpoint, labelField) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      let url = endpoint;
      let results = [];
      while (url) {
        const res = await apiClient.get(url);
        const data = res.data;
        if (Array.isArray(data)) {
          results = results.concat(data);
          url = null;
        } else {
          results = results.concat(data.results || []);
          url = data.next;
        }
      }
      if (!cancelled) {
        setOptions(
          results.map((item) => ({
            value: item.id,
            label:
              typeof labelField === "function" ? labelField(item) : item[labelField] ?? item.id,
          }))
        );
        setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return { options, loading };
}
