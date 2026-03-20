import { useState, useEffect } from "react";
import "./departamentos.css";

export default function Departamentos({ setSection }) {

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [form, setForm] = useState({
    nro: "",
    nombre: "",
    detalle: "",
    iva: "No Gravado",
    impInterno: "No posee",
    ubicacion: 0,
    imagen: null
  });

  /* CARGAR DESDE LOCALSTORAGE */

  useEffect(() => {

    const data = localStorage.getItem("departamentos");

    if (data) {
      setDepartamentos(JSON.parse(data));
    }

  }, []);

  /* GUARDAR EN LOCALSTORAGE */

  useEffect(() => {

    localStorage.setItem(
      "departamentos",
      JSON.stringify(departamentos)
    );

  }, [departamentos]);

  /* NUEVO */

  const abrirFormulario = () => {

    setSeleccionado(null);

    setForm({
      nro: departamentos.length + 1,
      nombre: "",
      detalle: "",
      iva: "No Gravado",
      impInterno: "No posee",
      ubicacion: 0,
      imagen: null
    });

    setMostrarFormulario(true);

  };

  /* MODIFICAR */

  const modificar = () => {

    if (seleccionado === null) {
      alert("Seleccione un departamento de la tabla para modificar.");
      return;
    }

    const depto = departamentos[seleccionado];

    setForm({ ...depto });

    setMostrarFormulario(true);

  };

  /* CANCELAR */

  const cancelar = () => {

    setMostrarFormulario(false);
    setSeleccionado(null);

  };

  /* SALIR */

  const salir = () => {

    setSection("dashboard");

  };

  /* CAMBIOS EN FORMULARIO */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "ubicacion" ? Number(value) : value
    }));

  };

  /* SELECCIONAR IMAGEN */

  const seleccionarImagen = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setForm((prev) => ({
        ...prev,
        imagen: reader.result
      }));

    };

    reader.readAsDataURL(file);

  };

  /* GUARDAR */

  const guardar = () => {

    if (!mostrarFormulario) return;

    if (!form.nombre.trim()) {
      alert("Ingrese nombre del departamento.");
      return;
    }

    if (seleccionado === null) {

      setDepartamentos((prev) => [...prev, form]);

    } else {

      const copia = [...departamentos];
      copia[seleccionado] = form;

      setDepartamentos(copia);

    }

    setMostrarFormulario(false);
    setSeleccionado(null);

  };

  /* ELIMINAR */

  const eliminar = () => {

    if (seleccionado === null) {
      alert("Seleccione un departamento para eliminar.");
      return;
    }

    const confirmar = window.confirm(
      "¿Está seguro que desea eliminar este departamento?"
    );

    if (!confirmar) return;

    const copia = [...departamentos];

    copia.splice(seleccionado, 1);

    const reordenado = copia.map((d, i) => ({
      ...d,
      nro: i + 1
    }));

    setDepartamentos(reordenado);
    setSeleccionado(null);

  };

  /* SELECCIONAR FILA */

  const seleccionarFila = (index) => {

    setSeleccionado(index);

  };

  /* BUSQUEDA */

  const departamentosFiltrados = departamentos.filter((d) =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (

    <div className="departamentos-container">

      <h2>Departamentos</h2>

      <div className="barra-acciones">

        <div className="botones">

          <button onClick={abrirFormulario}>➕ Nuevo</button>

          <button onClick={eliminar}>➖ Eliminar</button>

          <button onClick={modificar}>✏️ Modificar</button>

          <button onClick={guardar}>✔ Guardar</button>

          <button onClick={cancelar}>✖ Cancelar</button>

          <button onClick={salir}>➡ Salir</button>

        </div>

        <div className="buscar">

          <span>Buscar</span>

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

        </div>

      </div>

      {mostrarFormulario && (

        <div className="formulario-depto">

          <div className="fila">
            <label>Nro. depto.</label>
            <input
              type="text"
              name="nro"
              value={form.nro}
              onChange={handleChange}
            />
          </div>

          <div className="fila">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="fila">
            <label>Detalle</label>
            <input
              type="text"
              name="detalle"
              value={form.detalle}
              onChange={handleChange}
            />
          </div>

          {/* BOTON IMAGEN */}

{/* BOTON ACCESO RAPIDO */}

<div className="acceso-rapido">

  <button
    type="button"
    onClick={() =>
      document.getElementById("imagenDepto").click()
    }
  >
    Acceso rápido
  </button>

  <input
    type="file"
    id="imagenDepto"
    accept="image/*"
    hidden
    onChange={seleccionarImagen}
  />

</div>

{form.imagen && (

  <div className="preview">

    <img
      src={form.imagen}
      alt="preview"
      width="120"
    />

  </div>

)}
          <div className="fila">

            <label>I.V.A.</label>

            <select
              name="iva"
              value={form.iva}
              onChange={handleChange}
            >

              <option>No Gravado</option>
              <option>Exento</option>
              <option>IVA 0%</option>
              <option>IVA 10.5%</option>
              <option>IVA 21%</option>
              <option>IVA 27%</option>
              <option>IVA 5%</option>
              <option>IVA 2.5%</option>

            </select>

          </div>

          <div className="fila">

            <label>Imp. Interno</label>

            <select
              name="impInterno"
              value={form.impInterno}
              onChange={handleChange}
            >

              <option>No posee</option>
              <option>$3.09</option>

            </select>

          </div>

          <div className="fila">

            <label>Ubicación en la pantalla del punto de venta</label>

            <select
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
            >

              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}

            </select>

          </div>

          <div className="precio">
            <span>Precio final</span>
            <h2>0,00</h2>
          </div>

        </div>

      )}

      <table className="tabla">

        <thead>

          <tr>
            <th>Nro</th>
            <th>Imagen</th>
            <th>Departamento</th>
            <th>IVA</th>
            <th>Ubicación</th>
          </tr>

        </thead>

        <tbody>

          {departamentosFiltrados.map((d, index) => (

            <tr
              key={index}
              onClick={() => seleccionarFila(index)}
              style={{
                background:
                  seleccionado === index
                    ? "var(--table-hover)"
                    : "transparent",
                cursor: "pointer"
              }}
            >

              <td>{d.nro}</td>

              <td>

                {d.imagen ? (

                  <img
                    src={d.imagen}
                    alt="depto"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "6px"
                    }}
                  />

                ) : "—"}

              </td>

              <td>{d.nombre}</td>
              <td>{d.iva}</td>
              <td>{d.ubicacion}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}