import { useState, useEffect, useCallback } from "react";
import "./Articulos.css";
import {
  articulosImagenes,
  mapaImagenes
} from "../../data/articulosImagenes";
import { apiFetch } from "../../services/api";

const safeNumber = (v) => {
  const n = Number(v);
  return isNaN(n) || n === 0 ? null : n;
};


const emptyForm = {
  id: "",
  imgPath: null,
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
  itemTypeId: 1,
  measurementUnitId: "",

  reorderPoint: "",
  controlMeasurementUnitId: "",

  expirationDays: "",
  itemPresentation: "",

  useLabel: false,

sinPromocion: false,

promotionId: "",
promotionOriginalId: null
};

export default function Articulos({ setSection }) {

  const [view, setView] = useState("table");
  const [tab, setTab] = useState("basicos");
const [mostrarGaleria, setMostrarGaleria] = useState(false);
const [imagenArticulo, setImagenArticulo] = useState(null);
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
const [meta, setMeta] = useState({
  hasNext: false,
  hasPrevious: false
});
  const [articulos, setArticulos] = useState([]);
  const [selected, setSelected] = useState(null);
const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [stock, setStock] = useState([]);
const [linkedItems, setLinkedItems] = useState([]);
const [availableLinkedItems, setAvailableLinkedItems] =
  useState([]);
  const [comboItems, setComboItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
const [promotions, setPromotions] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [busquedaActiva, setBusquedaActiva] = useState("");
  const [openCategorias, setOpenCategorias] = useState(false);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [filters, setFilters] = useState({
  texto: "",
  departamento: "",
  subDepartamento: "",
  proveedor: "",
  marca: "",
  clasificacion: "",
  tipo: ""
});
const [nuevoLinkedItem, setNuevoLinkedItem] = useState("");
const [nuevoComboItem, setNuevoComboItem] = useState("");
const [nuevoBarcode, setNuevoBarcode] = useState("");

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
const obtenerImagenArticulo = (nombre, departamentoId) => {
  if (!nombre || !departamentoId) return null;

  const departamento = departamentos.find(
    d => String(d.id) === String(departamentoId)
  );

  if (!departamento) return null;

  const categoria = departamento.name;
  const lista = articulosImagenes[categoria];

  if (!lista || lista.length === 0) return null;

  const texto = nombre.toLowerCase().trim();

  const archivo = lista.find(img => {
    const nombreArchivo = img
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]/g, " ")
      .toLowerCase()
      .trim();

    return texto.includes(nombreArchivo);
  });

  return archivo ? `/Articulos/${archivo}` : null;
};

  const iva = ivaObj ? Number(ivaObj.value) : 0;

  const base = Number(costo) || 0;
  const margin = Number(margen) || 0;

  return Math.round(
    base * (1 + margin / 100) * (1 + iva / 100) * 100
  ) / 100;
};
const costoConIva = (() => {
  const ivaObj = ivas.find(i => i.id === Number(form.iva));
  const iva = ivaObj ? Number(ivaObj.value) : 0;

  return (
    (Number(form.costo) || 0) *
    (1 + iva / 100)
  ).toFixed(2);
})();
  // ================= GET ARTICULOS =================
  const getArticulos = useCallback(async () => {
   
  const res = await apiFetch(
  `/items?page=${page}&size=500`
);

  const data = await res.json();
 console.log(data.content[0]);
    console.log("FORM ACTUAL:", form);
console.log("SELECTED:", selected);
  setArticulos(data.content || []);
  setTotalPages(data.totalPages || 0);

  setMeta({
    hasNext: data.hasNext,
    hasPrevious: data.hasPrevious
  });
}, [page]);
  // ================= GET ITEM =================
const getItemById = useCallback(async (id) => {
  console.log(
  "FORM BARCODES:",
  form.barCodes
);
  const res = await apiFetch(
  `/items/${id}`
);

  if (!res.ok) {
    console.error(await res.text());
    return;
  }

  const data = await res.json();
  const item = data.item;
  const rutaImagen = item.imgPath
  ? mapaImagenes[item.imgPath.toLowerCase()] || null
  : null;

setImagenArticulo(rutaImagen);

console.log(
  "LINKED ITEMS DEL GET:",
  JSON.stringify(
    item.linkedItems,
    null,
    2
  )
);
console.log("LINK OBJECT COMPLETO:", item.linkedItems);

 setLinkedItems(
  item.linkedItems || []
);
setComboItems(
  (item.itemsInBundle || []).map(i => ({
    id: i.id,
    name: i.name,
    price: Number(i.price) || 0,
    quantity: Number(i.quantity) || 1
  }))
);
if (String(item.itemTypeId) === "2") {
  getComboItems(item.id);
}
  console.log(
  "BARCODES RECIBIDOS:",
  item.barCodes
);
  console.log("ITEM GET", item);
  console.log("TYPE PRINCIPAL", data.item.typeId);
const originalBarcodes = (item.barCodes || []).map(b => b.value);
setForm({
  ...emptyForm,

  id: item.id ?? "",

  nombre: item.name ?? "",
  imgPath: rutaImagen,

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
  promotionId: item.promotion?.id ?? "",
promotionOriginalId: item.promotion?.id ?? null,
sinPromocion: item.promotion == null,

  price_2: item.price_2 ?? 0,
  price_3: item.price_3 ?? 0,
  price_4: item.price_4 ?? 0,
  price_5: item.price_5 ?? 0,

  precioAnterior: item.previousPrice ?? 0,
  fechaCambio: item.lastPriceUpdate ?? "",

  barCodes: (item.barCodes || []).map(b => ({
  value: b.value,
  detail: b.detail ?? b.description ?? "",
  deleted: false,
})),
barCodesOriginal: (item.barCodes || []).map(b => b.value)
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
    const res = await apiFetch(
  `/items/stocks?page=0&size=500`,
);
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

  const res = await apiFetch(
  `/items/${row.itemId}/branches/${row.branchId}/stocks`,
  {
    method: "PUT",
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
    setImagenArticulo(null);
  setMostrarGaleria(false);
  setCategoriaSeleccionada(null);
  };
  const buildCreatePayload = (form, measurementUnits) => {
  const toNumber = (v) =>
    v !== "" && v !== null && v !== undefined ? Number(v) : null;
  const imgPath = form.imgPath
  ? form.imgPath
      .split("/")
      .pop()
      .split("\\")
      .pop()
      .replace(/\.[^/.]+$/, "")
      .replace(/ /g, "_")
      .replace(/[^A-Za-z0-9_-]/g, "")
  : null;


  const controlMeasurementUnitId = form.controlMeasurementUnitId
    ? Number(form.controlMeasurementUnitId)
    : null;


    
return {
  item: {
    name: form.nombre ?? "",
      imgPath,
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


const buildUpdatePayload = (form, measurementUnits) => {


  const imgPath = form.imgPath
  ? form.imgPath
      .split("/")
      .pop()
      .split("\\")
      .pop()
      .replace(/\.[^/.]+$/, "")
      .replace(/ /g, "_")
      .replace(/[^A-Za-z0-9_-]/g, "")
  : null;

  return {
    name: form.nombre,

    imgPath,

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
    
  };
  
};

  // ================= BARCODES =================

const guardarBarcodes = async (itemId, barCodes) => {
  console.log("BARCODES QUE SE VAN A ENVIAR:", barCodes);
  console.log("=== GUARDAR BARCODES ===");
  console.log("ITEM ID:", itemId);
  console.log("BARCODES:", barCodes);

  const res = await apiFetch(`/items/${itemId}/barcodes`, {
  method: "POST",
  body: JSON.stringify({
    barCodes
  })
});

  console.log("STATUS BARCODES:", res.status);

  if (!res.ok) {
    const err = await res.text();
    console.log("ERROR BARCODES:", err);

    if (res.status === 409) {
      console.warn("Barcode duplicado ignorado");
      return;
    }

    throw new Error(err);
  }
};
const eliminarBarcode = async (itemId, barCodeValue) => {
  await apiFetch(
  `/items/${itemId}/barcodes/${barCodeValue}`,
  {
    method: "DELETE",
  }
);
};
const updateComboItems = async (idCombo, items) => {
  const res = await apiFetch(`/items/${idCombo}/bundles`, {
    method: "PUT",
    body: JSON.stringify(items)
  });

  return res;
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

  const res = await apiFetch(
  `/items/${itemId}/linked-items`,
  {
    method: "POST",
    body: JSON.stringify(body)
  }
);

  console.log("STATUS LINK:", res.status);

  if (!res.ok) {
    console.log(await res.text());
  }
  return res;
};

const eliminarLinkedItem = async (
  itemId,
  linkedItemId
) => {
  console.log(
    "DELETE:",
    `${API}/items/${itemId}/linked-items/${linkedItemId}`
  );

  const res = await apiFetch(
  `/items/${itemId}/linked-items/${linkedItemId}`,
  {
    method: "DELETE",
  }
);
  console.log(
    "STATUS DELETE:",
    res.status
  );

  if (!res.ok) {
    console.log(
      "ERROR:",
      await res.text()
    );
  }

  return res;
};

// ================= PROMOCIONES =================

const vincularPromocion = async (promotionId, itemId) => {
  const res = await apiFetch(
  `/promotions/${promotionId}/items/${itemId}`,
  {
    method: "PUT",
  }
);

  if (!res.ok) {
    console.log(await res.text());
  }

  return res;
};

const desvincularPromocion = async (promotionId, itemId) => {
  const res = await apiFetch(
  `/promotions/${promotionId}/items/${itemId}`,
  {
    method: "DELETE",
  }
);

  if (!res.ok) {
    console.log(await res.text());
  }

  return res;
};


const getComboItems = useCallback(async (id) => {
  const res = await apiFetch(
  `/items/bundles/${id}`,
);

  if (!res.ok) {
    console.log(await res.text());
    return;
  }

  const data = await res.json();

  setComboItems(
    (data || []).map(i => ({
      id: i.id,
      name: i.name,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1
    }))
  );
}, []);

  // ================= GUARDAR =================

const guardar = async () => {
  const method = selected ? "PUT" : "POST";

  if (!form.itemTypeId) {
    alert("Debes seleccionar el tipo de artículo");
    return;
  }

  try {
    console.log(
      "BARCODES ANTES DE GUARDAR:",
      form.barCodes
    );

    // =====================================================
    // 1. CREAR PAYLOAD PRIMERO
    // =====================================================

    const payload = selected
      ? buildUpdatePayload(
          form,
          measurementUnits
        )
      : buildCreatePayload(
          form,
          measurementUnits
        );

    console.log("SELECTED:", selected);
    console.log("PAYLOAD:", payload);

    console.log(
      "PAYLOAD FINAL",
      JSON.stringify(payload, null, 2)
    );

    console.log(
      "TIPO A GUARDAR:",
      form.itemTypeId
    );

    // =====================================================
    // 2. DEFINIR ENDPOINT
    // =====================================================

    const endpoint = selected
      ? `/items/${selected}`
      : `/items`;

    // =====================================================
    // 3. GUARDAR ARTÍCULO
    // =====================================================

    const res = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload)
    });
console.log(
  "STATUS UPDATE:",
  res.status
);

console.log(
  "RESPUESTA UPDATE:",
  await res.clone().text()
);
    if (!res.ok) {
      const err = await res.text();

      console.error(
        "ERROR UPDATE ITEM:",
        err,
        res.status
      );

      alert(err);
      return;
    }

    // =====================================================
    // 4. ACTUALIZAR LISTADO
    // =====================================================

    await getArticulos();

    // =====================================================
    // 5. ACTUALIZAR ITEMS DEL COMBO
    // =====================================================

    if (form.itemTypeId === 2 && form.id) {
      await updateComboItems(
        form.id,
        comboItems
      );
    }

    // =====================================================
    // 6. OBTENER ID DEL ARTÍCULO
    // =====================================================

    const itemId = selected
      ? selected
      : Number(
          res.headers
            .get("location")
            ?.split("/")
            .pop()
        );

    if (!itemId) {
      console.error(
        "No se pudo obtener el ID del artículo"
      );
      return;
    }

    // =====================================================
    // 7. PROMOCIONES
    // =====================================================

    const original =
      form.promotionOriginalId;

    const actual = form.sinPromocion
      ? null
      : (
          form.promotionId
            ? Number(form.promotionId)
            : null
        );

    if (!original && actual) {
      await vincularPromocion(
        actual,
        itemId
      );
    }
    else if (original && !actual) {
      await desvincularPromocion(
        original,
        itemId
      );
    }
    else if (
      original &&
      actual &&
      Number(original) !== Number(actual)
    ) {
      await desvincularPromocion(
        original,
        itemId
      );

      await vincularPromocion(
        actual,
        itemId
      );
    }

    // =====================================================
    // 8. CÓDIGOS DE BARRAS
    // =====================================================

    const actuales =
      form.barCodes || [];

    const originales =
      form.barCodesOriginal || [];

    // Nuevos reales
    const nuevos = actuales.filter(
      b =>
        !b.deleted &&
        !originales.includes(b.value)
    );

    // Eliminados reales
    const eliminados = actuales.filter(
      b =>
        b.deleted &&
        originales.includes(b.value)
    );

    // =====================================================
    // 9. ELIMINAR BARCODES
    // =====================================================

    for (const b of eliminados) {
      await eliminarBarcode(
        itemId,
        b.value
      );
    }

    // =====================================================
    // 10. AGREGAR BARCODES
    // =====================================================

    if (nuevos.length > 0) {
      await guardarBarcodes(
        itemId,
        nuevos
      );
    }

    // =====================================================
    // 11. LIMPIAR / VOLVER A TABLA
    // =====================================================

    setImagenArticulo(null);
    setCategoriaSeleccionada(null);
    setMostrarGaleria(false);
    setView("table");

  } catch (err) {
    console.error(
      "Error guardando item:",
      err
    );
  }
};

  const eliminar = async () => {
    if (!selected) return;

    await apiFetch(`/items/${selected}`, {
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
    const res = await apiFetch(
      `/items/data-for-creation`
    );

    if (!res.ok) {
      console.error("Error obteniendo datos para combos:", res.status);
      return;
    }

    const data = await res.json();


    setClasificaciones(data.classifications || []);
    setProveedores(data.suppliers || []);
    setTaxes(data.taxes || []);
    setMarcas(data.brands || []);
    setCurrencies(data.currencies || []);
    setPromotions(data.promotions || []);
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
    setAvailableLinkedItems(
  data.linkedItems || []
);
  } catch (e) {
    console.error(e);
  }
}, []);

const agregarItemAlCombo = async () => {
  if (!form.id) {
    alert("Primero guardá el artículo principal");
    return;
  }

  const item = availableLinkedItems.find(
    x => x.linkedItemId === Number(nuevoComboItem)
  );

  if (!item) return;

  const res = await apiFetch(`/items/${form.id}/bundles`, {
  method: "POST",
  body: JSON.stringify([
    {
      id: Number(item.linkedItemId),
      quantity: 1
    }
  ])
});

  if (!res.ok) {
    alert(await res.text());
    return;
  }

  setComboItems(prev => [
    ...prev,
    {
      id: item.linkedItemId,
      name: item.linkedItemName,
      price: item.value || 0,
      quantity: 1
    }
  ]);

  setNuevoComboItem("");
};

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

useEffect(() => {
  console.log(
    "BARCODES CAMBIARON:",
    form.barCodes
  );
}, [form.barCodes]);


  // ================= FILTRO =================
const filtrados = articulos.filter(a => {
   console.log(a);
  const q = (filters.texto || "").toLowerCase().trim();

  const matchTexto =
    !q ||
    String(a.id).includes(q) ||
    (a.name || "").toLowerCase().includes(q) ||
    (a.barCode || "").toLowerCase().includes(q) ||
    (a.extraBarCode || "").toLowerCase().includes(q);

  const matchDepto =
    !filters.departamento ||
    String(a.itemCollectionId) === String(filters.departamento);

  const matchSubDepto =
    !filters.subDepartamento ||
    String(a.itemSubCollectionId) === String(filters.subDepartamento);
const matchTipo =
  !filters.tipo ||
  String(a.typeId) === String(filters.tipo);

  const matchClasificacion =
    !filters.clasificacion ||
    String(a.classificationId) === String(filters.clasificacion);

  const matchMarca =
    !filters.marca ||
    String(a.brandId) === String(filters.marca);

  const matchProveedor =
    !filters.proveedor ||
    String(a.supplierId) === String(filters.proveedor);

  return (
    matchTexto &&
    matchDepto &&
    matchSubDepto &&
    matchTipo &&
    matchClasificacion &&
    matchMarca &&
    matchProveedor
  );
});
  return (
  <div className="articulos-container">

    {/* ================= TOOLBAR ================= */}
    <div className="toolbar">

      <div className="tool new" onClick={nuevo}>
        <span className="tool-icon">＋</span>
        <span className="tool-label">Nuevo</span>
      </div>

      <div
        className="tool edit"
        onClick={() => {
          if (!selected) {
            alert("Seleccione un artículo");
            return;
          }

          getItemById(selected);
          getStock(selected);
          setView("form");
        }}
      >
        <span className="tool-icon">✎</span>
        <span className="tool-label">Editar</span>
      </div>

      <div className="tool delete" onClick={eliminar}>
        <span className="tool-icon">🗑</span>
        <span className="tool-label">Eliminar</span>
      </div>

      <div className="tool save" onClick={guardar}>
        <span className="tool-icon">✓</span>
        <span className="tool-label">Guardar</span>
      </div>

      <div
        className="tool exit"
        onClick={() => setSection("home")}
      >
        <span className="tool-icon">↪</span>
        <span className="tool-label">Salir</span>
      </div>

      <div
        className="tool cancel"
        onClick={() => {
          setForm(emptyForm);
          setSelected(null);
          setView("table");
          setTab("basicos");
          setImagenArticulo(null);
          setMostrarGaleria(false);
          setCategoriaSeleccionada(null);
        }}
      >
        <span className="tool-icon">✕</span>
        <span className="tool-label">Cancelar</span>
      </div>
     
{/* ================= BUSCADOR DENTRO DEL TOOLBAR ================= */}

<div className="search-bar-ml">

  <div className="search-box">
    <input
  type="text"
  placeholder="Buscar artículos..."
  value={busquedaActiva}
  onChange={(e) => {
    const valor = e.target.value;

    setBusquedaActiva(valor);

    setFilters(prev => ({
      ...prev,
      texto: valor
    }));
  }}
/>

    {/* BOTÓN FILTROS */}
    <button
  type="button"
   disabled
  className={`btn-filtros ${showFiltersPopup ? "active" : ""}`}
  onClick={() =>
    setShowFiltersPopup(prev => !prev)
  }
  title="Filtros"
  aria-label="Abrir filtros"
>
  <svg
    viewBox="0 0 24 24"
    width="19"
    height="19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6H20L14 13V18L10 20V13L4 6Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>

  </div>
</div>
  {/* ================= POPUP DE FILTROS ================= */}

  {showFiltersPopup && (
    <div className="filters-popup">

      <div className="popup-row">
        <label>Departamento</label>

        <select
          value={filters.departamento}
          onChange={(e) =>
            setFilters(f => ({
              ...f,
              departamento: e.target.value
            }))
          }
        >
          <option value="">Todos</option>

          {departamentos.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>


      <div className="popup-row">
        <label>Subdepartamento</label>

        <select
          value={filters.subDepartamento}
          onChange={(e) =>
            setFilters(f => ({
              ...f,
              subDepartamento: e.target.value
            }))
          }
        >
          <option value="">Todos</option>

          {subDeptos.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>


      <div className="popup-row">
        <label>Proveedor</label>

        <select
          value={filters.proveedor}
          onChange={(e) =>
            setFilters(f => ({
              ...f,
              proveedor: e.target.value
            }))
          }
        >
          <option value="">Todos</option>

          {proveedores.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>


      <div className="popup-row">
        <label>Marca</label>

        <select
          value={filters.marca}
          onChange={(e) =>
            setFilters(f => ({
              ...f,
              marca: e.target.value
            }))
          }
        >
          <option value="">Todas</option>

          {marcas.map(m => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>


      <div className="popup-row">
        <label>Clasificación</label>

        <select
          value={filters.clasificacion}
          onChange={(e) =>
            setFilters(f => ({
              ...f,
              clasificacion: e.target.value
            }))
          }
        >
          <option value="">Todas</option>

          {clasificaciones.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>


      <div className="popup-actions">

        <button
          type="button"
          onClick={() =>
            setFilters({
              texto: "",
              departamento: "",
              subDepartamento: "",
              proveedor: "",
              marca: "",
              clasificacion: "",
              tipo: ""
            })
          }
        >
          Limpiar
        </button>

        <button
          type="button"
          onClick={() =>
            setShowFiltersPopup(false)
          }
        >
          Aplicar
        </button>

      </div>

    </div>
  )}

</div>
      {view === "table" && (
        <>
        <div className="tabla-scroll">
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
        </div>
        <div className="pagination">
<button
  disabled={page === 0}
  onClick={() => setPage(p => Math.max(p - 1, 0))}
>
  ← Anterior
</button>

<span>
  Página {page + 1} de {Math.max(totalPages, page + 1)}
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
            <button onClick={() => setTab("listas")} className={tab === "listas" ? "active" : ""}>Listas/Promos/Imagen</button>
           <button
  onClick={() => setTab("combo")}
  className={tab === "combo" ? "active" : ""}
>
  Combo
</button>
            <button onClick={() => setTab("codigos")} className={tab === "codigos" ? "active" : ""}
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
                <input value={costoConIva} disabled />

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
        

        <div className="otros-box">
  <h3>Artículo Envase</h3>

  {linkedItems.map((l) => (
  <div
    key={l.linkedItemId}
    className="linked-item-row"
  >
    <span className="linked-item-name">
      {l.linkedItemName}
    </span>

    <button
      type="button"
      className="btn-remove-linked"
   onClick={async () => {
  console.log("ITEM ID:", form.id);
  console.log(
    "LINKED ITEM ID:",
    l.linkedItemId
  );

  const res = await eliminarLinkedItem(
    form.id,
    l.linkedItemId
  );

  if (res.ok) {
    setLinkedItems(prev =>
      prev.filter(
        x =>
          x.linkedItemId !==
          l.linkedItemId
      )
    );
  } else {
    alert(
      "No se pudo eliminar el vínculo"
    );
  }
}}

    >
      Quitar
    </button>
  </div>
))}

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "10px"
    }}
  >
    <select
  value={nuevoCodigo}
  onChange={e =>
    setNuevoCodigo(e.target.value)
  }
>
  <option value="">
    Seleccione un artículo
  </option>

  {availableLinkedItems.map(item => (
    <option
      key={item.linkedItemId}
      value={item.linkedItemId}
    >
      {item.linkedItemName}
    </option>
  ))}
</select>

    <button
  type="button"
  className="btn-vincular-envase"
  onClick={async () => {
    if (!form.id) {
      alert(
        "Primero guardá el artículo"
      );
      return;
    }

    const res = await vincularItem(
      form.id,
      nuevoCodigo
    );

    if (!res.ok) {
      await getItemById(form.id);
      alert(
        await res.text()
      );
      return;
    }

    setNuevoCodigo("");
  }}
>
  Vincular Envase
</button>
  </div>
</div>
      </div>

      <div className="otros-box">
  <h3>Suspender ventas</h3>

  <label className="check-row">
    <input
      type="checkbox"
      checked={form.suspendido || false}
      onChange={(e) =>
        setForm({
          ...form,
          suspendido: e.target.checked
        })
      }
    />
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

<div className="promo-row">

  <label className="check-row promo-check">
    <input
  type="checkbox"
  checked={form.sinPromocion}
  onChange={(e) =>
    setForm({
      ...form,
      sinPromocion: e.target.checked,
      promotionId: e.target.checked ? "" : form.promotionId
    })
  }
/>
    Sin promoción
  </label>

  <select
  value={form.promotionId}
  disabled={form.sinPromocion}
  onChange={(e) =>
    setForm({
      ...form,
      promotionId: e.target.value
    })
  }
>
  <option value="">Seleccione una promoción</option>

  {promotions.map((promo) => (
    <option
      key={promo.id}
      value={promo.id}
    >
      {promo.name}
    </option>
  ))}
</select>

</div>
<div className="imagen-articulo-box">

  <h3>Imagen del artículo</h3>

  <div className="preview-container">

    {imagenArticulo ? (
      <>
        <img
  src={
    form.imgPath
      ? encodeURI(`/Articulos/${form.imgPath}`)
      : ""
  }
  alt={form.nombre || "Artículo"}
  className="preview-articulo"
  onError={(e) => {
    console.error("ERROR CARGANDO IMAGEN:", e.currentTarget.src);
  }}
/>

        <button
          type="button"
            disabled
          className="btn-quitar-imagen"
          onClick={() => {
            setImagenArticulo(null);
            setForm(prev => ({
              ...prev,
              imgPath: null
            }));
          }}
        >
          🗑 Quitar
        </button>
      </>
    ) : (
      <div
        className="preview-vacia"
        onClick={() => {
          setMostrarGaleria(true);
          setCategoriaSeleccionada(null);
        }}
        style={{ cursor: "pointer" }}
      >
        <span className="plus">+</span>
        <span className="texto">
          Agregar imagen
        </span>
      </div>
    )}

  </div>

</div>
{mostrarGaleria && (

<div className="modal-imagenes">

<div className="modal-contenido">

<h3>Seleccionar imagen</h3>


<div className="galeria">

  {!categoriaSeleccionada ? (

    Object.keys(articulosImagenes).map((categoria) => (

      <div
        key={categoria}
        className="carpeta-item"
        onClick={() => setCategoriaSeleccionada(categoria)}
      >
        <div className="carpeta-icono">📁</div>
        <span>{categoria}</span>
      </div>

    ))

  ) : (

    <>
      <button
        className="volver-categoria"
        onClick={() => setCategoriaSeleccionada(null)}
      >
        ⬅ Volver
      </button>

      {articulosImagenes[categoriaSeleccionada].map((img) => (

        <div
          key={img}
          className="imagen-item"
          onClick={() => {
  setImagenArticulo(img);

  setForm(prev => ({
    ...prev,
     imgPath: img
  }));

  setMostrarGaleria(false);
  setCategoriaSeleccionada(null);
}}
        >

          <img
            src={`/Articulos/${encodeURI(img)}`}
            alt={img}
          />

          <span>{img.split("/").pop()}</span>

        </div>

      ))}

    </>

  )}

</div>


<button
className="cerrar-modal"
onClick={()=>setMostrarGaleria(false)}
>
Cerrar
</button>


</div>

</div>

)}
</div>
</div>
)}
{tab === "codigos" && (
  <div className="codigos-container">

    <div className="codigos-box">

      <h3> códigos de barra extra</h3>

      <div className="codigo-add-row">

        <input
  type="text"
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
  detail: "Adicional",
  deleted: false
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
    <tr
  key={index}
  className={b.deleted ? "barcode-deleted" : ""}
>

      <td>
        <input type="radio" readOnly />
      </td>

      <td>{b.value}</td>

      <td>{b.detail}</td>

      <td>

      {!b.deleted ? (
  <button
    type="button"
    className="btn-codigo eliminar"
    onClick={() => {
      setForm(prev => ({
        ...prev,
        barCodes: prev.barCodes.map((bc, i) =>
          i === index
            ? { ...bc, deleted: true }
            : bc
        )
      }));
    }}
  >
    Eliminar
  </button>
) : (
  <button
    type="button"
    className="btn-codigo restaurar"
    onClick={() => {
      setForm(prev => ({
        ...prev,
        barCodes: prev.barCodes.map((bc, i) =>
          i === index
            ? { ...bc, deleted: false }
            : bc
        )
      }));
    }}
  >
    Restaurar
  </button>
)}

      </td>

    </tr>
  ))}

</tbody>

      </table>

      <div className="codigo-info">
        <div className="codigo-info">
  Total de códigos: {form.barCodes.length}
  {form.barCodes.some(b => b.deleted) && (
  <div className="codigo-delete-warning">
    ⚠ Los códigos tachados serán eliminados al guardar.
  </div>
)}
</div>
      </div>

    </div>

  </div>
)}

        {tab === "combo" && (
  <div className="combo-container">

    <div className="combo-title">
      {form.nombre}
    </div>

    <table className="combo-table">

      <thead>
        <tr>
          <th>Código</th>
          <th>Cantidad</th>
          <th>Artículo</th>
          <th>Valor</th>
        </tr>
      </thead>

      <tbody>

        {comboItems.map((item) => (

          <tr key={item.id}>

            <td>{item.id}</td>

            <td>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {

                  const qty = Number(e.target.value);

                  setComboItems(prev =>
                    prev.map(x =>
                      x.id === item.id
                        ? {
                            ...x,
                            quantity: qty
                          }
                        : x
                    )
                  );
                }}
              />
            </td>

            <td>{item.name}</td>

            <td>
              $
              {(item.price * item.quantity).toFixed(2)}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
)}
  </div>
)}
</div>
  );
}
