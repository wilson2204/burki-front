import { useState, useEffect, useCallback } from "react";
import "./Articulos.css";

const API = "/api";

const fetchConfig = {
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};
const safeNumber = (v) => {
  const n = Number(v);
  return isNaN(n) || n === 0 ? null : n;
};


const emptyForm = {
  id: "",

  nombre: "",

  barCodes: [],
  codigo: "",
  adicional: "",

  costo: "",
  margen: "",
  precioFinal: "",

  iva: "",
  taxId: "",
  currencyId: "",

  clasificacionId: "",
  departamentoId: "",
  subDepartamentoId: "",
  proveedorId: "",
  marcaId: "",
  itemTypeId: "",
  measurementUnitId: "",

  reorderPoint: "",
  controlMeasurementUnitId: "",

  expirationDays: "",
  itemPresentation: "",

  useLabel: false
};

export default function Articulos({ setSection }) {

  const [view, setView] = useState("table");
  const [tab, setTab] = useState("basicos");
const [meta, setMeta] = useState({
  hasNext: false,
  hasPrevious: false
});
  const [articulos, setArticulos] = useState([]);
  const [selected, setSelected] = useState(null);

  const [stock, setStock] = useState([]);
const [linkedItems, setLinkedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");

  const [nuevoCodigo, setNuevoCodigo] = useState("");

  const [form, setForm] = useState(emptyForm);

  const [flashPrice, setFlashPrice] = useState(false);

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
  const calcularPrecioFinal = (costo, margen, ivaId) => {
  const ivaObj = ivas.find(i => i.id === Number(ivaId));
  const iva = ivaObj ? Number(ivaObj.value) : 0;

  const base = Number(costo) || 0;
  const margin = Number(margen) || 0;

  return Math.round(
    base * (1 + margin / 100) * (1 + iva / 100) * 100
  ) / 100;
};

  // ================= GET ARTICULOS =================
  const getArticulos = useCallback(async () => {
    console.log("FORM ACTUAL:", form);
console.log("SELECTED:", selected);
  const res = await fetch(
    `${API}/items?page=${page}&size=500`,
    fetchConfig
  );

  const data = await res.json();

  setArticulos(data.content || []);
  setTotalPages(data.totalPages || 0);

  setMeta({
    hasNext: data.hasNext,
    hasPrevious: data.hasPrevious
  });
}, [page]);
  // ================= GET ITEM =================
const getItemById = useCallback(async (id) => {
  const res = await fetch(
    `${API}/items/${id}`,
    fetchConfig
  );

  if (!res.ok) {
    console.error(await res.text());
    return;
  }

  const data = await res.json();
  const item = data.item;
  console.log("ITEM COMPLETO:", item);
  console.log("ITEM GET", item);
  console.log("TYPE PRINCIPAL", data.item.typeId);

setForm({
  ...emptyForm,

  id: item.id ?? "",

  nombre: item.name ?? "",

  codigo: item.barCode ?? item.barcode ?? "",
  adicional: item.extraBarCode ?? "",

  costo: item.cost ?? 0,
  margen: item.margin ?? 0,
  precioFinal: item.price ?? 0,

  iva: item.ivaId ?? "",
  taxId: item.taxId ?? "",
  currencyId: item.currencyId ?? "",

  clasificacionId:
    item.classificationId ??
    item.itemClassificationId ??
    "",

  departamentoId:
    item.itemCollectionId ??
    item.collectionId ??
    "",

  subDepartamentoId:
    item.itemSubCollectionId ??
    item.subCollectionId ??
    "",

  proveedorId: item.supplierId ?? "",

  marcaId:
    item.brandId ??
    item.itemBrandId ??
    "",

  itemTypeId:
    item.itemTypeId ??
    item.typeId ??
    "",

  measurementUnitId: item.measurementUnitId ?? "",

  reorderPoint:
    item.reorderPoint ??
    item.itemStock?.reorderPoint ??
    "",

  controlMeasurementUnitId:
    item.controlMeasurementUnitId ??
    item.itemStock?.controlMeasurementUnitId ??
    "",

  expirationDays: item.expirationDays ?? "",

  itemPresentation:
    item.itemPresentation ??
    item.presentation ??
    "",

  useLabel: item.useLabel ?? false,

  price_2: item.price_2 ?? 0,
  price_3: item.price_3 ?? 0,
  price_4: item.price_4 ?? 0,
  price_5: item.price_5 ?? 0,

  precioAnterior: item.previousPrice ?? 0,
  fechaCambio: item.lastPriceUpdate ?? "",

  barCodes: (item.barCodes || []).map(b => ({
    value: b.value,
    detail: b.detail ?? b.description ?? ""
  }))
});
  setStock(
    (item.stocks || []).map(s => ({
      ...s,
      itemId: item.id,
      itemName: item.name,
      editableStock: s.currentStock
    }))
  );
}, []);

  // ================= STOCK =================
  const getStock = useCallback(async (itemId) => {
    const res = await fetch(`${API}/items/stocks?page=0&size=500`, fetchConfig);
    const data = await res.json();

    setStock(
      (data.content || [])
        .filter(s => s.itemId === itemId)
        .map(s => ({
          ...s,
          editableStock: s.currentStock
        }))
    );
  }, []);

  // ================= UPDATE STOCK =================

const updateStock = async (row) => {
  console.log("ACTUALIZANDO STOCK", row);

  const res = await fetch(
    `${API}/items/${row.itemId}/branches/${row.branchId}/stocks`,
    {
      method: "PUT",
      ...fetchConfig,
      body: JSON.stringify({
        currentStock: Number(row.editableStock)
      })
    }
  );

  console.log("STATUS:", res.status);

  if (!res.ok) {
    console.error(await res.text());
  }
};
  // ================= CRUD =================
  const nuevo = () => {
    setForm(emptyForm);
    setSelected(null);
    setView("form");
    setTab("basicos");
  };
  const buildCreatePayload = (form, measurementUnits) => {
  const toNumber = (v) =>
    v !== "" && v !== null && v !== undefined ? Number(v) : null;

  const controlMeasurementUnitId = form.controlMeasurementUnitId
    ? Number(form.controlMeasurementUnitId)
    : null;

return {
  item: {
    name: form.nombre ?? "",

    barCode: form.codigo?.trim() || null,
    extraBarCode: form.adicional?.trim() || null,

    cost: Number(form.costo) || 0,
    margin: Number(form.margen) || 0,
    price: Number(form.precioFinal) || 0,

    price_2: Number(form.price_2) || 0,
    price_3: Number(form.price_3) || 0,
    price_4: Number(form.price_4) || 0,
    price_5: Number(form.price_5) || 0,

    currencyId: Number(form.currencyId) || 1,
    supplierId: Number(form.proveedorId) || 0,

    itemCollectionId: Number(form.departamentoId) || 0,
    itemSubCollectionId: Number(form.subDepartamentoId) || 0,

    ivaId: Number(form.iva) || 1,
    taxId: Number(form.taxId) || 0,

    itemTypeId: Number(form.itemTypeId) || 1,

    classificationId: Number(form.clasificacionId) || 0,
    brandId: Number(form.marcaId) || 0,

    measurementUnitId: Number(form.measurementUnitId) || 0,

    measurementUnitName:
      measurementUnits.find(
        m => m.id === Number(form.measurementUnitId)
      )?.name || "",

    expirationDays: Number(form.expirationDays) || 1,

    itemPresentation: Number(form.itemPresentation) || 2.0,

    useLabel: !!form.useLabel
  },

  itemStock: {
    reorderPoint: Number(form.reorderPoint) || 0,

    controlMeasurementUnitId:
      form.controlMeasurementUnitId
        ? Number(form.controlMeasurementUnitId)
        : null
  }
};
  };


const buildUpdatePayload = (form, measurementUnits) => ({
  name: form.nombre,

  //barCode: form.codigo?.trim() || null,
  //extraBarCode: form.adicional?.trim() || null,

  cost: Number(form.costo) || 0,
  margin: Number(form.margen) || 0,
  price: Number(form.precioFinal) || 0,

  currencyId: Number(form.currencyId) || 1,
  supplierId: Number(form.proveedorId) || 0,

  itemCollectionId: Number(form.departamentoId) || 0,
  itemSubCollectionId: Number(form.subDepartamentoId) || 0,

  ivaId: Number(form.iva),

  taxId: Number(form.taxId) || 0,

  itemTypeId: Number(form.itemTypeId),

  classificationId: Number(form.clasificacionId) || 0,

  brandId: Number(form.marcaId) || 0,

  measurementUnitId:
    Number(form.measurementUnitId) || 0,

  measurementUnitName:
    measurementUnits.find(
      m => m.id === Number(form.measurementUnitId)
    )?.name || "",

  expirationDays:
    Number(form.expirationDays) || 1,

  itemPresentation:
    Number(form.itemPresentation) || 1,

  price_2: Number(form.price_2) || 0,
  price_3: Number(form.price_3) || 0,
  price_4: Number(form.price_4) || 0,
  price_5: Number(form.price_5) || 0,

  useLabel: !!form.useLabel
}
);

  // ================= BARCODES =================

const guardarBarcodes = async (itemId, barCodes) => {

  console.log("BODY:", JSON.stringify({
    barCodes: barCodes.map(b => ({
      value: b.value,
      detail: b.detail || ""
    }))
  }));

  const res = await fetch(`${API}/items/${itemId}/barcodes`, {
    method: "POST",
    ...fetchConfig,
    body: JSON.stringify({
      barCodes: barCodes.map(b => ({
        value: b.value,
        detail: b.detail || ""
      }))
    })
  });

  console.log("STATUS BARCODES:", res.status);

  if (!res.ok) {
    console.log("ERROR BARCODES:", await res.text());
  }
};
const eliminarBarcode = async (itemId, barCodeValue) => {
  await fetch(
    `${API}/items/${itemId}/barcodes/${barCodeValue}`,
    {
      method: "DELETE",
      ...fetchConfig
    }
  );
};
  // ================= ARTICULOS VINCULADOS =================

const vincularItem = async (itemId, linkedItemId) => {

  const body = {
    linkedItemId: Number(linkedItemId)
  };

  console.log("URL:",
    `${API}/items/${itemId}/linked-items`
  );

  console.log("BODY:", body);

  const res = await fetch(
    `${API}/items/${itemId}/linked-items`,
    {
      method: "POST",
      ...fetchConfig,
      body: JSON.stringify(body)
    }
  );

  console.log("STATUS LINK:", res.status);

  if (!res.ok) {
    console.log(await res.text());
  }
  return res;
};
const eliminarLinkedItem = async (itemId, linkedItemId) => {
  await fetch(
    `${API}/items/${itemId}/linked-items/${linkedItemId}`,
    {
      method: "DELETE",
      ...fetchConfig
    }
  );
};
  // ================= GUARDAR =================

const guardar = async () => {
  const url = selected
    ? `${API}/items/${selected}`
    : `${API}/items`;

  const method = selected ? "PUT" : "POST";

  if (!form.itemTypeId) {
    alert("Debes seleccionar el tipo de artículo");
    return;
  }

  // 👇 PRIMERO crear payload
  const payload = selected
  ? buildUpdatePayload(
      form,
      measurementUnits
    )
  : buildCreatePayload(
      form,
      measurementUnits
    );

  // 👇 DESPUÉS usarlo
  console.log("SELECTED:", selected);
  console.log("PAYLOAD:", payload);
console.log(
  "PAYLOAD FINAL",
  JSON.stringify(payload, null, 2)
);
  try {
    console.log(
  "TIPO A GUARDAR:",
  form.itemTypeId
);
    const res = await fetch(url, {
      method,
      ...fetchConfig,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("ERROR UPDATE ITEM:", err, res.status);
      alert(err);
      return;
    }

    await getArticulos();

   if (selected) {
  await getItemById(selected);
} else {
  const location = res.headers.get("location");

  const itemId = Number(location.split("/").pop());

  if (form.barCodes.length > 0) {
    await guardarBarcodes(itemId, form.barCodes);
  }

  const idToUse = selected || itemId;


      console.log("Nuevo ID:", itemId);
    }

    setView("table");

  } catch (err) {
    console.error("Error guardando item:", err);
  }
};
  const eliminar = async () => {
    if (!selected) return;

    await fetch(`${API}/items/${selected}`, {
      method: "DELETE",
      credentials: "include"
    });

    setSelected(null);
    getArticulos();
  };

  // ================= STOCK EDIT =================
  const handleStockChange = (index, value) => {
    setStock(prev => {
      const copy = [...prev];
      copy[index].editableStock = value;
      return copy;
    });
  };
  // ================= COMBOS =================
const getCombos = useCallback(async () => {
  try {
    const res = await fetch(
      `${API}/items/data-for-creation`,
      fetchConfig
    );

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    const data = await res.json();

    setClasificaciones(data.classifications || []);
    setProveedores(data.suppliers || []);
    setTaxes(data.taxes || []);
    setMarcas(data.brands || []);
    setCurrencies(data.currencies || []);
    const departamentosGenericos =
  (data.collections || []).filter(d => d.id === 0);

const subDeptosGenericos =
  (data.subCollections || []).filter(
    s => s.collectionId === 0
  );

setDepartamentos(departamentosGenericos);
setSubDeptos(subDeptosGenericos);
    setIvas(data.IVAs || []);
    setMeasurementUnits(data.measurementUnits || []);
    setItemTypes(data.types || []);

  } catch (e) {
    console.error(e);
  }
}, []);


  // ================= EFFECTS =================
  useEffect(() => {
    getArticulos();
  }, [getArticulos]);

  useEffect(() => {
  getCombos();
}, [getCombos]);

useEffect(() => {
  const nuevoPrecio = calcularPrecioFinal(
    form.costo,
    form.margen,
    form.iva
  );

  setForm(prev => ({
    ...prev,
    precioFinal: nuevoPrecio
  }));
}, [form.costo, form.margen, form.iva, ivas]);


  // ================= FILTRO =================
  const filtrados = articulos.filter(a =>
    String(a.id).includes(search) ||
    (a.name || "").toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="articulos-container">
    <div className="toolbar">

      <div className="tool new" onClick={nuevo}>
        <span className="tool-icon">➕</span>
        <span className="tool-label">Nuevo</span>
      </div>

      <div className="tool delete" onClick={eliminar}>
        <span className="tool-icon">🗑️</span>
        <span className="tool-label">Eliminar</span>
      </div>

      <div className="tool save" onClick={guardar}>
        <span className="tool-icon">💾</span>
        <span className="tool-label">Guardar</span>
      </div>

      <div
        className="tool exit"
        onClick={() => setSection("home")}
      >
        <span className="tool-icon">🚪</span>
        <span className="tool-label">Salir</span>
      </div>

      {/* BOTÓN CANCELAR */}
<div
  className="tool cancel"
  onClick={() => {
    // Limpia el formulario
    setForm(emptyForm);

    // Deselecciona el artículo actual
    setSelected(null);

    // Vuelve a la vista de tabla
    setView("table");

    // Restablece la pestaña inicial
    setTab("basicos");
  }}
>
  <span className="tool-icon">❌</span>
  <span className="tool-label">Cancelar</span>
</div>

      <div className="toolbar-right">
        <input
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

    </div>

      {view === "table" && (
        <>
        <table className="tabla">
          
        <thead>
  <tr>
    <th>ID</th>
    <th>Artículo</th>
    <th>Costo</th>
    <th>Margen</th>
    <th>Precio</th>
  </tr>
</thead>

<tbody>
  {filtrados.map(a => (
    <tr
      key={a.id}
      onClick={() => setSelected(a.id)}
      onDoubleClick={() => {
  if (!a.id || a.id === 0) return;
  getItemById(a.id);
  getStock(a.id);
  setSelected(a.id);
  setView("form");
}}
      className={selected === a.id ? "selected" : ""}
    >
      <td>{a.id}</td>
      <td>{a.name}</td>
      <td>${a.cost ?? 0}</td>
      <td>{a.margin ?? 0}%</td>
      <td>${a.price ?? 0}</td>
    </tr>
  ))}
</tbody>
        </table>
        <div className="pagination">
<button
  disabled={page === 0}
  onClick={() => setPage(p => Math.max(p - 1, 0))}
>
  ← Anterior
</button>

<span>
 Página {page} de {totalPages - 1}
</span>

<button
  disabled={!meta.hasNext}
  onClick={() => setPage(p => p + 1)}
>
  Siguiente →
</button>
    </div>
  </>
      )}

      {view === "form" && (
        <div className="form-wrapper">

          <div className="tabs">
            <button onClick={() => setTab("basicos")} className={tab === "basicos" ? "active" : ""}>Básicos</button>
            <button onClick={() => setTab("otros")} className={tab === "otros" ? "active" : ""}>Otros</button>
            <button onClick={() => setTab("stock")} className={tab === "stock" ? "active" : ""}>Stock</button>
            <button onClick={() => setTab("listas")} className={tab === "listas" ? "active" : ""}>Listas y Promos</button>
            <button
  onClick={() => setTab("combo")}
  className={tab === "combo" ? "active" : ""}
>
  Combo
</button>
            <button onClick={() => setTab("codigos")}className={tab === "codigos" ? "active" : ""}
>
Códigos de barras
</button>
          </div>

          {tab === "basicos" && (
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
                  <div className={`precio-box floating ${flashPrice ? "flash" : ""}`}>
                    <span>Precio final</span>
                    <h1>{form.precioFinal}</h1>
                  </div>

                  <div className="row-double">
                    <div>
                      <label>Precio anterior</label>
                      <input value={form.precioAnterior} disabled />
                    </div>

                    <div>
                      <label>Fecha último cambio</label>
                      <input value={form.fechaCambio} disabled />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        {tab === "otros" && (
  <div className="otros-grid">

    {/* IZQUIERDA */}
    <div className="otros-col">

      {/* ENVASE */}
      <div className="otros-box">
        <h3>Envase</h3>

        <div className="field-row">
          <label>Artículo Envase</label>

          <select>
            <option>Sin envase</option>
            <option>Botella</option>
            <option>Caja</option>
            <option>Pack</option>
          </select>
        </div>
      </div>

      {/* SUSPENDER */}
      <div className="otros-box">
        <h3>Suspender ventas</h3>

        <label className="check-row">
          Quitar este artículo de la venta
        </label>
      </div>

      {/* GASTRONOMIA */}
      <div className="otros-box">
        <h3>Gastronomía</h3>

        <div className="field-row">
          <label>Sector de comanda</label>
          <select disabled>
            <option></option>
          </select>
        </div>

        <div className="field-row">
          <label>Preparación</label>
          <select disabled>
            <option></option>
          </select>
        </div>

        <div className="field-row">
          <label>Tiempo de prepa.</label>
          <input
  type="number"
  min="0"
  step="1"
/>
        </div>

      </div>

    </div>

    {/* DERECHA */}
    <div className="otros-col">

      <div className="otros-box">
        <h3>Unid. de medida - Etiqueta</h3>

        <label>Presentación - unid de medida de vta.</label>

        <div className="presentation-row">
          <input
  type="number"
  min="0"
  step="0.01"
/>
          <select
  value={form.measurementUnitId}
  onChange={e =>
    setForm({
      ...form,
      measurementUnitId: e.target.value
    })
  }
>
  {measurementUnits.map(m => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ))}
</select>
        </div>

        <label className="check-row">
          checked={form.useLabel}
          Incluir en etiquetas de gondola
        </label>

        <label className="check-row">
  <input
    type="checkbox"
    checked={form.useLabel}
    onChange={(e) =>
      setForm({
        ...form,
        useLabel: e.target.checked
      })
    }
  />
  Usa etiqueta (useLabel)
</label>

        <textarea
          className="etiqueta-box"
          value="1234567890123"
          readOnly
        />

        <div className="field-row vencimiento">
          <label># Días para el vencimiento</label>
          <input
  type="number"
  value={form.expirationDays}
  onChange={(e) =>
    setForm({
      ...form,
      expirationDays: e.target.value
    })
  }
/>
        </div>

      </div>

    </div>

  </div>
)}

          {tab === "stock" && (
  <div className="stock-container">

    <div className="stock-box">

      <h3>Control de Stock</h3>

      <div className="stock-grid">

        {/* IZQUIERDA */}
        <div className="stock-left">

          <div className="field-row">
            <label>Unidad de venta</label>

            <select
              value={form.measurementUnitId}
              onChange={e =>
                setForm({
                  ...form,
                  measurementUnitId: e.target.value
                })
              }
            >

              {measurementUnits.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <label>Unidad de control</label>

            <select
              value={form.measurementUnitId}
              onChange={e =>
                setForm({
                  ...form,
                  measurementUnitId: e.target.value
                })
              }
            >
              {measurementUnits.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <label>Punto de pedido</label>

           <input
  type="number"
  min="0"
  value={form.reorderPoint}
  onChange={(e) =>
    setForm({
      ...form,
      reorderPoint: e.target.value
    })
  }
/>
          </div>

        </div>
        {/* DERECHA */}
        <div className="stock-right">

          <label>Stock actual</label>
<textarea
  className="stock-box-area"
  readOnly
  value={
    stock.reduce(
      (acc, s) => acc + Number(s.currentStock || 0),
      0
    )
  }
/>

        </div>

      </div>

      {/* ================= STOCK POR SUCURSAL ================= */}

      <div className="stock-sucursales-card">

        <div className="stock-sucursales-header">
          <h3>Stock por Sucursal</h3>
        </div>

        <div className="stock-table">

        <div className="stock-table-header">
  <span>Sucursal</span>
  <span>Artículo</span>
  <span>Stock</span>
</div>

          <div className="stock-table-body">

          {stock.map((s, index) => (

  <div
    className="stock-row"
    key={`${s.branchId}-${s.itemId}-${index}`}
  >

    <span>{s.branchName}</span>

    <span>{s.itemName}</span>

    <span>

   <input
  type="number"
  step="0.01"
  value={s.editableStock}
  className="stock-edit-input"
  onChange={(e) =>
    handleStockChange(index, e.target.value)
  }
  onBlur={() => updateStock(s)}
/>
    </span>
  </div>
))}

          </div>

        </div>

      </div>

    </div>

  </div>
)}

  {tab === "listas" && (
  <div className="listas-grid">

    {/* IZQUIERDA */}
    <div className="listas-box">
      <h3>Listas de precios vigentes</h3>

      <div className="field-row">
        <label>Principal</label>

        <input
          type="number"
          value={form.precioFinal}
          disabled
        />
      </div>

      <div className="field-row">
        <label>Lista 2</label>
        <input type="number" />
      </div>

      <div className="field-row">
        <label>Lista 3</label>
        <input type="number" />
      </div>

      <div className="field-row">
        <label>Lista 4</label>
        <input type="number" />
      </div>

      <div className="field-row">
        <label>Lista 5</label>
        <input type="number" />
      </div>

    </div>

    {/* DERECHA */}
    <div className="listas-box">
      <h3>Promoción</h3>

      <select>
        <option>Sin Promo</option>
        <option>2x1</option>
        <option>3x2</option>
        <option>Descuento %</option>
      </select>
    </div>

  </div>
)}
{tab === "codigos" && (
  <div className="codigos-container">

    <div className="codigos-box">

      <h3> códigos de barra extra</h3>

      <div className="codigo-add-row">

        <input
          type="number"
          placeholder="Ingrese código de barras"
          value={nuevoCodigo}
onChange={e => setNuevoCodigo(e.target.value)}
        />

        <button
  type="button"
  className="btn-add-codigo"
  onClick={() => {

  if (!nuevoCodigo?.trim()) return;

  const existe = form.barCodes.some(
    b => b.value === nuevoCodigo.trim()
  );

  if (existe) {
    alert("Ese código ya existe");
    return;
  }

  setForm(prev => ({
    ...prev,

    barCodes: [
      ...prev.barCodes,
      {
        value: nuevoCodigo.trim(),
        detail: "Adicional"
      }
    ]
  }));

  setNuevoCodigo("");
}}
>
  Agregar
</button>

      </div>

      <table className="tabla-codigos">

        <thead>
          <tr>
            <th>Principal</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
<tbody>

  {form.barCodes.map((b, index) => (
    <tr key={index}>

      <td>
        <input type="radio" readOnly />
      </td>

      <td>{b.value}</td>

      <td>{b.details}</td>

      <td>

      <button
    
  type="button"
  className="btn-codigo eliminar"
  onClick={async () => {
    const itemId = form.id;

    if (!itemId) {
      // todavía no está guardado en backend
      setForm(prev => ({
        ...prev,
        barCodes: prev.barCodes.filter((_, i) => i !== index)
      }));
      return;
    }

    const barCodeValue = b.value;

    await eliminarBarcode(itemId, barCodeValue);

    setForm(prev => ({
      ...prev,
      barCodes: prev.barCodes.filter((_, i) => i !== index)
    }));
  }}
>
  Eliminar
</button>

      </td>

    </tr>
  ))}

</tbody>

      </table>

      <div className="codigo-info">
        <div className="codigo-info">
  Total de códigos: {form.barCodes.length}
</div>
      </div>

    </div>

  </div>
)}

          {tab === "combo" && (
  <div className="combo-container">

    <div className="combo-header">
      <div>Código</div>
      <div>Cantidad</div>
      <div>Artículo</div>
      <div>Valor</div>
    </div>

    <div className="combo-body">
<div className="combo-body">

  {linkedItems.map((l) => (
    <div key={l.linkedItemId} className="combo-row">

      <span>{l.linkedItemName || l.linkedItemId}</span>

      <button
        onClick={async () => {
          await eliminarLinkedItem(form.id, l.linkedItemId);

          setLinkedItems(prev =>
            prev.filter(x => x.linkedItemId !== l.linkedItemId)
          );
        }}
      >
        Quitar
      </button>

    </div>
  ))}

</div>
    <div className="combo-add">
  <input
    type="number"
    placeholder="ID del artículo a vincular"
    value={nuevoCodigo}
    onChange={e => setNuevoCodigo(e.target.value)}
  />

<button
onClick={async () => {
  if (!form.id) {
    alert("Primero guardá el artículo principal");
    return;
  }

  console.log("ID PRINCIPAL:", form.id);
  console.log("TIPO PRINCIPAL:", form.itemTypeId);

  // 1. Traer item a vincular
  const resItem = await fetch(
    `${API}/items/${nuevoCodigo}`,
    fetchConfig
  );

  if (!resItem.ok) {
    alert("Error al buscar el artículo a vincular");
    return;
  }

  const dataItem = await resItem.json();
  const item = dataItem.item;

  console.log("ITEM A VINCULAR:", item);

  // 2. VALIDACIÓN CORRECTA (backend rule real)
  const ENVASE_ID = 2;

  if (item.typeId !== ENVASE_ID) {
    alert("El artículo a vincular debe ser tipo Envase");
    return;
  }

  // 3. IMPORTANTE: el principal NO debe ser Envase
  if (form.itemTypeId === ENVASE_ID) {
    alert("El artículo principal no puede ser Envase");
    return;
  }

  // 4. Vincular
  const res = await vincularItem(form.id, nuevoCodigo);

  if (!res.ok) {
    const err = await res.text();
    console.error(err);
    alert(err);
    return;
  }

  setNuevoCodigo("");
}}
>
  Vincular
</button>
</div>
    </div>

  </div>
)}
        </div>
      )}

    </div>
  );
}
