import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/menu.css";

export default function Menu({ setSection, usuario, rol, permisos }) {

  const [openSystem, setOpenSystem] = useState(false);
  const [openParametros, setOpenParametros] = useState(false);
  const [openImpuestos, setOpenImpuestos] = useState(false);

  const [foto, setFoto] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) setFoto(fotoGuardada);
  }, []);

  const iniciales = usuario
    ? usuario.split(" ").map((p) => p[0]).join("").toUpperCase()
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

  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Seguro que querés cerrar sesión?");
    if (!confirmLogout) return;

    try {
      setIsLoggingOut(true);

      await fetch("http://localhost:8080/back_office/auth/logout", {
        method: "POST",
        credentials: "include"
      });

    } catch (error) {
      console.log("Error al cerrar sesión", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  const sinPermisos = !permisos || Object.keys(permisos).length === 0;

  const can = (perm) => {
    if (sinPermisos) return true;
    return permisos[perm];
  };

  return (
    <aside className="sidebar">

      {/* PERFIL */}
      <div className="user-top">
        <label className="avatar-wrapper">
          {foto ? (
            <img src={foto} alt="Perfil" className="user-avatar-img" />
          ) : (
            <div className="user-avatar">{iniciales}</div>
          )}
          <div className="avatar-overlay">+ Añadir foto</div>
          <input type="file" hidden onChange={subirFoto} />
        </label>

        <div className="user-info">
          <span className="user-name">{usuario || "Usuario"}</span>
          <span className="user-role">{rol || "Sin rol"}</span>
        </div>
      </div>

      {/* SISTEMA */}
      <div className="folder" onClick={() => setOpenSystem(!openSystem)}>
        {openSystem ? "▼" : "▶"} Sistema
      </div>

      {openSystem && (
        <div className="tree">

          <div className="tree-item" onClick={() => setSection("usuarios")}>
            Usuarios
          </div>

          <div className="tree-item" onClick={() => setSection("articulos")}>
            Artículos
          </div>

          <div className="tree-item" onClick={() => setSection("subarticulos")}>
            Sub-Artículos
          </div>

          <div className="tree-item" onClick={() => setSection("combos")}>
            Combos
          </div>

          <div onClick={() => setSection("clasificaciones")}>
  Clasificaciones
</div>

          <div className="menu-divider"></div>

          <div className="tree-item" onClick={() => setSection("cambios_precios")}>
            Cambios de precios
          </div>

          <div className="tree-item" onClick={() => setSection("listas_precios")}>
            Listas de precios
          </div>

          <div className="tree-item" onClick={() => setSection("promociones")}>
            Promociones
          </div>

          <div className="menu-divider"></div>

          <div className="tree-item" onClick={() => setSection("talles")}>
            Talles
          </div>

          <div className="tree-item" onClick={() => setSection("colores")}>
            Colores
          </div>

          <div className="menu-divider"></div>

          <div className="tree-item" onClick={() => setSection("departamentos")}>
            Departamentos
          </div>

          <div className="tree-item" onClick={() => setSection("subdepartamentos")}>
            Sub-Departamentos
          </div>

          <div className="menu-divider"></div>

          <div className="tree-item" onClick={() => setSection("clientes")}>
            Clientes
          </div>

          <div className="tree-item" onClick={() => setSection("categorias_clientes")}>
            Categorías de clientes
          </div>

          <div className="tree-item" onClick={() => setSection("marcas")}>
            Marcas
          </div>

          {/* 🔥 FIX PROVEEDORES */}
          <div className="tree-item" onClick={() => setSection("proveedores")}>
            Proveedores
          </div>

        </div>
      )}

      {/* PARAMETROS */}
      <div className="folder" onClick={() => setOpenParametros(!openParametros)}>
        {openParametros ? "▼" : "▶"} Parámetros
      </div>

      {openParametros && (
        <div className="tree">

          <div className="tree-item" onClick={() => setSection("empresa")}>
            Empresa
          </div>

          <div
            className="tree-item"
            onClick={() => setOpenImpuestos(!openImpuestos)}
          >
            {openImpuestos ? "▼" : "▶"} Impuestos
          </div>

          {openImpuestos && (
            <div className="tree" style={{ marginLeft: "15px" }}>
              <div className="tree-item" onClick={() => setSection("iva")}>
                IVA
              </div>

              <div className="tree-item" onClick={() => setSection("otros_tributos")}>
                Otros tributos
              </div>
            </div>
          )}

          <div className="tree-item" onClick={() => setSection("balanzas")}>
            Balanzas
          </div>

          <div className="tree-item" onClick={() => setSection("formas_pago")}>
            Formas de pago
          </div>

          <div className="tree-item" onClick={() => setSection("formas_pago_cuotas")}>
            Formas de pago - cuotas
          </div>

          {/* 🔥 FIX MONEDAS */}
          <div className="tree-item" onClick={() => setSection("monedas")}>
            Moneda extranjera
          </div>

          <div className="menu-divider"></div>

          <div className="tree-item" onClick={() => setSection("funciones_usuario")}>
            Funciones de usuarios
          </div>

          <div className="tree-item" onClick={() => setSection("movimientos_stock")}>
            Tipos de movimientos de stock
          </div>

          <div className="tree-item" onClick={() => setSection("config_pos")}>
            Configuración POS
          </div>

          <div className="tree-item" onClick={() => setSection("config_general")}>
            Configuración General
          </div>

          <div className="tree-item" onClick={() => setSection("asistente")}>
            Asistente de configuración
          </div>

        </div>
      )}

      {/* RESTO */}
      <div className="folder" onClick={() => setSection("stock")}>
        Stock
      </div>

      <div className="folder" onClick={() => setSection("fiscal")}>
        Fiscal
      </div>

      <div className="folder" onClick={() => setSection("Mi Información")}>
        Mi Información
      </div>

      {/* LOGOUT */}
      <div className="logout" onClick={handleLogout}>
        {isLoggingOut ? "Cerrando sesión..." : "Salir"}
      </div>

    </aside>
  );
}