import { useState, useEffect, useRef } from "react";
import "./Departamentos.css";
import { useLanguage } from "../../context/LanguageContext";

export default function Departamentos({ setSection }) {

  const { t } = useLanguage();
  const API_URL = "http://localhost:8080/back_office/item-collection";
  const API_IVA = "http://localhost:8080/back_office/iva";
  const API_TAX = "http://localhost:8080/back_office/tax/item-collection";

  const [data, setData] = useState([]);
  const [ivas, setIvas] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [seleccionado, setSeleccionado] = useState(null);
  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);

  const fileInputRef = useRef(null);

  const showForm = modoCrear || modoEditar; // 🔥 FIX CLAVE

  const [form, setForm] = useState({
    name: "",
    description: "",
    ivaRateId: "",
    taxId: "",
    positionButton: 0,
    price: 0,
    weighable: false,
    image: null
  });

  /* ================= FETCH ================= */

  const fetchData = async (url, setter) => {
    try {
      const res = await fetch(url, {
        credentials: "include"
      });

      if (!res.ok) {
        console.error("GET error:", url, res.status);
        return;
      }

      const json = await res.json();
      setter(json);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData(API_URL, setData);
    fetchData(API_IVA, setIvas);
    fetchData(API_TAX, setTaxes);
  }, []);

  /* ================= NUEVO FIX ================= */

  const handleNuevo = () => {
    setSeleccionado(null);
    setModoEditar(false);

    setForm({
      name: "",
      description: "",
      ivaRateId: "",
      taxId: "",
      positionButton: 0,
      price: 0,
      weighable: false,
      image: null
    });

    setModoCrear(true); // 🔥 SIEMPRE AL FINAL
  };

  const handleModificar = () => {
    const item = data.find(d => d.id === seleccionado);
    if (!item) return alert(t("departamentos.selectRecord"));

    setModoCrear(false);
    setModoEditar(true);

    setForm({
      name: item.name || "",
      description: item.description || "",
      ivaRateId: item.ivaRateId || "",
      taxId: item.taxId || "",
      positionButton: item.positionButton ?? 0,
      price: item.price ?? 0,
      weighable: item.weighable ?? false,
      image: item.imgPath || null
    });
  };

  const handleCancelar = () => {
    setModoCrear(false);
    setModoEditar(false);
    setSeleccionado(null);

    setForm({
      name: "",
      description: "",
      ivaRateId: "",
      taxId: "",
      positionButton: 0,
      price: 0,
      weighable: false,
      image: null
    });
  };

  const handleEliminar = async () => {
    if (!seleccionado) return alert(t("departamentos.selectRecord"));

    if (!window.confirm(t("departamentos.confirmDelete"))) return;

    try {
      const res = await fetch(`${API_URL}/${seleccionado}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.status === 204) {
        setData(data.filter(d => d.id !== seleccionado));
        handleCancelar();
        return;
      }

      if (res.status === 409) {
        alert(t("departamentos.inUse"))
        return;
      }

      console.error("DELETE error:", res.status);

    } catch (e) {
      console.error(e);
    }
  };

  const handleGuardar = async () => {

    if (!showForm) return alert(t("departamentos.pressNewOrEdit"))

    try {

      const url = modoCrear
        ? API_URL
        : `${API_URL}/${seleccionado}`;

      const method = modoCrear ? "POST" : "PUT";

      const payload = {
        name: form.name,
        description: form.description || null,
        ivaRateId: form.ivaRateId === "" ? null : form.ivaRateId,
        taxId: form.taxId === "" ? null : form.taxId,
        imgPath: form.image || null,
        positionButton: form.image ? form.positionButton : null,
        price: form.price || 0,
        weighable: form.weighable
      };

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("SAVE error:", err);
        alert(t("departamentos.saveError"))
        return;
      }

      await fetchData(API_URL, setData);
      handleCancelar();

    } catch (e) {
      console.error(e);
    }
  };

  /* ================= IMAGEN ================= */

  const handleAccesoRapido = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= BOTONES ================= */

  const canModify = !!seleccionado;
  const canDelete = !!seleccionado;
  const canSave = showForm;
  const handleSalir = () => {
  setSection("home"); // ⚠️ cambiá esto si tu app usa otro nombre
};

  /* ================= RENDER ================= */

  return (
    <div className="departamentos-container">
<div className="toolbar">

  <div className="tool nuevo" onClick={handleNuevo}>
    <span className="emoji">➕</span>
    <span>{t("common.new")}</span>
  </div>

  <div
    className={`tool eliminar ${!seleccionado ? "disabled" : ""}`}
    onClick={() => seleccionado && handleEliminar()}
  >
    <span className="emoji">🗑️</span>
    <span>{t("common.delete")}</span>
  </div>

  <div
    className={`tool modificar ${!canModify ? "disabled" : ""}`}
    onClick={() => canModify && handleModificar()}
  >
    <span className="emoji">✏️</span>
    <span>{t("common.edit")}</span>
  </div>

  <div
    className={`tool guardar ${!canSave ? "disabled" : ""}`}
    onClick={() => canSave && handleGuardar()}
  >
    <span className="emoji">💾</span>
    <span>{t("common.save")}</span>
  </div>

  <div
    className={`tool cancelar ${!showForm ? "disabled" : ""}`}
    onClick={() => showForm && handleCancelar()}
  >
    <span className="emoji">❌</span>
    <span>{t("common.cancel")}</span>
  </div>
  <div className="tool salir" onClick={handleSalir}>
  <span className="emoji">🚪</span>
  <span>{t("common.exit")}</span>
</div>

</div>

      {/* FORM FIJO Y CONTROLADO */}
      {showForm && (
        <div className="form-wrapper">

          <div className="form-left">

            <div className="row">
              <label>{t("common.name")}</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="row">
              <label>{t("departamentos.detail")}</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="row">
              <label>{t("departamentos.iva")}</label>
              <select
                value={form.ivaRateId}
                onChange={e =>
                  setForm({
                    ...form,
                    ivaRateId: e.target.value === "" ? "" : Number(e.target.value)
                  })
                }
              >
                <option value="">{t("common.select")}</option>
                {ivas.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <label>{t("departamentos.internalTax")}</label>
              <select
                value={form.taxId}
                onChange={e =>
                  setForm({
                    ...form,
                    taxId: e.target.value === "" ? "" : Number(e.target.value)
                  })
                }
              >
                <option value="">{t("common.none")}</option>
                {taxes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <label>{t("departamentos.position")}</label>
              <select
                value={form.positionButton}
                onChange={e =>
                  setForm({ ...form, positionButton: Number(e.target.value) })
                }
              >
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            <div className="row checkbox-row">
              <input
                type="checkbox"
                checked={form.weighable}
                onChange={e =>
                  setForm({ ...form, weighable: e.target.checked })
                }
              />
              <label>{t("departamentos.weighable")}</label>
            </div>

          </div>

          <div className="form-right">

            <button className="acceso-btn" onClick={handleAccesoRapido}>
              {t("departamentos.quickAccess")}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />

            {form.image && (
              <img
                src={form.image}
                alt="preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginTop: "10px"
                }}
              />
            )}

          </div>

        </div>
      )}

 {/* TABLA */}
<table className="tabla">
  <thead>
    <tr>
      <th style={{ width: "70px" }}>Nro</th>
      <th>Departmento</th>
      <th style={{ width: "100px" }}>Precio</th>
      <th style={{ width: "100px" }}>IVA</th>
    </tr>
  </thead>

  <tbody>
    {data.map((d) => (
      <tr
        key={d.id}
        onClick={() => setSeleccionado(d.id)}
        className={seleccionado === d.id ? "selected" : ""}
      >
        {/* Nro */}
        <td>{d.id}</td>

        {/* Department */}
        <td>{d.name}</td>

        {/* Precio */}
        <td>
          {Number(d.price || 0).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>

        {/* IVA */}
        <td>
          {(() => {
            const ivaSeleccionado = ivas.find(
              (i) => i.id === d.ivaRateId
            );

            const porcentaje =
              ivaSeleccionado?.rate ??
              ivaSeleccionado?.percentage ??
              ivaSeleccionado?.value ??
              ivaSeleccionado?.amount;

            if (porcentaje !== undefined && porcentaje !== null) {
              return Number(porcentaje).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            }

            return ivaSeleccionado?.description || "0,00";
          })()}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}