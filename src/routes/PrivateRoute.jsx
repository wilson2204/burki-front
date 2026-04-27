import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {

  // 🔥 validación simple de sesión
  const isAuth = localStorage.getItem("auth");
  const usuario = localStorage.getItem("usuario");

  if (!isAuth || !usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}