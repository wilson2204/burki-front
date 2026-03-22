import { useState, useEffect } from "react";
import { useAlert } from "../../context/Alertcontext";
import "./Usuarios.css";

export default function Usuarios({ setSection }) {
  const [view, setView] = useState("table");
  const [selectedUser, setSelectedUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    nameAndSurname: "",
    alias: "",
    role: "ADMINISTRATOR",
    email: "",
    password: "",
    rePassword: "",
    phoneNumber: "",
    cellPhoneNumber: "",
    commission: ""
  });

  const roles = ["ADMINISTRATOR", "MANAGER", "SUPERVISOR", "SELLER", "CASHIER"];

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        "http://localhost:8080/back_office/user?size=20&page=1",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        setUsuarios(data);
        return;
      }

      showAlert("No tenés permisos para acceder a Usuarios", "error");
      if (setSection) setSection("home");

    } catch (error) {
      showAlert("Error de conexión con el servidor", "error");
      if (setSection) setSection("home");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNuevo = () => {
    setFormData({
      nameAndSurname: "",
      alias: "",
      role: "ADMINISTRATOR",
      email: "",
      password: "",
      rePassword: "",
      phoneNumber: "",
      cellPhoneNumber: "",
      commission: ""
    });
    setSelectedUser(null);
    setOriginalData(null);
    setView("new");
  };

  const handleModificar = (user) => {
    setSelectedUser(user);

    const initialData = {
      nameAndSurname: user.nameAndSurname || "",
      alias: user.alias || "",
      role: user.userRole || "ADMINISTRATOR",
      email: user.email || "",
      password: "",
      rePassword: "",
      phoneNumber: user.phoneNumber || "",
      cellPhoneNumber: user.cellPhoneNumber || "",
      commission: user.commission !== null ? user.commission : ""
    };

    setFormData(initialData);
    setOriginalData(initialData);
    setView("edit");
  };

  const eliminarUsuario = (user) => {
    if (!window.confirm(`¿Eliminar a ${user.nameAndSurname}?`)) return;
    setUsuarios(usuarios.filter(u => u.id !== user.id));
  };

  const handleGuardar = async () => {
    // Validación de claves
    if (formData.password && formData.password !== formData.rePassword) {
      showAlert("Las claves no coinciden", "error");
      return;
    }

    // Validación de comisión
    if (formData.commission && Number(formData.commission) < 0) {
      showAlert("La comisión no puede ser negativa", "error");
      return;
    }

    // Nuevo usuario
    if (view === "new") {
      const payload = {
        role: formData.role,
        email: formData.email,
        password: formData.password,
        rePassword: formData.rePassword,
        nameAndSurname: formData.nameAndSurname,
        alias: formData.alias,
        phoneNumber: formData.phoneNumber,
        cellPhoneNumber: formData.cellPhoneNumber,
        // ✅ Siempre enviamos commission como número
        commision: formData.commision ? Number(formData.commision) : 0
      };

      try {
        const res = await fetch(
          "http://localhost:8080/back_office/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(payload)
          }
        );

        if (res.status === 201) {
          showAlert("Usuario creado correctamente ✅", "success");
          fetchUsuarios();
          setView("table");
          return;
        }

        showAlert("Error al crear usuario", "error");

      } catch (error) {
        showAlert("Error de conexión", "error");
      }

      return;
    }

    // Editar usuario
    if (view === "edit") {
      let payload = { userId: selectedUser.id };

      Object.keys(formData).forEach((key) => {
        if (key === "password" || key === "rePassword") return;

        if (formData[key] !== originalData[key]) {
          if (key === "role") {
            payload.userRol = formData.role;
          } else if (key === "commission") {
            // ✅ Siempre enviamos commission como número
            payload.commission = formData.commission ? Number(formData.commission) : 0;
          } else {
            payload[key] = formData[key];
          }
        }
      });

      if (formData.password) {
        payload.password = formData.password;
        payload.confirmPassword = formData.rePassword;
      }

      if (Object.keys(payload).length === 1) {
        showAlert("No hay cambios para guardar", "info");
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:8080/back_office/user",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(payload)
          }
        );

        if (res.status === 204) {
          showAlert("Usuario actualizado correctamente ✅", "success");
          fetchUsuarios();
          setView("table");
          return;
        }

        showAlert("Error al actualizar usuario", "error");

      } catch (error) {
        showAlert("Error de conexión", "error");
      }
    }
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-toolbar">
        <button className="btn primary" onClick={handleNuevo}>+ Nuevo</button>

        {(view !== "table") && (
          <>
            <button className="btn success" onClick={handleGuardar}>Guardar</button>
            <button className="btn" onClick={() => setView("table")}>Cancelar</button>
          </>
        )}
      </div>

      {view === "table" && (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nro</th>
              <th>Nombre</th>
              <th>Alias</th>
              <th>Rol</th>
              <th>Comisión</th>
              <th>Teléfono fijo</th>
              <th>Celular</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nameAndSurname}</td>
                <td>{user.alias}</td>
                <td>{roles.includes(user.userRole) ? user.userRole : "ADMINISTRATOR"}</td>
                <td>{user.commission}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.cellPhoneNumber}</td>
                <td className="acciones">
                  <button className="btn edit" onClick={() => handleModificar(user)}>✏</button>
                  <button className="btn danger" onClick={() => eliminarUsuario(user)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(view === "new" || view === "edit") && (
        <div className="usuarios-form-panel">
          <h3>{view === "new" ? "Nuevo Usuario" : "Modificar Usuario"}</h3>

          <input name="nameAndSurname" placeholder="Nombre y apellido" value={formData.nameAndSurname} onChange={handleChange} />
          <input name="alias" placeholder="Alias" value={formData.alias} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

          {view === "new" && (
            <>
              <input type="password" name="password" placeholder="Clave" value={formData.password} onChange={handleChange} />
              <input type="password" name="rePassword" placeholder="Repetir clave" value={formData.rePassword} onChange={handleChange} />
            </>
          )}

          <input name="phoneNumber" placeholder="Teléfono fijo (opcional)" value={formData.phoneNumber} onChange={handleChange} />
          <input name="cellPhoneNumber" placeholder="Celular" value={formData.cellPhoneNumber} onChange={handleChange} />
          <input name="commission" placeholder="Comisión" value={formData.commission} onChange={handleChange} />

          <label>Rol:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
