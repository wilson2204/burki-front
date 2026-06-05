import { useState, useEffect } from "react";
import "./Proveedores.css";
import { useLanguage } from "../../context/LanguageContext";

export default function Proveedores({ setSection }) {

  const { t } = useLanguage();
  const [modo, setModo] = useState("lista");
  const [proveedores, setProveedores] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [monedas, setMonedas] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    companyName: "",
    cuit: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    currencyId: ""
  });

  const API_URL = "http://localhost:8080/back_office/supplier";
  const API_CURRENCY = "http://localhost:8080/back_office/currency";

  // =====================
  // 🔥 GET
  // =====================
  const cargarDatos = async () => {
    const res = await fetch(API_URL, { credentials: "include" });
    const json = await res.json();
    setProveedores(json);
  };

  const cargarMonedas = async () => {
    const res = await fetch(API_CURRENCY, { credentials: "include" });
    const json = await res.json();
    setMonedas(json);
  };

  useEffect(() => {
    cargarDatos();
    cargarMonedas();
  }, []);

  // =====================
  // NUEVO
  // =====================
  const handleNuevo = () => {
    setForm({
      id: null,
      name: "",
      companyName: "",
      cuit: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      currencyId: ""
    });
    setModo("nuevo");
    setSeleccionado(null);
  };

  // =====================
  // EDITAR
  // =====================
  const handleModificar = () => {
    if (!seleccionado) return alert(t("suppliers.selectSupplier"));
    setForm(seleccionado);
    setModo("editar");
  };

  // =====================
  // POST
  // =====================
  const crear = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.status === 201) {
      cargarDatos();
      setModo("lista");
    }
  };

  // =====================
  // PUT
  // =====================
  const modificar = async () => {
    const res = await fetch(`${API_URL}/${form.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.status === 204) {
      cargarDatos();
      setModo("lista");
      setSeleccionado(null);
    }
  };

  // =====================
  // DELETE
  // =====================
  const eliminar = async () => {
    if (!seleccionado) return alert(t("suppliers.selectOne"));
    if (!confirm (t("suppliers.confirmDelete"))) return;

    const res = await fetch(`${API_URL}/${seleccionado.id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.status === 204) {
      cargarDatos();
      setSeleccionado(null);
    }
  };

  const handleGuardar = () => {
    if (modo === "nuevo") crear();
    if (modo === "editar") modificar();
  };

  const handleCancelar = () => {
    setModo("lista");
    setSeleccionado(null);
  };

  const handleSalir = () => {
    setSection("home");
  };

  return (
    <div className="proveedores-container">

      {/* 🔥 TOOLBAR */}
      <div className="toolbar">

        <div className="tool nuevo" data-icon="+" onClick={handleNuevo}>
          <span>{t("common.new")}</span>
        </div>

        <div className={`tool eliminar ${!seleccionado ? "disabled" : ""}`} data-icon="−" onClick={eliminar}>
          <span>{t("common.delete")}</span>
        </div>

        <div className={`tool modificar ${!seleccionado ? "disabled" : ""}`} data-icon="✎" onClick={handleModificar}>
          <span>{t("common.edit")}</span>
        </div>

        <div className={`tool guardar ${modo === "lista" ? "disabled" : ""}`} data-icon="✔" onClick={handleGuardar}>
          <span>{t("common.save")}</span>
        </div>

        <div className={`tool cancelar ${modo === "lista" ? "disabled" : ""}`} data-icon="✖" onClick={handleCancelar}>
          <span>{t("common.cancel")}</span>
        </div>

        <div className="tool salir" data-icon="➜" onClick={handleSalir}>
          <span>{t("common.exit")}</span>
        </div>

      </div>

      {/* 🔥 FORM */}
      {(modo === "nuevo" || modo === "editar") && (
        <div className="formulario">

          <label>{t("common.name")}</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

          <label>{t("suppliers.companyName")}</label>
          <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />

          <label>{t("suppliers.cuit")}</label>
          <input value={form.cuit} onChange={e => setForm({ ...form, cuit: e.target.value })} />

          <label>{t("suppliers.address")}</label>
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />

          <label>{t("suppliers.phone")}</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

          <label>{t("suppliers.email")}</label>
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

          <label>{t("suppliers.description")}</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

          <label>{t("suppliers.currency")}</label>
          <select value={form.currencyId} onChange={e => setForm({ ...form, currencyId: parseInt(e.target.value) })}>
            <option value="">{t("suppliers.selectCurrency")}</option>
            {monedas.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.symbol})
              </option>
            ))}
          </select>

        </div>
      )}

      {/* 🔥 TABLA */}
      {modo === "lista" && (
        <div className="tabla">
          <div className="tabla-header">
            <span>{t("common.id")}</span>
            <span>{t("common.name")}</span>
            <span>{t("suppliers.company")}</span>
            <span>{t("suppliers.phone")}</span>
          </div>

          <div className="tabla-body">
            {proveedores.map(p => (
              <div
                key={p.id}
                className={`fila ${seleccionado?.id === p.id ? "activa" : ""}`}
                onClick={() => setSeleccionado(p)}
              >
                <span>{p.id}</span>
                <span>{p.name}</span>
                <span>{p.companyName}</span>
                <span>{p.phone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}