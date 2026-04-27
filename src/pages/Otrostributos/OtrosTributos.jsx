import { useEffect, useState } from "react";
import "./OtrosTributos.css";

export default function OtrosTributos() {

  const [data, setData] = useState([]);
  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  const [form, setForm] = useState({
    codAfip: "",
    nombre: "",
    tipo: "$",
    valor: ""
  });

  const API_URL = "http://localhost:8080/back_office/tax";

  const AFIP_CODES = [
    { value: "NATIONAL_TAX", label: "Impuesto nacional" },
    { value: "PROVINCIAL_TAX", label: "Impuesto provincial" },
    { value: "MUNICIPAL_TAX", label: "Impuesto municipal" },
    { value: "INTERNAL_TAX", label: "Impuesto interno" },
    { value: "IIBB", label: "Ingresos brutos" },
    { value: "IVA_PERCEPTION", label: "Percepción de IVA" },
    { value: "IIBB_PERCEPTION", label: "Percepción de IIBB" },
    { value: "OTHERS", label: "Otros" }
  ];

  const cargarDatos = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        credentials: "include"
      });

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

  // 🔥 FIX CENTRAL: payload seguro
  const buildPayload = () => ({
    afipCode: form.codAfip,
    name: form.nombre.trim(), // 🔥 FIX 422 TAX_NAME
    type: form.tipo === "%" ? "PERCENTAGE" : "AMOUNT",
    amount: Number(form.valor),
    description: "DEFAULT"
  });

  const crear = async () => {

    if (!form.nombre.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload())
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

    const res = await fetch(`${API_URL}/${seleccionado}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload())
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

    const res = await fetch(`${API_URL}/${seleccionado}`, {
      method: "DELETE",
      credentials: "include"
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
  };

  return (
    <div className="otros-container">

      <div className="toolbar">

        <div className="tool nuevo" data-icon="+" onClick={handleNuevo}>
          <span>Nuevo</span>
        </div>

        <div className={`tool eliminar ${!seleccionado ? "disabled" : ""}`} data-icon="−" onClick={eliminar}>
          <span>Eliminar</span>
        </div>

        <div className={`tool modificar ${!seleccionado ? "disabled" : ""}`} data-icon="✎" onClick={handleModificar}>
          <span>Modificar</span>
        </div>

        <div className={`tool guardar ${!modoCrear && !modoEditar ? "disabled" : ""}`} data-icon="✔" onClick={handleGuardar}>
          <span>Guardar</span>
        </div>

        <div className={`tool cancelar ${!modoCrear && !modoEditar ? "disabled" : ""}`} data-icon="✖" onClick={handleCancelar}>
          <span>Cancelar</span>
        </div>

      </div>

      {(modoCrear || modoEditar) && (
        <div className="formulario">

          <label>Código AFIP</label>
          <select value={form.codAfip} onChange={e => setForm({ ...form, codAfip: e.target.value })}>
            <option value="">Seleccionar</option>
            {AFIP_CODES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <label>Nombre</label>
          <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />

          <label>Tipo</label>
          <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            <option value="$">$</option>
            <option value="%">%</option>
          </select>

          <label>Valor</label>
          <input value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />

        </div>
      )}

      {!modoCrear && !modoEditar && (
        <table className="tabla">
          <thead>
            <tr>
              <th>Id</th>
              <th>Cód.AFIP</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Valor</th>
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