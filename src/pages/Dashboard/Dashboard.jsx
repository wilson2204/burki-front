import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Menu from "../../components/Menu";
import {
  Package,
  Building2,
  Boxes,
  Users,
  DollarSign,
  LogOut
} from "lucide-react";
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
import Combos from "../Combos/Combos";
import Empresa from "../Empresa/Empresa";
import Sucursales from "../Sucursales/Sucursales";
import Terminales from "../Terminales/Terminales";
import {
  useAlert
} from "../../context/Alertcontext";
import { useLanguage } from "../../context/LanguageContext";
export default function Dashboard() {
  const [section, setSection] = useState("home");
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [permisos, setPermisos] = useState(null);
const [menuCollapsed, setMenuCollapsed] = useState(false);
  const navigate = useNavigate();
const [showSettings, setShowSettings] = useState(false);
const [profileImage, setProfileImage] = useState(
  localStorage.getItem("profileImage") || null
);
const {
  notifications,
  setNotifications
} = useAlert();
const { language, setLanguage } = useLanguage();
const [showNotifications, setShowNotifications] =
  useState(false);

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
  const texts = {
  es: {
    settings: "Configuración",
    language: "Idioma",

    hello: "Hola",
    welcome:
      "Bienvenido al panel de administración de Bruki Backoffice",

    articles: "Artículos",
    clients: "Clientes",
    departments: "Departamentos",
    monthSales: "Ventas del Mes",
    previousMonth: "vs mes anterior",

    salesChart: "Ventas de los últimos 6 meses",
    salesGraph: "Gráfico de Ventas",

    criticalStock: "Stock Crítico",
    recentActivity: "Actividad Reciente",

    newArticle: "Nuevo artículo creado",
    newSale: "Nueva venta realizada",
    registeredClient: "Cliente registrado",
    updatedStock: "Stock actualizado",
    connectedUser: "Usuario conectado",

    stock: "Stock",
    prices: "Precios",
    logout: "Salir"
  },

  en: {
    settings: "Settings",
    language: "Language",

    hello: "Hello",
    welcome:
      "Welcome to the Bruki Backoffice administration panel",

    articles: "Articles",
    clients: "Clients",
    departments: "Departments",
    monthSales: "Monthly Sales",
    previousMonth: "vs previous month",

    salesChart: "Sales of the last 6 months",
    salesGraph: "Sales Chart",

    criticalStock: "Critical Stock",
    recentActivity: "Recent Activity",

    newArticle: "New article created",
    newSale: "New sale completed",
    registeredClient: "Client registered",
    updatedStock: "Stock updated",
    connectedUser: "User connected",

    stock: "Stock",
    prices: "Prices",
    logout: "Logout"
  },

  pt: {
    settings: "Configurações",
    language: "Idioma",

    hello: "Olá",
    welcome:
      "Bem-vindo ao painel administrativo Bruki Backoffice",

    articles: "Artigos",
    clients: "Clientes",
    departments: "Departamentos",
    monthSales: "Vendas do Mês",
    previousMonth: "vs mês anterior",

    salesChart: "Vendas dos últimos 6 meses",
    salesGraph: "Gráfico de Vendas",

    criticalStock: "Estoque Crítico",
    recentActivity: "Atividade Recente",

    newArticle: "Novo artigo criado",
    newSale: "Nova venda realizada",
    registeredClient: "Cliente registrado",
    updatedStock: "Estoque atualizado",
    connectedUser: "Usuário conectado",

    stock: "Estoque",
    prices: "Preços",
    logout: "Sair"
  }
};

const t = texts[language];

const handleProfileImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setProfileImage(reader.result);

    localStorage.setItem(
      "profileImage",
      reader.result
    );
  };

  reader.readAsDataURL(file);
};

  return (
  <div className="dashboard">
<Menu
  section={section}
  setSection={setSection}
  usuario={usuario}
  rol={rol}
  permisos={permisos}
  collapsed={menuCollapsed}
  setCollapsed={setMenuCollapsed}
/>
      <div
  className="dashboard-main"
  style={{
    marginLeft: menuCollapsed ? "70px" : "260px",
    transition: "all 0.3s ease"
  }}
>
        <div className="dashboard-content">
          <div className="watermark">BRUKI</div>

{section === "home" && (
  <>
{/* ================= HEADER SUPERIOR ================= */}
<div className="top-header">
  <div className="top-header-left"></div>

  <div className="top-header-right">

    {/* BOTÓN CONFIGURACIÓN CON CAMBIO DE IDIOMA */}
    <div className="settings-dropdown">
      <button
        className="top-icon-btn"
        onClick={() =>
          setShowSettings((prev) => !prev)
        }
      >
        ⚙️
      </button>

      {showSettings && (
        <div className="settings-menu">
          <div className="settings-title">
            {t.settings}
          </div>

          <div className="settings-section">
            <span className="settings-label">
              🌐 {t.language}
            </span>

            <select
              className="language-select"
              value={language}
              onChange={(e) => {
                const newLanguage = e.target.value;
                setLanguage(newLanguage);
                localStorage.setItem(
                  "language",
                  newLanguage
                );
              }}
            >
              <option value="es">🇦🇷 Español</option>
              <option value="en">🇺🇸 English</option>
              <option value="pt">🇧🇷 Português</option>
            </select>
          </div>
        </div>
      )}
    </div>

<div className="top-user-avatar">
  {profileImage ? (
    <img
      src={profileImage}
      alt="avatar"
      className="top-user-avatar-img"
    />
  ) : (
    (usuario || "U")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  )}
</div>
      <div className="top-user-info">
        <span className="top-user-name">
          {usuario || "Usuario"}
        </span>
        <span className="top-user-role">
          {rol || "ADMIN"}
        </span>
      </div>
    </div>
  </div>

    {/* ================= HEADER PRINCIPAL ================= */}
    <div className="home-header">
      <h1>{t.hello}, {usuario || "Usuario"} 👋</h1>
      <p>{t.welcome}</p>
    </div>

    {/* ================= KPI CARDS ================= */}
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon purple">📦</div>
        <div className="kpi-content">
          <div className="kpi-title">{t.articles}</div>
          <div className="kpi-value">12.356</div>
          <div className="kpi-trend positive">↑ 8.2%</div>
          <div className="kpi-subtitle">vs mes anterior</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon blue">👥</div>
        <div className="kpi-content">
          <div className="kpi-title">{t.clients}</div>
          <div className="kpi-value">4.872</div>
          <div className="kpi-trend positive">↑ 6.4%</div>
          <div className="kpi-subtitle">vs mes anterior</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon green">🏢</div>
        <div className="kpi-content">
          <div className="kpi-title">{t.branches}</div>
          <div className="kpi-value">8</div>
          <div className="kpi-trend positive">↑ 2</div>
          <div className="kpi-subtitle">vs mes anterior</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon gold">💰</div>
        <div className="kpi-content">
          <div className="kpi-title">{t.monthSales}</div>
          <div className="kpi-value">$12.450.000</div>
          <div className="kpi-trend positive">↑ 15.3%</div>
          <div className="kpi-subtitle">{t.previousMonth}</div>
        </div>
      </div>
    </div>

    {/* ================= PANEL PRINCIPAL ================= */}
    <div className="home-panels">
      {/* GRÁFICO */}
      <div className="panel-card">
        <h3>📈 {t.salesChart}</h3>
        <div className="chart-placeholder">
          {t.salesGraph}
        </div>
      </div>

      {/* STOCK CRÍTICO */}
      <div className="panel-card">
        <h3>⚠️ {t.criticalStock}</h3>
        <ul className="simple-list">
          <li>Producto A — 12 u.</li>
          <li>Producto B — 8 u.</li>
          <li>Producto C — 5 u.</li>
          <li>Producto D — 3 u.</li>
          <li>Producto E — 2 u.</li>
        </ul>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="panel-card">
        <h3>🕒 {t.recentActivity}</h3>
        <ul className="simple-list">
          <li>{t.newArticle}</li>
          <li>{t.newSale}</li>
          <li>{t.registeredClient}</li>
          <li>{t.updatedStock}</li>
          <li>{t.connectedUser}</li>
        </ul>
      </div>
    </div>

    {/* ================= ACCESOS RÁPIDOS ================= */}
<div className="quick-access-wrapper">
  <div className="quick-access-bar">
    
    <div
      className="quick-item"
      onClick={() => setSection("articulos")}
    >
      <Package size={42} />
      <span>{t.articles}</span>
    </div>

    <div
      className="quick-item"
      onClick={() => setSection("departamentos")}
    >
      <Building2 size={42} />
      <span>{t.departments}</span>
    </div>

    {/* ❌ DESHABILITADOS */}
    <div className="quick-item disabled">
      <Boxes size={42} />
      <span>{t.stock}</span>
    </div>

    <div className="quick-item disabled">
      <Users size={42} />
      <span>{t.clients}</span>
    </div>

    <div className="quick-item disabled">
      <DollarSign size={42} />
      <span>{t.prices}</span>
    </div>

    <div
      className="quick-item salir"
      onClick={() => navigate("/login")}
    >
      <LogOut size={42} />
      <span>{t.logout}</span>
    </div>

  </div>
</div>
  </>
)}
          {section === "usuarios" && <Usuarios />}
{section === "articulos" && <Articulos setSection={setSection} />}
          {section === "subarticulos" && (
            <SubArticulos setSection={setSection} />
            
          )}
          {section === "combos" && <Combos />}
          {section === "clasificaciones" && (
        <Clasificaciones setSection={setSection} />
      )}
          {section === "departamentos" && (
            <Departamentos setSection={setSection} />
          )}
          {section === "subdepartamentos" && (
            <SubDepartamentos setSection={setSection} />
          )}
          {section === "proveedores" && <Proveedores setSection={setSection} />}
          {section === "marcas" && <Marcas setSection={setSection} />}
          {section === "empresa" && <Empresa />}
{section === "sucursales" && <Sucursales setSection={setSection} />}
{section === "terminales" && <Terminales />}
          {section === "otros_tributos" && (
  <OtrosTributos setSection={setSection} />
)}
          {section === "impuestos" && <h2>Impuestos</h2>}
          {section === "balanzas" && <h2>Balanzas</h2>}
          {section === "formas_pago" && <h2>Formas de pago</h2>}
          {section === "formas_pago_cuotas" && <h2>Formas de pago - cuotas</h2>}
          {section === "monedas" && (<Monedas setSection={setSection} />)}
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
              mode={document.body.classList.contains("dark") ? "dark" : "light"}
            />
          )}

        </div>
      </div>
    </div>
  );
}