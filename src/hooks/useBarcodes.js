import { useState } from "react";

const API = "http://localhost:8080/back_office";

const fetchConfig = {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};

export default function useBarcodes() {
  const [barCodes, setBarCodes] = useState([]);

  const addBarcodeLocal = (value, detail = "Adicional") => {
    setBarCodes(prev => [
      ...prev,
      { value, detail }
    ]);
  };

  const removeBarcodeLocal = (value) => {
    setBarCodes(prev =>
      prev.filter(b => b.value !== value)
    );
  };

  const saveBarcodes = async (itemId) => {
    await fetch(`${API}/items/${itemId}/barcodes`, {
      method: "POST",
      ...fetchConfig,
      body: JSON.stringify({
        barCodes: barCodes.map(b => ({
          value: b.value,
          detail: b.detail || ""
        }))
      })
    });
  };

  const deleteBarcode = async (itemId, value) => {
    await fetch(
      `${API}/items/${itemId}/barcodes/${value}`,
      {
        method: "DELETE",
        ...fetchConfig
      }
    );
  };

  return {
    barCodes,
    setBarCodes,
    addBarcodeLocal,
    removeBarcodeLocal,
    saveBarcodes,
    deleteBarcode
  };
}