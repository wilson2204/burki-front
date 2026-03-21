import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";

import "./styles/global.css";   // ✅ reset global
import "./styles/theme.css";    // ✅ tema centralizado

import { AlertProvider } from "./context/Alertcontext";
import { AuthProvider } from "./context/AuthContext";

import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AlertProvider>
  </React.StrictMode>
);