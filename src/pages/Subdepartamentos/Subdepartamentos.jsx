import { useState, useEffect } from "react";
import "./Subdepartamentos.css";
import { useLanguage } from "../../context/LanguageContext";

const API_SUB = "/api/item-sub-collection";
const API_DEP = "/api/item-collection";

export default function SubDepartamentos({ setSection }) {

const { t } = useLanguage();

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

    if (!nombre || !departamento) return alert(t("subdepartamentos.completeData"));

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
      alert(t("subdepartamentos.saveError"));
    }
  };

  // =========================
  // MODIFICAR
  // =========================
  const modificar = () => {

    if (seleccionado === null) return alert(t("subdepartamentos.selectRecord"));

    const item = subdepartamentos[seleccionado];

    setNombre(item.name);
    setDepartamento(item.itemCollectionId);
    setModo("editar");
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminar = async () => {

    if (seleccionado === null) return alert(t("subdepartamentos.selectRecord"));
    if (!window.confirm(t("subdepartamentos.confirmDelete"))) return;

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
      alert(t("subdepartamentos.deleteError"));
    }
  };

  const salir = () => {
  setSection("home"); // ⚠️ cambiar si tu app usa otro nombre
};

  return (
    <div className="sub-container">

      <h2>{t("subdepartamentos.title")}</h2>

      {/* ================= TOOLBAR PRO ================= */}
      <div className="toolbar">

        <button className="tool nuevo" data-icon="➕" onClick={nuevo}>
          <span>{t("common.new")}</span>
        </button>

        <button
          className={`tool eliminar ${seleccionado === null ? "disabled" : ""}`}
          data-icon="🗑️"
          onClick={eliminar}
        >
          <span>{t("common.delete")}</span>
        </button>

        <button
          className={`tool modificar ${seleccionado === null ? "disabled" : ""}`}
          data-icon="✏️"
          onClick={modificar}
        >
          <span>{t("common.edit")}</span>
        </button>

        <button className="tool guardar" data-icon="💾" onClick={guardar}>
          <span>{t("common.save")}</span>
        </button>

        <button className="tool cancelar" data-icon="❌" onClick={cancelar}>
          <span>{t("common.cancel")}</span>
        </button>
        <button className="tool salir" data-icon="🚪" onClick={salir}>
        <span>{t("common.exit")}</span>
        </button>
      </div>

      {/* ================= TABLA ================= */}
      {modo === "tabla" && (

        <table className="sub-table">

          <thead>
            <tr>
              <th>{t("common.id")}</th>
              <th>{t("departamentos.title")}</th>
              <th>{t("subdepartamentos.single")}</th>
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

          <label>{t("departamentos.title")}</label>

          <select
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          >
            <option value="">{t("common.select")}</option>

            {departamentos.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}

          </select>

          <label>{t("subdepartamentos.single")}</label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

        </div>

      )}

    </div>
  );
}