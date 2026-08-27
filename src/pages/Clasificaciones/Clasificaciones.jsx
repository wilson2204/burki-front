import { useState, useEffect } from "react";
import "./Clasificaciones.css";
import { useLanguage } from "../../context/LanguageContext";
import { apiFetch } from "../../services/api";

export default function Clasificaciones({ setSection, onUpdate }) {
    const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("table");

  const [form, setForm] = useState({
    id: "",
    name: ""
  });


  /* ================= GET ================= */
  const getAll = async () => {
    try {
      const res = await apiFetch("/item-classification");

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

    const endpoint = selected
  ? `/item-classification/${selected}`
  : "/item-classification";

    try {
    const res = await apiFetch(endpoint, {
  method: selected ? "PUT" : "POST",
  body: JSON.stringify({
    name: form.name,
  }),
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
      await apiFetch(`/item-classification/${selected}`, {
  method: "DELETE",
});

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

  <div
    className="tool nuevo"
    data-icon="＋"
    onClick={nuevo}
  >
    <span>{t("common.new")}</span>
  </div>

  <div
    className="tool eliminar"
    data-icon="−"
    onClick={eliminar}
  >
    <span>{t("common.delete")}</span>
  </div>

  <div
    className="tool duplicar"
    data-icon="⧉"
    onClick={duplicar}
  >
    <span>{t("common.duplicate")}</span>
  </div>

  <div
    className="tool modificar"
    data-icon="✎"
    onClick={modificar}
  >
    <span>{t("common.edit")}</span>
  </div>

  <div
    className="tool guardar"
    data-icon="✓"
    onClick={guardar}
  >
    <span>{t("common.save")}</span>
  </div>

  <div
  className="tool cancelar"
  data-icon="×"
  onClick={() => {
    setForm({
      id: "",
      name: ""
    });

    setSelected(null);
    setView("table");
  }}
>
  <span>{t("common.cancel")}</span>
</div>

  <div
    className="tool salir"
    data-icon="↪"
    onClick={() => setSection && setSection("home")}
  >
    <span>{t("common.exit")}</span>
  </div>

</div>

      <div className="contenido">

        {/* TABLA */}
        <div className="tabla-scroll">
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>{t("common.code")}</th>
<th>{t("common.name")}</th>
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
        </div>

        {/* FORM */}
        {view === "form" && (
          <div className="form">

            <div className="row">
              <label>{t("common.code")}</label>
              <input value={form.id || ""} disabled />
            </div>

            <div className="row">
              <label>{t("common.name")}</label>
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