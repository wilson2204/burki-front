import { useState } from "react";
import "./articulos.css";

export default function Articulos() {

  const [view, setView] = useState("table");
  const [tab, setTab] = useState("basicos");

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

  return (
    <div className="articulos-container">

      {/* BARRA SUPERIOR */}
      <div className="articulos-toolbar">

        <div className="articulos-buttons">
          <button className="btn nuevo" onClick={() => setView("form")}>➕ Nuevo</button>
          <button className="btn eliminar">➖ Eliminar</button>
          <button className="btn modificar">✏ Modificar</button>
          <button className="btn guardar">✔ Guardar</button>
          <button className="btn duplicar">📄 Duplicar</button>
          <button className="btn cancelar" onClick={() => setView("table")}>✖ Cancelar</button>
          <button className="btn salir">➡ Salir</button>
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
              <tr>
                <td>1</td>
                <td>7791234567890</td>
                <td>Producto de ejemplo</td>
                <td>$1000</td>
                <td>30%</td>
                <td>$1300</td>
                <td>21%</td>
                <td>A-001</td>
                <td>12/01/2026</td>
              </tr>
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

          {/* BASICOS */}
          {tab === "basicos" && (
            <div className="basicos-grid">
              <div className="col-izq">
                <label>Artículo</label>
                <textarea rows="3" />

                <div className="fila">
                  <div>
                    <label>Nro. Artículo</label>
                    <input type="text" value="1" />
                  </div>
                  <div>
                    <label>Código de barras</label>
                    <input type="text" />
                  </div>
                </div>

                <label>Código adicional</label>
                <input />

                <label>Departamento</label>
                <select><option>Generico</option></select>

                <label>Sub-depto</label>
                <select><option>Generico</option></select>

                <label>Proveedor</label>
                <select><option>Generico</option></select>

                <label>Marca</label>
                <select><option>Generico</option></select>

                <label>Tipo de art.</label>
                <select><option>Normal</option></select>

                <label>Clasificación</label>
                <select><option>Generica</option></select>
              </div>

              <div className="col-der">
                <label>Precio de venta final</label>
                <input className="precio-grande" value="0,00" />

                <div className="fila">
                  <div>
                    <label>Precio Anterior</label>
                    <input />
                  </div>
                  <div>
                    <label>Fecha Ult. Cambio</label>
                    <input />
                  </div>
                </div>

                <label>Costo sin IVA</label>
                <input value="0,00" />

                <label>Costo con IVA</label>
                <input value="0,00" />

                <label>Margen %</label>
                <input value="0" />

                <label>Tasa de IVA</label>
                <select><option>IVA 21%</option></select>

                <label>Impuesto Interno</label>
                <select><option>No posee</option></select>

                <button className="recalcular">Recalcular valores</button>

                <label>Tipo de moneda</label>
                <select><option>Local</option></select>
              </div>
            </div>
          )}

          {/* OTROS */}
          {tab === "otros" && (
            <div className="otros-grid">
              <div className="otros-col-izq">
                <h3>Envase</h3>
                <label>Artículo Envase</label>
                <select><option>Sin envase</option></select>

                <h3>Suspender ventas</h3>
                <label className="checkbox-group">
                  <input type="checkbox" />
                  <span>Quitar este artículo de la venta</span>
                </label>

                <h3>Gastronomía</h3>
                <label>Sector de comanda</label>
                <select><option>Sin sector</option></select>

                <label>Preparación</label>
                <select><option></option></select>

                <label>Tiempo de prep.</label>
                <input />
              </div>

              <div className="otros-col-der">
                <h3>Unid. de medida - Etiqueta</h3>

                <label>Presentación</label>
                <select>
                  {unidades.map((u, i) => (
                    <option key={i}>{u}</option>
                  ))}
                </select>

                <label className="checkbox-group">
                  <input type="checkbox" defaultChecked />
                  <span>Incluir en etiquetas de góndola</span>
                </label>

                <textarea rows="6" placeholder="Vista previa de etiqueta" />

                <label># Días para el vencimiento</label>
                <input />
              </div>
            </div>
          )}

          {/* STOCK */}
          {tab === "stock" && (
            <div className="stock-grid">
              <h3>Control de Stock</h3>

              <div className="fila">
                <div>
                  <label>Unidad de venta</label>
                  <select>{unidades.map((u,i)=><option key={i}>{u}</option>)}</select>
                </div>
                <div>
                  <label>Unidad de control</label>
                  <select>{unidades.map((u,i)=><option key={i}>{u}</option>)}</select>
                </div>
              </div>

              <div className="fila">
                <div>
                  <label>Punto de pedido</label>
                  <input type="number" />
                </div>
                <div>
                  <label>Stock actual</label>
                  <input type="number" />
                </div>
              </div>
            </div>
          )}

          {/* TALLE & COLOR */}
          {tab === "talle" && (
            <div className="talle-grid">

              <div className="panel">
                <h3>Talles</h3>
                {["Large", "Small", "Extra Large"].map(t => (
                  <label key={t} className="check-item">
                    <input type="checkbox" /> {t}
                  </label>
                ))}
              </div>

              <div className="panel">
                <h3>Colores</h3>
                {["Azul", "Blanco", "Negro"].map(c => (
                  <label key={c} className="check-item">
                    <input type="checkbox" /> {c}
                  </label>
                ))}
              </div>

              <div className="tabla-panel">
                <table className="talle-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Talle</th>
                      <th>Color</th>
                      <th>Stock gral.</th>
                      <th>Pto. Pedido</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>001</td>
                      <td>Large</td>
                      <td>Negro</td>
                      <td>10</td>
                      <td>3</td>
                    </tr>
                  </tbody>
                </table>

                <div className="talle-footer">
                  <button className="btn cargar">Cargar colores y talles</button>

                  <div className="stock-total">
                    <span>Stock total</span>
                    <input type="number" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LISTAS */}
          {tab === "listas" && <div className="placeholder">Listas y Promos</div>}
          {tab === "imagen" && <div className="placeholder">Imagen</div>}
          {tab === "combo" && <div className="placeholder">Combo</div>}

        </div>
      )}

    </div>
  );
}
