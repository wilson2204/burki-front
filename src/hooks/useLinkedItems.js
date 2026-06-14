import { useState } from "react";

const API = "http://localhost:8080/back_office";

const fetchConfig = {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};

export function useLinkedItems() {
  const [linkedItems, setLinkedItems] = useState([]);

  const linkItem = async (itemId, linkedItemId) => {
    await fetch(`${API}/items/${itemId}/linked-items`, {
      method: "POST",
      ...fetchConfig,
      body: JSON.stringify({
        linkedItemId: Number(linkedItemId)
      })
    });
  };

  const unlinkItem = async (itemId, linkedItemId) => {
    await fetch(
      `${API}/items/${itemId}/linked-items/${linkedItemId}`,
      {
        method: "DELETE",
        ...fetchConfig
      }
    );
  };

  return {
    linkedItems,
    setLinkedItems,
    linkItem,
    unlinkItem
  };
}