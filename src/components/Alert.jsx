import { useEffect, useState } from "react";
import "./alert.css";

export default function Alert({
  message,
  type = "info",
  onClose
}) {
  const [closing, setClosing] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);

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
    <div
      className={`alert ${type} ${
        closing ? "closing" : ""
      }`}
    >
      <div className="alert-content">
        <span className="alert-icon">
          {getIcon()}
        </span>

        <div className="alert-text">
          <span className="alert-message">
            {message}
          </span>

          <small className="alert-time">
            {new Date().toLocaleTimeString()}
          </small>
        </div>
      </div>

      <button
        className="alert-close"
        onClick={handleClose}
      >
        ✕
      </button>

      <div className="alert-progress" />
    </div>
  );
}