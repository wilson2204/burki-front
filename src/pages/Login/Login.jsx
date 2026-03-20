import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/bruki-logo.png";
import { useAlert } from "../../context/Alertcontext";

export default function Login() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [PIN, setPIN] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!PIN || !password) {
      showAlert("Completá PIN y contraseña", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/back_office/auth/login",
        {
          method: "POST",
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

      // 🔥 Usuario con una sola empresa
      if (data.code === "COMPLETED") {
        showAlert("Login exitoso 👋", "success");
        navigate("/home");
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

  return (
    <div className="login-page">

      <button
        className="google-theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <form className="login-card" onSubmit={handleLogin}>
        <img src={logo} alt="Bruki" className="login-logo" />

        <h1 className="login-title">Backoffice Bruki</h1>
        <p className="login-subtitle">Ingresá con tu usuario</p>

        <input
          type="text"
          placeholder="PIN"
          className="login-input"
          value={PIN}
          onChange={(e) => setPIN(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="login-button primary"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}