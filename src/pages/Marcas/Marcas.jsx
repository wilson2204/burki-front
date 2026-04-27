import { useEffect, useState } from "react";
import "./marcas.css";

export default function Marcas() {

  const [marcas, setMarcas] = useState([]);
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [marcaEditada, setMarcaEditada] = useState("");

  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);

  const [seleccionada, setSeleccionada] = useState(null);

  const API_URL = "http://localhost:8080/back_office/brand";

  // =========================
  // 🔥 GET
  // =========================
  const cargarMarcas = async () => {
    try {
      const res = await fetch(API_URL, {
        credentials: "include"
      });

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (res.status === 403) {
        alert("No tenés permisos para ver marcas");
        return;
      }

      if (!res.ok) {
        throw new Error("Error al obtener marcas");
      }

      const data = await res.json();

      const formateadas = data.map((m) => ({
        codigo: m.id,
        nombre: m.name
      }));

      setMarcas(formateadas);

    } catch (error) {
      console.error("Error cargando marcas:", error);
      alert("Error al cargar marcas");
    }
  };

  useEffect(() => {
    cargarMarcas();
  }, []);

  // =========================
  // 🔥 POST
  // =========================
  const crearMarca = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: nuevaMarca })
      });

      if (res.status === 201) {

        const location = res.headers.get("Location");

        if (location) {
          const id = location.split("/").pop();

          const nueva = {
            codigo: id,
            nombre: nuevaMarca
          };

          setMarcas([...marcas, nueva]);
        } else {
          console.warn("No vino Location → recargando");
          await cargarMarcas();
        }

        setNuevaMarca("");
        setModoCrear(false);
        return;
      }

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (res.status === 403) {
        alert("No tenés permisos para crear marcas");
        return;
      }

      if (res.status === 422) {
        alert("Nombre inválido");
        return;
      }

      throw new Error("Error inesperado");

    } catch (error) {
      console.error("Error creando marca:", error);
      alert("Error de conexión");
    }
  };

  // =========================
  // 🔥 PUT
  // =========================
  const modificarMarca = async () => {
    try {
      const res = await fetch(`${API_URL}/${seleccionada}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: marcaEditada })
      });

      if (res.status === 204) {
        const actualizadas = marcas.map(m =>
          m.codigo === seleccionada
            ? { ...m, nombre: marcaEditada }
            : m
        );

        setMarcas(actualizadas);
        setModoEditar(false);
        setSeleccionada(null);
        return;
      }

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (res.status === 403) {
        alert("No tenés permisos para modificar marcas");
        return;
      }

      if (res.status === 404) {
        alert("La marca no existe");
        return;
      }

      if (res.status === 422) {
        alert("Nombre inválido");
        return;
      }

      throw new Error("Error inesperado");

    } catch (error) {
      console.error("Error modificando marca:", error);
      alert("Error de conexión");
    }
  };

  // =========================
  // 🔥 DELETE
  // =========================
  const eliminarMarca = async () => {
    if (!seleccionada) {
      alert("Seleccioná una marca");
      return;
    }

    const confirmar = confirm("¿Eliminar marca?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/${seleccionada}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.status === 204) {
        setMarcas(marcas.filter(m => m.codigo !== seleccionada));
        setSeleccionada(null);
        return;
      }

      if (res.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (res.status === 403) {
        alert("No tenés permisos para eliminar marcas");
        return;
      }

      if (res.status === 404) {
        alert("La marca no existe");
        return;
      }

      throw new Error("Error inesperado");

    } catch (error) {
      console.error("Error eliminando marca:", error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="marcas-container">

      {/* 🔥 TOOLBAR */}
      <div className="toolbar">
        <button
          className="btn"
          onClick={() => {
            setModoCrear(true);
            setModoEditar(false);
          }}
        >
          ➕ Nuevo
        </button>

        <button className="btn" onClick={eliminarMarca}>
          🗑 Eliminar
        </button>

        <button
          className="btn"
          onClick={() => {
            if (!seleccionada) {
              alert("Seleccioná una marca");
              return;
            }

            const marca = marcas.find(m => m.codigo === seleccionada);

            setMarcaEditada(marca.nombre);
            setModoEditar(true);
            setModoCrear(false);
          }}
        >
          ✏️ Modificar
        </button>

        <button
          className="btn"
          disabled={!modoCrear && !modoEditar}
          onClick={modoCrear ? crearMarca : modificarMarca}
        >
          💾 Guardar
        </button>

        <button
          className="btn"
          disabled={!modoCrear && !modoEditar}
          onClick={() => {
            setModoCrear(false);
            setModoEditar(false);
            setNuevaMarca("");
            setMarcaEditada("");
          }}
        >
          ❌ Cancelar
        </button>

        <button className="btn" onClick={cargarMarcas}>
          🔄 Recargar
        </button>
      </div>

      {/* 🔥 INPUT */}
      {(modoCrear || modoEditar) && (
        <div className="form-nueva">
          <input
            type="text"
            placeholder="Nombre de la marca"
            value={modoCrear ? nuevaMarca : marcaEditada}
            onChange={(e) =>
              modoCrear
                ? setNuevaMarca(e.target.value)
                : setMarcaEditada(e.target.value)
            }
          />
        </div>
      )}

      {/* 🔥 TABLA */}
      <table className="tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
          </tr>
        </thead>

        <tbody>
          {marcas.map((m) => (
            <tr
              key={m.codigo}
              className={seleccionada === m.codigo ? "selected" : ""}
              onClick={() => setSeleccionada(m.codigo)}
            >
              <td>{m.codigo}</td>
              <td>{m.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}