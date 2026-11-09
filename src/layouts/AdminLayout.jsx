import React, { useState } from "react";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  const role = localStorage.getItem("role")?.toLowerCase();
  if (!localStorage.getItem("token") || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navLinks = [
    { label: "Home", path: "/admin", icon: "🏠" },
    { label: "Drives", path: "/admin/drives", icon: "💼" },
    { label: "Students", path: "/admin/students", icon: "🎓" },
    { label: "Admins", path: "/admin/admins", icon: "🛡️" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: "#0f172a", color: "#fff", display: "flex", flexDirection: "column", borderRight: "1px solid #1e293b" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #1e293b" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#fff" }}>CDAC Placement</h2>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Admin Control Panel</span>
        </div>
        <nav style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", margin: "0 0 8px 12px", letterSpacing: "0.5px" }}>ADMIN MENU</p>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px",
                  borderRadius: "8px", color: isActive ? "#fff" : "#94a3b8",
                  background: isActive ? "#1e3a8a" : "transparent", textDecoration: "none",
                  fontWeight: 600, fontSize: "14px"
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          height: "70px", background: "#fff", borderBottom: "1px solid #e2e8f0",
          display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 24px", position: "relative"
        }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9",
                border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "8px",
                cursor: "pointer", fontWeight: 600, color: "#0f172a"
              }}
            >
              <span style={{ background: "#1e3a8a", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                {user.name ? user.name.charAt(0).toUpperCase() : ""}
              </span>
              {user.name} ▾
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute", right: 0, top: "45px", background: "#fff",
                border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                borderRadius: "8px", width: "200px", zIndex: 1000, padding: "8px 0"
              }}>
                <div style={{ padding: "8px 16px", borderBottom: "1px solid #f1f5f9", fontSize: "12px", color: "#64748b" }}>
                  {user.name && <strong>{user.name}</strong>}
                  {user.email && <div style={{ fontSize: "11px", color: "#94a3b8" }}>{user.email}</div>}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%", textAlign: "left", background: "none", border: "none",
                    padding: "10px 16px", color: "#ef4444", fontWeight: 600, cursor: "pointer", fontSize: "13px"
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          <div className="admin-content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;