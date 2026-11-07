import AdminNavbar from "../components/Navbar/AdminNavbar";
import AdminSidebar from "../components/Navbar/AdminSidebar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
