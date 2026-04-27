import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../components/Menu";

import Usuarios from "../Usuarios/Usuarios";
import Articulos from "../Articulos/Articulos";
import Departamentos from "../Departamentos/Departamentos";
import SubDepartamentos from "../Subdepartamentos/Subdepartamentos";
import SubArticulos from "../Sub-Articulos/Subarticulos";
import MiInformacion from "../Mi_Informacion/MiInformacion";
import Marcas from "../Marcas/Marcas";
import OtrosTributos from "../Otrostributos/OtrosTributos";
import Proveedores from "../Proveedores/proveedores";
import Monedas from "../Monedas/Monedas";
import Clasificaciones from "../Clasificaciones/Clasificaciones";

export default function Dashboard() {
  const [section, setSection] = useState("home");
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [permisos, setPermisos] = useState(null);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();

  // 🔥 APLICAR TEMA AL BODY (FIX)
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  // 🔥 Cargar sesión + usuario + permisos
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("http://localhost:8080/back_office/user/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();

        setUsuario(data.nameAndSurname || "Usuario");
        setRol(data.userRole || "USER");

        const resPerm = await fetch(
          "http://localhost:8080/back_office/auth/check-permissions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              operations: [
                "CREATE",
                "DELETE",
                "UPDATE",
                "BACK_OFFICE_ACCESS",
                "VIEWS_ACCESS",
                "USERS_ACCESS",
                "REPORTS_ACCESS",
              ],
            }),
          }
        );

        if (!resPerm.ok) {
          setPermisos(null);
        } else {
          const permisosData = await resPerm.json();
          const permisosObj = {};
          permisosData.forEach(
            (p) => (permisosObj[p.operation] = p.isAllowed)
          );
          setPermisos(permisosObj);
        }
      } catch (error) {
        console.log("Error sesión:", error);
        navigate("/login");
      }
    };

    init();
  }, []);

  return (
    <div className={`dashboard ${theme}`}>
      <Menu
        setSection={setSection}
        usuario={usuario}
        rol={rol}
        permisos={permisos}
        theme={theme}
      />

      <div className="dashboard-main">
        <div className="dashboard-content">

          {/* 🔥 SWITCH TEMA */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: theme === "light" ? "#0f172a" : "#f1f5f9",
                color: theme === "light" ? "#f1f5f9" : "#0f172a",
                fontWeight: "bold",
                transition: "all 0.3s",
              }}
            >
              {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
            </button>
          </div>

          <div className="watermark">BRUKI</div>

          {section === "home" && (
            <>
              <h2>Bruki Backoffice</h2>
              <p>Panel de administración</p>
            </>
          )}

          {section === "usuarios" && <Usuarios />}
          {section === "articulos" && <Articulos />}
          {section === "subarticulos" && (
            <SubArticulos setSection={setSection} />
            
          )}
          {section === "clasificaciones" && (
        <Clasificaciones setSection={setSection} />
      )}
          {section === "departamentos" && (
            <Departamentos setSection={setSection} />
          )}
          {section === "subdepartamentos" && (
            <SubDepartamentos setSection={setSection} />
          )}
          {section === "proveedores" && <Proveedores />}
          {section === "marcas" && <Marcas />}
          {section === "otros_tributos" && <OtrosTributos />}

          {section === "impuestos" && <h2>Impuestos</h2>}
          {section === "balanzas" && <h2>Balanzas</h2>}
          {section === "formas_pago" && <h2>Formas de pago</h2>}
          {section === "formas_pago_cuotas" && <h2>Formas de pago - cuotas</h2>}
        {section === "monedas" && <Monedas />}
          {section === "funciones_usuario" && <h2>Funciones de usuarios</h2>}
          {section === "movimientos_stock" && <h2>Tipos de movimientos de stock</h2>}
          {section === "config_pos" && <h2>Configuración POS</h2>}
          {section === "config_general" && <h2>Configuración General</h2>}
          {section === "asistente" && <h2>Asistente de configuración</h2>}

          {section === "Mi Información" && (
            <MiInformacion
              usuario={{
                nameAndSurname: usuario,
                userRole: rol,
              }}
              mode={theme}
            />
          )}

        </div>
      </div>
    </div>
  );
}