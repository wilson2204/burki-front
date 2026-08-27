import { useEffect, useState } from "react";
import "./Marcas.css";
import { useLanguage } from "../../context/LanguageContext";
import { apiFetch } from "../../services/api";

export default function Marcas({ setSection }) {

  const { t } = useLanguage();
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
      const res = await apiFetch("/brand");

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
      const res = await apiFetch("/brand", {
  method: "POST",
  body: JSON.stringify({
    name: nuevaMarca,
  }),
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
     const res = await apiFetch(`/brand/${seleccionada}`, {
  method: "PUT",
  body: JSON.stringify({
    name: marcaEditada,
  }),
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
      const res = await apiFetch(`/brand/${seleccionada}`, {
  method: "DELETE"
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
  // Cancelar
  // =========================


const handleCancelar = () => {
  // Salir de cualquier modo
  setModoCrear(false);
  setModoEditar(false);

  // Limpiar campos
  setNuevaMarca("");
  setMarcaEditada("");

  // 🔥 QUITAR SELECCIÓN
  setSeleccionada(null);
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
  className="btn new"
  onClick={() => {
    setModoCrear(true);
    setModoEditar(false);

    setSeleccionada(null);
    setMarcaEditada("");
    setNuevaMarca("");
  }}
>
  <div className="tool-icon">＋</div>
  <span>{t("common.new")}</span>
</button>



  <button
    className="btn delete"
    onClick={eliminarMarca}
  >
    <div className="tool-icon">🗑</div>
    <span>{t("common.delete")}</span>
  </button>

  <button
    className="btn edit"
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
    <div className="tool-icon">✎</div>
    <span>{t("common.edit")}</span>
  </button>

  <button
    className="btn save"
    disabled={!modoCrear && !modoEditar}
    onClick={modoCrear ? crearMarca : modificarMarca}
  >
    <div className="tool-icon">✓</div>
    <span>{t("common.save")}</span>
  </button>

  
<button
  type="button"
  className="btn cancel"
  disabled={
    !modoCrear &&
    !modoEditar &&
    seleccionada === null
  }
  onClick={handleCancelar}
>
  <div className="tool-icon">✕</div>
  <span>{t("common.cancel")}</span>
</button>


  <button
    className="btn"
    onClick={cargarMarcas}
  >
    <div className="tool-icon">↻</div>
    <span>{t("marcas.reload")}</span>
  </button>

  <button
    className="btn exit"
    onClick={salir}
  >
    <div className="tool-icon">↪</div>
    <span>{t("common.exit")}</span>
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
  <div className="tabla-wrapper">

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

</div>
);
}