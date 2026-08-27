import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/menu.css";
import { Building2, Users } from "lucide-react";
import {
  Home,
  ChevronRight,
  Package,
  Coins,
  User,
  FileText,
  Wrench,
  BarChart3,
  LogOut,
  Moon,
  Menu as MenuIcon
} from "lucide-react";
import logo from "../assets/logo_con_sombreado-removebg-preview.png";
import { useLanguage } from "../context/LanguageContext";
import { apiFetch } from "../services/api";

export default function Menu({
  section,
  setSection,
  usuario,
  rol,
  permisos,
  collapsed,
  setCollapsed,
  showQuickAccess,
  setShowQuickAccess
}){
  const [openSystem, setOpenSystem] = useState(false);
  const [openParametros, setOpenParametros] = useState(false);
  const [openImpuestos, setOpenImpuestos] = useState(false);
  const [openEmpresa, setOpenEmpresa] = useState(false);
  const [openInformes, setOpenInformes] = useState(false);
const [openContable, setOpenContable] = useState(false);
const [openStock, setOpenStock] = useState(false);
  const [foto, setFoto] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";});
  const navigate = useNavigate();
const { t } = useLanguage();


  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) setFoto(fotoGuardada);
  }, []);
  useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [darkMode]);

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

      await apiFetch("/auth/logout", {
  method: "POST",
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
    <>
<button
  className={`sidebar-collapse-btn ${
    collapsed ? "floating" : ""
  }`}
  onClick={() => setCollapsed(!collapsed)}
>
  <MenuIcon size={18} />
</button>
      <aside className={collapsed ? "sidebar hidden" : "sidebar"}>
{/* HEADER */}
<div className="sidebar-header">
 <div className="sidebar-logo">
  <img
    src={logo}
    alt="BRUKI"
    className="sidebar-logo-image"
  />

  {!collapsed && (
    <span className="sidebar-title">BRUKI</span>
  )}
</div>

  <button
    className="sidebar-collapse-btn"
    onClick={() => setCollapsed(!collapsed)}
  >
    <MenuIcon size={18} />
  </button>
</div>

{/* MENÚ PRINCIPAL */}

{/* INICIO */}
<div
  className={`folder ${collapsed ? "collapsed" : ""} ${
    section === "home" ? "active" : ""
  }`}
  onClick={() => setSection("home")}
>
  <span className="folder-icon">
    <Home size={18} />
  </span>
  {!collapsed && <span className="folder-label">{t("menu.home")}</span>}
</div>

{/* SISTEMA */}
<div
  className={`folder ${collapsed ? "collapsed" : ""}`}
  onClick={() => setOpenSystem(!openSystem)}
>
  <span className="folder-icon">
    <Package size={18} />
  </span>

  {!collapsed && (
    <>
      <span className="folder-label">{t("menu.system")}</span>
      <ChevronRight
        size={16}
        className={`folder-arrow ${openSystem ? "open" : ""}`}
      />
    </>
  )}
</div>

{openSystem && !collapsed && (
  <div className="tree">
    <div className="tree-item disabled">{t("menu.users")}</div>
    <div
      className="tree-item"
      onClick={() => setSection("articulos")}>{t("menu.articles")}</div>
    <div className="tree-item disabled">{t("menu.subArticles")}</div>
    <div
  className="tree-item"
  onClick={() => setSection("combos")}
>
  {t("menu.combos")}
</div>
    <div
      className="tree-item"
      onClick={() => setSection("clasificaciones")}
    >
    {t("menu.classifications")}
    </div>

    <div className="menu-divider"></div>

    <div className="tree-item disabled">{t("menu.priceChanges")}</div>
    <div className="tree-item disabled">{t("menu.priceLists")}</div>
    <div
  className="tree-item"
  onClick={() => setSection("promociones")}
>
  {t("menu.promotions")}
</div>


    <div className="menu-divider"></div>

    <div
      className="tree-item"
      onClick={() => setSection("departamentos")}
    >
      {t("menu.departments")}
    </div>
    <div
      className="tree-item"
      onClick={() => setSection("subdepartamentos")}
    >
      {t("menu.subDepartments")}
    </div>

    <div className="menu-divider"></div>

    <div className="tree-item disabled">{t("menu.customers")}</div>
    <div className="tree-item disabled">{t("menu.customerCategories")}</div>
    <div
      className="tree-item"
      onClick={() => setSection("marcas")}
    >
      {t("menu.brands")}
    </div>
    <div
      className="tree-item"
      onClick={() => setSection("proveedores")}
    >
      {t("menu.suppliers")}
    </div>
  </div>
)}

{/* PARÁMETROS */}
<div
  className={`folder ${collapsed ? "collapsed" : ""}`}
  onClick={() => setOpenParametros(!openParametros)}
>
  <span className="folder-icon">
    <Coins size={18} />
  </span>

  {!collapsed && (
    <>
      <span className="folder-label">{t("menu.parameters")}</span>
      <ChevronRight
        size={16}
        className={`folder-arrow ${openParametros ? "open" : ""}`}
      />
    </>
  )}
</div>

{openParametros && !collapsed && (
  <div className="tree">
    {/* EMPRESA */}
    <div
      className="tree-item"
      onClick={() => setOpenEmpresa(!openEmpresa)}
    >
      {openEmpresa ? "▼" : "▶"} {t("menu.company")}
    </div>

    {openEmpresa && (
      <div className="tree" style={{ marginLeft: "15px" }}>
        <div className="tree-item disabled">{t("menu.company")}</div>
        <div
          className="tree-item"
          onClick={() => setSection("sucursales")}
        >
          {t("menu.branches")}
        </div>
        <div className="tree-item disabled">{t("menu.terminals")}</div>
      </div>
    )}

    {/* IMPUESTOS */}
    <div
      className="tree-item"
      onClick={() => setOpenImpuestos(!openImpuestos)}
    >
      {openImpuestos ? "▼" : "▶"} {t("menu.taxes")}
    </div>

    {openImpuestos && (
      <div className="tree" style={{ marginLeft: "15px" }}>
        <div
          className="tree-item"
          onClick={() => setSection("otros_tributos")}
        >
          {t("menu.otherTaxes")}
        </div>
      </div>
    )}

    <div
  className="tree-item"
  onClick={() => setSection("balanzas")}
>
  {t("menu.scales")}
</div>
    <div className="tree-item disabled">{t("menu.paymentMethods")}</div>
    <div className="tree-item disabled">{t("menu.installments")}</div>

    <div
      className="tree-item"
      onClick={() => setSection("monedas")}
    >
      {t("menu.foreignCurrency")}
    </div>

    <div className="menu-divider"></div>

    <div className="tree-item disabled">{t("menu.userRoles")}</div>
    <div className="tree-item disabled">
      {t("menu.stockMovements")}
    </div>
    <div className="tree-item disabled">{t("menu.posConfiguration")}</div>
    <div className="tree-item disabled">{t("menu.generalConfiguration")}</div>
    <div className="tree-item disabled">
      {t("menu.configurationWizard")}
    </div>
  </div>
)}

{/* RESTO DEL MENÚ */}
{/* STOCK */}
<div
  className={`folder ${collapsed ? "collapsed" : ""}`}
  onClick={() => setOpenStock(!openStock)}
>
  <span className="folder-icon">
    <Package size={18} />
  </span>

  {!collapsed && (
    <>
      <span className="folder-label">
        {t("menu.stock")}
      </span>

      <ChevronRight
        size={16}
        className={`folder-arrow ${openStock ? "open" : ""}`}
      />
    </>
  )}
</div>


{openStock && !collapsed && (
  <div className="tree">

    <div
      className="tree-item"
      onClick={() => setSection("movimientos_stock")}
    >
      Movimientos de Stock
    </div>

  </div>
)}

<div className={`folder disabled ${collapsed ? "collapsed" : ""}`}>
  <span className="folder-icon">
    <Coins size={18} />
  </span>
  {!collapsed && <span className="folder-label">{t("menu.fiscal")}</span>}
</div>

<div className={`folder disabled ${collapsed ? "collapsed" : ""}`}>
  <span className="folder-icon">
    <User size={18} />
  </span>
  {!collapsed && <span className="folder-label">{t("menu.myInformation")}</span>}
</div>

{/* INFORMES */}
<div
  className={`folder ${collapsed ? "collapsed" : ""}`}
  onClick={() => setOpenInformes(!openInformes)}
>
  <span className="folder-icon">
    <FileText size={18} />
  </span>

  {!collapsed && (
    <>
      <span className="folder-label">{t("menu.reports")}</span>
      <ChevronRight
        size={16}
        className={`folder-arrow ${openInformes ? "open" : ""}`}
      />
    </>
  )}
</div>

{openInformes && !collapsed && (
  <div className="tree">

    <div className="tree-item disabled">{t("menu.reportArticles")}</div>
<div className="tree-item disabled">{t("menu.reportLabels")}</div>
<div className="tree-item disabled">{t("menu.reportStock")}</div>
<div className="tree-item disabled">{t("menu.reportDepartments")}</div>

    <div className="menu-divider"></div>

    <div className="tree-item disabled">{t("menu.reportCustomers")}</div>
<div className="tree-item disabled">{t("menu.reportAccounts")}</div>


    <div className="menu-divider"></div>

    <div className="tree-item disabled">{t("menu.reportSales")}</div>
<div className="tree-item disabled">{t("menu.reportCash")}</div>

<div className="tree-item disabled">{t("menu.reportFinance")}</div>

    <div
      className="tree-item"
      onClick={() => setOpenContable(!openContable)}
    >
      {openContable ? "▼" : "▶"} {t("menu.accounting")}
    </div>

    {openContable && (
      <div className="tree" style={{ marginLeft: "15px" }}>

        <div className="tree-item disabled">
  {t("menu.vatSalesJournal")}
</div>

        <div
  className="tree-item"
  onClick={() => setSection("iva_alicuotas")}
>
  {t("menu.vatRates")}
</div>

      </div>
    )}

  </div>
)}

<div className={`folder disabled ${collapsed ? "collapsed" : ""}`}>
  <span className="folder-icon">
    <Wrench size={18} />
  </span>
  {!collapsed && <span className="folder-label">{t("menu.tools")}</span>}
</div>

<div
  className={`folder ${collapsed ? "collapsed" : ""}`}
  onClick={() => setSection("Estadisticas")}
>
  <span className="folder-icon">
    <BarChart3 size={18} />
  </span>
  {!collapsed && <span className="folder-label">{t("menu.statistics")}</span>}
</div>

{/* BOTÓN SALIR */}
<div className="logout" onClick={handleLogout}>
  <LogOut size={18} />
  {!collapsed && (
    <span>
      {isLoggingOut
  ? t("menu.loggingOut")
  : t("common.exit")}
    </span>
  )}
</div>
{showQuickAccess && (
  <div className="quick-access-wrapper">
    <div className="quick-access-bar">

      <div className="quick-item" onClick={() => setSection("articulos")}>
        <Package size={42} />
        <span>{t("menu.articles")}</span>
      </div>

      <div className="quick-item" onClick={() => setSection("departamentos")}>
        <Building2 size={42} />
        <span>{t("menu.departmentsShort")}</span>
      </div>

      <div className="quick-item" onClick={() => setSection("usuarios")}>
        <Users size={42} />
        <span>{t("menu.customers")}</span>
      </div>

      <div className="quick-item salir" onClick={() => navigate("/login")}>
        <LogOut size={42} />
        <span>{t("common.exit")}</span>
      </div>

    </div>
  </div>
)}

{/* TARJETA MODO OSCURO */}
{!collapsed && (
  <div
    className="dark-mode-card"
    onClick={() => setDarkMode(!darkMode)}
    style={{ cursor: "pointer" }}
  >
    <div className="dark-mode-left">
      <Moon size={18} />
      <span>{t("menu.darkMode")}</span>
    </div>

    <span>{darkMode ? "🌙 ON" : "☀️ OFF"}</span>
  </div>
)}

      </aside>
    </>
  );
}