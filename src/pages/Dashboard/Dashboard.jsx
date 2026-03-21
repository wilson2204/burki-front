import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../components/Menu";
import Usuarios from "../Usuarios/Usuarios";
import Articulos from "../Articulos/Articulos";
import Departamentos from "../Departamentos/Departamentos";
import SubDepartamentos from "../Subdepartamentos/SubDepartamentos";
import SubArticulos from "../Sub-Articulos/Subarticulos";
import MiInformacion from "../Mi_Informacion/MiInformacion";

export default function Dashboard() {
  const [section, setSection] = useState("home");
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [permisos, setPermisos] = useState(null);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const cargarUsuario = async () => {
    try {
      const res = await fetch("http://localhost:8080/back_office/user/me", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsuario(data.nameAndSurname || "Usuario");
      setRol(data.userRole || "USER");
    } catch (error) {
      console.log("Error usuario:", error);
    }
  };

  const cargarPermisos = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/back_office/auth/check-permissions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          credentials: "include",
        }
      );
      if (!res.ok) return setPermisos(null);
      const data = await res.json();
      const permisosObj = {};
      data.forEach((p) => (permisosObj[p.operation] = p.isAllowed));
      setPermisos(permisosObj);
    } catch (error) {
      console.log("Error permisos:", error);
      setPermisos(null);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedRol = localStorage.getItem("rol");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUsuario(storedUser);
    setRol(storedRol);
    cargarUsuario();
    cargarPermisos();
  }, []);

  return (
    <div className={`dashboard ${theme}`}>
      <Menu setSection={setSection} usuario={usuario} rol={rol} permisos={permisos} theme={theme} />

      <div className="dashboard-main">
        <div className="dashboard-content">
          {/* Botón switch de modo */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
          {section === "subarticulos" && <SubArticulos setSection={setSection} />}
          {section === "departamentos" && <Departamentos setSection={setSection} />}
          {section === "subdepartamentos" && <SubDepartamentos setSection={setSection} />}
          {section === "Mi Información" && (
            <MiInformacion usuario={{ nameAndSurname: usuario, userRole: rol }} mode={theme} />
          )}
        </div>
      </div>
    </div>
  );
}