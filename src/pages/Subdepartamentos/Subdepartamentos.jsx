import { useState, useEffect } from "react";
import "./Subdepartamentos.css";

const API_SUB = "http://localhost:8080/back_office/item-sub-collection";
const API_DEP = "http://localhost:8080/back_office/item-collection";

export default function SubDepartamentos() {

  const [modo, setModo] = useState("tabla");

  const [subdepartamentos, setSubdepartamentos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [departamento, setDepartamento] = useState("");
  const [nombre, setNombre] = useState("");

  const [seleccionado, setSeleccionado] = useState(null);

  // =========================
  // LOAD SUBDEPARTAMENTOS
  // =========================
  const cargarSubdepartamentos = async () => {
    try {
      const res = await fetch(API_SUB, {
        method: "GET",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Error subdepartamentos");

      const data = await res.json();
      setSubdepartamentos(data);

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOAD DEPARTAMENTOS
  // =========================
  const cargarDepartamentos = async () => {
    try {
      const res = await fetch(API_DEP, {
        method: "GET",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Error departamentos");

      const data = await res.json();

      const normalizados = data.map(d => ({
        id: d.id ?? d.nro,
        name: d.name ?? d.nombre
      }));

      setDepartamentos(normalizados);

    } catch (err) {
      console.error(err);
      setDepartamentos([]);
    }
  };

  useEffect(() => {
    cargarSubdepartamentos();
    cargarDepartamentos();
  }, []);

  // =========================
  // NUEVO
  // =========================
  const nuevo = () => {
    setModo("nuevo");
    setNombre("");
    setDepartamento("");
    setSeleccionado(null);
  };

  // =========================
  // CANCELAR
  // =========================
  const cancelar = () => {
    setModo("tabla");
    setNombre("");
    setDepartamento("");
    setSeleccionado(null);
  };

  // =========================
  // GUARDAR (POST / PUT)
  // =========================
  const guardar = async () => {

    if (!nombre || !departamento) return alert("Complete los datos");

    try {

      if (modo === "editar") {

        const id = subdepartamentos[seleccionado].id;

        const res = await fetch(`${API_SUB}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            name: nombre,
            itemCollectionId: Number(departamento)
          })
        });

        if (!res.ok) throw new Error();

      } else {

        const res = await fetch(API_SUB, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            name: nombre,
            itemCollectionId: Number(departamento)
          })
        });

        if (!res.ok) throw new Error();
      }

      await cargarSubdepartamentos();
      setModo("tabla");

    } catch (err) {
      console.error(err);
      alert("Error guardando");
    }
  };

  // =========================
  // MODIFICAR
  // =========================
  const modificar = () => {

    if (seleccionado === null) return alert("Seleccione un registro");

    const item = subdepartamentos[seleccionado];

    setNombre(item.name);
    setDepartamento(item.itemCollectionId);
    setModo("editar");
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminar = async () => {

    if (seleccionado === null) return alert("Seleccione un registro");
    if (!window.confirm("¿Eliminar?")) return;

    try {

      const id = subdepartamentos[seleccionado].id;

      const res = await fetch(`${API_SUB}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error();

      await cargarSubdepartamentos();
      setSeleccionado(null);

    } catch (err) {
      console.error(err);
      alert("Error eliminando");
    }
  };

  const salir = () => {
    setModo("tabla");
    setSeleccionado(null);
  };

  return (
    <div className="sub-container">

      <h2>Sub-Departamentos</h2>

      {/* ================= TOOLBAR PRO ================= */}
      <div className="toolbar">

        <button className="tool nuevo" data-icon="➕" onClick={nuevo}>
          <span>Nuevo</span>
        </button>

        <button
          className={`tool eliminar ${seleccionado === null ? "disabled" : ""}`}
          data-icon="🗑️"
          onClick={eliminar}
        >
          <span>Eliminar</span>
        </button>

        <button
          className={`tool modificar ${seleccionado === null ? "disabled" : ""}`}
          data-icon="✏️"
          onClick={modificar}
        >
          <span>Modificar</span>
        </button>

        <button className="tool guardar" data-icon="💾" onClick={guardar}>
          <span>Guardar</span>
        </button>

        <button className="tool cancelar" data-icon="❌" onClick={cancelar}>
          <span>Cancelar</span>
        </button>

      </div>

      {/* ================= TABLA ================= */}
      {modo === "tabla" && (

        <table className="sub-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Departamento</th>
              <th>SubDepartamento</th>
            </tr>
          </thead>

          <tbody>

            {subdepartamentos.map((d, index) => (

              <tr
                key={d.id}
                onClick={() => setSeleccionado(index)}
                className={seleccionado === index ? "fila-activa" : ""}
              >

                <td>{d.id}</td>
                <td>{d.itemCollectionId}</td>
                <td>{d.name}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      {/* ================= FORM ================= */}
      {modo !== "tabla" && (

        <div className="form-sub">

          <label>Departamento</label>

          <select
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          >
            <option value="">Seleccione</option>

            {departamentos.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}

          </select>

          <label>SubDepartamento</label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

        </div>

      )}

    </div>
  );
}