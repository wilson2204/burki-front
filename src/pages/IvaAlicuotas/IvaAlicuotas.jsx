import { useState } from "react";
import "./IvaAlicuotas.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { apiFetch } from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLanguage } from "../../context/LanguageContext";

export default function IvaAlicuotas({ setSection }) {
  const hoy = new Date().toISOString().split("T")[0];
const { t } = useLanguage();
  const [desde, setDesde] = useState(hoy);
  const [hasta, setHasta] = useState(hoy);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
const [paginaActual, setPaginaActual] = useState(1);
const registrosPorPagina = 10;

const listar = async () => {
  try {
    setLoading(true);

    const res = await apiFetch(
  `/report/iva?page=0&size=500&asc=true&from=${desde}&to=${hasta}`
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
const exportarExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    datos.map((item) => ({
      Fecha: item.fecha,
      "Razón Social": item.razonSocial,
      DNI: item.documento,
      Tipo: item.tipo,
      Comprobante: item.comprobante,
      "Neto Gravado": item.netoGravado,
      "IVA %": item.ivaTasa,
      "IVA Importe": item.ivaImporte,
      CAE: item.cae,
    }))
  );

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "IVA"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    file,
    `IVA_${desde}_${hasta}.xlsx`
  );
};

const exportarPDF = () => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  // Encabezado
  doc.setFontSize(18);
  doc.text("BRUKI", 14, 15);

  doc.setFontSize(14);
  doc.text(
    "IVA Ventas Alícuotas",
    140,
    15,
    { align: "center" }
  );

  doc.setFontSize(10);
  doc.text(
    `Desde: ${desde}  Hasta: ${hasta}`,
    14,
    25
  );

  doc.text(
    `Generado: ${new Date().toLocaleString("es-AR")}`,
    230,
    25
  );

  autoTable(doc, {
    startY: 35,

    head: [[
      "Fecha",
      "Razón Social",
      "DNI",
      "Comp.",
      "Comprobante",
      "Neto Gravado",
      "IVA %",
      "IVA Importe",
      "CAE"
    ]],

    body: datos.map(item => [
      item.fecha,
      item.razonSocial,
      item.documento,
      item.comp,
      item.comprobante,
      `$${Number(item.netoGravado).toLocaleString("es-AR")}`,
      `${item.ivaTasa}%`,
      `$${Number(item.ivaImporte).toLocaleString("es-AR")}`,
      item.cae
    ]),

    styles: {
      fontSize: 8
    },

    headStyles: {
      fillColor: [52, 73, 94]
    }
  });

  const finalY =
    doc.lastAutoTable.finalY + 10;

  doc.setFontSize(11);

  doc.text(
    `Neto Gravado: $${totalNeto.toLocaleString("es-AR")}`,
    180,
    finalY
  );

  doc.text(
    `IVA: $${totalIva.toLocaleString("es-AR")}`,
    180,
    finalY + 7
  );

  doc.text(
    `TOTAL: $${(
      totalNeto + totalIva
    ).toLocaleString("es-AR")}`,
    180,
    finalY + 14
  );

  doc.save(
    `IVA_${desde}_${hasta}.pdf`
  );
};


const imprimir = () => {
  const contenido = `
<table>
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
    ${datos.map(item => `
      <tr>
        <td>${item.fecha}</td>
        <td>${item.razonSocial}</td>
        <td>${item.documento}</td>
        <td>${item.tipo}</td>
        <td>${item.comp}</td>
        <td>${item.comprobante}</td>
        <td>$${Number(item.netoGravado).toLocaleString("es-AR")}</td>
        <td>${item.ivaTasa}%</td>
        <td>$${Number(item.ivaImporte).toLocaleString("es-AR")}</td>
        <td>${item.cae}</td>
      </tr>
    `).join("")}
  </tbody>
</table>
`;

  const ventana = window.open(
    "",
    "",
    "width=1400,height=900"
  );

  ventana.document.write(`
    <html>
      <head>
        <title>IVA Ventas Alícuotas</title>

        <style>
          @page {
            size: landscape;
            margin: 15mm;
          }

          body {
            font-family: Arial, sans-serif;
            color: #000;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            margin-bottom: 15px;
            padding-bottom: 10px;
          }

          .empresa {
            font-size: 24px;
            font-weight: bold;
          }

          .titulo {
            text-align: center;
            margin-bottom: 15px;
          }

          .titulo h2 {
            margin: 0;
          }

          .info {
            margin-bottom: 15px;
            font-size: 14px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          th {
            background: #e5e7eb;
            border: 1px solid #000;
            padding: 6px;
          }

          td {
            border: 1px solid #000;
            padding: 6px;
          }

          .totales {
            margin-top: 20px;
            text-align: right;
            font-size: 14px;
            font-weight: bold;
          }

          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #666;
          }
        </style>
      </head>

      <body>

        <div class="header">
          <div class="empresa">
            BRUKI
          </div>

          <div>
            ${new Date().toLocaleString("es-AR")}
          </div>
        </div>

        <div class="titulo">
          <h2>IVA Ventas Alícuotas</h2>
        </div>

        <div class="info">
          <strong>Desde:</strong> ${desde}
          &nbsp;&nbsp;&nbsp;
          <strong>Hasta:</strong> ${hasta}
        </div>

        ${contenido}

        <div class="totales">
          <div>
            Neto Gravado:
            $${totalNeto.toLocaleString("es-AR")}
          </div>

          <div>
            IVA:
            $${totalIva.toLocaleString("es-AR")}
          </div>

          <div>
            Total:
            $${(
              totalNeto + totalIva
            ).toLocaleString("es-AR")}
          </div>
        </div>

        <div class="footer">
          Reporte generado por BRUKI
        </div>

      </body>
    </html>
  `);

  ventana.document.close();

  setTimeout(() => {
    ventana.print();
    ventana.close();
  }, 500);
};

return (
  <div className="iva-container">

    {/* HEADER */}

    <div className="iva-hero">

      <div className="hero-left">
        <div className="hero-icon">
          📄
        </div>

        <div>
          <h1>{t("ivaAlicuotas.title")}</h1>
            <p>
 {t("ivaAlicuotas.subtitle")}
</p>
          
        </div>
      </div>

      <div className="hero-filters">

        <div className="date-group">
          <label>
 {t("ivaAlicuotas.from")}
</label>
          <input
            type="date"
            value={desde}
            onChange={(e) =>
              setDesde(e.target.value)
            }
          />
        </div>

        <div className="date-group">
          <label>
        {t("ivaAlicuotas.to")}
</label>
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
          🔍 {t("ivaAlicuotas.list")}
        </button>

    <button
  className="btn-salir"
  onClick={() => setSection("home")}
>
  {t("ivaAlicuotas.exit")}
</button>

      </div>

    </div>

    {/* TABLA */}

    <div className="iva-card">

      <div className="table-header">

        <div>
          
            <h2>
 {t("ivaAlicuotas.title")}
</h2>

          <span>
  {t("ivaAlicuotas.from")} <strong>{desde}</strong>{" "}
  {t("ivaAlicuotas.to").toLowerCase()}{" "}
  <strong>{hasta}</strong>
</span>
        </div>

      </div>

      <div className="table-actions">

        <div className="actions-left">

          <button>⏮</button>
          <button>◀</button>

          <span>
  {t("ivaAlicuotas.page")} {paginaActual} {t("ivaAlicuotas.of")}{" "}
  {totalPaginas || 1}
</span>

          <button>▶</button>
          <button>⏭</button>

        </div>

        <div className="actions-center">

          <button onClick={exportarExcel}>
  ⬇ {t("ivaAlicuotas.exportExcel")}
</button>

<button onClick={imprimir}>
  🖨 {t("ivaAlicuotas.print")}
</button>

<button onClick={exportarPDF}>
  📄 {t("ivaAlicuotas.pdf")}
</button>

        </div>

        <div className="actions-right">

          <select>
            <option>100%</option>
            <option>75%</option>
            <option>50%</option>
          </select>

          <input
            type="text"
            placeholder={t("ivaAlicuotas.search")}
          />

        </div>

      </div>

      <div className="table-wrapper printable-table">

        <table className="iva-table">

          <thead>
            <tr>
              <th>{t("ivaAlicuotas.date")}</th>
<th>{t("ivaAlicuotas.legalName")}</th>
<th>{t("ivaAlicuotas.document")}</th>
<th>{t("ivaAlicuotas.type")}</th>
<th>{t("ivaAlicuotas.comp")}</th>
<th>{t("ivaAlicuotas.invoice")}</th>
<th>{t("ivaAlicuotas.taxableAmount")}</th>
<th>{t("ivaAlicuotas.vatRate")}</th>
<th>{t("ivaAlicuotas.vatAmount")}</th>
<th>{t("ivaAlicuotas.cae")}</th>
            </tr>
          </thead>

          <tbody>

            {datos.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="empty-state"
                >
                  {t("ivaAlicuotas.noData")}
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
    ← {t("ivaAlicuotas.previous")}
  </button>

  <span>
  {t("ivaAlicuotas.page")} {paginaActual} {t("ivaAlicuotas.of")} {totalPaginas || 1}
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
    {t("ivaAlicuotas.next")} →
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
            {t("ivaAlicuotas.taxableSales")}
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
          <span>
 {t("ivaAlicuotas.vat")}
</span>

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
            {t("ivaAlicuotas.totalSales")}
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