import { useState, useEffect } from "react";
import "./Departamentos.css";
import { useLanguage } from "../../context/LanguageContext";
import { departamentosImagenes } from "../../data/departamentosImagenes";
import { apiFetch } from "../../services/api";

export default function Departamentos({ setSection }) {
const [mostrarGaleria, setMostrarGaleria] = useState(false);

    const { t } = useLanguage();

  const [data, setData] = useState([]);
  const [ivas, setIvas] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const [seleccionado, setSeleccionado] = useState(null);
  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);

  

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

  const fetchData = async (endpoint, setter) => {
  try {

    const res = await apiFetch(endpoint);

    if (!res.ok) {
      console.error(
        "GET error:",
        endpoint,
        res.status
      );
      return;
    }

    const json = await res.json();

    setter(json);

  } catch (e) {
    console.error(e);
  }
};

  useEffect(() => {

  fetchData(
    "/item-collection",
    setData
  );

  fetchData(
    "/iva",
    setIvas
  );

  fetchData(
    "/tax/item-collection",
    setTaxes
  );

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
      const res = await apiFetch(
  `/item-collection/${seleccionado}`,
  {
    method: "DELETE"
  }
);

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
  ? "/item-collection"
  : `/item-collection/${seleccionado}`;

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

      const res = await apiFetch(url, {
  method,
  body: JSON.stringify(payload)
});

      if (!res.ok) {
        const err = await res.text();
        console.error("SAVE error:", err);
        alert(t("departamentos.saveError"))
        return;
      }

      await fetchData(
  "/item-collection",
  setData
);
      handleCancelar();

    } catch (e) {
      console.error(e);
    }
  };

  /* ================= IMAGEN ================= */

const handleAccesoRapido = () => {
  setMostrarGaleria(true);
};
  /* ================= BOTONES ================= */

  const canModify = !!seleccionado;
  const canDelete = !!seleccionado;
  const canSave = showForm;
  const handleSalir = () => {
  setSection("home"); 
};

  /* ================= RENDER ================= */

  return (
    <div className="departamentos-container">
<div className="toolbar">

  <div
    className="tool nuevo"
    data-icon="＋"
    onClick={handleNuevo}
  >
    <span>{t("common.new")}</span>
  </div>

  <div
    className={`tool eliminar ${!seleccionado ? "disabled" : ""}`}
    data-icon="🗑"
    onClick={() => seleccionado && handleEliminar()}
  >
    <span>{t("common.delete")}</span>
  </div>

  <div
    className={`tool modificar ${!canModify ? "disabled" : ""}`}
    data-icon="✎"
    onClick={() => canModify && handleModificar()}
  >
    <span>{t("common.edit")}</span>
  </div>

  <div
    className={`tool guardar ${!canSave ? "disabled" : ""}`}
    data-icon="✓"
    onClick={() => canSave && handleGuardar()}
  >
    <span>{t("common.save")}</span>
  </div>

<div className={`tool cancelar ${ !(modoCrear || modoEditar || seleccionado) ? "disabled" : "" }`} data-icon="✕" onClick={ (modoCrear || modoEditar || seleccionado) ? handleCancelar : undefined } > <span>{t("common.cancel")}</span> </div>


  <div
    className="tool salir"
    data-icon="↪"
    onClick={handleSalir}
  >
    <span>{t("common.exit")}</span>
  </div>

</div>
      {/* FORM FIJO Y CONTROLADO */}
      {showForm && (
  <div className="form-wrapper">

    {/* IZQUIERDA */}
    <div className="form-left">

      <div className="row">
        <label>{t("common.name")}</label>
        <input
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div className="row">
        <label>{t("departamentos.detail")}</label>
        <input
          value={form.description}
          onChange={e =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />
      </div>

      <div className="row">
        <label>{t("departamentos.iva")}</label>
        <select
          value={form.ivaRateId}
          onChange={e =>
            setForm({
              ...form,
              ivaRateId:
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
            })
          }
        >
          <option value="">
            {t("common.select")}
          </option>

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
              taxId:
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
            })
          }
        >
          {taxes.map(tx => (
            <option key={tx.id} value={tx.id}>
              {tx.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <label>{t("departamentos.position")}</label>

        <select
          value={form.positionButton}
          onChange={e =>
            setForm({
              ...form,
              positionButton: Number(e.target.value)
            })
          }
        >
          {[...Array(11)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

    </div>

    {/* DERECHA */}
  <div className="form-right">

  <div className="pesable-card">

    <div className="row checkbox-row weighable-row">
      <input
        type="checkbox"
        checked={form.weighable}
        onChange={e =>
          setForm({
            ...form,
            weighable: e.target.checked
          })
        }
      />
      <label>{t("departamentos.weighable")}</label>
    </div>

  </div>


  <button
    className="acceso-btn"
    onClick={handleAccesoRapido}
  >
    {t("departamentos.quickAccess")}
  </button>


  {form.image && (
    <div className="preview-card">
      <img
        src={`/Departamentos/${form.image}`}
        alt="preview"
      />
    </div>
  )}
{form.image && (
    <button
        type="button"
        className="quitar-imagen-btn"
        onClick={() =>
            setForm(prev => ({
                ...prev,
                image: null
            }))
        }
    >
        🗑 Quitar imagen
    </button>
)}
</div>

  </div>
)}

 {/* TABLA */}
<div className="tabla-container">
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
{mostrarGaleria && (
  <div className="modal-imagenes">
    <div className="modal-contenido">

      <h3>Seleccionar imagen</h3>

      <div className="galeria">

        {departamentosImagenes.map((img) => (

          <div
            key={img}
            className="imagen-item"
            onClick={() => {
              setForm(prev => ({
                ...prev,
                image: img,
              }));

              setMostrarGaleria(false);
            }}
          >
            <img
              src={`/Departamentos/${img}`}
              alt={img}
            />

            <span>{img.replace(".png", "")}</span>

          </div>

        ))}

      </div>

      <button
        className="cerrar-modal"
        onClick={() => setMostrarGaleria(false)}
      >
        Cerrar
      </button>

    </div>
  </div>
)}
    </div>
  );
}