import { useEffect, useState } from "react";
import "./Monedas.css";

export default function Monedas() {

  const API_URL = "http://localhost:8080/back_office/currency";

  const [data, setData] = useState([]);
  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    value: ""
  });

  // =====================
  // 🔥 GET
  // =====================
  const cargarDatos = async () => {
    try {
      const res = await fetch(API_URL, {
        credentials: "include"
      });

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      const json = await res.json();
      setData(json);

    } catch (error) {
      console.error("Error cargando:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =====================
  // NUEVO
  // =====================
  const handleNuevo = () => {
    setModoCrear(true);
    setModoEditar(false);
    setForm({
      name: "",
      symbol: "",
      value: ""
    });
  };

  // =====================
  // EDITAR
  // =====================
  const handleModificar = () => {
    if (!seleccionado) return alert("Seleccioná una moneda");

    setForm(seleccionado);
    setModoEditar(true);
    setModoCrear(false);
  };

  // =====================
  // 🔥 POST
  // =====================
  const crear = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          symbol: form.symbol,
          value: parseFloat(form.value)
        })
      });

      if (res.status === 201) {
        cargarDatos();
        setModoCrear(false);
        return;
      }

      if (res.status === 401) {
        alert("No autorizado");
        return;
      }

      if (res.status === 422) {
        alert("Datos inválidos");
        return;
      }

    } catch (error) {
      console.error("Error creando:", error);
    }
  };

  // =====================
  // 🔥 PUT
  // =====================
  const modificar = async () => {
    try {
      const res = await fetch(`${API_URL}/${seleccionado.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          symbol: form.symbol,
          value: parseFloat(form.value)
        })
      });

      if (res.status === 204) {
        cargarDatos();
        setModoEditar(false);
        setSeleccionado(null);
        return;
      }

      if (res.status === 404) {
        alert("No existe la moneda");
        return;
      }

      if (res.status === 422) {
        alert("Error de formato");
        return;
      }

    } catch (error) {
      console.error("Error modificando:", error);
    }
  };

  // =====================
  // 🔥 DELETE
  // =====================
  const eliminar = async () => {
    if (!seleccionado) return alert("Seleccioná una moneda");

    const ok = confirm("¿Eliminar moneda?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/${seleccionado.id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.status === 204) {
        cargarDatos();
        setSeleccionado(null);
        return;
      }

      if (res.status === 404) {
        alert("No existe");
        return;
      }

      if (res.status === 409) {
        alert("No se puede eliminar: está en uso");
        return;
      }

    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // =====================
  // GUARDAR
  // =====================
  const handleGuardar = () => {
    if (modoCrear) crear();
    if (modoEditar) modificar();
  };

  // =====================
  // CANCELAR
  // =====================
  const handleCancelar = () => {
    setModoCrear(false);
    setModoEditar(false);
  };

  return (
    <div className="monedas-container">

      {/* 🔥 TOOLBAR */}
      <div className="toolbar">

        <div className="tool nuevo" data-icon="+"
          onClick={handleNuevo}>
          <span>Nuevo</span>
        </div>

        <div
          className={`tool eliminar ${!seleccionado ? "disabled" : ""}`}
          data-icon="−"
          onClick={eliminar}
        >
          <span>Eliminar</span>
        </div>

        <div
          className={`tool modificar ${!seleccionado ? "disabled" : ""}`}
          data-icon="✎"
          onClick={handleModificar}
        >
          <span>Modificar</span>
        </div>

        <div
          className={`tool guardar ${!modoCrear && !modoEditar ? "disabled" : ""}`}
          data-icon="✔"
          onClick={handleGuardar}
        >
          <span>Guardar</span>
        </div>

        <div
          className={`tool cancelar ${!modoCrear && !modoEditar ? "disabled" : ""}`}
          data-icon="✖"
          onClick={handleCancelar}
        >
          <span>Cancelar</span>
        </div>

      </div>

      {/* 🔥 FORM */}
      {(modoCrear || modoEditar) && (
        <div className="formulario">

          <label>Nombre</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <label>Símbolo</label>
          <input
            value={form.symbol}
            onChange={e => setForm({ ...form, symbol: e.target.value })}
          />

          <label>Valor</label>
          <input
            type="number"
            value={form.value}
            onChange={e => setForm({ ...form, value: e.target.value })}
          />

        </div>
      )}

      {/* 🔥 TABLA */}
      <div className="tabla">
        <div className="tabla-header">
          <span>ID</span>
          <span>Nombre</span>
          <span>Símbolo</span>
          <span>Valor</span>
        </div>

        <div className="tabla-body">
          {data.map((d) => (
            <div
              key={d.id}
              className={`fila ${seleccionado?.id === d.id ? "activa" : ""}`}
              onClick={() => setSeleccionado(d)}
            >
              <span>{d.id}</span>
              <span>{d.name}</span>
              <span>{d.symbol}</span>
              <span>{d.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}