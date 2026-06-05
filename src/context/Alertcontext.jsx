import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect
} from "react";

import Alert from "../components/Alert";

const AlertContext = createContext();

export function AlertProvider({
  children
}) {

  const [alerts, setAlerts] =
    useState([]);

  const [notifications, setNotifications] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "notifications"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  const lastMessage = useRef(null);

  const alertId = useRef(0);

  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const removeAlert = (id) => {
    setAlerts((prev) =>
      prev.filter((a) => a.id !== id)
    );
  };

  const showAlert = (
    message,
    type = "info"
  ) => {

    if (lastMessage.current === message)
      return;

    lastMessage.current = message;

    const id = alertId.current++;

    const newAlert = {
      id,
      message,
      type,
      time: new Date().toLocaleTimeString(),
      read: false
    };

    // ALERTA VISUAL
    setAlerts((prev) => [
      ...prev,
      newAlert
    ]);

    // 🔔 GUARDAR NOTIFICACIÓN
    setNotifications((prev) => [
      newAlert,
      ...prev
    ]);

    setTimeout(() => {
      removeAlert(id);
      lastMessage.current = null;
    }, 1500);
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        notifications,
        setNotifications
      }}
    >
      {children}

      <div className="alert-stack">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={() =>
              removeAlert(alert.id)
            }
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export const useAlert = () =>
  useContext(AlertContext);