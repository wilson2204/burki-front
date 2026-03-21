import React from "react";
import "./MiInformacion.css";

export default function MiInformacion({ usuario, mode = "light" }) {
  const data = usuario || {
    pin: "TA0000",
    userRole: "ADMINISTRATOR",
    alias: "TestAdmin",
    nameAndSurname: "Test Admin",
    commission: 0.0,
    imgPath: "",
    cellPhoneNumber: "",
    phoneNumber: "",
    email: ""
  };

  const handleChangePassword = () => {
    alert("Aquí abrirías el modal o redirigirías al formulario de cambio de contraseña.");
  };

  return (
    <div className={`mi-informacion-card ${mode}`}>
      <h2>Mi Información</h2>

      {data.imgPath ? (
        <img src={data.imgPath} alt="Avatar" />
      ) : (
        <div className="user-avatar-placeholder">
          {data.nameAndSurname
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
      )}

      <p><strong>Nombre:</strong> {/*data.nameAndSurname*/ "Test Admin"} </p>
      <p><strong>Alias:</strong> {data.alias || "Test Admin"}</p>
      <p><strong>Rol:</strong> {data.userRole ||"Administrator" }</p>
      <p><strong>PIN:</strong> {data.pin ||"TA0000" }</p>
      <p><strong>Comisión:</strong> {data.commission || "0,0"}</p>
      <p><strong>Email:</strong> {data.email || "Sin email"}</p>
      <p><strong>Teléfono:</strong> {data.phoneNumber || "Sin teléfono"}</p>
      <p><strong>Celular:</strong> {data.cellPhoneNumber || "Sin celular"}</p>

      {/* 🔹 Botón Cambiar Contraseña */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className={`change-password-btn ${mode}`}
          onClick={handleChangePassword}
        >
          Cambiar Contraseña
        </button>
      </div>
    </div>
  );
}