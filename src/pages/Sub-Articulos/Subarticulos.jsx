import { useState, useEffect } from "react";
import "./Subarticulos.css";

export default function SubArticulos({ setSection }) {

  const [articuloPrincipal, setArticuloPrincipal] = useState("");
  const [unidad, setUnidad] = useState("Porcentaje");

  const [subarticulos, setSubarticulos] = useState([]);
  const [articulos, setArticulos] = useState([]);

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
  const obtenerArticulos = async () => {
  try {
    const response = await fetch("http://localhost:8080/back_office/item", {
      method: "GET",
      credentials: "include", // Envía automáticamente las cookies de sesión
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ==========================
    // ERROR 401 - ACCESS_DENIED
    // ==========================
    if (response.status === 401) {
      const error = await response.json();

      if (error.code === "ACCESS_DENIED") {
        alert("Acceso denegado. La sesión no es válida o ha expirado.");
        return [];
      }
    }

    // ==========================
    // ERROR 403
    // ==========================
    if (response.status === 403) {
      alert(
        "No tiene permisos para acceder a los artículos o existe un dato inválido en la base de datos."
      );
      return [];
    }

    // ==========================
    // OTROS ERRORES
    // ==========================
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // ==========================
    // RESPUESTA EXITOSA (200)
    // ==========================
    const data = await response.json();

    console.log("Artículos obtenidos:", data);

    // Guardar en el estado
    setArticulos(data);

    return data;
  } catch (error) {
    console.error("Error al obtener artículos:", error);
    alert("Ocurrió un error al consultar los artículos.");
    return [];
  }
};

// Cargar automáticamente al abrir el componente
useEffect(() => {
  obtenerArticulos();
}, []);

// REEMPLAZA tu función guardar() actual por esta versión

const guardar = async () => {
  // Validaciones
  if (!articuloPrincipal.trim()) {
    alert("Debe ingresar el artículo principal.");
    return;
  }

  if (subarticulos.length === 0) {
    alert("Debe agregar al menos un subartículo.");
    return;
  }

  // Buscar el artículo principal dentro de los artículos cargados
  const articuloPadre = articulos.find(
    (a) =>
      a.name?.toLowerCase() === articuloPrincipal.toLowerCase() ||
      a.barCode === articuloPrincipal
  );

  if (!articuloPadre) {
    alert("El artículo principal no existe.");
    return;
  }

  // Buscar cada subartículo y convertirlo a itemId
  const detalle = [];

  for (const sub of subarticulos) {
    const articuloHijo = articulos.find(
      (a) =>
        a.barCode === sub.codigo ||
        a.name?.toLowerCase() === sub.nombre.toLowerCase()
    );

    if (!articuloHijo) {
      alert(
        `El subartículo "${sub.nombre || sub.codigo}" no existe en artículos.`
      );
      return;
    }

    detalle.push({
      itemId: articuloHijo.id,
      quantity: parseFloat(sub.cantidad) || 0
    });
  }

  // Payload final
  const payload = {
    itemId: articuloPadre.id,      // artículo principal
    unit: unidad,                  // Porcentaje / Cantidad / Unidad
    details: detalle               // subartículos
  };

  try {
    const response = await fetch(
      "http://localhost:8080/back_office/sub-item",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Error al guardar:", error);
      alert("No se pudo guardar la composición.");
      return;
    }

    console.log("Composición guardada:", payload);
    alert("Composición guardada correctamente.");
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Ocurrió un error al guardar la composición.");
  }
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

          <button className="btn" onClick={obtenerArticulos}>
  Buscar
</button>
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