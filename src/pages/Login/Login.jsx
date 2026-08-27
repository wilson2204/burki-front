
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

  // =========================================================
  // TEMA
  // =========================================================

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

  // =========================================================
  // TEXTOS
  // =========================================================

  const texts = {
    es: {
      title: "Backoffice Bruki",
      subtitle: "Ingresá con tu usuario",
      pin: "PIN",
      password: "Contraseña",
      login: "Iniciar sesión",
      loading: "Cargando...",
      quick: "Usuario Demo",

      emptyFields: "Completá PIN y contraseña",
      loginSuccess: "Login exitoso 👋",
      selectCompany: "Elegí tu empresa 👇",

      incorrectCredentials: "PIN o contraseña incorrectos",
      forbidden: "Acceso prohibido",
      validationError: "Error de validación",
      serverError: "Error del servidor",
      connectionError: "Error de conexión",

      spanish: "Español",
      english: "English",
      portuguese: "Português",
    },

    en: {
      title: "Bruki Backoffice",
      subtitle: "Sign in with your account",
      pin: "PIN",
      password: "Password",
      login: "Login",
      loading: "Loading...",
      quick: "Demo User",

      emptyFields: "Enter PIN and password",
      loginSuccess: "Login successful 👋",
      selectCompany: "Choose your company 👇",

      incorrectCredentials: "Incorrect PIN or password",
      forbidden: "Access denied",
      validationError: "Validation error",
      serverError: "Server error",
      connectionError: "Connection error",

      spanish: "Español",
      english: "English",
      portuguese: "Português",
    },

    pt: {
      title: "Bruki Backoffice",
      subtitle: "Entre com sua conta",
      pin: "PIN",
      password: "Senha",
      login: "Entrar",
      loading: "Carregando...",
      quick: "Usuário Demo",

      emptyFields: "Preencha o PIN e a senha",
      loginSuccess: "Login realizado com sucesso 👋",
      selectCompany: "Escolha sua empresa 👇",

      incorrectCredentials: "PIN ou senha incorretos",
      forbidden: "Acesso negado",
      validationError: "Erro de validação",
      serverError: "Erro do servidor",
      connectionError: "Erro de conexão",

      spanish: "Español",
      english: "English",
      portuguese: "Português",
    },
  };

  const t = texts[language] || texts.es;

  // =========================================================
  // CAMBIAR IDIOMA
  // =========================================================

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    setShowLanguages(false);
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    const cleanPIN = PIN.trim();

    if (!cleanPIN || !password) {
      showAlert(t.emptyFields, "error");
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // LOGIN
      //
      // IMPORTANTE:
      // El LOGIN NO utiliza /auth/refresh.
      //
      // El refresh queda exclusivamente en api.js.
      // =====================================================

      const res = await fetch(
        "http://localhost:8080/back_office/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PIN: cleanPIN,
            password,
          }),
        }
      );

      // =====================================================
      // RESPUESTA
      // =====================================================

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("LOGIN STATUS:", res.status);
      console.log("LOGIN DATA:", data);
      console.log("LOGIN CODE:", data.code);
      console.log("COMPANIES:", data.companies);

      // =====================================================
      // ERRORES
      // =====================================================

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(t.incorrectCredentials);
        }

        if (res.status === 403) {
          throw new Error(t.forbidden);
        }

        if (res.status === 422) {
          throw new Error(
            data.message ||
            data.code ||
            t.validationError
          );
        }

        throw new Error(
          data.message ||
          t.serverError
        );
      }

      // =====================================================
      // UNA SOLA EMPRESA
      // =====================================================

      if (data.code === "COMPLETED") {
        localStorage.setItem("auth", "true");
        localStorage.setItem("usuario", cleanPIN);

        showAlert(
          t.loginSuccess,
          "success"
        );

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      // =====================================================
      // VARIAS EMPRESAS
      // =====================================================

      if (data.code === "SELECT") {
        const companies = Array.isArray(data.companies)
          ? data.companies
          : [];

        sessionStorage.setItem(
          "PIN",
          cleanPIN
        );

        sessionStorage.setItem(
          "password",
          password
        );

        sessionStorage.setItem(
          "empresas",
          JSON.stringify(companies)
        );

        showAlert(
          t.selectCompany,
          "success"
        );

        navigate("/empresa-select", {
          replace: true,
          state: {
            companies,
          },
        });

        return;
      }

      // =====================================================
      // RESPUESTA DESCONOCIDA
      // =====================================================

      throw new Error(
        data.message ||
        data.code ||
        t.serverError
      );

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      showAlert(
        error.message ||
        t.connectionError,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ACCESO RÁPIDO
  // =========================================================

  const accesoRapido = () => {
    setPIN("TA0000");
    setPassword("123456789");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="login-page">

      {/* =====================================================
          TEMA
      ===================================================== */}

      <button
        type="button"
        className="google-theme-toggle"
        onClick={() =>
          setDarkMode((prev) => !prev)
        }
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <form
        className="login-card"
        onSubmit={handleLogin}
      >

        {/* ===================================================
            IDIOMA
        =================================================== */}

        <div className="login-language-wrapper">

          <button
            type="button"
            className="login-language"
            onClick={() =>
              setShowLanguages((prev) => !prev)
            }
          >
            🌐

            <span>
              {language === "es"
                ? "🇦🇷 ES"
                : language === "en"
                ? "🇺🇸 EN"
                : "🇧🇷 PT"}
            </span>

            <span className="arrow">
              {showLanguages ? "▲" : "▼"}
            </span>
          </button>

          {showLanguages && (
            <div className="language-dropdown">

              <button
                type="button"
                className={`language-option ${
                  language === "es"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  changeLanguage("es")
                }
              >
                🇦🇷 {t.spanish}
              </button>

              <button
                type="button"
                className={`language-option ${
                  language === "en"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  changeLanguage("en")
                }
              >
                🇺🇸 {t.english}
              </button>

              <button
                type="button"
                className={`language-option ${
                  language === "pt"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  changeLanguage("pt")
                }
              >
                🇧🇷 {t.portuguese}
              </button>

            </div>
          )}

        </div>

        {/* ===================================================
            LOGO
        =================================================== */}

        <img
          src={logo}
          alt="Bruki"
          className="login-logo"
        />

        {/* ===================================================
            TÍTULO
        =================================================== */}

        <h1 className="login-title">
          {t.title}
        </h1>

        <p className="login-subtitle">
          {t.subtitle}
        </p>

        {/* ===================================================
            PIN
        =================================================== */}

        <input
          type="text"
          placeholder={t.pin}
          className="login-input"
          value={PIN}
          onChange={(e) =>
            setPIN(e.target.value)
          }
          disabled={loading}
          autoComplete="username"
        />

        {/* ===================================================
            PASSWORD
        =================================================== */}

        <input
          type="password"
          placeholder={t.password}
          className="login-input"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          disabled={loading}
          autoComplete="current-password"
        />

        {/* ===================================================
            BOTÓN LOGIN
        =================================================== */}

        <button
          type="submit"
          className="login-button primary"
          disabled={loading}
        >
          {loading
            ? t.loading
            : t.login}
        </button>

        {/* ===================================================
            DIVISOR
        =================================================== */}

        <div className="login-divider">
          <span>o</span>
        </div>

        {/* ===================================================
            ACCESO RÁPIDO
        =================================================== */}

        <button
          type="button"
          className="quick-access-button"
          onClick={accesoRapido}
          disabled={loading}
        >
          🚀 {t.quick}
        </button>

      </form>
    </div>
  );
}
