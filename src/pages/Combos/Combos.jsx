import { FaPlusCircle, FaSearch} from "react-icons/fa";
import "./Combos.css";
import { apiFetch } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useMemo, useEffect, Fragment } from "react";

export default function Combos() {
  // =========================
  // ESTADOS
  // =========================
  const [modo, setModo] = useState("ver");
const [comboId, setComboId] = useState(null);
  const [combo, setCombo] = useState({
    id: null,
    codigo: "",
    nombre: "",
    precioFinal: 0,
  });
  const { t } = useLanguage();
  const [itemsOriginales, setItemsOriginales] = useState([]);
const [modoEdicion, setModoEdicion] = useState(false);
  const [articulo, setArticulo] = useState({
    id: "",
    nombre: "",
    precio: 0,
    cantidad: 1,
  });
const [itemsIniciales, setItemsIniciales] = useState([]);
  const [items, setItems] = useState([]);
  const [combos, setCombos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
const [comboSeleccionado, setComboSeleccionado] = useState(null);
  // =========================
  // TOTAL COMBO
  // =========================
  const totalCombo = useMemo(() => {
    return items.reduce((acc, item) => acc + item.total, 0);
  }, [items]);

  // =========================
  // CARGAR COMBOS
  // =========================
  const cargarCombos = async () => {
    try {
      const res = await apiFetch("/items/bundles");
      if (!res.ok) return;

      const data = await res.json();

      const list = data.content || [];

      setCombos(
        list.map((c) => ({
          id: c.id ?? c.itemId,
          name: c.name,
          price: c.price,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // BUSCAR ARTICULO
  // =========================
  const buscarArticulo = async () => {
    if (!articulo.id) return;

    try {
      const res = await apiFetch(
  `/items/resume-for-bundle?id=${articulo.id}`
);

      if (!res.ok) {
        alert(t("combos.articleNotFound"));
        return;
      }

      const data = await res.json();

      setArticulo((prev) => ({
        ...prev,
        id: data.id,
        nombre: data.name,
        precio: data.price,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // BUSCAR COMBO
  // =========================
  const buscarCombo = async (codigo) => {
  try {
    const resItem = await apiFetch(`/items/${codigo}`);

    if (!resItem.ok) {
      alert(t("combos.comboNotFound"));
      return;
    }

    const data = await resItem.json();

    setComboId(data.item.id);

    setCombo({
      id: data.item.id,
      codigo: data.item.barcode,
      nombre: data.item.name,
      precioFinal: data.item.price,
    });

    

    const resItems = await apiFetch(
  `/items/bundles/${data.item.id}`
);

    if (resItems.ok) {
      const itemsData = await resItems.json();

      const cargados = itemsData.map((i) => ({
  id: i.id,
  nombre: i.name,
  precio: i.price,
  cantidad: i.quantity,
  total: i.price * i.quantity,
}));

setItems(cargados);

setItemsIniciales(
  structuredClone(cargados)
);

    } else {
      setItems([]);
    }
  } catch (err) {
    console.error(err);
  }
};

  // =========================
  // AGREGAR ARTICULO
  // =========================
  const handleAgregarArticulo = () => {
    if (!articulo.id) return;

    setItems((prev) => [
      ...prev,
      {
        id: articulo.id,
        nombre: articulo.nombre,
        precio: Number(articulo.precio),
        cantidad: Number(articulo.cantidad),
        total: Number(articulo.precio) * Number(articulo.cantidad),
      },
    ]);

    setArticulo({
      id: "",
      nombre: "",
      precio: 0,
      cantidad: 1,
    });
  };

  // =========================
  // NUEVO
  // =========================
  const handleNuevo = () => {
  setCombo({ id: null, codigo: "", nombre: "", precioFinal: 0 });
  setItems([]);
  setModo("nuevo");
  setModoEdicion(true); // 👈 importante
  setComboSeleccionado(null);
setSelectedItems([]);
setItemsIniciales([]);
};
  // =========================
  // CANCELAR
  // =========================
  const handleCancelar = () => {
  setComboSeleccionado(null);

  setComboId(null);

  setCombo({
    id: null,
    codigo: "",
    nombre: "",
    precioFinal: 0,
  });

  setItems([]);
  setItemsIniciales([]);
  setSelectedItems([]);

  setModo("ver");
  setModoEdicion(false);
};
  // =========================
  // Editar
  // =========================
const handleEditar = () => {
  if (!comboSeleccionado) {
    alert(t("combos.selectCombo"));
    return;
  }

  setModo("editar");
  setModoEdicion(true);
};
  // =========================
  // GUARDAR
  // =========================
  const handleGuardar = async () => {
  console.log("COMBO:", combo);
  console.log("COMBO ID:", combo.id);
  console.log("comboId:", comboId);
  console.log("ITEMS:", items);
  console.log("ITEMS INICIALES:", itemsIniciales);
console.log("ITEMS ACTUALES:", items);


  const id = combo.id ?? comboId;

  if (!id) {
    alert(t("combos.selectCombo"));
    return;
  }

  const nuevos = items.filter(
  item => !itemsIniciales.some(
    original => Number(original.id) === Number(item.id)
  )
);

const payload = nuevos.map(item => ({
  id: Number(item.id),
  quantity: Number(item.cantidad)
}));

console.log("PAYLOAD QUE ENVIO:", payload);

  const res = await apiFetch(`/items/${id}/bundles`, {
  method: "POST",
  body: JSON.stringify(payload),
});

  if (res.status === 204) {
    alert(t("combos.comboSaved"));
    setModo("ver");
    setModoEdicion(false);
  } else {
    console.log(await res.json());
  }
};
// =========================
  // ELiminar
  // =========================
const handleEliminarCombo = async () => {
  const id = comboSeleccionado ?? combo.id ?? comboId;

  if (!id) {
    alert(t("combos.selectCombo"));
    return;
  }

  if (!window.confirm(t("combos.confirmDeleteCombo"))) return;

  try {
    const res = await apiFetch(`/items/${id}/bundles`, {
  method: "DELETE",
});

    if (res.status === 204) {
      alert(t("combos.comboDeleted"));

      setCombo({
        id: null,
        codigo: "",
        nombre: "",
        precioFinal: 0,
      });

      setItems([]);
      setComboId(null);
      setModo("ver");

      cargarCombos();
    } else {
      console.log(await res.json());
    }
  } catch (err) {
    console.error(err);
  }
  setComboSeleccionado(null);
setSelectedItems([]);
setItemsIniciales([]);
};

// =========================
  // Eliminar Todos los Articulos
  // =========================
  const handleEliminarTodos = async () => {
  const id = combo.id ?? comboId;

  if (!id) {
    alert(t("combos.selectCombo"));
    return;
  }

  if (!window.confirm(t("combos.confirmDeleteItems"))) return;

  try {
    const res = await apiFetch(`/items/${id}/bundles`, {
  method: "DELETE",
});

    if (res.status === 204) {
      alert(t("combos.itemsDeleted"));
      setItems([]);
    } else {
      console.log(await res.json());
    }
  } catch (err) {
    console.error(err);
  }
};
const handleEliminarSeleccionados = async () => {
  const id = combo.id ?? comboId;

  if (!id) {
    alert(t("combos.selectCombo"));
    return;
  }

  if (selectedItems.length === 0) {
    alert(t("combos.selectArticle"));
    return;
  }

  try {
    for (const index of selectedItems) {
      const item = items[index];

      await apiFetch(`/items/${id}/bundles/${item.id}`, {
  method: "DELETE",
});
    }

    alert(t("combos.itemsDeleted"));

    setItems(items.filter((_, i) => !selectedItems.includes(i)));
    setSelectedItems([]);

  } catch (err) {
    console.error(err);
  }
};
  // =========================
  // SALIR
  // =========================
  const handleSalir = () => {
    window.history.back();
  };

  // =========================
  // TOGGLE SELECT
  // =========================
  const toggleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {
    cargarCombos();
  }, []);

  return (
    <div className="combo-container">

  {/* =========================
    TOOLBAR
========================= */}
<div className="toolbar">

  <div
    className="tool nuevo"
    data-icon="＋"
    onClick={handleNuevo}
  >
    <span>{t("common.new")}</span>
  </div>

 <div
  className="tool eliminar delete-wrapper"
  data-icon="🗑"
>
  <div
    className="tool-inner"
    onClick={() => setShowDeleteMenu(p => !p)}
  >
    <span>{t("common.delete")}</span>
  </div>

    {showDeleteMenu && (
      <div className="delete-menu">

        <button
          onClick={() => {
            handleEliminarCombo();
            setShowDeleteMenu(false);
          }}
          disabled={modo !== "ver"}
        >
          <span>−</span>
          {t("combos.deleteCombo")}
        </button>

        <button
          onClick={() => {
            handleEliminarTodos();
            setShowDeleteMenu(false);
          }}
          disabled={modo === "ver"}
        >
          <span>⌫</span>
          {t("combos.deleteAllItems")}
        </button>

        <button
          onClick={() => {
            handleEliminarSeleccionados();
            setShowDeleteMenu(false);
          }}
          disabled={modo === "ver"}
        >
          <span>−</span>
          {t("combos.deleteSelected")}
        </button>

      </div>
    )}
  </div>

  <div
    className="tool modificar"
    data-icon="✎"
    onClick={handleEditar}
  >
    <span>{t("common.edit")}</span>
  </div>

  <div
    className="tool guardar"
    data-icon="✓"
    onClick={handleGuardar}
  >
    <span>{t("common.save")}</span>
  </div>

  <div
    className="tool cancelar"
    data-icon="×"
    onClick={handleCancelar}
  >
    <span>{t("common.cancel")}</span>
  </div>

  <div
    className="tool salir"
    data-icon="↪"
    onClick={handleSalir}
  >
    <span>{t("common.exit")}</span>
  </div>

</div>
{/* =========================
    LISTA DE COMBOS
========================= */}

{combos.length > 0 && modo === "ver" && (
  <div className="seccion">

    <h3>{t("combos.availableCombos")}</h3>

    <div className="combos-lista">

      {/* CABECERA */}
      <div className="combo-lista-header">
        <div>{t("common.id")}</div>
        <div>{t("common.name")}</div>
        <div>{t("articulos.price")}</div>
      </div>

      {/* COMBOS */}
      {combos.map((c) => {
        const id = c.id ?? c.itemId;
        const seleccionado = comboSeleccionado === id;

        return (
          <div
            key={id}
            className={`combo-item ${
              seleccionado ? "combo-item-selected" : ""
            }`}
          >

            {/* FILA PRINCIPAL */}
            <div
              className="combo-row"
              onClick={() => {

  if (seleccionado) {
    setComboSeleccionado(null);
    return;
  }

  setComboSeleccionado(id);
  buscarCombo(id);
}}
            >
              <div>{id}</div>

              <div className="combo-nombre">
                {c.name}
              </div>

              <div>{c.price}</div>
            </div>

            {/* DETALLE */}
            {seleccionado && (modo === "ver" || modo === "editar") && (
              <div className="combo-detalle-expandido">

                <div className="detalle-header">

                  <div>
                    <strong>{combo.nombre}</strong>
                    <span>ID #{combo.id}</span>
                  </div>

                  <div className="detalle-precio">
                    ${combo.precioFinal}
                  </div>

                </div>

                <div className="detalle-items">

                  {items.length === 0 ? (

                    <div className="detalle-vacio">
                      {t("combos.noArticles")}
                    </div>

                  ) : (

                    <>
                      <div className="detalle-items-header">
  <span>{t("common.id")}</span>
  <span>{t("combos.article")}</span>
  <span>{t("articulos.price")}</span>
  <span>{t("combos.quantity")}</span>
  <span>{t("combos.total")}</span>
</div>

                      {items.map((item, index) => (

                      <div className="detalle-item" key={`${item.id}-${index}`}>
  <span>{item.id}</span>

  <span className="item-nombre">
    {item.nombre}
  </span>

  <span>{item.precio}</span>
  <span>{item.cantidad}</span>
  <span>{item.total}</span>
</div>

                      ))}

                    </>

                  )}

                </div>

                <div className="detalle-total">
                  <span>
                    {t("combos.comboTotal")}
                  </span>

                  <strong>
                    ${totalCombo}
                  </strong>
                </div>

              </div>
            )}

          </div>
        );
      })}

    </div>
  </div>
)}
      {/* =========================
          DATOS DEL COMBO
      ========================= */}
      {modo !== "ver" && (
        <div className="seccion">
          <h3>{t("combos.comboData")}</h3>

          <div className="grid-combo">
            <div className="campo articulo">
  <label>{t("common.code")}</label>

  <div className="buscar">
    <input
      value={combo.codigo}
      onChange={(e) =>
        setCombo({
          ...combo,
          codigo: e.target.value,
        })
      }
    />

    <FaSearch
      style={{ cursor: "pointer" }}
      onClick={() => buscarCombo(combo.codigo)}
    />
  </div>
</div>

            <div className="campo">
              <label>{t("combos.comboName")}</label>
              <input
                value={combo.nombre}
                onChange={(e) =>
                  setCombo({
                    ...combo,
                    nombre: e.target.value,
                  })
                }
              />
            </div>

            <div className="campo">
              <label>{t("combos.finalPrice")}</label>
              <input
                value={combo.precioFinal || totalCombo}
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================
          AGREGAR ARTICULO
      ========================= */}
      {modo !== "ver" && (
        <div className="seccion">
          <h3>{t("combos.addArticle")}</h3>

          <div className="grid-articulo">

            <div className="campo articulo">
              <label>{t("common.id")}</label>
              <div className="buscar">
                <input
                  value={articulo.id}
                  onChange={(e) =>
                    setArticulo({
                      ...articulo,
                      id: e.target.value,
                    })
                  }
                />
                <FaSearch
  style={{ cursor: "pointer" }}
  onClick={buscarArticulo}
/>
              </div>
            </div>

            <div className="campo">
              <label>{t("combos.article")}</label>
              <input value={articulo.nombre} readOnly />
            </div>

            <div className="campo">
              <label>{t("articulos.price")}</label>
              <input value={articulo.precio} readOnly />
            </div>

            <div className="campo">
              <label>{t("combos.quantity")}</label>
              <input
                type="number"
                value={articulo.cantidad}
                onChange={(e) =>
                  setArticulo({
                    ...articulo,
                    cantidad: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btnAgregar"
              onClick={handleAgregarArticulo}
            >
              <FaPlusCircle /> {t("combos.add")}
            </button>

          </div>
        </div>
      )}
      {modo === "editar" && (
  <div className="seccion">
    <h3>{t("combos.comboDetail")}</h3>

<div className="tabla-scroll">
    <table className="tabla">
      <thead>
        <tr>
          <th></th>
          <th>{t("common.id")}</th>
          <th>{t("combos.article")}</th>
          <th>{t("articulos.price")}</th>
          <th>{t("combos.quantity")}</th>
          <th>{t("combos.total")}</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, index) => (
          <tr key={item.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedItems.includes(index)}
                onChange={() => toggleSelect(index)}
              />
            </td>

            <td>{item.id}</td>
            <td>{item.nombre}</td>
            <td>{item.precio}</td>
            <td>{item.cantidad}</td>
            <td>{item.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
</div>

    <div className="total">
      {t("combos.comboTotal")}: <strong>${totalCombo}</strong>
    </div>
  </div>
)}
    </div>
  );
}