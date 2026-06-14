import { useEffect, useState } from "react";
import "./Estadisticas.css";
import { useLanguage } from "../../context/LanguageContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const API_URL = "/api";

const COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6"
];

export default function Estadisticas() {
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [todayStats, setTodayStats] = useState({
    totalRevenue: 0,
    tickets: 0,
    averageRevenue: 0,
  });

  const [monthStats, setMonthStats] = useState({
    totalRevenue: 0,
    tickets: 0,
    averageRevenue: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [criticalStock, setCriticalStock] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [
        todayRes,
        monthRes,
        revenueRes,
        criticalRes,
        paymentRes,
      ] = await Promise.all([
        fetch(`${API_URL}/report/sales/today`, {
          credentials: "include",
        }),

        fetch(`${API_URL}/report/sales/current-month`, {
          credentials: "include",
        }),

        fetch(`${API_URL}/report/sales/year-and-month`, {
          credentials: "include",
        }),

        fetch(`${API_URL}/report/critical-stock-items`, {
          credentials: "include",
        }),

        fetch(`${API_URL}/report/payment-methods/revenue/current-month`, {
          credentials: "include",
        }),
      ]);

      // 🔥 CONTROL DE ERRORES HTTP
      if (!todayRes.ok) throw new Error("Error today stats");
      if (!monthRes.ok) throw new Error("Error month stats");
      if (!revenueRes.ok) throw new Error("Error revenue stats");
      if (!criticalRes.ok) throw new Error("Error critical stock");
      if (!paymentRes.ok) throw new Error("Error payment methods");

      const todayData = await todayRes.json();
      const monthData = await monthRes.json();
      const revenueData = await revenueRes.json();
      const criticalData = await criticalRes.json();
      const paymentData = await paymentRes.json();

      setTodayStats(todayData || { totalRevenue: 0, tickets: 0, averageRevenue: 0 });
      setMonthStats(monthData || { totalRevenue: 0, tickets: 0, averageRevenue: 0 });
      setMonthlyRevenue(Array.isArray(revenueData) ? revenueData : []);
      setCriticalStock(Array.isArray(criticalData) ? criticalData : []);
      setPaymentMethods(Array.isArray(paymentData) ? paymentData : []);

    } catch (error) {
      console.error("Error estadísticas:", error);

      // opcional: reset seguro
      setTodayStats({ totalRevenue: 0, tickets: 0, averageRevenue: 0 });
      setMonthStats({ totalRevenue: 0, tickets: 0, averageRevenue: 0 });
      setMonthlyRevenue([]);
      setCriticalStock([]);
      setPaymentMethods([]);

    } finally {
      setLoading(false);
    }
  };

const months = [
  "",
  t("months.jan"),
  t("months.feb"),
  t("months.mar"),
  t("months.apr"),
  t("months.may"),
  t("months.jun"),
  t("months.jul"),
  t("months.aug"),
  t("months.sep"),
  t("months.oct"),
  t("months.nov"),
  t("months.dec"),
];

  const chartData = (monthlyRevenue || [])
    .slice(-12)
    .map(item => ({
      mes: `${months[item.month - 1]}/${item.year}`,
      ingresos: item.revenue,
    }));

  const money = (value) =>
    Number(value || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="estadisticas-container">
        <div className="loading-card">
          {t("statistics.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="estadisticas-container">

      <div className="estadisticas-header">
        <h1>📊 {t("statistics.title")}</h1>
        <p>{t("statistics.subtitle")}</p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div>
            <span>{t("statistics.salesToday")}</span>
            <h2>${money(todayStats.totalRevenue)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div>
            <span>{t("statistics.ticketsToday")}</span>
            <h2>{todayStats.tickets}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <span>{t("statistics.averageToday")}</span>
            <h2>${money(todayStats.averageRevenue)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div>
            <span>{t("statistics.salesMonth")}</span>
            <h2>${money(monthStats.totalRevenue)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div>
            <span>{t("statistics.ticketsMonth")}</span>
            <h2>{monthStats.tickets}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div>
            <span>{t("statistics.averageMonth")}</span>
            <h2>${money(monthStats.averageRevenue)}</h2>
          </div>
        </div>

      </div>

      <div className="chart-card">
        <h2>📈 {t("statistics.monthlyRevenue")}</h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>

            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

            <XAxis dataKey="mes" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              formatter={(value) =>
                `$${Number(value).toLocaleString("es-AR")}`
              }
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff"
              }}
            />

            <Bar
              dataKey="ingresos"
              fill="url(#salesGradient)"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bottom-grid">

        <div className="chart-card">
          <h2>💳 {t("statistics.paymentMethods")}</h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={paymentMethods || []}
                dataKey="revenue"
                nameKey="paymentMethod"
                outerRadius={120}
                label
              >
                {(paymentMethods || []).map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="table-card">
          <h2>🚨 {t("statistics.criticalStock")}</h2>

          <div className="table-wrapper">
            <table className="critical-table">
              <thead>
                <tr>
                  <th>{t("statistics.code")}</th>
                  <th>{t("statistics.item")}</th>
                  <th>{t("statistics.reorderPoint")}</th>
                  <th>{t("statistics.stock")}</th>
                </tr>
              </thead>

              <tbody>
                {(criticalStock || []).map((item, index) => (
                  <tr key={index}>
                    <td>{item.barCode}</td>
                    <td>{item.item}</td>
                    <td>{item.reorderPoint}</td>
                    <td className="negative-stock">
                      {item.currentStock}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>

      </div>

    </div>
  );
}