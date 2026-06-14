import { useEffect, useState } from "react";
import "./Monedas.css";
import { useLanguage } from "../../context/LanguageContext";

export default function Monedas({ setSection }) {

  const API_URL = "/api/currency";
const { t } = useLanguage();
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
        alert(t("monedas.sessionExpired"));
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
    if (!seleccionado) return alert(t("monedas.selectCurrency"));

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
        alert(t("monedas.unauthorized"));
        return;
      }

      if (res.status === 422) {
        alert(t("monedas.invalidData"));
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
        alert(t("monedas.currencyNotFound"));
        return;
      }

      if (res.status === 422) {
        alert(t("monedas.formatError"));
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
    if (!seleccionado) return alert(t("monedas.selectCurrency"));
    const ok = confirm(t("monedas.confirmDelete"));
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
        alert(t("monedas.notFound"));
        return;
      }

      if (res.status === 409) {
        alert(t("monedas.inUse"));
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
          <span>{t("common.new")}</span>
        </div>

        <div
          className={`tool eliminar ${!seleccionado ? "disabled" : ""}`}
          data-icon="−"
          onClick={eliminar}
        >
          <span>{t("common.delete")}</span>
        </div>

        <div
          className={`tool modificar ${!seleccionado ? "disabled" : ""}`}
          data-icon="✎"
          onClick={handleModificar}
        >
          <span>{t("common.edit")}</span>
        </div>

        <div
          className={`tool guardar ${!modoCrear && !modoEditar ? "disabled" : ""}`}
          data-icon="✔"
          onClick={handleGuardar}
        >
          <span>{t("common.save")}</span>
        </div>

        <div
          className={`tool cancelar ${!modoCrear && !modoEditar ? "disabled" : ""}`}
          data-icon="✖"
          onClick={handleCancelar}
        >
          <span>{t("common.cancel")}</span>
        </div>

        <div
  className="tool salir"
  data-icon="←"
  onClick={() => setSection("home")}
>
  <span>{t("common.exit")}</span>
</div>

      </div>

      {/* 🔥 FORM */}
      {(modoCrear || modoEditar) && (
        <div className="formulario">

          <label>{t("common.name")}</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <label>{t("monedas.symbol")}</label>
          <input
            value={form.symbol}
            onChange={e => setForm({ ...form, symbol: e.target.value })}
          />

          <label>{t("monedas.value")}</label>
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
          <span>{t("common.id")}</span>
          <span>{t("common.name")}</span>
          <span>{t("monedas.symbol")}</span>
          <span>{t("monedas.value")}</span>
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