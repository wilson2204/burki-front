import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/Alertcontext";
import "./Recuperar.css";

export default function Recuperar() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      showAlert("Ingresá tu email", "error");
      return;
    }

    // Simulación
    showAlert("Te enviamos un link de recuperación 📩", "success");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="recuperar-page">
      <form className="recuperar-card" onSubmit={handleSubmit}>
        <h2>Recuperar contraseña</h2>
        <p>Ingresá tu email y te enviaremos un enlace</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Enviar</button>

        <span onClick={() => navigate("/")}>
          Volver al login
        </span>
      </form>
    </div>
  );
}
