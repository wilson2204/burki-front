import { useState, useCallback } from "react";

const API = "http://localhost:8080/back_office";

const fetchConfig = {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};

export function useItems() {
  const [articulos, setArticulos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getArticulos = useCallback(async () => {
    const res = await fetch(
      `${API}/items?page=${page}&size=500`,
      fetchConfig
    );

    const data = await res.json();

    setArticulos(data.content || []);
    setTotalPages(data.totalPages || 0);
  }, [page]);

  const getItemById = useCallback(async (id) => {
    const res = await fetch(`${API}/items/${id}`, fetchConfig);
    if (!res.ok) return null;
    return await res.json();
  }, []);

  const guardarItem = async (url, method, payload) => {
    const res = await fetch(url, {
      method,
      ...fetchConfig,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(await res.text());
      return null;
    }

    return res;
  };

  const eliminarItem = async (id) => {
    await fetch(`${API}/items/${id}`, {
      method: "DELETE",
      ...fetchConfig
    });
  };

  return {
    articulos,
    setArticulos,
    selected,
    setSelected,
    page,
    setPage,
    totalPages,
    getArticulos,
    getItemById,
    guardarItem,
    eliminarItem
  };
}