import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "./pages/Login/Login.css";
import { AlertProvider } from "./context/Alertcontext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertProvider>
      <AppRouter />
    </AlertProvider>
  </React.StrictMode>
);
