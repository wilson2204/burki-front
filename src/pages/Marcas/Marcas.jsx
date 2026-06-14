import { useEffect, useState } from "react";
import "./Marcas.css";
import { useLanguage } from "../../context/LanguageContext";

export default function Marcas({ setSection }) {

  const { t } = useLanguage();
  const [marcas, setMarcas] = useState([]);
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [marcaEditada, setMarcaEditada] = useState("");

  const [modoCrear, setModoCrear] = useState(false);
  const [modoEditar, setModoEditar] = useState(false);

  const [seleccionada, setSeleccionada] = useState(null);

  const API_URL = "/api/brand";

  // =========================
  // 🔥 GET
  // =========================
  const cargarMarcas = async () => {
    try {
      const res = await fetch(API_URL, {
        credentials: "include"
      });

      if (res.status === 401) {
        alert(t("marcas.sessionExpired"));
      }

      if (res.status === 403) {
        alert(t("marcas.loadError"));
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
        alert(t("marcas.sessionExpired"));
        return;
      }

      if (res.status === 403) {
        alert(t("marcas.noCreatePermission"));
        return;
      }

      if (res.status === 422) {
        alert(t("marcas.invalidName"));
        return;
      }

      throw new Error("Error inesperado");

    } catch (error) {
      console.error("Error creando marca:", error);
      alert(t("marcas.connectionError"));
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
        alert(t("marcas.sessionExpired"));
        return;
      }

      if (res.status === 403) {
        alert(t("marcas.noEditPermission"));
        return;
      }

      if (res.status === 404) {
        alert(t("marcas.brandNotFound"));
        return;
      }

      if (res.status === 422) {
        alert(t("marcas.invalidName"));
        return;
      }

      throw new Error("Error inesperado");

    } catch (error) {
      console.error("Error modificando marca:", error);
      alert(t("marcas.connectionError"));
    }
  };

  // =========================
  // 🔥 DELETE
  // =========================
  const eliminarMarca = async () => {
    if (!seleccionada) {
      alert(t("marcas.selectBrand"));
      return;
    }

    const confirmar = confirm(t("marcas.confirmDelete"));
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
        alert(t("marcas.sessionExpired"));
        return;
      }

      if (res.status === 403) {
        alert(t("marcas.noViewPermission"));
        return;
      }

      if (res.status === 404) {
        alert(t("marcas.brandNotFound"));
        return;
      }

      throw new Error("Error inesperado");

    } catch (error) {
      console.error("Error eliminando marca:", error);
      alert("Error de conexión");
    }
  };
  // =========================
  // Salir
  // =========================

  const salir = () => {
  setSection("home"); // ⚠️ cambiá si tu app usa "home" u otro nombre
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
          ➕ {t("common.new")}
        </button>

        <button className="btn" onClick={eliminarMarca}>
          🗑 {t("common.delete")}
        </button>

        <button
          className="btn"
          onClick={() => {
            if (!seleccionada) {
              alert(t("marcas.selectBrand"));
              return;
            }

            const marca = marcas.find(m => m.codigo === seleccionada);

            setMarcaEditada(marca.nombre);
            setModoEditar(true);
            setModoCrear(false);
          }}
        >
          ✏️ {t("common.edit")}
        </button>

        <button
          className="btn"
          disabled={!modoCrear && !modoEditar}
          onClick={modoCrear ? crearMarca : modificarMarca}
        >
          💾 {t("common.save")}
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
          ❌ {t("common.cancel")}
        </button>

        <button className="btn" onClick={cargarMarcas}>
          🔄 {t("marcas.reload")}
        </button>
        <button className="btn" onClick={salir}>
  🚪 {t("common.exit")}
</button>
      </div>

      {/* 🔥 INPUT */}
      {(modoCrear || modoEditar) && (
        <div className="form-nueva">
          <input
            type="text"
            placeholder={t("marcas.brandName")}
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
            <th>{t("common.id")}</th>
            <th>{t("common.name")}</th>
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