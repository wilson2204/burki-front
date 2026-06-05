import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EmpresaSelect.css";
import { useAlert } from "../../context/Alertcontext";
import { useLanguage } from "../../context/LanguageContext";

export default function EmpresaSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const storedPIN = sessionStorage.getItem("PIN");
  const storedPassword = sessionStorage.getItem("password");

  const empresas =
    location.state?.companies ||
    JSON.parse(sessionStorage.getItem("empresas") || "[]");

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    if (!storedPIN || empresas.length === 0) {
      showAlert(t("empresaSelect.loginFirst"), "info");
      navigate("/login");
    }
  }, []);

  const handleIngresar = async () => {
    if (!empresaSeleccionada) {
      return showAlert(t("empresaSelect.selectCompany"), "info");
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/back_office/auth/login",
        {
          method: "POST",
          credentials: "include", // 🔥 USÁS COOKIE
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PIN: storedPIN,
            password: storedPassword,
            companyName: empresaSeleccionada,
          }),
        }
      );

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        if (res.status === 401)
          throw new Error(t("empresaSelect.wrongCredentials"));
        if (res.status === 403)
          throw new Error(t("empresaSelect.forbidden"));
        throw new Error(t("empresaSelect.serverError"));
      }

      if (data.code === "COMPLETED") {
        showAlert(t("empresaSelect.loginSuccess"), "success");

        // 🔥 CLAVE: guardar sesión en frontend
        localStorage.setItem("auth", "true");
        localStorage.setItem("empresa", empresaSeleccionada);
        localStorage.setItem("usuario", storedPIN);

        sessionStorage.clear();

        navigate("/dashboard", { replace: true });
      }

    } catch (error) {
      showAlert(
  error.message || t("empresaSelect.connectionError"),
  "error"
);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="empresa-page">
      <div className="empresa-card">
        <h2 className="empresa-title">
  {t("empresaSelect.title")}
</h2>

        <div className="empresa-grid">
          {empresas.map((e) => (
            <div
              key={e.value}
              className={`empresa-item ${
                empresaSeleccionada === e.value ? "active" : ""
              }`}
              onClick={() => setEmpresaSeleccionada(e.value)}
            >
              {e.value}
            </div>
          ))}
        </div>

        <button
          className="empresa-btn"
          onClick={handleIngresar}
          disabled={loading || !empresaSeleccionada}
        >
          {loading
  ? t("empresaSelect.entering")
  : t("empresaSelect.enter")}
        </button>
      </div>
    </div>
  );
}