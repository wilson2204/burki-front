import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR (después) */}
      <div style={{ width: "220px", background: "#0f172a", color: "white" }}>
        Sidebar
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
