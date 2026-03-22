import { useState, useEffect } from "react";
import "./Subdepartamentos.css";

export default function SubDepartamentos() {

  const [modo, setModo] = useState("tabla");

  const [subdepartamentos, setSubdepartamentos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [departamento, setDepartamento] = useState("");
  const [nombre, setNombre] = useState("");

  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {

    const deps = localStorage.getItem("departamentos");
    if (deps) setDepartamentos(JSON.parse(deps));

    const subs = localStorage.getItem("subdepartamentos");
    if (subs) setSubdepartamentos(JSON.parse(subs));

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "subdepartamentos",
      JSON.stringify(subdepartamentos)
    );

  }, [subdepartamentos]);

  const nuevo = () => {

    setModo("nuevo");
    setNombre("");
    setDepartamento("");

  };

  const cancelar = () => {

    setModo("tabla");
    setSeleccionado(null);

  };

  const guardar = () => {

    if (!nombre || !departamento) {
      alert("Complete los datos");
      return;
    }

    if (modo === "editar") {

      const copia = [...subdepartamentos];

      copia[seleccionado] = {
        ...copia[seleccionado],
        nombre,
        departamento
      };

      setSubdepartamentos(copia);

    } else {

      const nuevoSub = {
        codigo: subdepartamentos.length + 1,
        departamento,
        nombre
      };

      setSubdepartamentos([...subdepartamentos, nuevoSub]);

    }

    setModo("tabla");
  };

  const modificar = () => {

    if (seleccionado === null) {
      alert("Seleccione un registro");
      return;
    }

    const item = subdepartamentos[seleccionado];

    setNombre(item.nombre);
    setDepartamento(item.departamento);

    setModo("editar");

  };

  const eliminar = () => {

    if (seleccionado === null) {
      alert("Seleccione un registro");
      return;
    }

    if (!window.confirm("Eliminar registro?")) return;

    const copia = [...subdepartamentos];

    copia.splice(seleccionado, 1);

    const reordenado = copia.map((d, i) => ({
      ...d,
      codigo: i + 1
    }));

    setSubdepartamentos(reordenado);
    setSeleccionado(null);

  };

  return (
    <div className="sub-container">

      <h2>Sub-Departamentos</h2>

      {/* BARRA BOTONES */}

      <div className="toolbar">

        <button onClick={nuevo}>➕ Nuevo</button>

        <button onClick={eliminar}>➖ Eliminar</button>

        <button onClick={modificar}>✏️ Modificar</button>

        <button onClick={guardar}>✔ Guardar</button>

        <button onClick={cancelar}>❌ Cancelar</button>

        <button onClick={() => setModo("tabla")}>➡ Salir</button>

      </div>

      {/* TABLA */}

      {modo === "tabla" && (

        <table className="sub-table">

          <thead>
            <tr>
              <th>Codigo</th>
              <th>Departamento</th>
              <th>Sub-Departamento</th>
            </tr>
          </thead>

          <tbody>

            {subdepartamentos.map((d, index) => (

              <tr
                key={index}
                onClick={() => setSeleccionado(index)}
                className={
                  seleccionado === index ? "fila-activa" : ""
                }
              >

                <td>{d.codigo}</td>
                <td>{d.departamento}</td>
                <td>{d.nombre}</td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      {/* FORMULARIO */}

      {modo !== "tabla" && (

        <div className="form-sub">

          <div className="campo">

            <label>Departamento</label>

            <select
              value={departamento}
              onChange={(e) =>
                setDepartamento(e.target.value)
              }
            >

              <option value="">Seleccione</option>

              {departamentos.map((d) => (

                <option key={d.nro} value={d.nombre}>
                  {d.nombre}
                </option>

              ))}

            </select>

          </div>

          <div className="campo">

            <label>SubDepartamento</label>

            <input
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
            />

          </div>

        </div>

      )}

    </div>
  );
}