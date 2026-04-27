import { useState, useEffect, useRef } from "react";
import "./Departamentos.css";

export default function Departamentos() {

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
    if (!item) return alert("Seleccioná un registro");

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
    if (!seleccionado) return alert("Seleccioná un registro");

    if (!window.confirm("¿Eliminar este registro?")) return;

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
        alert("No se puede eliminar: está siendo usado por otros registros");
        return;
      }

      console.error("DELETE error:", res.status);

    } catch (e) {
      console.error(e);
    }
  };

  const handleGuardar = async () => {

    if (!showForm) return alert("Primero presioná Nuevo o Modificar");

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
        alert("Error al guardar");
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

  /* ================= RENDER ================= */

  return (
    <div className="departamentos-container">

      <h2>Departamentos</h2>

      <div className="toolbar">

        <div className="tool nuevo" onClick={handleNuevo}>
          <span>Nuevo</span>
        </div>

        <div
          className={`tool modificar ${!canModify ? "disabled" : ""}`}
          onClick={() => canModify && handleModificar()}
        >
          <span>Modificar</span>
        </div>

        <div
          className={`tool eliminar ${!canDelete ? "disabled" : ""}`}
          onClick={() => canDelete && handleEliminar()}
        >
          <span>Eliminar</span>
        </div>

        <div
          className={`tool guardar ${!canSave ? "disabled" : ""}`}
          onClick={() => canSave && handleGuardar()}
        >
          <span>Guardar</span>
        </div>

        <div className="tool cancelar" onClick={handleCancelar}>
          <span>Cancelar</span>
        </div>

      </div>

      {/* FORM FIJO Y CONTROLADO */}
      {showForm && (
        <div className="form-wrapper">

          <div className="form-left">

            <div className="row">
              <label>Nombre</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="row">
              <label>Detalle</label>
              <input
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="row">
              <label>I.V.A</label>
              <select
                value={form.ivaRateId}
                onChange={e =>
                  setForm({
                    ...form,
                    ivaRateId: e.target.value === "" ? "" : Number(e.target.value)
                  })
                }
              >
                <option value="">Seleccionar</option>
                {ivas.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <label>Imp. Interno</label>
              <select
                value={form.taxId}
                onChange={e =>
                  setForm({
                    ...form,
                    taxId: e.target.value === "" ? "" : Number(e.target.value)
                  })
                }
              >
                <option value="">Ninguno</option>
                {taxes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <label>Ubicación</label>
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
              <label>Es pesable</label>
            </div>

          </div>

          <div className="form-right">

            <button className="acceso-btn" onClick={handleAccesoRapido}>
              Acceso rápido
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
        <tbody>
          {data.map(d => (
            <tr
              key={d.id}
              onClick={() => setSeleccionado(d.id)}
              className={seleccionado === d.id ? "selected" : ""}
            >
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.ivaDescription || d.ivaRateId}</td>
              <td>{d.positionButton}</td>
              <td>{d.weighable ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}