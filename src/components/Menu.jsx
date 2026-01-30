import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/menu.css";

export default function Menu({ setSection }) {
  const [openSystem, setOpenSystem] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [foto, setFoto] = useState(null);

  // Datos simulados (después se pueden traer del backend)
  const nombre = "Agustín";
  const apellido = "Wilson";
  const rol = "Administrador";

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    const fotoGuardada = localStorage.getItem("fotoPerfil");

    if (user) {
      setUsuario(user.split("@")[0]);
    }

    if (fotoGuardada) {
      setFoto(fotoGuardada);
    }
  }, []);

  const iniciales = usuario
    ? usuario
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "?";

  const subirFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("fotoPerfil", reader.result);
      setFoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="sidebar">

      {/* PERFIL DE USUARIO */}
      <div className="user-top">

        <label className="avatar-wrapper">
          {foto ? (
            <img src={foto} alt="Perfil" className="user-avatar-img" />
          ) : (
            <div className="user-avatar">{iniciales}</div>
          )}

          <div className="avatar-overlay">+ Añadir foto</div>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={subirFoto}
          />
        </label>

        <div className="user-info">
          <span className="user-name">{nombre} {apellido}</span>
          <span className="user-role">{rol}</span>
        </div>

      </div>

      {/* SISTEMA */}
      <div
        className="folder"
        onClick={() => setOpenSystem(!openSystem)}
      >
        {openSystem ? "▼" : "▶"} Sistema
      </div>

      {openSystem && (
        <div className="tree">
          {[
            { label: "Usuarios", value: "usuarios" },
            { label: "Artículos", value: "articulos" },
            { label: "Sub-Artículos", value: "subarticulos" },
            { label: "Combos", value: "combos" },
            { label: "Clasificación", value: "clasificacion" },
            { label: "Cambios de precios", value: "cambiosprecios" },
            { label: "Listas de precios", value: "listasprecios" },
            { label: "Promociones", value: "promociones" },
            { label: "Talles", value: "talles" },
            { label: "Colores", value: "colores" },
            { label: "Departamentos", value: "departamentos" },
            { label: "Clientes", value: "clientes" },
            { label: "Marcas", value: "marcas" },
            { label: "Proveedores", value: "proveedores" },
          ].map((item) => (
            <div
              key={item.value}
              className="tree-item"
              onClick={() => setSection(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}

      <div className="folder" onClick={() => setSection("stock")}>Stock</div>
      <div className="folder" onClick={() => setSection("fiscal")}>Fiscal</div>
      <div className="folder" onClick={() => setSection("informes")}>Informes</div>
      <div className="folder" onClick={() => setSection("restaurante")}>Restaurante</div>
      <div className="folder" onClick={() => setSection("estadisticas")}>Estadísticas</div>

      <div
        className="logout"
        onClick={() => {
          localStorage.removeItem("usuario");
          localStorage.removeItem("fotoPerfil");
          navigate("/");
        }}
      >
        Salir
      </div>

      {/* BRAND ABAJO */}
      <div className="brand-bottom">
        <h2>BRUKI</h2>
        <span>Backoffice</span>
      </div>

    </aside>
  );
}
