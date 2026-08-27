import { useState, useCallback } from "react";

const API = "http://localhost:8080/back_office";

const fetchConfig = {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};

export function useStock() {
  const [stock, setStock] = useState([]);

  const getStock = useCallback(async (itemId) => {
    const res = await fetch(
      `${API}/items/stocks?page=0&size=500`,
      fetchConfig
    );

    const data = await res.json();

    setStock(
      (data.content || [])
        .filter(s => s.itemId === itemId)
        .map(s => ({
          ...s,
          editableStock: s.currentStock
        }))
    );
  }, []);

  const updateStock = async (itemId, payload) => {
    await fetch(`${API}/items/${itemId}/stocks`, {
      method: "PUT",
      ...fetchConfig,
      body: JSON.stringify(payload)
    });
  };

  return {
    stock,
    setStock,
    getStock,
    updateStock
  };
}