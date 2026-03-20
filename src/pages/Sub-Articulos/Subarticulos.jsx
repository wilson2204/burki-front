import { useState } from "react";
import "./Subarticulos.css";

export default function SubArticulos({ setSection }) {

  const [articuloPrincipal, setArticuloPrincipal] = useState("");
  const [unidad, setUnidad] = useState("Porcentaje");

  const [subarticulos, setSubarticulos] = useState([]);

  const agregarSubarticulo = () => {
    const nuevo = {
      codigo: "",
      nombre: "",
      cantidad: ""
    };

    setSubarticulos([...subarticulos, nuevo]);
  };

  const eliminarSubarticulo = (index) => {
    const copia = [...subarticulos];
    copia.splice(index, 1);
    setSubarticulos(copia);
  };

  const actualizarCampo = (index, campo, valor) => {
    const copia = [...subarticulos];
    copia[index][campo] = valor;
    setSubarticulos(copia);
  };

  const guardar = () => {
    const data = {
      articuloPrincipal,
      unidad,
      subarticulos
    };

    console.log("Guardar:", data);
    alert("Composición guardada");
  };

  return (
    <div className="subarticulos-container">

      <h2>Sub-Artículos</h2>

      <div className="subarticulos-top">

        <div className="form-left">

          <div className="form-group">
            <label>Artículo principal</label>
            <input
              type="text"
              value={articuloPrincipal}
              onChange={(e) => setArticuloPrincipal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Unidad de medida</label>
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
            >
              <option>Porcentaje</option>
              <option>Cantidad</option>
              <option>Unidad</option>
            </select>
          </div>

        </div>

        <div className="form-buttons">

          <button className="btn">Buscar</button>

          <button className="btn guardar" onClick={guardar}>
            Guardar
          </button>

          <button className="btn agregar" onClick={agregarSubarticulo}>
            Agregar subartículo
          </button>

          <button
            className="btn eliminar"
            onClick={() => eliminarSubarticulo(subarticulos.length - 1)}
          >
            Eliminar subartículo
          </button>

        </div>

      </div>

      <h3>Subartículos</h3>

      <table className="tabla-subarticulos">

        <thead>
          <tr>
            <th>Código</th>
            <th>SubArtículo</th>
            <th>Cantidad</th>
          </tr>
        </thead>

        <tbody>

          {subarticulos.map((sub, index) => (
            <tr key={index}>

              <td>
                <input
                  value={sub.codigo}
                  onChange={(e) =>
                    actualizarCampo(index, "codigo", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  value={sub.nombre}
                  onChange={(e) =>
                    actualizarCampo(index, "nombre", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={sub.cantidad}
                  onChange={(e) =>
                    actualizarCampo(index, "cantidad", e.target.value)
                  }
                />
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <div className="salir-container">
        <button className="btn-salir" onClick={() => setSection("home")}>
          Salir
        </button>
      </div>

    </div>
  );
}