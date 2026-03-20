import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../components/Menu";
import Usuarios from "../Usuarios/Usuarios";
import Articulos from "../Articulos/Articulos";
import Departamentos from "../Departamentos/Departamentos";
import SubDepartamentos from "../Subdepartamentos/Subdepartamentos";
import SubArticulos from "../Sub-Articulos/Subarticulos";

export default function Dashboard() {

  // 🔥 SECTIONS (IMPORTANTE)
  const [section, setSection] = useState("home");

  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [permisos, setPermisos] = useState(null);

  const navigate = useNavigate();

  // 🔐 USER.ME
  const cargarUsuario = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/back_office/user/me"
      
      );

      console.log("USER.ME STATUS:", res.status);

      if (!res.ok) {
        console.warn("⚠️ user/me falló");
        return;
      }

      const data = await res.json();
      console.log("USER DATA:", data);

      setUsuario(data.nameAndSurname || "Usuario");
      setRol(data.userRole || "USER");

    } catch (error) {
      console.log("Error usuario:", error);
    }
  };

  // 🔐 PERMISOS
  const cargarPermisos = async () => {
    try {

      const res = await fetch(
        "http://localhost:8080/back_office/auth/check-permissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operations: [
              "CREATE",
              "DELETE",
              "UPDATE",
              "BACK_OFFICE_ACCESS",
              "VIEWS_ACCESS",
              "USERS_ACCESS",
              "REPORTS_ACCESS"
            ]
          })
        }
      );

      console.log("PERMISOS STATUS:", res.status);

      if (!res.ok) {
        console.warn("⚠️ permisos fallaron");
        setPermisos(null);
        return;
      }

      const data = await res.json();
      console.log("PERMISOS DATA:", data);

      const permisosObj = {};
      data.forEach(p => {
        permisosObj[p.operation] = p.isAllowed;
      });

      setPermisos(permisosObj);

    } catch (error) {
      console.log("Error permisos:", error);
      setPermisos(null);
    }
  };

  // 🔥 INIT
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
    <div className="dashboard">

      <Menu
        setSection={setSection}   // 🔥 IMPORTANTE
        usuario={usuario}
        rol={rol}
        permisos={permisos}
      />

      <div className="dashboard-main">

        <div className="dashboard-content">

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
          {section === "departamentos" && (
            <Departamentos setSection={setSection} />
          )}
          {section === "subdepartamentos" && (
            <SubDepartamentos setSection={setSection} />
          )}

        </div>

      </div>

    </div>
  );
}