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
const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [soloNovedades, setSoloNovedades] = useState(false);
  const [originalBarCodes, setOriginalBarCodes] = useState([]);
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [stock, setStock] = useState([]);

  const emptyForm = {
  id: "",
  nombre: "",
  barCodes: [],

  codigo: "",
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
  measurementUnitId: "",

  itemPresentation: 1,

  price_2: "",
  price_3: "",
  price_4: "",
  price_5: "",

  expirationDays: 0,

  useLabel: false,

  reorderPoint: 0,
  controlMeasurementUnitId: ""
};

  const [form, setForm] = useState(emptyForm);

  const fetchConfig = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  };

  // =========================================================
  // COMBOS
  // =========================================================

  const getCombos = async () => {
    try {

      const res = await fetch(
        "http://localhost:8080/back_office/item/data-for-creation",
        fetchConfig
      );

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

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

  // =========================================================
  // LEER ARTICULOS
  // NUEVO ENDPOINT
  // =========================================================

const getArticulos = async () => {

  try {

    const res = await fetch(
      `http://localhost:8080/back_office/item?page=${page}&size=500`,
      {
        credentials: "include"
      }
    );

    if (res.status === 401) {
      alert("Sesión expirada");
      return;
    }

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    const data = await res.json();

    setArticulos(data.content || []);
setTotalPages(data.totalPages || 0);
  } catch (err) {
    console.error(err);
  }
};

  // =========================================================
  // LEER STOCK
  // NUEVO ENDPOINT
  // =========================================================

  const getStock = async (itemId) => {

    try {

      const res = await fetch(
        "http://localhost:8080/back_office/item-stock",
        {
          credentials: "include"
        }
      );

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const data = await res.json();

      const filtrado = data
        .filter(s => s.itemId === itemId)
        .map(s => ({
          ...s,
          editableStock: s.currentStock
        }));

      setStock(filtrado);

    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // ACTUALIZAR STOCK
  // NUEVO ENDPOINT
  // =========================================================

  const updateStock = async (item) => {

    try {

      const res = await fetch(
        `http://localhost:8080/back_office/item-stock/${item.branchId}/${item.itemId}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            stock: Number(item.editableStock)
          })
        }
      );

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (res.status === 404) {
        alert("Artículo o sucursal inexistente");
        return;
      }

      if (res.status === 422) {
        alert("Formato inválido");
        return;
      }

      if (!res.ok) {
        console.error(await res.text());
        alert("Error actualizando stock");
        return;
      }

      setStock(prev =>
        prev.map(s =>
          s.branchId === item.branchId &&
          s.itemId === item.itemId
            ? {
                ...s,
                currentStock: item.editableStock
              }
            : s
        )
      );

      alert("Stock actualizado");

    } catch (err) {
      console.error(err);
    }
  };

  const handleStockChange = (index, value) => {

    const updated = [...stock];

    updated[index].editableStock = value;

    setStock(updated);
  };

  // =========================================================
  // RECALCULAR
  // =========================================================

  const recalcular = () => {

    const costo = parseFloat(form.costo) || 0;

    const margen =
  Number(
    Math.max(
      0,
      parseFloat(form.margen) || 0
    ).toFixed(4)
  );

    const ivaObj =
      ivas.find(i => i.id == form.iva);

    const ivaRate =
      ivaObj
        ? (ivaObj.value || 0)
        : 0;

    const costoConIva =
      costo + (costo * ivaRate / 100);

    const precio =
      costo + (costo * margen / 100);

    const precioFinal =
      precio + (precio * ivaRate / 100);

    setForm(prev => ({
      ...prev,

      costoConIva:
        costoConIva.toFixed(2),

      precio:
        precio.toFixed(2),

      precioFinal:
        precioFinal.toFixed(2),

      fechaCambio:
        new Date().toLocaleString()
    }));

    setFlashPrice(true);

    setTimeout(() => {
      setFlashPrice(false);
    }, 500);
  };

  // =========================================================
  // EFFECTS
  // =========================================================

useEffect(() => {

  getCombos();

}, []);

useEffect(() => {

  getArticulos();

}, [page]);

  useEffect(() => {

    recalcular();

  }, [
    form.costo,
    form.margen,
    form.iva,
    ivas
  ]);

  // =========================================================
  // NUEVO
  // =========================================================

  const nuevo = () => {

    setForm(emptyForm);

    setSelected(null);

    setView("form");

    setTab("basicos");
  };

  // =========================================================
  // GUARDAR
  // NUEVOS ENDPOINTS
  // =========================================================

 const guardar = async () => {

  try {

    let payload = {
      item: {
        name: form.nombre || "SIN NOMBRE",

        barCode: form.codigo || null,
        extraBarCode: form.adicional || null,

        cost: parseFloat(form.costo) || 0,

        margin: Number(
          Math.max(0, parseFloat(form.margen) || 0).toFixed(4)
        ),

        price: parseFloat(form.precioFinal) || 0,

        currencyId: parseInt(form.currencyId) || 1,
        supplierId: parseInt(form.proveedorId) || 0,
        itemCollectionId: parseInt(form.departamentoId) || 0,
        itemSubCollectionId: parseInt(form.subDepartamentoId) || 0,
        ivaId: parseInt(form.iva) || 1,
        taxId: parseInt(form.taxId) || 0,
        itemTypeId: parseInt(form.itemTypeId) || 1,
        classificationId: parseInt(form.clasificacionId) || 0,
        measurementUnitId: parseInt(form.measurementUnitId) || 1,
        brandId: parseInt(form.marcaId) || 0,
        measurementUnitName:
          measurementUnits.find(
            m => m.id == form.measurementUnitId
          )?.name || "",

        itemPresentation:
          parseFloat(form.itemPresentation) || 1,

        price_2: parseFloat(form.price_2) || 0,
        price_3: parseFloat(form.price_3) || 0,
        price_4: parseFloat(form.price_4) || 0,
        price_5: parseFloat(form.price_5) || 0,

        expirationDays:
          parseInt(form.expirationDays) || 0,

        useLabel: form.useLabel || false
      },

barCodesToUpdate: form.barCodes.map(b => {

  const exists = originalBarCodes.some(
    ob => ob.value === b.value
  );

  return {

    action: exists
      ? "UPDATE"
      : "CREATE",

    barCode: {
      value: b.value,
      details: b.details
    }

  };

}),
      Stock: {
        reorderPoint:
          parseFloat(form.reorderPoint) || 0,

        controlMeasurementUnitId:
          parseInt(form.controlMeasurementUnitId) || null
      },

      linkedItems: null
    };

    console.log(payload);

    const method =
      selected
        ? "PUT"
        : "POST";

    const url =
      selected
        ? `http://localhost:8080/back_office/item/${selected}`
        : "http://localhost:8080/back_office/item";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) {
      alert("Sesión expirada");
      return;
    }

    if (res.status === 403) {
      const txt = await res.text();
      console.error(txt);
      alert("403 Forbidden");
      return;
    }

    if (res.status === 404) {
      const txt = await res.text();
      console.error(txt);
      alert("Entidad relacionada inexistente");
      return;
    }

    if (res.status === 409) {
      const txt = await res.text();
      console.error(txt);
      alert("Código de barras duplicado");
      return;
    }

    if (res.status === 422) {
      const txt = await res.text();
      console.error(txt);
      alert("Datos inválidos");
      return;
    }

    if (!res.ok) {
      console.error(await res.text());
      alert("Error guardando artículo");
      return;
    }

    await getArticulos();

    setView("table");

    alert(
      selected
        ? "Artículo actualizado"
        : "Artículo creado"
    );

  } catch (err) {
    console.error(err);
  }
};

  const eliminar = async () => {

  if (!selected) {
    alert("Seleccioná un artículo");
    return;
  }

  try {

    // =====================================================
    // ELIMINAR CODIGOS
    // =====================================================

    if (form.barCodes?.length > 0) {

      const payload = {

        item: {
          name: form.nombre
        },

        barCodesToUpdate:

          form.barCodes.map(b => ({

            action: "DELETE",

            barCode: {
              value: b.value,
              details: b.details
            }

          }))
      };

      const limpiar = await fetch(
        `http://localhost:8080/back_office/item/${selected}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!limpiar.ok) {

        console.error(await limpiar.text());

        alert("Error eliminando códigos");

        return;
      }
    }

    const limpiarCodigos = async () => {

  if (!form.barCodes?.length) return true;

  const payload = {

    item: {
      name: form.nombre
    },

    barCodesToUpdate:

      form.barCodes.map(b => ({

        action: "DELETE",

        barCode: {
          value: b.value,
          details: b.details
        }

      }))
  };

  const res = await fetch(
    `http://localhost:8080/back_office/item/${selected}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  return res.ok;
};



    // =====================================================
    // ELIMINAR ARTICULO
    // =====================================================

    const res = await fetch(
      `http://localhost:8080/back_office/item/${selected}`,
      {
        method: "DELETE",
        credentials: "include"
      }
    );

    if (res.status === 401) {
      alert("Sesión expirada");
      return;
    }

    if (res.status === 409) {

      console.error(await res.text());

      alert("El artículo está vinculado");

      return;
    }

    if (res.status === 422) {

      alert("El stock debe ser 0");

      return;
    }

    if (!res.ok) {

      console.error(await res.text());

      alert("Error eliminando");

      return;
    }

    await getArticulos();

    setSelected(null);

    setForm({ ...emptyForm });

    setView("table");

    alert("Artículo eliminado");

  } catch (err) {

    console.error(err);
  }
};

  // =========================================================
  // FILTROS
  // =========================================================

  const articulosFiltrados = articulos.filter(a => {

    const t = search.toLowerCase();

    const marcaNombre =
      marcas.find(m => m.id === a.brandId)
        ?.name
        ?.toLowerCase() || "";

    const match =
      String(a.id)
        .toLowerCase()
        .includes(t)

      ||

      (a.name || "")
        .toLowerCase()
        .includes(t)

      ||

      marcaNombre.includes(t)

      ||

      String(a.cost ?? "")
        .toLowerCase()
        .includes(t)

      ||

      String(a.margin ?? "")
        .toLowerCase()
        .includes(t)

      ||

      String(a.price ?? "")
        .toLowerCase()
        .includes(t);

    if (soloNovedades) {
      return match && a.price > 0;
    }

    return match;
  });

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

        <label>
          <input
            type="checkbox"
            checked={soloNovedades}
            onChange={e => setSoloNovedades(e.target.checked)}
          />
          Solo novedades
        </label>
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
  {articulosFiltrados.map(a => (
    <tr
      key={a.id}
      onClick={() => setSelected(a.id)}
      onDoubleClick={() => {

        const item = articulos.find(x => x.id === a.id);

setOriginalBarCodes(item.barCodes || []);

      setForm({
  ...emptyForm,

  id: item.id,
  barCodes: item.barCodes || [],
  nombre:
    item.name || "",

  precio:
    item.price || "0",

  precioFinal:
    item.price || "0",

  costo:
    item.cost || "",

  margen:
  Number(
    Math.max(
      0,
      parseFloat(item.margin) || 0
    ).toFixed(4)
  ),

  codigo:
    item.barCode || "",

  adicional:
    item.extraBarCode || "",

  iva:
    item.ivaId || "",

  taxId:
    item.taxId || "",

  currencyId:
    item.currencyId || "",

  clasificacionId:
    item.classificationId || "",

  departamentoId:
    item.itemCollectionId || "",

  subDepartamentoId:
    item.itemSubCollectionId || "",

  proveedorId:
    item.supplierId || "",

  marcaId:
    item.brandId || "",

  itemTypeId:
    item.itemTypeId || "",

  measurementUnitId:
    item.measurementUnitId || "",

  itemPresentation:
    item.itemPresentation || 1,

  price_2:
    item.price_2 || 0,

  price_3:
    item.price_3 || 0,

  price_4:
    item.price_4 || 0,

  price_5:
    item.price_5 || 0,

  expirationDays:
    item.expirationDays || 0,

useLabel: Boolean(item.useLabel)

});

        setSelected(item.id);
        getStock(item.id);
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
        onClick={() => setPage(prev => prev - 1)}
      >
        ← Anterior
      </button>

      <span>
        Página {page + 1} de {totalPages}
      </span>

      <button
        disabled={page >= totalPages - 1}
        onClick={() => setPage(prev => prev + 1)}
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
        details: "Adicional"
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
          onClick={() =>
            setForm(prev => ({
              ...prev,
              barCodes: prev.barCodes.filter((_, i) => i !== index)
            }))
          }
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

      {/* FILAS DEL COMBO */}
      {/* después acá podés agregar artículos */}

    </div>

  </div>
)}
        </div>
      )}

    </div>
  );
}
