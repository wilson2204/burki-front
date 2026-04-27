import { useState, useEffect } from "react";
import "./Articulos.css";

export default function Articulos({ setSection }) {

  const [view, setView] = useState("table");
  const [tab, setTab] = useState("basicos");

  const [articulos, setArticulos] = useState([]);
  const [selected, setSelected] = useState(null);

  const [clasificaciones, setClasificaciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [subDeptos, setSubDeptos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [ivas, setIvas] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [measurementUnits, setMeasurementUnits] = useState([]);

  const [flashPrice, setFlashPrice] = useState(false);

  const emptyForm = {
    id: "",
    codigo: "",
    nombre: "",
    adicional: "",
    costo: "",
    costoConIva: "",
    margen: "",
    precio: "0.00",
    precioFinal: "0.00",
    precioAnterior: "",
    fechaCambio: "",
    iva: "",
    taxId: "",
    currencyId: "",
    clasificacionId: "",
    departamentoId: "",
    subDepartamentoId: "",
    proveedorId: "",
    marcaId: "",
    itemTypeId: "",
    measurementUnitId: ""
  };

  const [form, setForm] = useState(emptyForm);

  const fetchConfig = {
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  };

  const getCombos = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/back_office/item/data-for-creation",
        fetchConfig
      );
      if (!res.ok) return;

      const data = await res.json();

      setClasificaciones(data.itemClassifications || []);
      setItemTypes(data.itemTypes || []);
      setMeasurementUnits(data.measurementUnits || []);

      setProveedores(data.supplier || []);
      setDepartamentos(data.itemCollections || []);
      setSubDeptos(data.itemSubCollections || []);
      setMarcas(data.brands || []);
      setIvas(data.IVAs || []);
      setTaxes(data.taxes || []);
      setCurrencies(data.currencies || []);

    } catch (err) {
      console.error(err);
    }
  };

  const getArticulos = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/back_office/item",
        fetchConfig
      );
      if (!res.ok) return;

      setArticulos(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCombos();
    getArticulos();
  }, []);

  const recalcular = () => {
    const costo = parseFloat(form.costo) || 0;
    const margen = parseFloat(form.margen) || 0;

    const ivaObj = ivas.find(i => i.id == form.iva);
    const ivaRate = ivaObj ? (ivaObj.value || 0) : 0;

    const costoConIva = costo + (costo * ivaRate / 100);
    const precio = costo + (costo * margen / 100);
    const precioFinal = precio + (precio * ivaRate / 100);

    setForm(prev => ({
      ...prev,
      costoConIva: costoConIva.toFixed(2),
      precio: precio.toFixed(2),
      precioFinal: precioFinal.toFixed(2),
      fechaCambio: new Date().toLocaleString()
    }));

    setFlashPrice(true);
    setTimeout(() => setFlashPrice(false), 500);
  };

  useEffect(() => {
    recalcular();
  }, [form.costo, form.margen, form.iva, ivas]);

  const nuevo = () => {
    setForm(emptyForm);
    setSelected(null);
    setView("form");
  };

  // 🔥 SOLO ESTO CAMBIÓ
  const guardar = async () => {
    const payload = {
      barCode: form.codigo ? form.codigo : null,
      extraBarCode: form.adicional ? form.adicional : null,
      name: form.nombre || "SIN NOMBRE",

      cost: parseFloat(form.costo) || 0,
      margin: parseFloat(form.margen) || 0,
      price: parseFloat(form.precio) || 0,

      currencyId: form.currencyId ? parseInt(form.currencyId) : null,
      supplierId: form.proveedorId ? parseInt(form.proveedorId) : null,
      itemCollectionId: form.departamentoId ? parseInt(form.departamentoId) : null,
      itemSubCollectionId: form.subDepartamentoId ? parseInt(form.subDepartamentoId) : null,
      ivaId: form.iva ? parseInt(form.iva) : null,
      taxId: form.taxId ? parseInt(form.taxId) : null,
      classificationId: form.clasificacionId ? parseInt(form.clasificacionId) : null,
      brandId: form.marcaId ? parseInt(form.marcaId) : null,
      itemTypeId: form.itemTypeId ? parseInt(form.itemTypeId) : null,
      measurementUnitId: form.measurementUnitId ? parseInt(form.measurementUnitId) : null,

      equivalentMeasurementName: "Unidad",
      measurementUnitName: "Unidad"
    };

    const method = selected ? "PUT" : "POST";
    const url = selected
      ? `http://localhost:8080/back_office/item/${selected}`
      : "http://localhost:8080/back_office/item";

    const res = await fetch(url, {
      ...fetchConfig,
      method,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ERROR BACK:", text);
      alert("Error al guardar (ver consola)");
      return;
    }

    getArticulos();
    setView("table");
  };

  const eliminar = async () => {
    if (!selected) return;

    await fetch(
      `http://localhost:8080/back_office/item/${selected}`,
      { ...fetchConfig, method: "DELETE" }
    );

    getArticulos();
  };

  return (
    <div className="articulos-container">

      <div className="toolbar">
        <div className="tool" onClick={nuevo}>➕ Nuevo</div>
        <div className="tool" onClick={eliminar}>🗑️ Eliminar</div>
        <div className="tool" onClick={guardar}>💾 Guardar</div>
        <div className="tool" onClick={() => setSection("home")}>🚪 Salir</div>
      </div>

      {view === "table" && (
        <table className="tabla">
          <tbody>
            {articulos.map(a => (
              <tr
                key={a.id}
                onClick={() => setSelected(a.id)}
                onDoubleClick={() => {
                  const item = articulos.find(x => x.id === a.id);

                  setForm({
                    ...form,
                    id: item.id,
                    nombre: item.name || "",
                    precio: item.price || "0",
                    costo: item.cost || "",
                    margen: item.margin || "",
                    codigo: item.barCode || "",
                    adicional: item.extraBarCode || ""
                  });

                  setSelected(item.id);
                  setView("form");
                }}
                className={selected === a.id ? "selected" : ""}
              >
                <td>{a.name}</td>
                <td>${a.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {view === "form" && (
        <div className="form-wrapper">
          <div className="tabs-buttons">
            <button className="tab-btn active">BASICOS</button>
          </div>

          <div className="basicos-container">
            <div className="form-grid">

              <label>Artículo</label>
              <textarea value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}/>

              <label>Precio final</label>
              <input value={form.precioFinal} disabled />

              <label>Nro. Artículo</label>
              <input value={form.id || "0"} disabled />

              <label>Código de barras</label>
              <input value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})}/>

              <label>Código adicional</label>
              <input value={form.adicional} onChange={e => setForm({...form, adicional: e.target.value})}/>

              <label>Departamento</label>
              <select value={form.departamentoId} onChange={e => setForm({...form, departamentoId: e.target.value})}>
                {departamentos.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <label>Sub-depto</label>
              <select value={form.subDepartamentoId} onChange={e => setForm({...form, subDepartamentoId: e.target.value})}>
                {subDeptos.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <label>Proveedor</label>
              <select value={form.proveedorId} onChange={e => setForm({...form, proveedorId: e.target.value})}>
                {proveedores.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label>Marca</label>
              <select value={form.marcaId} onChange={e => setForm({...form, marcaId: e.target.value})}>
                {marcas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>

              <label>Tipo de art.</label>
              <select value={form.itemTypeId} onChange={e => setForm({...form, itemTypeId: e.target.value})}>
                {itemTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>

              <label>Clasificación</label>
              <select value={form.clasificacionId} onChange={e => setForm({...form, clasificacionId: e.target.value})}>
                {clasificaciones.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label>Costo sin IVA</label>
              <input value={form.costo} onChange={e => setForm({...form, costo: e.target.value})}/>

              <label>Costo con IVA</label>
              <input value={form.costoConIva} disabled />

              <label>Margen %</label>
              <input value={form.margen} onChange={e => setForm({...form, margen: e.target.value})}/>

              <label>Tasa de IVA</label>
              <select value={form.iva} onChange={e => setForm({...form, iva: e.target.value})}>
                {ivas.map(i => <option key={i.id} value={i.id}>{i.description}</option>)}
              </select>

              <label>Impuesto interno</label>
              <select value={form.taxId} onChange={e => setForm({...form, taxId: e.target.value})}>
                {taxes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>

              <label>Tipo de moneda</label>
              <select value={form.currencyId} onChange={e => setForm({...form, currencyId: e.target.value})}>
                {currencies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <div className="form-actions">
                <button className="btn-recalcular" onClick={recalcular}>
                  Recalcular valores
                </button>

                <div className={`precio-box floating ${flashPrice ? "flash" : ""}`}>
                  <span>Precio final</span>
                  <h1>{form.precioFinal}</h1>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}