import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Usuarios from "../pages/Usuarios/Usuarios";
import EmpresaSelect from "../pages/EmpresaSelect/EmpresaSelect";
import Recuperar from "../pages/Recuperar/Recuperar";
import Departamentos from "../pages/Departamentos/Departamentos";

import PrivateRoute from "./PrivateRoute.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN Y RECUPERAR */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />

        {/* SELECCION DE EMPRESA */}
        <Route path="/empresa-select" element={<EmpresaSelect />} />

        {/* DASHBOARD PROTEGIDO */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="departamentos" element={<Departamentos />} />
        </Route>

        {/* REDIRECCION GENERAL */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}