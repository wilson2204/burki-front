import { useState, useEffect } from "react";
import Menu from "../../components/Menu";
import Usuarios from "../Usuarios/Usuarios";
import Articulos from "../Articulos/Articulos";
import { useAlert } from "../../context/Alertcontext";

export default function Dashboard() {
  const [section, setSection] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [usuario, setUsuario] = useState("");

  const { showAlert } = useAlert();

  // 🔹 CARGAMOS EL USUARIO DESDE LOCALSTORAGE
  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (user) {
      setUsuario(user);

      // 🔔 ALERTA DE BIENVENIDA (solo una vez)
      showAlert(`Bienvenido ${user} 👋`, "success");
    }
  }, []);

  return (
    <div className={`dashboard ${darkMode ? "dark-mode" : ""}`}>
      <Menu setSection={setSection} usuario={usuario} />

      <main className="dashboard-main">

        {/* HEADER */}
        <div className="dashboard-header">
          <h2>{getTitle(section)}</h2>

          <button 
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Modo claro" : "🌙 Modo oscuro"}
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="dashboard-content">

          {section === "home" && (
            <p>Seleccioná una opción del menú.</p>
          )}

          {section === "usuarios" && <Usuarios />}
          {section === "articulos" && <Articulos />}

          {section === "departamentos" && <p>Módulo Departamentos</p>}
          {section === "movimientos" && <p>Módulo Movimientos</p>}
          {section === "sistema" && <p>Módulo Sistema</p>}
          {section === "stock" && <p>Módulo Stock</p>}
          {section === "fiscal" && <p>Módulo Fiscal</p>}
          {section === "informes" && <p>Módulo Informes</p>}
          {section === "restaurante" && <p>Módulo Restaurante</p>}
          {section === "herramientas" && <p>Módulo Herramientas</p>}
          {section === "parametros" && <p>Módulo Parámetros</p>}
          {section === "ayuda" && <p>Módulo Ayuda</p>}
          {section === "estadisticas" && <p>Módulo Estadísticas 📈</p>}

        </div>
      </main>
    </div>
  );
}

/* TITULOS */
function getTitle(section) {
  const titles = {
    home: "Inicio",
    usuarios: "Usuarios",
    articulos: "Artículos",
    departamentos: "Departamentos",
    movimientos: "Movimientos",
    sistema: "Sistema",
    stock: "Stock",
    fiscal: "Fiscal",
    informes: "Informes",
    restaurante: "Restaurante",
    herramientas: "Herramientas",
    parametros: "Parámetros",
    ayuda: "Ayuda",
    estadisticas: "Estadísticas"
  };

  return titles[section] || section;
}
