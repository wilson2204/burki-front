import { useCallback, useEffect, useState } from "react";
import "./Balanzas.css";
import { apiFetch } from "../../services/api";

/* =========================================================
   ENDPOINTS
========================================================= */

const API_BALANZAS = "/weighing-scales";
const API_SUCURSALES = "/branch/for-stock-movements";

/* =========================================================
   FORMULARIO INICIAL
========================================================= */

const formularioInicial = {
  nombre: "",
  banderaCodigo: "",
  tipoDatoEtiqueta: "",
  digitosCodigo: "",
  digitosPrecio: "",
  decimales: "",
  branchId: "",
};

/* =========================================================
   HELPERS
========================================================= */

const obtenerIdBalanza = (balanza) => {
  return balanza?.id ?? null;
};

const obtenerNombreBalanza = (balanza) => {
  return balanza?.name ?? "";
};

const obtenerNombreSucursal = (branchId, sucursales) => {
  const sucursal = sucursales.find(
    (item) => String(item.id) === String(branchId)
  );

  return sucursal?.name ?? `Sucursal ${branchId ?? ""}`;
};

/* =========================================================
   COMPONENTE
========================================================= */

export default function Balanzas({ setSection }) {
  /* =======================================================
     ESTADOS
  ======================================================= */

  const [modo, setModo] = useState("tabla");

  const [balanzas, setBalanzas] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const [seleccionada, setSeleccionada] = useState(null);

  const [form, setForm] = useState({
    ...formularioInicial,
  });

  const [cargando, setCargando] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [cargandoSucursales, setCargandoSucursales] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  /* =======================================================
     MENSAJES
  ======================================================= */

  const limpiarMensajes = useCallback(() => {
    setError("");
    setMensaje("");
  }, []);

  /* =======================================================
     OBTENER MENSAJE DE ERROR
  ======================================================= */

  const obtenerMensajeError = async (
    response,
    mensajeDefault
  ) => {
    try {
      const data = await response.json();

      return (
        data?.message ||
        data?.error ||
        data?.detail ||
        data?.description ||
        data?.title ||
        mensajeDefault
      );
    } catch {
      return mensajeDefault;
    }
  };

  /* =======================================================
     CARGAR BALANZAS
  ======================================================= */

  const cargarBalanzas = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const response = await apiFetch(API_BALANZAS, {
        method: "GET",
      });

      if (!response.ok) {
        const mensajeError = await obtenerMensajeError(
          response,
          "No se pudieron cargar las balanzas."
        );

        throw new Error(mensajeError);
      }

      const data = await response.json();

      setBalanzas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando balanzas:", err);

      setError(
        err?.message ||
          "No se pudieron cargar las balanzas."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  /* =======================================================
     CARGAR SUCURSALES
  ======================================================= */

  const cargarSucursales = useCallback(async () => {
    try {
      setCargandoSucursales(true);

      const response = await apiFetch(API_SUCURSALES, {
        method: "GET",
      });

      if (!response.ok) {
        const mensajeError = await obtenerMensajeError(
          response,
          "No se pudieron cargar las sucursales."
        );

        throw new Error(mensajeError);
      }

      const data = await response.json();

      setSucursales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Error cargando sucursales:",
        err
      );

      setError(
        err?.message ||
          "No se pudieron cargar las sucursales."
      );
    } finally {
      setCargandoSucursales(false);
    }
  }, []);

  /* =======================================================
     CARGA INICIAL
  ======================================================= */

  useEffect(() => {
    cargarBalanzas();
    cargarSucursales();
  }, [cargarBalanzas, cargarSucursales]);

  /* =======================================================
     RESET FORMULARIO
  ======================================================= */

  const limpiarFormulario = () => {
    setForm({
      ...formularioInicial,
    });
  };

  /* =======================================================
     CARGAR DETALLE DE BALANZA
  ======================================================= */

  const obtenerDetalleBalanza = async (id) => {
    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      throw new Error(
        "No se pudo identificar la balanza."
      );
    }

    const response = await apiFetch(
      `${API_BALANZAS}/${encodeURIComponent(id)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const mensajeError = await obtenerMensajeError(
        response,
        "No se pudo obtener la información de la balanza."
      );

      throw new Error(mensajeError);
    }

    return await response.json();
  };

  /* =======================================================
     CARGAR DETALLE EN FORMULARIO
  ======================================================= */

  const cargarBalanzaEnFormulario = (balanza) => {
    if (!balanza) return;

    setForm({
      nombre: balanza.name ?? "",

      banderaCodigo:
        balanza.flag ?? "",

      tipoDatoEtiqueta:
        balanza.dataType ?? "",

      digitosCodigo:
        balanza.codeLength !== undefined &&
        balanza.codeLength !== null
          ? String(balanza.codeLength)
          : "",

      digitosPrecio:
        balanza.dataTypeLength !== undefined &&
        balanza.dataTypeLength !== null
          ? String(balanza.dataTypeLength)
          : "",

      decimales:
        balanza.decimalQuantity !== undefined &&
        balanza.decimalQuantity !== null
          ? String(balanza.decimalQuantity)
          : "",

      branchId:
        balanza.branchId !== undefined &&
        balanza.branchId !== null
          ? String(balanza.branchId)
          : "",
    });
  };

  /* =======================================================
     NUEVO
  ======================================================= */

  const nuevo = () => {
    limpiarMensajes();

    setSeleccionada(null);

    limpiarFormulario();

    setModo("nuevo");
  };

  /* =======================================================
     MODIFICAR
  ======================================================= */

  const modificar = async () => {
    limpiarMensajes();

    if (!seleccionada) {
      setError(
        "Seleccione una balanza para modificar."
      );
      return;
    }

    try {
      setCargandoDetalle(true);

      const id = obtenerIdBalanza(seleccionada);

      const detalle = await obtenerDetalleBalanza(id);

      /*
        Guardamos el detalle completo como seleccionada
        para tener branchId disponible, aunque NO se
        enviará en el PUT.
      */

      setSeleccionada(detalle);

      cargarBalanzaEnFormulario(detalle);

      setModo("editar");
    } catch (err) {
      console.error(
        "Error obteniendo detalle de balanza:",
        err
      );

      setError(
        err?.message ||
          "No se pudo obtener la información de la balanza."
      );
    } finally {
      setCargandoDetalle(false);
    }
  };

  /* =======================================================
     DOBLE CLICK
  ======================================================= */

  const editarDobleClick = async (balanza) => {
    limpiarMensajes();

    setSeleccionada(balanza);

    try {
      setCargandoDetalle(true);

      const id = obtenerIdBalanza(balanza);

      const detalle = await obtenerDetalleBalanza(id);

      setSeleccionada(detalle);

      cargarBalanzaEnFormulario(detalle);

      setModo("editar");
    } catch (err) {
      console.error(
        "Error obteniendo detalle de balanza:",
        err
      );

      setError(
        err?.message ||
          "No se pudo obtener la información de la balanza."
      );
    } finally {
      setCargandoDetalle(false);
    }
  };

  /* =======================================================
     CANCELAR
  ======================================================= */

  const cancelar = () => {
    limpiarMensajes();

    setSeleccionada(null);

    limpiarFormulario();

    setModo("tabla");
  };

  /* =======================================================
     SALIR
  ======================================================= */

  const salir = () => {
    limpiarMensajes();

    setSeleccionada(null);

    limpiarFormulario();

    if (typeof setSection === "function") {
      setSection("home");
      return;
    }

    window.history.back();
  };

  /* =======================================================
     SELECCIONAR FILA
  ======================================================= */

  const seleccionarBalanza = (balanza) => {
    limpiarMensajes();

    setSeleccionada((actual) => {
      if (!actual) {
        return balanza;
      }

      const actualId = obtenerIdBalanza(actual);
      const nuevoId = obtenerIdBalanza(balanza);

      if (
        String(actualId) ===
        String(nuevoId)
      ) {
        return null;
      }

      return balanza;
    });
  };

  /* =======================================================
     CAMBIAR INPUT
  ======================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (mensaje) {
      setMensaje("");
    }
  };

  /* =======================================================
     VALIDAR FORMULARIO
  ======================================================= */

  const validarFormulario = () => {
    /* =====================================================
       NOMBRE
    ===================================================== */

    if (!String(form.nombre).trim()) {
      setError(
        "Ingrese el nombre de la balanza."
      );

      return false;
    }

    /* =====================================================
       FLAG
    ===================================================== */

    const flag = String(
      form.banderaCodigo ?? ""
    ).trim();

    if (!flag) {
      setError(
        "Ingrese la bandera de la balanza."
      );

      return false;
    }

    if (flag.length !== 2) {
      setError(
        "La bandera debe tener exactamente 2 caracteres."
      );

      return false;
    }

    /* =====================================================
       DATA TYPE
    ===================================================== */

    if (
      form.tipoDatoEtiqueta !== "PRICE" &&
      form.tipoDatoEtiqueta !== "WEIGHT"
    ) {
      setError(
        "Seleccione un tipo de dato válido."
      );

      return false;
    }

    /* =====================================================
       CODE LENGTH
    ===================================================== */

    if (form.digitosCodigo === "") {
      setError(
        "Seleccione el largo del código."
      );

      return false;
    }

    const codeLength = Number(
      form.digitosCodigo
    );

    if (
      Number.isNaN(codeLength) ||
      codeLength < 0 ||
      codeLength > 9
    ) {
      setError(
        "El largo del código debe estar entre 0 y 9."
      );

      return false;
    }

    /* =====================================================
       DATA TYPE LENGTH
    ===================================================== */

    if (form.digitosPrecio === "") {
      setError(
        "Seleccione el largo del precio/peso."
      );

      return false;
    }

    const dataTypeLength = Number(
      form.digitosPrecio
    );

    if (
      Number.isNaN(dataTypeLength) ||
      dataTypeLength < 0 ||
      dataTypeLength > 9
    ) {
      setError(
        "El largo del precio/peso debe estar entre 0 y 9."
      );

      return false;
    }

    /* =====================================================
       DECIMALES
    ===================================================== */

    if (form.decimales === "") {
      setError(
        "Seleccione la cantidad de decimales."
      );

      return false;
    }

    const decimalQuantity = Number(
      form.decimales
    );

    if (
      Number.isNaN(decimalQuantity) ||
      decimalQuantity < 0 ||
      decimalQuantity > 3
    ) {
      setError(
        "La cantidad de decimales debe estar entre 0 y 3."
      );

      return false;
    }

    /* =====================================================
       SUCURSAL SOLO PARA NUEVO
    ===================================================== */

    if (
      modo === "nuevo" &&
      (
        form.branchId === "" ||
        form.branchId === null ||
        form.branchId === undefined
      )
    ) {
      setError(
        "Seleccione una sucursal."
      );

      return false;
    }

    return true;
  };

  /* =======================================================
     CONSTRUIR PAYLOAD
  ======================================================= */

  const construirPayload = () => {
    const payload = {
      name: String(
        form.nombre
      ).trim(),

      flag: String(
        form.banderaCodigo
      ).trim(),

      dataType:
        form.tipoDatoEtiqueta,

      codeLength:
        Number(form.digitosCodigo),

      dataTypeLength:
        Number(form.digitosPrecio),

      decimalQuantity:
        Number(form.decimales),
    };

    /*
      branchId SOLO se manda al crear.
      Al editar NO se permite modificar la sucursal.
    */

    if (modo === "nuevo") {
      payload.branchId =
        Number(form.branchId);
    }

    return payload;
  };

  /* =======================================================
     GUARDAR
  ======================================================= */

  const guardar = async () => {
    limpiarMensajes();

    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);

      const payload =
        construirPayload();

      let response;

      /* ===================================================
         CREAR
      =================================================== */

      if (modo === "nuevo") {
        response = await apiFetch(
          API_BALANZAS,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(payload),
          }
        );
      }

      /* ===================================================
         EDITAR
      =================================================== */

      else if (modo === "editar") {
        const id =
          obtenerIdBalanza(
            seleccionada
          );

        if (
          id === undefined ||
          id === null ||
          id === ""
        ) {
          throw new Error(
            "No se pudo identificar la balanza seleccionada."
          );
        }

        response = await apiFetch(
          `${API_BALANZAS}/${encodeURIComponent(id)}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(payload),
          }
        );
      }

      else {
        throw new Error(
          "Operación no válida."
        );
      }

      /* ===================================================
         VALIDAR RESPUESTA
      =================================================== */

      if (!response) {
        throw new Error(
          "No se recibió respuesta del servidor."
        );
      }

      if (!response.ok) {
        const mensajeError =
          await obtenerMensajeError(
            response,
            modo === "nuevo"
              ? "No se pudo crear la balanza."
              : "No se pudo modificar la balanza."
          );

        throw new Error(
          mensajeError
        );
      }

      /*
        POST y PUT devuelven 204.
        No hacemos response.json().
      */

      setMensaje(
        modo === "nuevo"
          ? "Balanza creada correctamente."
          : "Balanza modificada correctamente."
      );

      setSeleccionada(null);

      limpiarFormulario();

      await cargarBalanzas();

      setModo("tabla");
    } catch (err) {
      console.error(
        "Error guardando balanza:",
        err
      );

      setError(
        err?.message ||
          "Ocurrió un error al guardar la balanza."
      );
    } finally {
      setGuardando(false);
    }
  };

  /* =======================================================
     ELIMINAR
  ======================================================= */

  const eliminar = async () => {
    limpiarMensajes();

    if (!seleccionada) {
      setError(
        "Seleccione una balanza para eliminar."
      );

      return;
    }

    const id =
      obtenerIdBalanza(
        seleccionada
      );

    if (
      id === undefined ||
      id === null ||
      id === ""
    ) {
      setError(
        "No se pudo identificar la balanza seleccionada."
      );

      return;
    }

    const nombre =
      obtenerNombreBalanza(
        seleccionada
      ) ||
      `ID ${id}`;

    const confirmar =
      window.confirm(
        `¿Está seguro que desea eliminar la balanza "${nombre}"?`
      );

    if (!confirmar) {
      return;
    }

    try {
      setCargando(true);

      const response =
        await apiFetch(
          `${API_BALANZAS}/${encodeURIComponent(id)}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        const mensajeError =
          await obtenerMensajeError(
            response,
            "No se pudo eliminar la balanza."
          );

        throw new Error(
          mensajeError
        );
      }

      /*
        DELETE exitoso = 200.
      */

      setMensaje(
        "Balanza eliminada correctamente."
      );

      setSeleccionada(null);

      await cargarBalanzas();
    } catch (err) {
      console.error(
        "Error eliminando balanza:",
        err
      );

      setError(
        err?.message ||
          "Ocurrió un error al eliminar la balanza."
      );
    } finally {
      setCargando(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="balanzas-container">

      {/* ===================================================
          TOOLBAR
      =================================================== */}

      <div className="toolbar">

        {/* NUEVO */}

        <button
          type="button"
          className={`tool new ${
            modo !== "tabla"
              ? "disabled"
              : ""
          }`}
          onClick={nuevo}
          disabled={
            modo !== "tabla"
          }
          title="Nueva balanza"
        >
          <span className="tool-icon">
            ＋
          </span>

          <span className="tool-label">
            Nuevo
          </span>
        </button>

        {/* MODIFICAR */}

        <button
          type="button"
          className={`tool edit ${
            !seleccionada ||
            modo !== "tabla" ||
            cargandoDetalle
              ? "disabled"
              : ""
          }`}
          onClick={modificar}
          disabled={
            !seleccionada ||
            modo !== "tabla" ||
            cargandoDetalle
          }
          title="Modificar balanza"
        >
          <span className="tool-icon">
            ✎
          </span>

          <span className="tool-label">
            {cargandoDetalle
              ? "Cargando..."
              : "Modificar"}
          </span>
        </button>

        {/* ELIMINAR */}

        <button
          type="button"
          className={`tool delete ${
            !seleccionada ||
            modo !== "tabla"
              ? "disabled"
              : ""
          }`}
          onClick={eliminar}
          disabled={
            !seleccionada ||
            modo !== "tabla"
          }
          title="Eliminar balanza"
        >
          <span className="tool-icon">
            −
          </span>

          <span className="tool-label">
            Eliminar
          </span>
        </button>

        {/* GUARDAR */}

        <button
          type="button"
          className={`tool save ${
            modo === "tabla" ||
            guardando
              ? "disabled"
              : ""
          }`}
          onClick={guardar}
          disabled={
            modo === "tabla" ||
            guardando
          }
          title="Guardar"
        >
          <span className="tool-icon">
            ▼
          </span>

          <span className="tool-label">
            {guardando
              ? "Guardando..."
              : "Guardar"}
          </span>
        </button>

        {/* CANCELAR */}

        <button
          type="button"
          className={`tool cancel ${
            modo === "tabla"
              ? "disabled"
              : ""
          }`}
          onClick={cancelar}
          disabled={
            modo === "tabla"
          }
          title="Cancelar"
        >
          <span className="tool-icon">
            ×
          </span>

          <span className="tool-label">
            Cancelar
          </span>
        </button>

        {/* SALIR */}

        <button
          type="button"
          className="tool exit"
          onClick={salir}
          title="Salir"
        >
          <span className="tool-icon">
            ›
          </span>

          <span className="tool-label">
            Salir
          </span>
        </button>

      </div>

      {/* ===================================================
          MENSAJES
      =================================================== */}

      {error && (
        <div className="balanzas-message error">
          {error}
        </div>
      )}

      {mensaje && !error && (
        <div className="balanzas-message success">
          {mensaje}
        </div>
      )}

      {/* ===================================================
          TABLA
      =================================================== */}

      {modo === "tabla" && (
        <div className="balanzas-table-wrapper">

          <table className="balanzas-table">

            <thead>
              <tr>

                <th className="col-nro">
                  ID
                </th>

                <th className="col-nombre">
                  Nombre
                </th>

                <th className="col-bandera">
                  Bandera
                </th>

                <th className="col-sucursal">
                  Sucursal
                </th>

              </tr>
            </thead>

            <tbody>

              {/* CARGANDO */}

              {cargando ? (
                <tr>
                  <td
                    colSpan={4}
                    className="table-status"
                  >
                    Cargando balanzas...
                  </td>
                </tr>
              ) : null}

              {/* SIN DATOS */}

              {!cargando &&
              balanzas.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="table-status"
                  >
                    No hay balanzas cargadas.
                  </td>
                </tr>
              ) : null}

              {/* DATOS */}

              {!cargando &&
              balanzas.length > 0
                ? balanzas.map(
                    (balanza) => {

                      const id =
                        obtenerIdBalanza(
                          balanza
                        );

                      const nombre =
                        obtenerNombreBalanza(
                          balanza
                        );

                      const branchId =
                        balanza?.branchId;

                      const nombreSucursal =
                        obtenerNombreSucursal(
                          branchId,
                          sucursales
                        );

                      const seleccionadaId =
                        obtenerIdBalanza(
                          seleccionada
                        );

                      const estaSeleccionada =
                        seleccionada &&
                        String(
                          seleccionadaId
                        ) ===
                          String(id);

                      return (
                        <tr
                          key={id}
                          className={
                            estaSeleccionada
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            seleccionarBalanza(
                              balanza
                            )
                          }
                          onDoubleClick={() =>
                            editarDobleClick(
                              balanza
                            )
                          }
                        >

                          <td>
                            {id}
                          </td>

                          <td>
                            {nombre}
                          </td>

                          <td>
                            {balanza?.flag ?? ""}
                          </td>

                          <td>
                            {nombreSucursal}
                          </td>

                        </tr>
                      );
                    }
                  )
                : null}

            </tbody>

          </table>

        </div>
      )}

      {/* ===================================================
          FORMULARIO
      =================================================== */}

      {(modo === "nuevo" ||
        modo === "editar") && (

        <div className="balanzas-form-area">

          <div className="balanzas-form">

            {/* =================================================
                NOMBRE
            ================================================= */}

            <div className="form-row">

              <label htmlFor="nombre">
                Nombre
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                value={
                  form.nombre
                }
                onChange={
                  handleChange
                }
                autoFocus
                maxLength={100}
                disabled={guardando}
              />

            </div>

            {/* =================================================
                BANDERA
            ================================================= */}

            <div className="form-row">

              <label htmlFor="banderaCodigo">
                Bandera
              </label>

              <input
                id="banderaCodigo"
                name="banderaCodigo"
                type="text"
                value={
                  form.banderaCodigo
                }
                onChange={
                  handleChange
                }
                maxLength={2}
                minLength={2}
                disabled={guardando}
                placeholder="Ej: 12"
              />

            </div>

            {/* =================================================
                TIPO DE DATO
            ================================================= */}

            <div className="form-row">

              <label htmlFor="tipoDatoEtiqueta">
                Tipo de dato
              </label>

              <select
                id="tipoDatoEtiqueta"
                name="tipoDatoEtiqueta"
                value={
                  form.tipoDatoEtiqueta
                }
                onChange={
                  handleChange
                }
                disabled={guardando}
              >

                <option value="">
                  Seleccione...
                </option>

                <option value="PRICE">
                  Precio
                </option>

                <option value="WEIGHT">
                  Peso
                </option>

              </select>

            </div>

            {/* =================================================
                LARGO CÓDIGO
            ================================================= */}

            <div className="form-row">

              <label htmlFor="digitosCodigo">
                Largo del código
              </label>

              <select
                id="digitosCodigo"
                name="digitosCodigo"
                value={
                  form.digitosCodigo
                }
                onChange={
                  handleChange
                }
                disabled={guardando}
              >

                <option value="">
                  Seleccione...
                </option>

                {Array.from(
                  { length: 10 },
                  (_, index) => index
                ).map(
                  (numero) => (
                    <option
                      key={numero}
                      value={numero}
                    >
                      {numero}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                LARGO PRECIO/PESO
            ================================================= */}

            <div className="form-row">

              <label htmlFor="digitosPrecio">
                Largo precio/peso
              </label>

              <select
                id="digitosPrecio"
                name="digitosPrecio"
                value={
                  form.digitosPrecio
                }
                onChange={
                  handleChange
                }
                disabled={guardando}
              >

                <option value="">
                  Seleccione...
                </option>

                {Array.from(
                  { length: 10 },
                  (_, index) => index
                ).map(
                  (numero) => (
                    <option
                      key={numero}
                      value={numero}
                    >
                      {numero}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                DECIMALES
            ================================================= */}

            <div className="form-row">

              <label htmlFor="decimales">
                Cant. de decimales
              </label>

              <select
                id="decimales"
                name="decimales"
                value={
                  form.decimales
                }
                onChange={
                  handleChange
                }
                disabled={guardando}
              >

                <option value="">
                  Seleccione...
                </option>

                {Array.from(
                  { length: 5 },
                  (_, index) => index
                ).map(
                  (numero) => (
                    <option
                      key={numero}
                      value={numero}
                    >
                      {numero}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                SUCURSAL
            ================================================= */}

            <div className="form-row">

              <label htmlFor="branchId">
                Sucursal
              </label>

              <select
                id="branchId"
                name="branchId"
                value={
                  form.branchId
                }
                onChange={
                  handleChange
                }
                disabled={
                  modo === "editar" ||
                  guardando ||
                  cargandoSucursales
                }
              >

                <option value="">
                  {cargandoSucursales
                    ? "Cargando sucursales..."
                    : "Seleccione una sucursal..."}
                </option>

                {sucursales.map(
                  (sucursal) => (
                    <option
                      key={sucursal.id}
                      value={sucursal.id}
                    >
                      {sucursal.name}
                    </option>
                  )
                )}

              </select>

              {modo === "editar" && (
                <small className="field-help">
                  La sucursal no puede modificarse.
                </small>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}