import { useState, useEffect } from "react";
import "./Sucursales.css";
import { useLanguage } from "../../context/LanguageContext";

const API_URL = "http://localhost:8080";

export default function Sucursales({ setSection }) {

  // =========================
  // STATES
  // =========================
  const [sucursales, setSucursales] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [selected, setSelected] = useState(null);
  const [editando, setEditando] = useState(false);
  const [view, setView] = useState("table");
const { t } = useLanguage();
  const [error, setError] = useState("");

  // =========================
  // FORM
  // =========================
  const emptyForm = {
    id: "",
    companyId: "",
    name: "",
    address: "",
    email: "",
    phone1: "",
    phone2: "",
    priceListId: 1,
    branchIdStockDepot: ""
  };

  const [form, setForm] = useState(emptyForm);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    getCompanies();
    getSucursales();
  }, []);

  // =========================
  // GET COMPANIES
  // =========================
  const getCompanies = async () => {

    try {

      const response = await fetch(
        `${API_URL}/back_office/branch/companies`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      );

      if (response.status === 401) {
        setError("Sesión expirada");
        return;
      }

      if (response.status === 403) {
        setError("Error al obtener empresas");
        return;
      }

      const data = await response.json();

      setCompanies(data);

    } catch (error) {

      console.error(error);
      setError("Error del servidor");

    }
  };

  // =========================
  // GET SUCURSALES
  // =========================
  const getSucursales = async () => {

    try {

      const response = await fetch(
        `${API_URL}/back_office/branch`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      );

      if (response.status === 401) {
        setError("Sesión expirada");
        return;
      }

      if (response.status === 403) {
        setError("Error al obtener sucursales");
        return;
      }

      const data = await response.json();

      const sucursalesFormateadas = data.map((s) => ({
        id: s.id,
        companyId: s.companyId,
        name: s.name,
        address: s.location || "",
        email: s.email || "",
        phone1: s.firstPhoneNumber || "",
        phone2: s.secondPhoneNumber || "",
        priceListId: s.listNumber,
        branchIdStockDepot: s.branchIdStockDepot
      }));

      setSucursales(sucursalesFormateadas);

    } catch (error) {

      console.error(error);
      setError("Error del servidor");

    }
  };

  // =========================
  // NUEVO
  // =========================
  const nuevo = () => {

    const nuevoId =
      sucursales.length > 0
        ? Math.max(...sucursales.map((s) => s.id)) + 1
        : 1;

    setForm({
      ...emptyForm,
      id: nuevoId
    });

    setSelected(null);
    setEditando(true);
    setView("form");
  };

  // =========================
  // MODIFICAR
  // =========================
  const modificar = () => {

    if (!selected) {
      alert("Seleccione una sucursal");
      return;
    }

    const sucursal = sucursales.find(
      (s) => s.id === selected
    );

    if (!sucursal) return;

    setForm({
      id: sucursal.id,
      companyId: sucursal.companyId || "",
      name: sucursal.name || "",
      address: sucursal.address || "",
      email: sucursal.email || "",
      phone1: sucursal.phone1 || "",
      phone2: sucursal.phone2 || "",
      priceListId: sucursal.priceListId || 1,
      branchIdStockDepot:
        sucursal.branchIdStockDepot || ""
    });

    setEditando(true);
    setView("form");
  };

  // =========================
  // CANCELAR
  // =========================
  const cancelar = () => {

    setForm(emptyForm);
    setSelected(null);
    setEditando(false);
    setView("table");
  };

  // =========================
  // GUARDAR
  // =========================
  const guardar = async () => {

    if (!editando) return;

    try {

      const body = {
  companyId: Number(form.companyId),
  name: form.name.trim(),
  location: form.address?.trim() || null,
  firstPhoneNumber: form.phone1?.trim() || null,
  secondPhoneNumber: form.phone2?.trim() || null,
  email: form.email?.trim() || null,
  listNumber: Number(form.priceListId),
  branchIdStockDepot: form.branchIdStockDepot
    ? Number(form.branchIdStockDepot)
    : null
};

      // =========================
      // UPDATE
      // =========================
      if (selected) {

        const response = await fetch(
          `${API_URL}/back_office/branch/${selected}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(body)
          }
        );

        if (response.status === 204) {

          await getSucursales();

          cancelar();

          alert(
            "Sucursal actualizada correctamente"
          );

          return;
        }

        if (response.status === 401) {
          alert("Sesión expirada");
          return;
        }

        if (response.status === 404) {
          alert("Sucursal no encontrada");
          return;
        }

        if (response.status === 422) {
          alert("Datos inválidos");
          return;
        }

        alert("Error al actualizar sucursal");

        return;
      }

      // =========================
      // CREATE
      // =========================
      const response = await fetch(
        `${API_URL}/back_office/branch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(body)
        }
      );

      if (response.status === 201) {

        await getSucursales();

        cancelar();

        alert("Sucursal creada correctamente");

        return;
      }

      if (response.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (response.status === 403) {
        alert("Acceso denegado");
        return;
      }

      if (response.status === 404) {
        alert("Endpoint no encontrado");
        return;
      }

      if (response.status === 422) {
        alert("Formato inválido");
        return;
      }

      alert("Error al crear sucursal");

    } catch (error) {

      console.error(error);
      alert("Error del servidor");

    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminar = async () => {

    if (!selected) {
      alert("Seleccione una sucursal");
      return;
    }

    const confirmar = window.confirm(
      "¿Desea eliminar la sucursal seleccionada?"
    );

    if (!confirmar) return;

    try {

      const response = await fetch(
        `${API_URL}/back_office/branch/${selected}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      );

      if (response.status === 204) {

        setSucursales(
          sucursales.filter(
            (s) => s.id !== selected
          )
        );

        setSelected(null);

        alert(
          "Sucursal eliminada correctamente"
        );

        return;
      }

      if (response.status === 401) {
        alert("Sesión expirada");
        return;
      }

      if (response.status === 409) {

        let errorCode = "";

        try {

          const data = await response.json();

          errorCode = data.errorCode;

        } catch {}

        if (
          errorCode ===
          "CAN_NOT_DELETE_LINKED_ENTITY"
        ) {

          alert(
            "No se puede eliminar porque está vinculada a otros registros"
          );

        } else {

          alert(
            "No se puede eliminar la sucursal"
          );
        }

        return;
      }

      alert("Error al eliminar sucursal");

    } catch (error) {

      console.error(error);
      alert("Error del servidor");

    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="sucursales-container">

      {/* TOOLBAR */}
      <div className="toolbar">

        <div
          className="tool new"
          onClick={nuevo}
        >
          <span className="tool-icon">➕</span>
          <span className="tool-label">{t("common.new")}</span>
        </div>

        <div
          className="tool delete"
          onClick={eliminar}
        >
          <span className="tool-icon">➖</span>
          <span className="tool-label">{t("common.delete")}</span>
        </div>

        <div
          className="tool modify"
          onClick={modificar}
        >
          <span className="tool-icon">✏️</span>
          <span className="tool-label">
            {t("common.edit")}
          </span>
        </div>

        <div
          className={`tool save ${
            !editando ? "disabled" : ""
          }`}
          onClick={
            editando ? guardar : undefined
          }
        >
          <span className="tool-icon">💾</span>
          <span className="tool-label">
            {t("common.save")}
          </span>
        </div>

        <div
          className={`tool cancel ${
            !editando ? "disabled" : ""
          }`}
          onClick={
            editando ? cancelar : undefined
          }
        >
          <span className="tool-icon">❌</span>
          <span className="tool-label">
            {t("common.cancel")}
          </span>
        </div>

        <div
          className="tool exit"
          onClick={() =>
            setSection("home")
          }
        >
          <span className="tool-icon">🚪</span>
          <span className="tool-label">{t("common.exit")}</span>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* TABLA */}
      {view === "table" && (
        <table className="tabla">

          <thead>
            <tr>
              <th>{t("common.id")}</th>
              <th>{t("common.name")}</th>
              <th>{t("sucursales.address")}</th>
              <th>{t("common.list")}</th>
            </tr>
          </thead>

          <tbody>
            {sucursales.map((s) => (
              <tr
                key={s.id}
                onClick={() =>
                  setSelected(s.id)
                }
                onDoubleClick={() => {

                  setSelected(s.id);

                  setForm({
                    id: s.id,
                    companyId:
                      s.companyId || "",
                    name: s.name || "",
                    address:
                      s.address || "",
                    email: s.email || "",
                    phone1:
                      s.phone1 || "",
                    phone2:
                      s.phone2 || "",
                    priceListId:
                      s.priceListId || 1,
                    branchIdStockDepot:
                      s.branchIdStockDepot ||
                      ""
                  });

                  setEditando(true);
                  setView("form");
                }}
                className={
                  selected === s.id
                    ? "selected"
                    : ""
                }
              >
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.priceListId}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

      {/* FORM */}
      {view === "form" && (
        <div className="sucursal-form-container">

          <div className="sucursal-form">

            <div className="sucursal-row sucursal-row-top">

              <div className="sucursal-field sucursal-nro">
                <label>{t("sucursales.branchNumber")}</label>

                <input
                  type="text"
                  value={form.id}
                  disabled
                />
              </div>

              <div className="sucursal-field sucursal-empresa">

                <label>{t("sucursales.company")}</label>

                <select
                  value={form.companyId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      companyId: Number(
                        e.target.value
                      )
                    })
                  }
                  disabled={!editando}
                >

                  <option value="">
                    <option value="">
  {t("sucursales.selectCompany")}
</option>
                  </option>

                  {companies.map(
                    (company) => (
                      <option
                        key={company.id}
                        value={company.id}
                      >
                        {company.tradeName}
                      </option>
                    )
                  )}

                </select>
              </div>
            </div>

            <div className="sucursal-field">

              <label>{t("common.name")}</label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                disabled={!editando}
              />
            </div>

            <div className="sucursal-field">

              <label>{t("sucursales.address")}</label>
              

              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address:
                      e.target.value
                  })
                }
                disabled={!editando}
              />
            </div>

            <div className="sucursal-field">

              <label>{t("sucursales.email")}</label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                disabled={!editando}
              />
            </div>

            <div className="sucursal-row sucursal-row-bottom">

              <div className="sucursal-field">

                <label>{t("sucursales.phone1")}</label>

                <input
                  type="text"
                  value={form.phone1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone1:
                        e.target.value
                    })
                  }
                  disabled={!editando}
                />
              </div>

              <div className="sucursal-field">

                <label>{t("sucursales.phone2")}</label>

                <input
                  type="text"
                  value={form.phone2}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone2:
                        e.target.value
                    })
                  }
                  disabled={!editando}
                />
              </div>

              <div className="sucursal-field sucursal-lista">

                <label>{t("sucursales.defaultPriceList")}</label>

                <select
                  value={form.priceListId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priceListId: Number(
                        e.target.value
                      )
                    })
                  }
                  disabled={!editando}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}