import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Usuarios from "../pages/Usuarios/Usuarios";
import EmpresaSelect from "../pages/EmpresaSelect/EmpresaSelect";
import Recuperar from "../pages/Recuperar/Recuperar";



export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/*RECUPERAR*/}
        <Route path="/recuperar" element={<Recuperar />} />
        {/*EMPRESAS*/}
        <Route path="/empresa-select" element={<EmpresaSelect />} />

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD CON RUTAS INTERNAS */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

