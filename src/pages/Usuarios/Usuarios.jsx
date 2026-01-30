import { useState } from "react";
import "./usuarios.css";

export default function Usuarios() {
  const [view, setView] = useState("table");
  const [selectedUser, setSelectedUser] = useState(null);

  // 👤 USUARIO LOGUEADO (SIMULADO)
  const usuarioActual = {
    nombre: "Pedro",
    rol: "Admin"
  };

  const tienePermisoEliminar = () => {
    const rol = usuarioActual.rol.toLowerCase();
    return rol === "admin" || rol === "gerente" || rol === "administrador";
  };

  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Admin", alias: "Admin", rol: "Gerente", comision: "-" },
    { id: 4, nombre: "Cajero", alias: "cajero", rol: "Cajero", comision: "-" }
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    alias: "",
    rol: "Administrador",
    email: "",
    clave: "",
    repetirClave: "",
    comision: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNuevo = () => {
    setFormData({
      nombre: "",
      alias: "",
      rol: "Administrador",
      email: "",
      clave: "",
      repetirClave: "",
      comision: "",
    });
    setSelectedUser(null);
    setView("new");
  };

  const handleModificar = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setView("edit");
  };

  // ❌ ELIMINAR
  const eliminarUsuario = (user) => {
    if (!tienePermisoEliminar()) {
      alert("⛔ Solo ADMIN o GERENTE pueden eliminar usuarios");
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que querés eliminar a ${user.nombre}?`
    );

    if (confirmar) {
      setUsuarios(usuarios.filter(u => u.id !== user.id));
      setSelectedUser(null);
    }
  };

  const handleGuardar = () => {
    if (formData.clave !== formData.repetirClave) {
      alert("Las claves no coinciden ❌");
      return;
    }

    alert("Usuario guardado correctamente ✅");
    setView("table");
  };

  return (
    <div className="usuarios-container">

      {/* TOOLBAR */}
      <div className="usuarios-toolbar">
        <button className="btn primary" onClick={handleNuevo}>+ Nuevo</button>
        <button className="btn success" onClick={handleGuardar}>Guardar</button>
        <button className="btn" onClick={() => setView("table")}>Cancelar</button>
      </div>

      {/* TABLA */}
      {view === "table" && (
        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nro</th>
                <th>Nombre</th>
                <th>Alias</th>
                <th>Rol</th>
                <th>Comisión</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map(user => (
                <tr
                  key={user.id}
                  className={selectedUser?.id === user.id ? "selected" : ""}
                  onClick={() => setSelectedUser(user)}
                >
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.alias}</td>
                  <td>{user.rol}</td>
                  <td>{user.comision}</td>

                  <td className="acciones">
                    {/* MODIFICAR */}
                    <button
                      className="btn edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModificar(user);
                      }}
                      title="Modificar"
                    >
                      ✏
                    </button>

                    {/* ELIMINAR */}
                    {tienePermisoEliminar() && (
                      <button
                        className="btn danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarUsuario(user);
                        }}
                        title="Eliminar"
                      >
                        🗑
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORMULARIO */}
      {(view === "new" || view === "edit") && (
        <div className="usuarios-form-panel">

          <div className="form-header">
            <h3>{view === "new" ? "Nuevo Usuario" : "Modificar Usuario"}</h3>
          </div>

          <div className="form-body">
            <div className="form-grid">

              <div>
                <label>Nombre y apellido</label>
                <input name="nombre" value={formData.nombre} onChange={handleChange} />
              </div>

              <div>
                <label>Alias</label>
                <input name="alias" value={formData.alias} onChange={handleChange} />
              </div>

              <div>
                <label>Rol</label>
                <select name="rol" value={formData.rol} onChange={handleChange}>
                  <option>Administrador</option>
                  <option>Gerente</option>
                  <option>Vendedor</option>
                  <option>Cajero</option>
                </select>
              </div>

              <div>
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} />
              </div>

              <div>
                <label>Clave</label>
                <input type="password" name="clave" value={formData.clave} onChange={handleChange} />
              </div>

              <div>
                <label>Repetir clave</label>
                <input type="password" name="repetirClave" value={formData.repetirClave} onChange={handleChange} />
              </div>

              <div>
                <label>Comisión</label>
                <input name="comision" value={formData.comision} onChange={handleChange} />
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
