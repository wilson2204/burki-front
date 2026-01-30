import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../../assets/bruki-logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState(null); // 👈 NUEVO

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !dni || !email || !email2 || !password || !password2) {
      setError("Completá todos los campos");
      return;
    }

    if (email !== email2) {
      setError("Los emails no coinciden");
      return;
    }

    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    console.log("REGISTER OK", {
      role,
      nombre,
      apellido,
      dni,
      email,
      password,
    });

    alert("Registro exitoso 🚀");
    navigate("/");
  };

  return (
    <div className={`register-page ${darkMode ? "dark" : ""}`}>
      {/* BOTÓN DARK MODE */}
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="register-card">
        <img src={logo} alt="Bruki" className="register-logo" />

        {/* =====================
            SELECCIÓN DE ROL
        ===================== */}
        {!role && (
          <>
            <h1 className="register-title">¿Cómo te querés registrar?</h1>
            <p className="register-subtitle">Elegí tu tipo de cuenta</p>

            <div className="role-selector">
              <button
                type="button"
                className="role-card"
                onClick={() => setRole("jefe")}
              >
                <span className="role-icon">👔</span>
                <strong>Jefe/a</strong>
                <small>Acceso completo</small>
              </button>

              <button
                type="button"
                className="role-card"
                onClick={() => setRole("empleado")}
              >
                <span className="role-icon">👷</span>
                <strong>Empleado/a</strong>
                <small>Acceso limitado</small>
              </button>
            </div>

            <button
              type="button"
              className="register-back"
              onClick={() => navigate("/")}
            >
              Volver al inicio
            </button>
          </>
        )}

        {/* =====================
            FORMULARIO
        ===================== */}
        {role && (
          <form onSubmit={handleRegister}>
            <h1 className="register-title">
              Registro {role === "jefe" ? "Jefe" : "Empleado"}
            </h1>

            <p className="register-subtitle">
              Completá tus datos para continuar
            </p>

            <input
              type="text"
              placeholder="Nombre"
              className="register-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Apellido"
              className="register-input"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            <input
              type="text"
              placeholder="DNI"
              className="register-input"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="email"
              placeholder="Repetir Email"
              className="register-input"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Repetir Contraseña"
              className="register-input"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />

            {error && (
              <p style={{ color: "#dc2626", fontSize: "14px" }}>{error}</p>
            )}

            <button type="submit" className="register-button">
              Registrarse
            </button>

            <button
              type="button"
              className="register-back"
              onClick={() => setRole(null)}
            >
              Cambiar tipo de cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
