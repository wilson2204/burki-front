import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Promociones.css";
import { apiFetch } from "../../services/api";

const TIPOS_PROMOCION = {
  "Más de N usa lista X": "BUYING_N_USES_LIST_X",
  "Llevando N paga M (2x1)": "BUYING_N_PAYS_M",
  "Porcentaje de descuento fijo": "FIX_DISCOUNT_PERCENTAGE",
  "Porc. de desc. en la 2 unidad": "SECOND_ITEM_DISCOUNT_PERCENTAGE"
};

export default function Promociones({ setSection }) {

  const { t } = useLanguage();
const [promoActiva, setPromoActiva] = useState(false);
  const emptyForm = {
    nombre: "",
    tipo: "Más de N usa lista X",

    nLlevando: "",
    cantidadM: "",
    porcentaje: "",
    monto: "",

    listaPrecio: "Todas",

    activa: true,
    diasVigente: false,

    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,

    desde: "",
    hasta: ""
  };

  const [editando, setEditando] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [form, setForm] = useState(emptyForm);
const [promociones, setPromociones] = useState([]);
useEffect(() => {
  cargarPromociones();
}, []);
  const handleChange = (campo, valor) => {
    setForm(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

const cargarPromociones = async () => {
  try {
    const response = await apiFetch("/promotions");

    if (response.status === 401) {
      alert("Acceso denegado");
      return;
    }

    if (response.status === 403) {
      alert("Error al obtener promociones");
      return;
    }

    if (!response.ok) {
      throw new Error("Error al obtener promociones");
    }

    const data = await response.json();
    setPromociones(data);
  } catch (error) {
    console.error(error);
  }
};
const crearBodyPromocion = () => {
  return {
    name: form.nombre,

    type: TIPOS_PROMOCION[form.tipo],

    fromDate: `${form.desde}T00:00:00`,

    toDate: `${form.hasta}T23:59:59`,

    itsAvailable: form.activa,

    priceListNumber:
      form.listaPrecio === "Todas"
        ? 0
        : Number(form.listaPrecio),

    itemsBuyQuantity: form.nLlevando
      ? Number(form.nLlevando)
      : null,

    itemsPayQuantity: form.cantidadM
      ? Number(form.cantidadM)
      : null,

    discountPercentage: form.porcentaje
      ? Number(form.porcentaje)
      : null,

    daysAvailable: [
      form.lunes,
      form.martes,
      form.miercoles,
      form.jueves,
      form.viernes,
      form.sabado,
      form.domingo
    ]
  };
};
const obtenerFechaHoy = () => {
  const fecha = new Date();

  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
};
  const handleNuevo = () => {

  const hoy = obtenerFechaHoy();

  setForm({
    ...emptyForm,

    desde: hoy,
    hasta: hoy,

    activa: false
  });

  setSeleccionado(null);
  setEditando(true);
};

const handleGuardar = async () => {
  try {

    const body = {

  name: form.nombre,

  type: TIPOS_PROMOCION[form.tipo],

  fromDate: `${form.desde}T00:00:00`,

  toDate: `${form.hasta}T23:59:59`,

  itsAvailable: form.activa,

  priceListNumber:
    form.listaPrecio === "Todas"
      ? 0
      : Number(form.listaPrecio),


  itemsBuyQuantity:
    form.tipo === "Más de N usa lista X" ||
    form.tipo === "Llevando N paga M (2x1)"
      ? Number(form.nLlevando)
      : null,


  itemsPayQuantity:
    form.tipo === "Llevando N paga M (2x1)"
      ? Number(form.cantidadM)
      : null,


  discountPercentage:
    form.tipo === "Porcentaje de descuento fijo" ||
    form.tipo === "Porc. de desc. en la 2 unidad"
      ? Number(form.porcentaje) / 100
      : null,


  daysAvailable:[
    form.lunes,
    form.martes,
    form.miercoles,
    form.jueves,
    form.viernes,
    form.sabado,
    form.domingo
  ]

};

    let response;

if (seleccionado === null) {

 response = await apiFetch("/promotions", {
  method: "POST",
  body: JSON.stringify(body)
});

} else {

response = await apiFetch(
  `/promotions/${seleccionado.id}`,
  {
    method: "PUT",
    body: JSON.stringify(body)
  }
);
}

    if (response.status === 401) {
      alert("No autorizado");
      return;
    }


    if (response.status === 422) {
      alert("Datos inválidos. Revisá fechas o campos obligatorios.");
      return;
    }
console.log("STATUS BACKEND:", response.status);

const respuesta = await response.text();

console.log("RESPUESTA BACKEND:", respuesta);

if (!response.ok) {
  throw new Error("Error al crear promoción");
}
    if (!response.ok) {
      throw new Error("Error al crear promoción");
    }




    await cargarPromociones();


    setForm(emptyForm);
    setEditando(false);


  } catch (error) {

    console.error(error);

  }
};

  
const handleCancelar = () => {
  const hoy = obtenerFechaHoy();

  setForm({
    ...emptyForm,
    desde: hoy,
    hasta: hoy
  });

  setSeleccionado(null);
  setEditando(false);
};

const handleModificar = () => {

  if (!seleccionado) return;


  const promo = seleccionado;


  setForm({

    nombre: promo.name,

    tipo:
      Object.keys(TIPOS_PROMOCION)
      .find(
        key => TIPOS_PROMOCION[key] === promo.type
      )
      || "Más de N usa lista X",


    nLlevando: promo.itemsBuyQuantity ?? "",

    cantidadM: promo.itemsPayQuantity ?? "",

    porcentaje: promo.discountPercentage ?? "",

    monto:"",


    listaPrecio:
      promo.priceListNumber
      ? String(promo.priceListNumber)
      : "Todas",


    activa: promo.itsAvailable,


    diasVigente: true,


    lunes: promo.daysAvailable?.[0] ?? false,
    martes: promo.daysAvailable?.[1] ?? false,
    miercoles: promo.daysAvailable?.[2] ?? false,
    jueves: promo.daysAvailable?.[3] ?? false,
    viernes: promo.daysAvailable?.[4] ?? false,
    sabado: promo.daysAvailable?.[5] ?? false,
    domingo: promo.daysAvailable?.[6] ?? false,


    desde:
      promo.fromDate?.substring(0,10) || "",

    hasta:
      promo.toDate?.substring(0,10) || ""

  });


  setEditando(true);

};

const bloquearFechas = !form.activa;
const bloquearDias = !form.diasVigente;
  
const handleEliminar = async () => {

  if (!seleccionado) return;

  const confirmar = window.confirm(
    `¿Seguro que querés eliminar la promoción "${seleccionado.name}"?`
  );

  if (!confirmar) return;


  try {

    const response = await apiFetch(
  `/promotions/${seleccionado.id}`,
  {
    method: "DELETE"
  }
);


    if (response.status === 401) {
      alert("No autorizado");
      return;
    }


    if (response.status === 403) {
      alert("No tenés permisos para eliminar promociones");
      return;
    }


    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      throw new Error("Error al eliminar promoción");
    }


    alert("Promoción eliminada correctamente");


    await cargarPromociones();


    setSeleccionado(null);


  } catch(error) {

    console.error(error);
    alert("No se pudo eliminar la promoción");

  }

};

  const handleSalir = () => {
    if (setSection) {
      setSection("home");
    }
  };

  const tipo = form.tipo;

  const usaNLlevando =
    tipo === "Más de N usa lista X" ||
    tipo === "Llevando N paga M (2x1)";

  const usaCantidadM =
    tipo === "Llevando N paga M (2x1)";

  const usaPorcentaje =
    tipo === "Porcentaje de descuento fijo" ||
    tipo === "Porc. de desc. en la 2 unidad";

  const usaMonto = false;

  return (
    <div className="promociones-page">

     <div className="toolbar">

  <div className="tool new" onClick={handleNuevo}>
    <div className="tool-icon">＋</div>
    <div className="tool-label">{t("common.new")}</div>
  </div>

  <div
    className={`tool delete ${!seleccionado ? "disabled" : ""}`}
    onClick={() => seleccionado && handleEliminar()}
  >
    <div className="tool-icon">🗑</div>
    <div className="tool-label">{t("common.delete")}</div>
  </div>

  <div
    className={`tool edit ${!seleccionado ? "disabled" : ""}`}
    onClick={() => seleccionado && handleModificar()}
  >
    <div className="tool-icon">✎</div>
    <div className="tool-label">{t("common.edit")}</div>
  </div>

  <div
    className={`tool save ${!editando ? "disabled" : ""}`}
    onClick={() => editando && handleGuardar()}
  >
    <div className="tool-icon">✓</div>
    <div className="tool-label">{t("common.save")}</div>
  </div>

<div
  className={`tool cancel ${!seleccionado ? "disabled" : ""}`}
  onClick={seleccionado ? handleCancelar : undefined}
>
  <div className="tool-icon">✕</div>
  <div className="tool-label">
    {t("common.cancel")}
  </div>
</div>



  <div className="tool exit" onClick={handleSalir}>
    <div className="tool-icon">↪</div>
    <div className="tool-label">{t("common.exit")}</div>
  </div>

</div>

      {!editando && (
        <div className="promo-list">

          <table>

            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Tipo</th>
              </tr>
            </thead>

           <tbody>
  {promociones.map((promo) => (
    <tr
      key={promo.id}
      onClick={() => setSeleccionado(promo)}
      className={seleccionado?.id === promo.id ? "selected" : ""}
    >
      <td>{promo.id}</td>
      <td>{promo.name}</td>
      <td>{promo.type}</td>
    </tr>
  ))}
</tbody>

          </table>

        </div>
      )}

      {editando && (
        <div className="promo-form">

          <div className="form-left">

            <div className="field">
              <label>Nombre de la promoción</label>
              <input
                value={form.nombre}
                onChange={e => handleChange("nombre", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Tipo de promoción</label>

              <select
                value={form.tipo}
                onChange={e => handleChange("tipo", e.target.value)}
              >
                <option>Más de N usa lista X</option>
                <option>Llevando N paga M (2x1)</option>
                <option>Porcentaje de descuento fijo</option>
                <option>Porc. de desc. en la 2 unidad</option>
              </select>
            </div>

            <div className="double">
              <div className="field">
                <label>N. Llevando</label>

              <input
  disabled={
    !usaNLlevando || tipo === "Porc. de desc. en la 2 unidad"
  }
  value={
    tipo === "Porc. de desc. en la 2 unidad"
      ? 2
      : form.nLlevando
  }
  onChange={e => handleChange("nLlevando", e.target.value)}
/>
              </div>

              <div className="field">
                <label>% Descuento</label>

                <input
                  disabled={!usaPorcentaje}
                  value={form.porcentaje}
                  onChange={e => handleChange("porcentaje", e.target.value)}
                />
              </div>
            </div>
                        <div className="double">

              <div className="field">
                <label>Cantidad M</label>

                <input
                  disabled={!usaCantidadM}
                  value={form.cantidadM}
                  onChange={e => handleChange("cantidadM", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Monto descuento</label>

                <input
                  disabled={!usaMonto}
                  value={form.monto}
                  onChange={e => handleChange("monto", e.target.value)}
                />
              </div>

            </div>

            <div className="field">

              <label>Lista de precios</label>

              <select
                value={form.listaPrecio}
                onChange={e => handleChange("listaPrecio", e.target.value)}
              >
                <option>Todas</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                
              </select>

            </div>

          </div>

          <div className="form-right">

            <h3>

              <input
                type="checkbox"
                checked={form.diasVigente}
                onChange={e => handleChange("diasVigente", e.target.checked)}
              />

              Establecer días vigente

            </h3>

            <div className="dias">

              <label>
                <input
  type="checkbox"
    disabled={bloquearDias}
  checked={form.lunes}
  onChange={e => handleChange("lunes", e.target.checked)}
/>
                Lunes
              </label>

              <label>
                <input
  type="checkbox"
    disabled={bloquearDias}
  checked={form.martes}
  onChange={e => handleChange("martes", e.target.checked)}
/>
                Martes
              </label>

              <label>
                <input
  type="checkbox"
    disabled={bloquearDias}
  checked={form.miércoles}
  onChange={e => handleChange("miércoles", e.target.checked)}
/>
                Miércoles
              </label>

              <label>
                <input
  type="checkbox"
    disabled={bloquearDias}
  checked={form.jueves}
  onChange={e => handleChange("jueves", e.target.checked)}
/>
                Jueves
              </label>

              <label>
                <input
  type="checkbox"
    disabled={bloquearDias}
  checked={form.viernes}
  onChange={e => handleChange("viernes", e.target.checked)}
/>
                Viernes
              </label>

              <label>
                <input
  type="checkbox"
    disabled={bloquearDias}
  checked={form.sabado}
  onChange={e => handleChange("sabado", e.target.checked)}
/>
                Sábado
              </label>

              <label>
                <input
  type="checkbox"
    disabled={bloquearDias}
  checked={form.domingo}
  onChange={e => handleChange("domingo", e.target.checked)}
/>
                Domingo
              </label>

              <label>

              <input
  type="checkbox"
  disabled={bloquearDias}
  checked={
    form.lunes &&
    form.martes &&
    form.miércoles &&
    form.jueves &&
    form.viernes &&
    form.sabado &&
    form.domingo
  }
  onChange={(e) => {
    const valor = e.target.checked;

    setForm(prev => ({
      ...prev,
      lunes: valor,
      martes: valor,
      miércoles: valor,
      jueves: valor,
      viernes: valor,
      sabado: valor,
      domingo: valor
    }));
  }}
/>
                Todos

              </label>

            </div>

           <h3>
  <input
    type="checkbox"
    checked={form.activa}
    onChange={e => {
      const valor = e.target.checked;

      setForm(prev => ({
        ...prev,
        activa: valor,
        ...(valor
          ? {}
          : {
              lunes: false,
              martes: false,
              miercoles: false,
              jueves: false,
              viernes: false,
              sabado: false,
              domingo: false
            })
      }));
    }}
  />

  Promo ACTIVA
</h3>

            <div className="field">

              <label>Desde</label>

              <input
  type="date"
  disabled={bloquearFechas}
  value={form.desde}
  onChange={e => handleChange("desde", e.target.value)}
/>

            </div>

            <div className="field">

              <label>Hasta</label>

              <input
  type="date"
 disabled={bloquearFechas}
  value={form.hasta}
  onChange={e => handleChange("hasta", e.target.value)}
/>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}