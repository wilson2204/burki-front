import { useEffect, useState } from "react";
import "./OtrosTributos.css";
import { useLanguage } from "../../context/LanguageContext";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt
} from "react-icons/fa";
import { apiFetch } from "../../services/api";

export default function OtrosTributos({ setSection }) {

  const [data, setData] = useState([]);
  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
const { t } = useLanguage();
  const [form, setForm] = useState({
    codAfip: "",
    nombre: "",
    tipo: "$",
    valor: ""
  });

  const salir = () => {
  setSection("home");
};

const AFIP_CODES = [
  { value: "NATIONAL_TAX", label: t("otrosTributos.nationalTax") },
  { value: "PROVINCIAL_TAX", label: t("otrosTributos.provincialTax") },
  { value: "MUNICIPAL_TAX", label: t("otrosTributos.municipalTax") },
  { value: "INTERNAL_TAX", label: t("otrosTributos.internalTax") },
  { value: "IIBB", label: t("otrosTributos.iibb") },
  { value: "IVA_PERCEPTION", label: t("otrosTributos.ivaPerception") },
  { value: "IIBB_PERCEPTION", label: t("otrosTributos.iibbPerception") },
  { value: "OTHERS", label: t("otrosTributos.others") }
];

  const cargarDatos = async () => {
    try {
      const res = await apiFetch("/tax");

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        console.log("ERROR BACKEND GET:", text);
        return;
      }

      const json = await res.json();

      setData(json.map(i => ({
        id: i.id,
        codAfip: i.afipCode,
        nombre: i.name,
        tipo: i.type === "PERCENTAGE" ? "%" : "$",
        valor: i.amount
      })));

    } catch (err) {
      console.error(err);
      alert("Error cargando datos");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleNuevo = () => {
    setModoCrear(true);
    setModoEditar(false);
    setSeleccionado(null);
    setForm({ codAfip: "", nombre: "", tipo: "$", valor: "" });
  };

  const handleModificar = () => {
    if (!seleccionado) return alert("Seleccioná uno");

    const item = data.find(d => d.id === seleccionado);

    setForm({
      codAfip: item.codAfip,
      nombre: item.nombre,
      tipo: item.tipo,
      valor: item.valor
    });

    setModoEditar(true);
    setModoCrear(false);
  };

  //  payload seguro
  const buildPayload = () => ({
    afipCode: form.codAfip,
    name: form.nombre.trim(), 
    type: form.tipo === "%" ? "PERCENTAGE" : "AMOUNT",
    amount: Number(form.valor),
    description: "DEFAULT"
  });

  const crear = async () => {

    if (!form.nombre.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    const res = await apiFetch("/tax", {
  method: "POST",
  body: JSON.stringify(buildPayload()),
});

    if (res.status === 201) {
      await cargarDatos();
      setModoCrear(false);
    } else {
      console.log("POST ERROR:", await res.text());
    }
  };

  const modificar = async () => {

    if (!form.nombre.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    const res = await apiFetch(`/tax/${seleccionado}`, {
  method: "PUT",
  body: JSON.stringify(buildPayload()),
});

    if (res.status === 204) {
      await cargarDatos();
      setModoEditar(false);
      setSeleccionado(null);
    } else {
      console.log("PUT ERROR:", await res.text());
    }
  };

  const eliminar = async () => {
    if (!seleccionado) return alert("Seleccioná uno");
    if (!confirm("¿Eliminar?")) return;

    const res = await apiFetch(`/tax/${seleccionado}`, {
  method: "DELETE",
});

    if (res.status === 204) {
      await cargarDatos();
      setSeleccionado(null);
    } else {
      console.log("DELETE ERROR:", await res.text());
    }
  };

  const handleGuardar = () => {
    if (modoCrear) crear();
    if (modoEditar) modificar();
  };

  const handleCancelar = () => {
  setModoCrear(false);
  setModoEditar(false);
  setSeleccionado(null);

  setForm({
    codAfip: "",
    nombre: "",
    tipo: "$",
    valor: ""
  });
};

  return (
    <div className="otros-container">

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
    data-icon="✓"
    onClick={handleGuardar}
  >
    <span>{t("common.save")}</span>
  </div>

  <div
  className={`tool cancelar ${
    !seleccionado && !modoCrear && !modoEditar
      ? "disabled"
      : ""
  }`}
  data-icon="✕"
  onClick={
    seleccionado || modoCrear || modoEditar
      ? handleCancelar
      : undefined
  }
>
  <span>{t("common.cancel")}</span>
</div>

  <div
    className="tool salir"
    data-icon="↪"
    onClick={salir}
  >
    <span>{t("common.exit")}</span>
  </div>

</div>


      {(modoCrear || modoEditar) && (
        <div className="formulario">

          <label>{t("otrosTributos.afipCode")}</label>
          <select value={form.codAfip} onChange={e => setForm({ ...form, codAfip: e.target.value })}>
            <option value="">{t("common.select")}</option>
            {AFIP_CODES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <label>{t("otrosTributos.name")}</label>
          <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />

          <label>{t("otrosTributos.type")}</label>
          <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            <option value="$">$</option>
            <option value="%">%</option>
          </select>

          <label>{t("otrosTributos.value")}</label>
          <input value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />

        </div>
      )}

      {!modoCrear && !modoEditar && (
        <table className="tabla">
          <thead>
            <tr>
              <th>{t("common.id")}</th>
              <th>{t("otrosTributos.afipCode")}</th>
              <th>{t("otrosTributos.name")}</th>
              <th>{t("otrosTributos.type")}</th>
              <th>{t("otrosTributos.value")}</th>
            </tr>
          </thead>

          <tbody>
            {data.map(d => (
              <tr
                key={d.id}
                className={seleccionado === d.id ? "selected" : ""}
                onClick={() => setSeleccionado(d.id)}
              >
                <td>{d.id}</td>
                <td>{AFIP_CODES.find(c => c.value === d.codAfip)?.label || d.codAfip}</td>
                <td>{d.nombre}</td>
                <td>{d.tipo}</td>
                <td>{d.valor}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}