
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EmpresaSelect.css";
import { useAlert } from "../../context/Alertcontext";
import { useLanguage } from "../../context/LanguageContext";

export default function EmpresaSelect() {
  console.log("EMPRESASELECT RENDER");

  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const { t } = useLanguage();

  // =========================================================
  // DATOS GUARDADOS DEL LOGIN
  // =========================================================

  const storedPIN = sessionStorage.getItem("PIN");
  const storedPassword = sessionStorage.getItem("password");

  const empresas =
    location.state?.companies ||
    JSON.parse(
      sessionStorage.getItem("empresas") || "[]"
    );

  // =========================================================
  // ESTADOS
  // =========================================================

  const [empresaSeleccionada, setEmpresaSeleccionada] =
    useState(null);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // VALIDAR SESIÓN DE SELECCIÓN
  // =========================================================

  useEffect(() => {
    console.log("=================================");
    console.log("EMPRESA SELECT");
    console.log("storedPIN:", storedPIN);
    console.log("empresas:", empresas);
    console.log("empresas.length:", empresas?.length);
    console.log("=================================");

    if (
      !storedPIN ||
      !storedPassword ||
      !Array.isArray(empresas) ||
      empresas.length === 0
    ) {
      console.log(
        "REDIRECCIONANDO AL LOGIN"
      );

      showAlert(
        t("empresaSelect.loginFirst"),
        "info"
      );

      navigate("/login", {
        replace: true,
      });
    }
  }, []);

  // =========================================================
  // INGRESAR A LA EMPRESA
  // =========================================================

  const handleIngresar = async () => {
    if (loading) return;

    if (!empresaSeleccionada) {
      showAlert(
        t("empresaSelect.selectCompany"),
        "info"
      );
      return;
    }

    try {
      setLoading(true);

      console.log("=================================");
      console.log("SELECCIONANDO EMPRESA");
      console.log("PIN:", storedPIN);
      console.log(
        "EMPRESA:",
        empresaSeleccionada
      );
      console.log("=================================");

      // =====================================================
      // COMPLETAR LOGIN
      //
      // Esta petición NO usa apiFetch.
      //
      // Es parte del proceso de autenticación inicial.
      // El backend se encarga de establecer/actualizar
      // las cookies HttpOnly.
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
            PIN: storedPIN,
            password: storedPassword,
            companyName: empresaSeleccionada,
          }),
        }
      );

      // =====================================================
      // LEER RESPUESTA
      // =====================================================

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("LOGIN EMPRESA STATUS:", res.status);
      console.log("LOGIN EMPRESA RESPONSE:", data);
      console.log("LOGIN EMPRESA CODE:", data.code);

      // =====================================================
      // ERRORES
      // =====================================================

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(
            t("empresaSelect.wrongCredentials")
          );
        }

        if (res.status === 403) {
          throw new Error(
            t("empresaSelect.forbidden")
          );
        }

        throw new Error(
          data.message ||
          t("empresaSelect.serverError")
        );
      }

      // =====================================================
      // LOGIN COMPLETADO
      // =====================================================

      if (data.code === "COMPLETED") {

        // -----------------------------------------------
        // Indicadores del frontend
        // -----------------------------------------------

        localStorage.setItem(
          "auth",
          "true"
        );

        localStorage.setItem(
          "empresa",
          empresaSeleccionada
        );

        localStorage.setItem(
          "usuario",
          storedPIN
        );

        // -----------------------------------------------
        // Ya no necesitamos los datos temporales
        // -----------------------------------------------

        sessionStorage.removeItem("PIN");
        sessionStorage.removeItem("password");
        sessionStorage.removeItem("empresas");

        showAlert(
          t("empresaSelect.loginSuccess"),
          "success"
        );

        // -----------------------------------------------
        // Entramos al Dashboard
        // -----------------------------------------------

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      // =====================================================
      // RESPUESTA DESCONOCIDA
      // =====================================================

      throw new Error(
        data.message ||
        data.code ||
        t("empresaSelect.serverError")
      );

    } catch (error) {
      console.error(
        "❌ EMPRESA SELECT ERROR:",
        error
      );

      showAlert(
        error.message ||
        t("empresaSelect.connectionError"),
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="empresa-page">

      <div className="empresa-card">

        {/* ===================================================
            TÍTULO
        =================================================== */}

        <h2 className="empresa-title">
          {t("empresaSelect.title")}
        </h2>

        {/* ===================================================
            EMPRESAS
        =================================================== */}

        <div className="empresa-grid">

          {empresas.map((e) => (
            <div
              key={e.value}
              className={`empresa-item ${
                empresaSeleccionada === e.value
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setEmpresaSeleccionada(e.value)
              }
            >
              {e.value}
            </div>
          ))}

        </div>

        {/* ===================================================
            BOTÓN
        =================================================== */}

        <button
          type="button"
          className="empresa-btn"
          onClick={handleIngresar}
          disabled={
            loading ||
            !empresaSeleccionada
          }
        >
          {loading
            ? t("empresaSelect.entering")
            : t("empresaSelect.enter")}
        </button>

      </div>

    </div>
  );
}
