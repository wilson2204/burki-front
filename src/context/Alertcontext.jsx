import { createContext, useContext, useState, useRef } from "react";
import Alert from "../components/Alert";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const lastMessage = useRef(null); // 👈 evita duplicados
  const alertId = useRef(0);

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const showAlert = (message, type = "info") => {

    // 🚫 evita duplicado inmediato (StrictMode fix)
    if (lastMessage.current === message) return;
    lastMessage.current = message;

    const id = alertId.current++;

    const newAlert = { id, message, type };

    setAlerts((prev) => [...prev, newAlert]);

    setTimeout(() => {
      removeAlert(id);
      lastMessage.current = null;
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <div className="alert-stack">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
