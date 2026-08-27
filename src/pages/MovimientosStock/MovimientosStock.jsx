import { useEffect, useState } from "react";
import "./MovimientosStock.css";
import { apiFetch } from "../../services/api";

const TIPOS_MOVIMIENTO = {
  INGRESO: "STOCK_IN",
  EGRESO: "STOCK_OUT",
  AJUSTE: "ADJUSTMENT",
  TRANSFERENCIA: "TRANSFER"
};

const MENSAJES_ERROR = {
  BRANCHS_ARE_THE_SAME_EXCEPTION:
    "La sucursal de origen y destino no pueden ser iguales.",

  STOCK_IS_NEGATIVE:
    "La operación dejaría el stock en negativo.",

  ITEM_NOT_FOUND:
    "El artículo no existe.",

  BRANCH_NOT_FOUND:
    "La sucursal indicada no existe.",

  ADJUST_QUANTITY_AND_STOCK_ARE_EQUAL_EXCEPTION:
    "El ajuste es igual al stock actual."
};

const MovimientosStock = ({ setSection }) => {
  const [tipoMovimiento, setTipoMovimiento] = useState("INGRESO");

  const [sucursales, setSucursales] = useState([]);
  const [sucursal, setSucursal] = useState("");
  const [sucursalDestino, setSucursalDestino] = useState("");

  const [articulo, setArticulo] = useState(null);
  const [buscar, setBuscar] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

  const [stocksArticulo, setStocksArticulo] = useState([]);

  const [cantidad, setCantidad] = useState(0);
  const [ajuste, setAjuste] = useState(0);

  const [movimientos, setMovimientos] = useState([]);

  const [cargandoSucursales, setCargandoSucursales] = useState(false);
  const [buscandoArticulo, setBuscandoArticulo] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [erroresBackend, setErroresBackend] = useState([]);

  /* =========================================================
     CARGAR SUCURSALES
  ========================================================= */

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    try {
      setCargandoSucursales(true);

      const res = await apiFetch("/branch/for-stock-movements");

      if (!res.ok) {
        throw new Error(
          `Error al cargar sucursales: ${res.status}`
        );
      }

      const data = await res.json();

      setSucursales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando sucursales:", error);
    } finally {
      setCargandoSucursales(false);
    }
  };

  /* =========================================================
     OBTENER STOCK DE ARTÍCULO
  ========================================================= */

  const cargarStockArticulo = async (itemId) => {
    try {
      const res = await apiFetch(
        `/items/stocks/for-movements?id=${itemId}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Artículo no encontrado.");
        }

        throw new Error(
          `Error consultando stock: ${res.status}`
        );
      }

      const data = await res.json();

      setStocksArticulo(Array.isArray(data) ? data : []);

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error obteniendo stock:", error);
      setStocksArticulo([]);
      return [];
    }
  };

  /* =========================================================
     BUSCAR ARTÍCULO POR NOMBRE O ID
  ========================================================= */

  const buscarArticulo = async () => {
    const texto = buscar.trim();

    if (!texto) {
      setResultadosBusqueda([]);
      return;
    }

    try {
      setBuscandoArticulo(true);
      setErroresBackend([]);

      const esId = /^\d+$/.test(texto);

const parametro = esId
  ? `id=${encodeURIComponent(texto)}`
  : `name=${encodeURIComponent(texto)}`;

const res = await apiFetch(
  `/items/stocks/for-movements?${parametro}`
);

      if (!res.ok) {
        throw new Error(
          `Error buscando artículo: ${res.status}`
        );
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setResultadosBusqueda([]);
        setArticulo(null);
        setStocksArticulo([]);
        return;
      }

      /*
       * El endpoint devuelve un registro por sucursal.
       * Por eso agrupamos por itemId para no mostrar
       * el mismo artículo varias veces.
       */
      const unicos = [];

      data.forEach((item) => {
        const existe = unicos.some(
          (x) => x.itemId === item.itemId
        );

        if (!existe) {
          unicos.push(item);
        }
      });

      setResultadosBusqueda(unicos);
    } catch (error) {
      console.error("Error buscando artículo:", error);
      setResultadosBusqueda([]);
    } finally {
      setBuscandoArticulo(false);
    }
  };

  /* =========================================================
     SELECCIONAR ARTÍCULO
  ========================================================= */

  const seleccionarArticulo = async (item) => {
  setArticulo({
    id: item.itemId,
    name: item.itemName
  });

  setResultadosBusqueda([]);

  await cargarStockArticulo(item.itemId);
};
  /* =========================================================
     STOCK ACTUAL SEGÚN SUCURSAL
  ========================================================= */

  const obtenerStockSucursal = (branchId) => {
    if (!branchId) return 0;

    const encontrado = stocksArticulo.find(
      (stock) => Number(stock.branchId) === Number(branchId)
    );

    return encontrado ? Number(encontrado.stock) : 0;
  };

  const stockActualOrigen = obtenerStockSucursal(sucursal);

  const stockActualDestino = obtenerStockSucursal(
    sucursalDestino
  );

  /* =========================================================
    NUEVO STOCK
  ========================================================= */

  const calcularNuevoStock = () => {
    const actual = Number(stockActualOrigen);
    const cant = Number(cantidad);

    if (tipoMovimiento === "INGRESO") {
      return actual + cant;
    }

    if (tipoMovimiento === "EGRESO") {
      return actual - cant;
    }

    if (tipoMovimiento === "AJUSTE") {
  return actual + Number(ajuste);
}

    return actual;
  };

  const stockNuevo = calcularNuevoStock();

  const stockNuevoDestino =
    tipoMovimiento === "TRANSFERENCIA"
      ? Number(stockActualDestino) + Number(cantidad)
      : stockActualDestino;
      const obtenerAjusteVisual = () => {
  if (tipoMovimiento === "INGRESO") {
    return `+${Number(cantidad)}`;
  }

  if (tipoMovimiento === "EGRESO") {
    return `-${Number(cantidad)}`;
  }

  if (tipoMovimiento === "AJUSTE") {
    const valor = Number(ajuste);

    if (valor > 0) {
      return `+${valor}`;
    }

    return `${valor}`;
  }

  if (tipoMovimiento === "TRANSFERENCIA") {
    return `-${Number(cantidad)}`;
  }

  return "0";
};

  /* =========================================================
     CAMBIO DE TIPO
  ========================================================= */

  const cambiarTipoMovimiento = (nuevoTipo) => {
    setTipoMovimiento(nuevoTipo);

    setCantidad(0);
    setAjuste(0);
    setSucursal("");
    setSucursalDestino("");
    setErroresBackend([]);
  };

  /* =========================================================
     AGREGAR MOVIMIENTO A LA TABLA
  ========================================================= */

  const agregarMovimiento = () => {
    setErroresBackend([]);

    if (!articulo) {
      alert("Primero seleccioná un artículo.");
      return;
    }

    if (!sucursal) {
      alert("Seleccioná una sucursal.");
      return;
    }

    if (
      tipoMovimiento === "TRANSFERENCIA" &&
      !sucursalDestino
    ) {
      alert("Seleccioná una sucursal de destino.");
      return;
    }

    if (
      tipoMovimiento === "TRANSFERENCIA" &&
      Number(sucursal) === Number(sucursalDestino)
    ) {
      alert(
        "La sucursal de salida y la de destino no pueden ser iguales."
      );
      return;
    }

    if (tipoMovimiento !== "AJUSTE" && Number(cantidad) <= 0) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }


    const nuevoMovimiento = {
      sucursal,
      sucursalDestino:
        tipoMovimiento === "TRANSFERENCIA"
          ? sucursalDestino
          : null,

      codigo: articulo.id,
      articulo: articulo.name,

      ingreso: tipoMovimiento,

      cantidad:
        tipoMovimiento === "AJUSTE"
          ? Number(ajuste)
          : Number(cantidad),

      stockActual: stockActualOrigen,

      nuevoStock:
        tipoMovimiento === "TRANSFERENCIA"
          ? stockActualOrigen - Number(cantidad)
          : stockNuevo,

      stockDestino:
        tipoMovimiento === "TRANSFERENCIA"
          ? stockActualDestino
          : null,

      nuevoStockDestino:
        tipoMovimiento === "TRANSFERENCIA"
          ? stockNuevoDestino
          : null
    };

    setMovimientos((prev) => [
      ...prev,
      nuevoMovimiento
    ]);

    setCantidad(0);
    setAjuste(0);
    setBuscar("");
    setArticulo(null);
    setStocksArticulo([]);
    setResultadosBusqueda([]);
  };

  /* =========================================================
     ELIMINAR MOVIMIENTO
  ========================================================= */

  const eliminarMovimiento = (index) => {
    setMovimientos((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =========================================================
     LIMPIAR FORMULARIO
  ========================================================= */

  const cancelar = () => {
    setCantidad(0);
    setAjuste(0);
    setBuscar("");
    setArticulo(null);
    setStocksArticulo([]);
    setResultadosBusqueda([]);
    setSucursal("");
    setSucursalDestino("");
    setErroresBackend([]);
  };

  /* =========================================================
     GUARDAR MOVIMIENTOS
  ========================================================= */

 const guardar = async () => {
  if (movimientos.length === 0) {
    alert("No hay movimientos para guardar.");
    return;
  }

  try {
    setGuardando(true);
    setErroresBackend([]);

    // ==========================================
    // TIPO DEL MOVIMIENTO
    // ==========================================

    const type = TIPOS_MOVIMIENTO[tipoMovimiento];

    if (!type) {
      alert("Tipo de movimiento inválido.");
      return;
    }

    // ==========================================
    // ARMAR MAP RESPETANDO EL ORDEN
    // ==========================================

    const mapaMovimientos = new Map();

    movimientos.forEach((movimiento, index) => {
      const movimientoBackend = {
        itemId: Number(movimiento.codigo),
        quantity: String(movimiento.cantidad),
        fromBranch: Number(movimiento.sucursal)
      };

      // Solo TRANSFER necesita toBranch
      if (tipoMovimiento === "TRANSFERENCIA") {
        movimientoBackend.toBranch = Number(
          movimiento.sucursalDestino
        );
      }

      mapaMovimientos.set(
        index + 1,
        movimientoBackend
      );
    });

    // ==========================================
    // CONVERTIR MAP A OBJETO
    // ==========================================

    const body = {
  type,
  movements: Object.fromEntries(mapaMovimientos)
};

    // ==========================================
    // DEBUG
    // ==========================================

    console.log("================================");
    console.log("TIPO FRONT:", tipoMovimiento);
    console.log("TYPE BACKEND:", type);
    console.log("MAP:", mapaMovimientos);
    console.log("BODY:", body);
    console.log("JSON:", JSON.stringify(body));
    console.log("================================");

    // ==========================================
    // POST
    // ==========================================

    const res = await apiFetch(
  `/stock-movements`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }
);

    console.log("STATUS:", res.status);

    const responseText = await res.text();

    console.log("RESPONSE:", responseText);

    // ==========================================
    // 204 OK
    // ==========================================

    if (res.status === 204) {
      alert("Movimientos guardados correctamente.");

      setMovimientos([]);
      cancelar();

      return;
    }

    // ==========================================
    // LEER ERRORES
    // ==========================================

    let errores = [];

    if (responseText) {
      try {
        errores = JSON.parse(responseText);
      } catch {
        errores = [];
      }
    }

    // ==========================================
    // 207 PARCIAL
    // ==========================================

    if (res.status === 207) {
      setErroresBackend(
        Array.isArray(errores)
          ? errores
          : []
      );

      alert(
        "Algunos movimientos se guardaron y otros tuvieron errores."
      );

      const indicesFallidos = new Set(
        (Array.isArray(errores)
          ? errores
          : []
        ).map(
          (error) => Number(error.index)
        )
      );

      // Mantener solamente los movimientos que fallaron
      setMovimientos((prev) =>
        prev.filter((_, index) =>
          indicesFallidos.has(index + 1)
        )
      );

      return;
    }

    // ==========================================
    // 422 ERROR TOTAL
    // ==========================================

    if (res.status === 422) {
      setErroresBackend(
        Array.isArray(errores)
          ? errores
          : []
      );

      alert(
        "No se pudo guardar ninguno de los movimientos."
      );

      return;
    }

    // ==========================================
    // OTROS ERRORES
    // ==========================================

    throw new Error(
      `Error del servidor: ${res.status}${
        responseText
          ? ` - ${responseText}`
          : ""
      }`
    );

  } catch (error) {
    console.error(
      "Error guardando movimientos:",
      error
    );

    alert(
      error.message ||
        "Ocurrió un error al guardar los movimientos."
    );

  } finally {
    setGuardando(false);
  }
};

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="movimientos-stock-container">

      {/* HEADER */}

      <div className="header-stock">
        <h2>Movimientos de stock</h2>

        <div className="acciones">
          <button
            onClick={guardar}
            disabled={
              guardando ||
              movimientos.length === 0
            }
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>

          <button onClick={() => setSection("home")}>
  Salir
</button>
        </div>
      </div>

      {/* FILTROS */}

      <div className="stock-filtros">

        <div className="field">
          <label>Tipo de movimiento</label>

          <select
            value={tipoMovimiento}
              disabled={movimientos.length > 0}
            onChange={(e) =>
              cambiarTipoMovimiento(e.target.value)
            }
          >
            <option value="INGRESO">
              Ingreso
            </option>

            <option value="EGRESO">
              Egreso
            </option>

            <option value="AJUSTE">
              Ajuste
            </option>

            <option value="TRANSFERENCIA">
              Transferencia
            </option>
          </select>
        </div>

        {tipoMovimiento === "TRANSFERENCIA" ? (
          <>
            <div className="field">
              <label>Sucursal de salida</label>

              <select
                value={sucursal}
                  disabled={movimientos.length > 0}
                onChange={(e) =>
                  setSucursal(e.target.value)
                }
              >
                <option value="">
                  Seleccionar
                </option>

                {sucursales.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>
                Enviar a sucursal o depósito
              </label>

              <select
                value={sucursalDestino}
                  disabled={movimientos.length > 0}
                onChange={(e) =>
                  setSucursalDestino(e.target.value)
                }
              >
                <option value="">
                  Seleccionar
                </option>

                {sucursales.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="field">
            <label>Sucursal o depósito</label>

            <select
              value={sucursal}
                disabled={movimientos.length > 0}
              onChange={(e) =>
                setSucursal(e.target.value)
              }
            >
              <option value="">
                {cargandoSucursales
                  ? "Cargando..."
                  : "Seleccionar"}
              </option>

              {sucursales.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* DETALLE */}

      <div className="detalle-stock">

        {/* HEADER */}

        <div className="detalle-header">
          <span>Artículo</span>
          <span>Sucursal</span>
          <span>Actual</span>
          <span>Cantidad</span>
          <span>Ajuste</span>
          <span>Nuevo</span>
        </div>

        {/* ORIGEN */}

        <div className="detalle-row origen">

          {/* ARTÍCULO */}

          <div className="articulo-col">

            <div className="search-box">

              <input
                placeholder="Buscar artículo..."
                value={buscar}
                onChange={(e) =>
                  setBuscar(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    buscarArticulo();
                  }
                }}
              />

              <button
                className="search-btn"
                onClick={buscarArticulo}
                disabled={buscandoArticulo}
              >
                {buscandoArticulo ? "..." : "🔍"}
              </button>

            </div>

            {/* RESULTADOS */}

            {resultadosBusqueda.length > 0 && (
              <div className="resultados-articulos">

                {resultadosBusqueda.map((item) => (
                  <button
                    type="button"
                    key={item.itemId}
                    onClick={() =>
                      seleccionarArticulo(item)
                    }
                  >
                    <strong>
                      {item.itemName}
                    </strong>

                    <small>
                      Código: {item.itemId}
                    </small>
                  </button>
                ))}

              </div>
            )}

            <input
              value={articulo?.name || ""}
              placeholder="Descripción del artículo"
              readOnly
            />

            <span className="badge origen">
              ORIGEN
            </span>

          </div>

          {/* SUCURSAL */}

          <div className="sucursal-col">

            <label>Origen</label>

            <select
              value={sucursal}
              disabled={movimientos.length > 0}
              onChange={(e) =>
                setSucursal(e.target.value)
              }
            >
              <option value="">
                Seleccionar
              </option>

              {sucursales.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                </option>
              ))}
            </select>

          </div>

          {/* ACTUAL */}

          <div className="valor-card">
            <strong>
              {stockActualOrigen}
            </strong>

            <span>unidades</span>
          </div>

          {/* CANTIDAD */}

          <div className="cantidad-card">

            <input
              type="number"
              min="0"
              value={cantidad}
              disabled={
                tipoMovimiento === "AJUSTE"
              }
              onChange={(e) =>
                setCantidad(e.target.value)
              }
            />

          </div>


       {/* AJUSTE */}
<div className="valor-card">

  <strong>
    {obtenerAjusteVisual()}
  </strong>

</div>

          {/* NUEVO */}

          <div className="valor-card success">

            <strong>
              {stockNuevo}
            </strong>

            <span>unidades</span>

          </div>

        </div>

        {/* DESTINO */}

        {tipoMovimiento === "TRANSFERENCIA" && (

          <div className="detalle-row destino">

            {/* ARTÍCULO */}

            <div className="articulo-col">

              <div className="search-box">

                <input
                  value={articulo?.name || ""}
                  readOnly
                />

              </div>

              <input
                value={articulo?.name || ""}
                placeholder="Descripción del artículo"
                readOnly
              />

              <span className="badge destino">
                DESTINO
              </span>

            </div>

            {/* SUCURSAL DESTINO */}

            <div className="sucursal-col">

              <label>Destino</label>

              <select
                value={sucursalDestino}
                onChange={(e) =>
                  setSucursalDestino(e.target.value)
                }
              >
                <option value="">
                  Seleccionar
                </option>

                {sucursales.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </option>
                ))}
              </select>

              </div>

            {/* STOCK DESTINO */}

            <div className="valor-card">

              <strong>
                {stockActualDestino}
              </strong>

              <span>unidades</span>

            </div>

            {/* ESPACIO */}

            <div className="cantidad-placeholder" />

            {/* AJUSTE */}

            <div className="valor-card">

              <strong>
                {ajuste}
              </strong>

            </div>

            {/* NUEVO DESTINO */}

            <div className="valor-card success">

              <strong>
                {stockNuevoDestino}
              </strong>

              <span>unidades</span>

            </div>

          </div>

        )}

      </div>

      {/* BOTONES */}

      <div className="botones-stock">

        <button
          onClick={agregarMovimiento}
        >
          Ingresar
        </button>

        <button
          onClick={cancelar}
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            if (movimientos.length === 0) return;

            setMovimientos((prev) =>
              prev.slice(0, -1)
            );
          }}
        >
          Eliminar
        </button>

      </div>

      {/* ERRORES BACKEND */}

      {erroresBackend.length > 0 && (

        <div className="errores-stock">

          <h4>
            Movimientos con error
          </h4>

          {erroresBackend.map(
            (error, index) => (

              <div
                className="error-stock"
                key={`${error.index}-${index}`}
              >

                <strong>
                  Movimiento #{error.index}
                </strong>

                <span>
                  {MENSAJES_ERROR[error.code] ||
                    error.code}
                </span>

                {error.info && (
                  <small>
                    {String(error.info)}
                  </small>
                )}

              </div>

            )
          )}

        </div>

      )}

      {/* TABLA */}

      <div className="tabla-wrapper">

        <table className="tabla-stock">

          <thead>

            <tr>
              <th>Suc</th>
              <th>Cód.</th>
              <th>Artículo</th>
              <th>Movimiento</th>
              <th>Cant. Mov.</th>
              <th>Nuevo stock</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {movimientos.map(
              (m, index) => (

                <tr key={index}>

                  <td>
                    {m.sucursal}

                    {m.sucursalDestino
                      ? ` → ${m.sucursalDestino}`
                      : ""}
                  </td>

                  <td>
                    {m.codigo}
                  </td>

                  <td>
                    {m.articulo}
                  </td>

                  <td>
                    {m.ingreso}
                  </td>

                  <td>
                    {m.cantidad}
                  </td>

                  <td>
                    {m.nuevoStock}

                    {m.sucursalDestino && (
                      <>
                        {" → "}
                        {m.nuevoStockDestino}
                      </>
                    )}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        eliminarMovimiento(index)
                      }
                    >
                      ×
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default MovimientosStock;