import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmpresaSelect.css";

export default function SelectEmpresa() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  useEffect(() => {
    setEmpresas([
      "Bruki SRL",
      "Wilson Tech",
      "Café Central",
    ]);
  }, []);

  const handleContinue = () => {
    if (!empresaSeleccionada) return;

    localStorage.setItem("empresa", empresaSeleccionada);
    navigate("/dashboard");
  };

  return (
    <div className="empresa-page">
      <div className="empresa-card">
        <h2>Seleccioná tu empresa</h2>
        <p>Elegí con cuál querés trabajar</p>

        <div className="empresa-grid">
          {empresas.map((e, i) => (
            <div
              key={i}
              className={`empresa-item ${
                empresaSeleccionada === e ? "active" : ""
              }`}
              onClick={() => setEmpresaSeleccionada(e)}
            >
              {e}
            </div>
          ))}
        </div>

        <button
          className="empresa-btn"
          onClick={handleContinue}
          disabled={!empresaSeleccionada}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
