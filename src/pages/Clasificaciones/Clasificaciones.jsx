import { useState, useEffect } from "react";
import "./Clasificaciones.css";

export default function Clasificaciones({ setSection, onUpdate }) {

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("table");

  const [form, setForm] = useState({
    id: "",
    name: ""
  });

  const fetchConfig = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  };

  /* ================= GET ================= */
  const getAll = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/back_office/item-classification",
        fetchConfig
      );

      if (!res.ok) {
        console.error("GET error:", res.status);
        return;
      }

      setData(await res.json());

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  /* ================= ACCIONES ================= */

  const nuevo = () => {
    setForm({ id: "", name: "" });
    setSelected(null);
    setView("form");
  };

  const modificar = () => {
    const item = data.find(x => x.id === selected);
    if (!item) return;

    setForm(item);
    setView("form");
  };

  const duplicar = () => {
    const item = data.find(x => x.id === selected);
    if (!item) return;

    setForm({
      id: "",
      name: item.name + " (copia)"
    });

    setSelected(null);
    setView("form");
  };

  const guardar = async () => {

    const url = selected
      ? `http://localhost:8080/back_office/item-classification/${selected}`
      : `http://localhost:8080/back_office/item-classification`;

    try {
      const res = await fetch(url, {
        method: selected ? "PUT" : "POST",
        ...fetchConfig,
        body: JSON.stringify({
          name: form.name
        })
      });

      if (!res.ok) {
        console.error("SAVE error:", await res.text());
        return;
      }

      await getAll();

      if (onUpdate) onUpdate();

      setView("table");

    } catch (err) {
      console.error(err);
    }
  };

  const eliminar = async () => {
    if (!selected) return;

    try {
      await fetch(
        `http://localhost:8080/back_office/item-classification/${selected}`,
        {
          method: "DELETE",
          ...fetchConfig
        }
      );

      await getAll();

      if (onUpdate) onUpdate();

      setSelected(null);

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="clasif-container">

      {/* TOOLBAR PRO */}
      <div className="toolbar">
        <div className="tool nuevo" data-icon="➕" onClick={nuevo}><span>Nuevo</span></div>
        <div className="tool eliminar" data-icon="🗑️" onClick={eliminar}><span>Eliminar</span></div>
        <div className="tool duplicar" data-icon="📄" onClick={duplicar}><span>Duplicar</span></div>
        <div className="tool modificar" data-icon="✏️" onClick={modificar}><span>Modificar</span></div>
        <div className="tool guardar" data-icon="💾" onClick={guardar}><span>Guardar</span></div>
        <div className="tool cancelar" data-icon="❌" onClick={() => setView("table")}><span>Cancelar</span></div>
        <div className="tool salir" data-icon="🚪" onClick={() => setSection && setSection("home")}><span>Salir</span></div>
      </div>

      <div className="contenido">

        {/* TABLA */}
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {data.map(x => (
                <tr
                  key={x.id}
                  onClick={() => setSelected(x.id)}
                  className={selected === x.id ? "active" : ""}
                >
                  <td>{x.id}</td>
                  <td>{x.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        {view === "form" && (
          <div className="form">

            <div className="row">
              <label>Código</label>
              <input value={form.id || ""} disabled />
            </div>

            <div className="row">
              <label>Nombre</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}