import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";

import "./styles/global.css";
import "./styles/theme.css";

import { AlertProvider } from "./context/Alertcontext";
import { AuthProvider } from "./context/AuthContext";

import { registerSW } from 'virtual:pwa-register'

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    const actualizar = confirm("Hay una nueva versión disponible 🚀\n¿Querés actualizar?");
    if (actualizar) {
      updateSW(true); // 💥 fuerza update
    }
  },
  onOfflineReady() {
    console.log('App lista offline')
  }
})
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AlertProvider>
  </React.StrictMode>
);