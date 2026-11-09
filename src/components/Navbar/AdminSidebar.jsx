import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const links = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Drives", path: "/admin/drives", icon: "💼" },
    { name: "Students", path: "/admin/students", icon: "🎓" },
    { name: "Admins", path: "/admin/admins", icon: "🛡️" }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <p className="admin-sidebar-title">ADMIN MENU</p>
        <nav className="admin-sidebar-links">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin" || link.path === "/admin/admins"}
              className={({ isActive }) =>
                isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
              }
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <p className="portal-tag">CDAC Placement Cell</p>
        <span>Academic Year 2026</span>
      </div>
    </aside>
  );
}

export default AdminSidebar;