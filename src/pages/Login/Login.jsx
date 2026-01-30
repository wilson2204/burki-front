import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";
import logo from "../../assets/bruki-logo.png";
import { useAlert } from "../../context/Alertcontext";

export default function Login() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [darkMode, setDarkMode] = useState(false);
  const [alias, setAlias] = useState("");
  const [captchaValido, setCaptchaValido] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!alias) {
      showAlert("Completá el alias", "error");
      return;
    }

    if (!captchaValido) {
      showAlert("Confirmá que no sos un robot 🤖", "info");
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
          body: JSON.stringify({ alias }),
        }
      );

      if (!res.ok) {
        throw new Error("Alias incorrecto");
      }

      const data = await res.json();

      // 🔐 GUARDAMOS SESIÓN
      localStorage.setItem("token", data.token || "token-backend");
      localStorage.setItem("usuario", data.alias || alias);
      localStorage.setItem("rol", data.rol || "Usuario");
      localStorage.setItem("fotoPerfil", data.foto || "");

      showAlert(`Bienvenido ${data.alias || alias} 👋`, "success");

      navigate("/empresa-select");

    } catch (error) {
      showAlert(error.message || "Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${darkMode ? "dark" : ""}`}>

      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <form className="login-card" onSubmit={handleLogin}>
        <img src={logo} alt="Bruki" className="login-logo" />

        <h1 className="login-title">Backoffice Bruki</h1>
        <p className="login-subtitle">Ingresá con tu alias</p>

        <input
          type="text"
          placeholder="Alias"
          className="login-input"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />

        <div style={{ margin: "15px 0" }}>
          <ReCAPTCHA
            sitekey="6Lfhx0ksAAAAADxQAFkLoP1FAAtOY1EtvVZCl5h-"
            onChange={(value) => setCaptchaValido(!!value)}
          />
        </div>

        <button
          type="submit"
          className="login-button primary"
          disabled={!captchaValido || loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
