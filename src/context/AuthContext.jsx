import { createContext, useContext, useEffect, useState } from "react";
import { getFuncionalidades } from "../services/funcionalidades.services";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [funcionalidades, setFuncionalidades] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarFuncionalidades() {
      try {
        const data = await getFuncionalidades();
        setFuncionalidades(data || {}); // 🔹 asegura que siempre sea objeto
      } catch (error) {
        console.error("Error cargando funcionalidades", error);
        setFuncionalidades({});
      } finally {
        setLoading(false);
      }
    }

    cargarFuncionalidades();
  }, []);

  const can = (permiso) => {
    return funcionalidades?.[permiso] === true;
  };

  return (
    <AuthContext.Provider value={{ funcionalidades, can, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
