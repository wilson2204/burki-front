// REEMPLAZA TODO TU ARCHIVO Combos.jsx POR ESTE CÓDIGO.
// La causa del problema es que los botones estaban dentro de un <form>
// y algunos navegadores pueden interferir con los eventos.
// En esta versión NO usamos <form>, por lo que todos los botones
// funcionarán correctamente.

import { useState } from "react";
import "./Combos.css";

export default function Combos({ setSection }) {
  const [combo, setCombo] = useState({
    codigo: "",
    articuloCombo: "",
    precio: "",
  });

  const [detalle, setDetalle] = useState({
    codigo: "",
    cantidad: 1,
    articulo: "",
    precio: "",
  });

  const [items, setItems] = useState([]);

  // ================= CAMBIOS EN FORMULARIOS =================
  const handleComboChange = (e) => {
    const { name, value } = e.target;
    setCombo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetalleChange = (e) => {
    const { name, value } = e.target;
    setDetalle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= NUEVO =================
  const nuevoCombo = () => {
    setCombo({
      codigo: "",
      articuloCombo: "",
      precio: "",
    });

    setDetalle({
      codigo: "",
      cantidad: 1,
      articulo: "",
      precio: "",
    });

    setItems([]);
  };

  // ================= AGREGAR ITEM =================
  const agregarItem = () => {
    if (!detalle.codigo.trim()) {
      alert("Ingrese el código del artículo.");
      return;
    }

    if (!detalle.articulo.trim()) {
      alert("Ingrese la descripción del artículo.");
      return;
    }

    const nuevoItem = {
      codigo: detalle.codigo.trim(),
      cantidad: Number(detalle.cantidad) || 1,
      articulo: detalle.articulo.trim(),
      precio: Number(detalle.precio) || 0,
    };

    setItems((prev) => [...prev, nuevoItem]);

    setDetalle({
      codigo: "",
      cantidad: 1,
      articulo: "",
      precio: "",
    });

    alert("Artículo agregado correctamente.");
  };

  // ================= ELIMINAR =================
  const eliminarItem = () => {
    if (items.length === 0) {
      alert("No hay artículos para eliminar.");
      return;
    }

    if (!window.confirm("¿Desea eliminar el último artículo agregado?")) {
      return;
    }

    setItems((prev) => prev.slice(0, -1));
  };

  // ================= GUARDAR =================
  const guardarCombo = () => {
    if (!combo.codigo.trim()) {
      alert("Ingrese el código del combo.");
      return;
    }

    if (!combo.articuloCombo.trim()) {
      alert("Ingrese el nombre del artículo combo.");
      return;
    }

    if (items.length === 0) {
      alert("Debe agregar al menos un artículo al combo.");
      return;
    }

    const datos = {
      codigo: combo.codigo.trim(),
      articuloCombo: combo.articuloCombo.trim(),
      precio: Number(combo.precio) || 0,
      detalle: items,
    };

    console.log("Combo a guardar:", datos);
    alert("Combo guardado correctamente.");
  };

  // ================= CANCELAR =================
  const cancelar = () => {
    if (!window.confirm("¿Desea cancelar los cambios realizados?")) {
      return;
    }

    nuevoCombo();
  };

  // ================= SALIR =================
  const salir = () => {
    if (!window.confirm("¿Desea salir del módulo Combos?")) {
      return;
    }

    if (setSection) {
      setSection("articulos");
    }
  };

  return (
    <div className="combos-container">
      {/* TOOLBAR */}
      <div className="combos-toolbar">
        <button type="button" className="toolbar-btn" onClick={nuevoCombo}>
          ➕ Nuevo
        </button>

        <button type="button" className="toolbar-btn" onClick={eliminarItem}>
          ➖ Eliminar
        </button>

        <button type="button" className="toolbar-btn" onClick={guardarCombo}>
          ✔ Guardar
        </button>

        <button type="button" className="toolbar-btn" onClick={cancelar}>
          ✖ Cancelar
        </button>

        <button type="button" className="toolbar-btn" onClick={salir}>
          ➜ Salir
        </button>
      </div>

      {/* DATOS DEL COMBO */}
      <div className="combos-form">
        <div
          className="form-row"
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 200px",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div className="form-group">
            <label>Cód.</label>
            <input
              type="text"
              name="codigo"
              value={combo.codigo}
              onChange={handleComboChange}
            />
          </div>

          <div className="form-group">
            <label>Artículo combo</label>
            <input
              type="text"
              name="articuloCombo"
              value={combo.articuloCombo}
              onChange={handleComboChange}
            />
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              name="precio"
              value={combo.precio}
              onChange={handleComboChange}
            />
          </div>
        </div>
      </div>

      <hr />

      {/* DETALLE DEL COMBO */}
      <div className="combos-form">
        <div className="form-row">
          <div className="form-group small">
            <label>Cód. [+Busca]</label>
            <input
              type="text"
              name="codigo"
              value={detalle.codigo}
              onChange={handleDetalleChange}
            />
          </div>

          <div className="form-group small">
            <label>Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={detalle.cantidad}
              onChange={handleDetalleChange}
            />
          </div>

          <div className="form-group">
            <label>Artículos vinculados</label>
            <input
              type="text"
              name="articulo"
              value={detalle.articulo}
              onChange={handleDetalleChange}
            />
          </div>

          <div className="form-group medium">
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              name="precio"
              value={detalle.precio}
              onChange={handleDetalleChange}
            />
          </div>

          <div className="form-group add-btn-group">
            <label>&nbsp;</label>
            <button
              type="button"
              className="add-btn"
              onClick={agregarItem}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="table-container">
        <table className="combos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Artículo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
                  No hay artículos agregados.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td>{item.codigo}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.articulo}</td>
                  <td>${item.precio.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}