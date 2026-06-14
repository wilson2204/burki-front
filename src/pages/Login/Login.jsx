import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo_con_sombreado-removebg-preview.png";
import { useAlert } from "../../context/Alertcontext";

export default function Login() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [PIN, setPIN] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
const [language, setLanguage] = useState(
  localStorage.getItem("language") || "es"
);
const [showLanguages, setShowLanguages] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
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

  const texts = {
  es: {
    title: "Backoffice Bruki",
    subtitle: "Ingresá con tu usuario",
    pin: "PIN",
    password: "Contraseña",
    login: "Iniciar sesión",
    loading: "Cargando...",
    quick: "Acceso rápido"
  },

  en: {
    title: "Bruki Backoffice",
    subtitle: "Sign in with your account",
    pin: "PIN",
    password: "Password",
    login: "Login",
    loading: "Loading...",
    quick: "Quick Access"
  },

  pt: {
    title: "Bruki Backoffice",
    subtitle: "Entre com sua conta",
    pin: "PIN",
    password: "Senha",
    login: "Entrar",
    loading: "Carregando...",
    quick: "Acesso rápido"
  }
};

const t = texts[language];

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!PIN || !password) {
      showAlert("Completá PIN y contraseña", "error");
      return;
    }

    try {
      setLoading(true);

const res = await fetch(
  "/api/auth/login",
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      PIN,
      password,
    }),
  }
);

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) throw new Error("PIN o contraseña incorrectos");
        if (res.status === 403) throw new Error("Acceso prohibido");
        if (res.status === 422) throw new Error(data.code || "Error de validación");
        throw new Error("Error del servidor");
      }

      // Usuario con una sola empresa
  if (data.code === "COMPLETED") {
  showAlert("Login exitoso 👋", "success");

  await new Promise(resolve => setTimeout(resolve, 50)); // 🔥 importante

  navigate("/dashboard");
  return;
}

      // 🔥 Usuario con varias empresas
      if (data.code === "SELECT") {
        sessionStorage.setItem("PIN", PIN);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("empresas", JSON.stringify(data.companies));

        showAlert("Elegí tu empresa 👇", "success");

        navigate("/empresa-select", {
          state: { companies: data.companies },
        });
      }

    } catch (error) {
      console.error(error);
      showAlert(error.message || "Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

    const accesoRapido = () => {
    setPIN("TA0000"); // tu PIN
    setPassword("123456789"); // tu contraseña
  };

  return (
    <div className="login-page">

      <button
        className="google-theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <form className="login-card" onSubmit={handleLogin}>
     <div
  className="login-language"
  onClick={() => setShowLanguages(!showLanguages)}
>
  🌐

  <span>
    {language === "es"
      ? "🇦🇷 ES"
      : language === "en"
      ? "🇺🇸 EN"
      : "🇧🇷 PT"}
  </span>

  <span className="arrow">▼</span>

  {showLanguages && (
    <div className="language-dropdown">

      <div
        className="language-option"
        onClick={() => {
          setLanguage("es");
          localStorage.setItem("language", "es");
          setShowLanguages(false);
        }}
      >
        🇦🇷 Español
      </div>

      <div
        className="language-option"
        onClick={() => {
          setLanguage("en");
          localStorage.setItem("language", "en");
          setShowLanguages(false);
        }}
      >
        🇺🇸 English
      </div>

      <div
        className="language-option"
        onClick={() => {
          setLanguage("pt");
          localStorage.setItem("language", "pt");
          setShowLanguages(false);
        }}
      >
        🇧🇷 Português
      </div>

    </div>
  )}
</div>
        <img src={logo} alt="Bruki" className="login-logo" />

        <h1 className="login-title">{t.title}</h1>
        <p className="login-subtitle">{t.subtitle}</p>

        <input
          type="text"
          placeholder={t.pin}
          className="login-input"
          value={PIN}
          onChange={(e) => setPIN(e.target.value)}
        />

        <input
  type="password"
  placeholder={t.password}
  className="login-input"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

<button
  type="submit"
  className="login-button primary"
  disabled={loading}
>
  {loading ? t.loading : t.login}
</button>

<div className="login-divider">
  <span>o</span>
</div>

<button
  type="button"
  className="quick-access-button"
  onClick={accesoRapido}
>
  🚀 {t.quick}
</button>
      </form>
    </div>
  );
}