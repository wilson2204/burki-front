import { useState } from "react";
import "./IvaAlicuotas.css";
const API_URL =
  "/api/report/iva";

export default function IvaAlicuotas({ setSection }) {
  const hoy = new Date().toISOString().split("T")[0];

  const [desde, setDesde] = useState(hoy);
  const [hasta, setHasta] = useState(hoy);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
const [paginaActual, setPaginaActual] = useState(1);
const registrosPorPagina = 10;
const listar = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `${API_URL}?page=0&size=500&asc=true&from=${desde}&to=${hasta}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("ERROR BACKEND:", text);
      throw new Error("Error al obtener IVA");
    }

const json = await res.json();

console.log("RESPUESTA COMPLETA:", json);

const content = json.content ?? [];

if (!Array.isArray(content)) {
  console.error("CONTENT NO ES ARRAY:", content);
  setDatos([]);
  return;
}

setDatos(
  content.map((item) => ({
    fecha: item.date,
    razonSocial: item.legalName,
    documento: item.DNI || "-",
    tipo: "FC",
    comp: "Factura",
    comprobante: item.invoice,
    netoGravado: item.BI,
    ivaTasa:
      item.BI > 0
        ? ((item.IVA / item.BI) * 100).toFixed(2)
        : "0.00",
    ivaImporte: item.IVA,
    cae: item.CAE,
  }))
);
setPaginaActual(1);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const totalNeto = datos.reduce(
    (acc, item) =>
      acc + Number(item.netoGravado || 0),
    0
  );

  const totalIva = datos.reduce(
    (acc, item) =>
      acc + Number(item.ivaImporte || 0),
    0
  );
  const totalPaginas = Math.ceil(
  datos.length / registrosPorPagina
);

const inicio =
  (paginaActual - 1) *
  registrosPorPagina;

const fin =
  inicio + registrosPorPagina;

const datosPaginados =
  datos.slice(inicio, fin);

return (
  <div className="iva-container">

    {/* HEADER */}

    <div className="iva-hero">

      <div className="hero-left">
        <div className="hero-icon">
          📄
        </div>

        <div>
          <h1>IVA Ventas alícuotas</h1>
          <p>
            Detalle de ventas por alícuota de IVA
          </p>
        </div>
      </div>

      <div className="hero-filters">

        <div className="date-group">
          <label>Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) =>
              setDesde(e.target.value)
            }
          />
        </div>

        <div className="date-group">
          <label>Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) =>
              setHasta(e.target.value)
            }
          />
        </div>

        <button
          className="btn-listar"
          onClick={listar}
        >
          🔍 Listar
        </button>

    <button
  className="btn-salir"
  onClick={() => setSection("home")}
>
  Salir
</button>

      </div>

    </div>

    {/* TABLA */}

    <div className="iva-card">

      <div className="table-header">

        <div>
          <h2>
            IVA Ventas Alícuotas
          </h2>

          <span>
            Desde <strong>{desde}</strong>
            {" "}hasta{" "}
            <strong>{hasta}</strong>
          </span>
        </div>

      </div>

      <div className="table-actions">

        <div className="actions-left">

          <button>⏮</button>
          <button>◀</button>

          <span className="page-info">
            1 de 1
          </span>

          <button>▶</button>
          <button>⏭</button>

        </div>

        <div className="actions-center">

          <button>⬇ Exportar</button>
          <button>🖨 Imprimir</button>
          <button>📄 PDF</button>

        </div>

        <div className="actions-right">

          <select>
            <option>100%</option>
            <option>75%</option>
            <option>50%</option>
          </select>

          <input
            type="text"
            placeholder="Buscar..."
          />

        </div>

      </div>

      <div className="table-wrapper">

        <table className="iva-table">

          <thead>
            <tr>
              <th>Fecha</th>
              <th>Razón Social</th>
              <th>DNI</th>
              <th>Tipo</th>
              <th>Comp</th>
              <th>Comprobante</th>
              <th>Neto Gravado</th>
              <th>IVA %</th>
              <th>IVA Importe</th>
              <th>CAE</th>
            </tr>
          </thead>

          <tbody>

            {datos.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="empty-state"
                >
                  No hay datos para mostrar
                </td>
              </tr>
            ) : (
              datosPaginados.map((item, index) => (
                <tr key={index}>

                  <td>{item.fecha}</td>

                  <td>
                    {item.razonSocial}
                  </td>

                  <td>
                    {item.documento}
                  </td>

                  <td>{item.tipo}</td>

                  <td>{item.comp}</td>

                  <td>
                    {item.comprobante}
                  </td>

                  <td>
                    $
                    {Number(
                      item.netoGravado
                    ).toLocaleString(
                      "es-AR"
                    )}
                  </td>

                  <td>
                    <span className="iva-chip">
                      {item.ivaTasa}%
                    </span>
                  </td>

                  <td>
                    $
                    {Number(
                      item.ivaImporte
                    ).toLocaleString(
                      "es-AR"
                    )}
                  </td>

                  <td>{item.cae}</td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
    <div className="pagination">

  <button
    disabled={paginaActual === 1}
    onClick={() =>
      setPaginaActual(
        paginaActual - 1
      )
    }
  >
    ← Anterior
  </button>

  <span>
    Página {paginaActual} de{" "}
    {totalPaginas || 1}
  </span>

  <button
    disabled={
      paginaActual === totalPaginas ||
      totalPaginas === 0
    }
    onClick={() =>
      setPaginaActual(
        paginaActual + 1
      )
    }
  >
    Siguiente →
  </button>

</div>

    {/* RESUMEN */}

    <div className="stats-grid">

      <div className="stat-card ventas">
        <div className="stat-icon">
          🛒
        </div>

        <div>
          <span>
            Ventas Gravadas
          </span>

          <strong>
            $
            {totalNeto.toLocaleString(
              "es-AR"
            )}
          </strong>
        </div>
      </div>

      <div className="stat-card iva">
        <div className="stat-icon">
          🧮
        </div>

        <div>
          <span>IVA</span>

          <strong>
            $
            {totalIva.toLocaleString(
              "es-AR"
            )}
          </strong>
        </div>
      </div>

      <div className="stat-card total">
        <div className="stat-icon">
          💵
        </div>

        <div>
          <span>
            Total Ventas
          </span>

          <strong>
            $
            {(
              totalNeto +
              totalIva
            ).toLocaleString(
              "es-AR"
            )}
          </strong>
        </div>
      </div>

    </div>

  </div>
);
}