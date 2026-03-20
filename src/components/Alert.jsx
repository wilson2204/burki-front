import { useEffect, useState } from "react";
import "./Alert.css";

export default function Alert({ message, type = "info", onClose }) {
  const [closing, setClosing] = useState(false);

  // ⏱ cerrar automáticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);

    // esperamos animación salida
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✔";
      case "error":
        return "✖";
      case "warning":
        return "⚠";
      default:
        return "ℹ";
    }
  };

  return (
    <div className={`alert ${type} ${closing ? "closing" : ""}`}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-message">{message}</span>
      </div>

      <button onClick={handleClose}>✕</button>

      {/* barra progreso */}
      <div className="alert-progress" />
    </div>
  );
}
