import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Menu from "../../components/Menu";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
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
import IvaAlicuotas from "../IvaAlicuotas/IvaAlicuotas";
import {
  useAlert
} from "../../context/Alertcontext";
import { useLanguage } from "../../context/LanguageContext";
import Estadisticas from "../Estadisticas/Estadisticas";
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
  const [todayStats, setTodayStats] = useState({
  totalRevenue: 0,
  tickets: 0,
  averageRevenue: 0,
});

const [monthStats, setMonthStats] = useState({
  totalRevenue: 0,
  tickets: 0,
  averageRevenue: 0,
});

const [criticalStock, setCriticalStock] = useState([]);
const [salesHistory, setSalesHistory] = useState([]);

  // 🔥 Cargar sesión + usuario + permisos
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/user/me", {
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
          "/api/auth/check-permissions",
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
    cargarDashboardStats();
  }, []);
  const handleLogout = async () => {
  try {
    const res = await fetch(
      "/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (res.status === 204) {
      navigate("/login");
      return;
    }

    console.error("Error logout:", res.status);
    navigate("/login");
  } catch (error) {
    console.error("Error logout:", error);
    navigate("/login");
  }
};
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

const cargarDashboardStats = async () => {
  try {
    const [
      salesRes,
      todayRes,
      monthRes,
      criticalRes
    ] = await Promise.all([
      fetch(
<<<<<<< HEAD
        "/api/report/sales/year-and-month",
=======
        "/report/sales/year-and-month",
>>>>>>> b0a1b94 (save local changes)
        {
          credentials: "include",
        }
      ),

      fetch(
<<<<<<< HEAD
        "/api/report/sales/today",
=======
        "/report/sales/today",
>>>>>>> b0a1b94 (save local changes)
        {
          credentials: "include",
        }
      ),

      fetch(
<<<<<<< HEAD
        "/api/report/sales/current-month",
=======
        "/report/sales/current-month",
>>>>>>> b0a1b94 (save local changes)
        {
          credentials: "include",
        }
      ),

      fetch(
<<<<<<< HEAD
        "/api/report/critical-stock-items",
=======
        "/report/critical-stock-items",
>>>>>>> b0a1b94 (save local changes)
        {
          credentials: "include",
        }
      ),
    ]);

    const salesData = await salesRes.json();
    const todayData = await todayRes.json();
    const monthData = await monthRes.json();
    const criticalData = await criticalRes.json();

    const months = [
      "",
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic"
    ];

    setSalesHistory(
      salesData.map(item => ({
        mes: `${months[item.month]}/${item.year}`,
        ventas: item.revenue
      }))
    );

    setTodayStats(todayData);
    setMonthStats(monthData);
    setCriticalStock(criticalData);

  } catch (error) {
    console.error("Error Dashboard:", error);
  }
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
        <div className="kpi-icon red">⚠️</div>
        <div className="kpi-content">
          <div className="kpi-title">Stock Crítico</div>

<div className="kpi-value">
  {criticalStock.length}
</div>

<div className="kpi-subtitle">
  Productos críticos
</div>
        </div>
      </div>

<div className="kpi-card">
  <div className="kpi-icon blue">🎟️</div>

  <div className="kpi-content">
    <div className="kpi-title">
      Tickets del Mes
    </div>

    <div className="kpi-value">
      {monthStats.tickets}
    </div>

    <div className="kpi-subtitle">
      Ventas registradas
    </div>
  </div>
</div>

    <div className="kpi-card">
  <div className="kpi-icon green">💵</div>

  <div className="kpi-content">
    <div className="kpi-title">Ventas Hoy</div>

    <div className="kpi-value">
      $
      {Number(
        todayStats.totalRevenue || 0
      ).toLocaleString("es-AR")}
    </div>

    <div className="kpi-trend positive">
      {todayStats.tickets} tickets
    </div>

    <div className="kpi-subtitle">
      Promedio $
      {Number(
        todayStats.averageRevenue || 0
      ).toLocaleString("es-AR")}
    </div>
  </div>
</div>

<div className="kpi-card">
  <div className="kpi-icon gold">📈</div>

  <div className="kpi-content">
    <div className="kpi-title">
      {t.monthSales}
    </div>

    <div className="kpi-value">
      $
      {Number(
        monthStats.totalRevenue || 0
      ).toLocaleString("es-AR")}
    </div>

    <div className="kpi-trend positive">
      {monthStats.tickets} tickets
    </div>

    <div className="kpi-subtitle">
      Promedio $
      {Number(
        monthStats.averageRevenue || 0
      ).toLocaleString("es-AR")}
    </div>
  </div>
</div>
      </div>
    

    {/* ================= PANEL PRINCIPAL ================= */}
    <div className="home-panels">
      {/* GRÁFICO */}
      <div className="panel-card">
        <h3>📈 {t.salesChart}</h3>
      <div
  style={{
    width: "100%",
    height: "300px"
  }}
>
  <ResponsiveContainer>
    <LineChart data={salesHistory}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="mes" />

      <YAxis />

      <Tooltip
        formatter={(value) =>
          `$${Number(value).toLocaleString("es-AR")}`
        }
      />

      <Line
        type="monotone"
        dataKey="ventas"
        stroke="#2563eb"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
      </div>

      {/* STOCK CRÍTICO */}
      <div className="panel-card">
        <h3>⚠️ {t.criticalStock}</h3>
     <ul className="simple-list">
  {criticalStock
    .slice(0, 5)
    .map((item, index) => (
      <li key={index}>
        {item.item}
        <br />
        Stock: {item.currentStock}
        {" | "}
        PP: {item.reorderPoint}
      </li>
    ))}
</ul>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="panel-card">
      <h3>📊 Resumen Comercial</h3>
      <ul className="simple-list">
  <li>
    Ventas hoy: {todayStats.tickets}
  </li>

  <li>
    Facturación hoy:
    {" "}
    $
    {Number(
      todayStats.totalRevenue || 0
    ).toLocaleString("es-AR")}
  </li>

  <li>
    Ventas del mes:
    {" "}
    {monthStats.tickets}
  </li>

  <li>
    Facturación mensual:
    {" "}
    $
    {Number(
      monthStats.totalRevenue || 0
    ).toLocaleString("es-AR")}
  </li>

  <li>
    Productos críticos:
    {" "}
    {criticalStock.length}
  </li>
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
  onClick={handleLogout}
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
          {section === "iva_alicuotas" && (
  <IvaAlicuotas setSection={setSection} />
)}
          {section === "Estadisticas" && <Estadisticas />}
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