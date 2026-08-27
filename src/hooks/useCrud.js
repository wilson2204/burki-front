import { useCallback } from "react";

const API = "http://localhost:8080/back_office";

const fetchConfig = {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};

export default function useCrud({ form, setForm }) {

  // ===================== NUEVO =====================
  const nuevo = useCallback(() => {
    setForm({
      id: "",
      nombre: "",
      barCodes: [],
      codigo: "",
      adicional: "",
      costo: "",
      margen: "",
      precioFinal: "",
      iva: "",
      taxId: "",
      currencyId: "",
      clasificacionId: "",
      departamentoId: "",
      subDepartamentoId: "",
      proveedorId: "",
      marcaId: "",
      itemTypeId: "",
      measurementUnitId: "",
      reorderPoint: "",
      controlMeasurementUnitId: "",
      expirationDays: "",
      itemPresentation: "",
      useLabel: false
    });
  }, [setForm]);

  // ===================== GUARDAR =====================
  const guardar = useCallback(async () => {
    try {
      const res = await fetch(`${API}/items`, {
        method: form.id ? "PUT" : "POST",
        ...fetchConfig,
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error al guardar");

      const data = await res.json();

      setForm(prev => ({
        ...prev,
        ...data
      }));

      alert("Guardado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al guardar artículo");
    }
  }, [form, setForm]);

  // ===================== ELIMINAR =====================
  const eliminar = useCallback(async () => {
    if (!form.id) return alert("Seleccioná un artículo");

    try {
      const res = await fetch(`${API}/items/${form.id}`, {
        method: "DELETE",
        ...fetchConfig
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setForm({
        id: "",
        nombre: "",
        barCodes: [],
        codigo: "",
        adicional: "",
        costo: "",
        margen: "",
        precioFinal: "",
        iva: "",
        taxId: "",
        currencyId: "",
        clasificacionId: "",
        departamentoId: "",
        subDepartamentoId: "",
        proveedorId: "",
        marcaId: "",
        itemTypeId: "",
        measurementUnitId: "",
        reorderPoint: "",
        controlMeasurementUnitId: "",
        expirationDays: "",
        itemPresentation: "",
        useLabel: false
      });

      alert("Eliminado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  }, [form.id, setForm]);

  // ===================== GET BY ID =====================
  const getItemById = useCallback(async (id) => {
    try {
      const res = await fetch(`${API}/items/${id}`, {
        method: "GET",
        ...fetchConfig
      });

      if (!res.ok) throw new Error("Error al obtener item");

      const data = await res.json();

      setForm({
        ...data,
        barCodes: data.barCodes || []
      });
    } catch (err) {
      console.error(err);
    }
  }, [setForm]);

  // ===================== VINCULAR ITEM =====================
  const vincularItem = useCallback(async (itemId, linkedId) => {
    try {
      await fetch(`${API}/items/${itemId}/link/${linkedId}`, {
        method: "POST",
        ...fetchConfig
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // ===================== ELIMINAR LINK =====================
  const eliminarLinkedItem = useCallback(async (itemId, linkedId) => {
    try {
      await fetch(`${API}/items/${itemId}/link/${linkedId}`, {
        method: "DELETE",
        ...fetchConfig
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return {
    nuevo,
    guardar,
    eliminar,
    getItemById,
    vincularItem,
    eliminarLinkedItem
  };
}