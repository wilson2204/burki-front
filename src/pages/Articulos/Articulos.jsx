import { useState } from "react";
import "./articulos.css";

export default function Articulos({ setSection }) {

  const [view, setView] = useState("table");
  const [tab, setTab] = useState("basicos");

  const [articulos, setArticulos] = useState([
    {
      id: 1,
      codigo: "7791234567890",
      nombre: "Producto de ejemplo",
      costo: 1000,
      margen: 30,
      precio: 1300,
      iva: 21,
      adicional: "A-001",
      fecha: "12/01/2026"
    }
  ]);

  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    id: "",
    codigo: "",
    nombre: "",
    costo: "",
    margen: "",
    precio: "",
    iva: "21",
    adicional: ""
  });

  const unidades = [
    "Sin Descripción",
    "Kilogramos",
    "Metros",
    "Metro cuadrado",
    "Metro cubico",
    "Litros",
    "Unidad",
    "Gramos",
    "Milimetros",
    "Centimetros",
    "Mililitros"
  ];

  /* NUEVO */
  const nuevoArticulo = () => {
    setForm({
      id: "",
      codigo: "",
      nombre: "",
      costo: "",
      margen: "",
      precio: "",
      iva: "21",
      adicional: ""
    });

    setView("form");
  };

  /* GUARDAR */
  const guardarArticulo = () => {

    if (selected !== null) {
      const updated = articulos.map(a =>
        a.id === selected ? { ...form, id: selected } : a
      );
      setArticulos(updated);
    } else {
      const nuevo = {
        ...form,
        id: articulos.length + 1,
        fecha: new Date().toLocaleDateString()
      };
      setArticulos([...articulos, nuevo]);
    }

    setSelected(null);
    setView("table");
  };

  /* ELIMINAR */
  const eliminarArticulo = () => {

    if (selected === null) return alert("Seleccione un artículo");

    const nuevos = articulos.filter(a => a.id !== selected);
    setArticulos(nuevos);
    setSelected(null);
  };

  /* MODIFICAR */
  const modificarArticulo = () => {

    if (selected === null) return alert("Seleccione un artículo");

    const art = articulos.find(a => a.id === selected);

    setForm(art);
    setView("form");
  };

  /* DUPLICAR */
  const duplicarArticulo = () => {

    if (selected === null) return alert("Seleccione un artículo");

    const art = articulos.find(a => a.id === selected);

    const copia = {
      ...art,
      id: articulos.length + 1
    };

    setArticulos([...articulos, copia]);
  };

  /* SALIR */
  const salir = () => {
    if (setSection) {
      setSection("home");
    }
  };

  return (
    <div className="articulos-container">

      {/* BARRA SUPERIOR */}
      <div className="articulos-toolbar">

        <div className="articulos-buttons">
          <button className="btn nuevo" onClick={nuevoArticulo}>➕ Nuevo</button>

          <button className="btn eliminar" onClick={eliminarArticulo}>
            ➖ Eliminar
          </button>

          <button className="btn modificar" onClick={modificarArticulo}>
            ✏ Modificar
          </button>

          <button className="btn guardar" onClick={guardarArticulo}>
            ✔ Guardar
          </button>

          <button className="btn duplicar" onClick={duplicarArticulo}>
            📄 Duplicar
          </button>

          <button className="btn cancelar" onClick={() => setView("table")}>
            ✖ Cancelar
          </button>

          <button className="btn salir" onClick={salir}>
            ➡ Salir
          </button>
        </div>

        <div className="articulos-search">
          <label>
            Listar solo <br />
            Novedades <input type="checkbox" />
          </label>

          <div>
            <span>Buscar</span>
            <input type="text" placeholder="Buscar artículo..." />
          </div>
        </div>

      </div>

      {/* TABLA */}
      {view === "table" && (
        <div className="articulos-table-container">
          <table className="articulos-table">
            <thead>
              <tr>
                <th>Nro.</th>
                <th>Cod. de Barras</th>
                <th>Artículo</th>
                <th>Costo</th>
                <th>Margen</th>
                <th>Precio</th>
                <th>IVA</th>
                <th>Cod. Adicional</th>
                <th>Ult. Cambio</th>
              </tr>
            </thead>

            <tbody>
              {articulos.map(a => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a.id)}
                  style={{
                    background: selected === a.id ? "#e0f2fe" : ""
                  }}
                >
                  <td>{a.id}</td>
                  <td>{a.codigo}</td>
                  <td>{a.nombre}</td>
                  <td>${a.costo}</td>
                  <td>{a.margen}%</td>
                  <td>${a.precio}</td>
                  <td>{a.iva}%</td>
                  <td>{a.adicional}</td>
                  <td>{a.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORMULARIO */}
      {view === "form" && (
        <div className="articulos-form">

          {/* PESTAÑAS */}
          <div className="articulos-tabs">
            {["basicos","otros","stock","talle","listas","imagen","combo"].map(t => (
              <button
                key={t}
                className={tab === t ? "tab active" : "tab"}
                onClick={() => setTab(t)}
              >
                {t === "basicos" && "Básicos"}
                {t === "otros" && "Otros"}
                {t === "stock" && "Stock"}
                {t === "talle" && "Talle & color"}
                {t === "listas" && "Listas y Promos"}
                {t === "imagen" && "Imagen"}
                {t === "combo" && "Combo"}
              </button>
            ))}
          </div>

          {tab === "basicos" && (
            <div className="basicos-grid">

              <div className="col-izq">

                <label>Artículo</label>
                <textarea
                  value={form.nombre}
                  onChange={e =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />

                <label>Código de barras</label>
                <input
                  value={form.codigo}
                  onChange={e =>
                    setForm({ ...form, codigo: e.target.value })
                  }
                />

                <label>Código adicional</label>
                <input
                  value={form.adicional}
                  onChange={e =>
                    setForm({ ...form, adicional: e.target.value })
                  }
                />

              </div>

              <div className="col-der">

                <label>Costo</label>
                <input
                  value={form.costo}
                  onChange={e =>
                    setForm({ ...form, costo: e.target.value })
                  }
                />

                <label>Margen</label>
                <input
                  value={form.margen}
                  onChange={e =>
                    setForm({ ...form, margen: e.target.value })
                  }
                />

                <label>Precio</label>
                <input
                  value={form.precio}
                  onChange={e =>
                    setForm({ ...form, precio: e.target.value })
                  }
                />

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}