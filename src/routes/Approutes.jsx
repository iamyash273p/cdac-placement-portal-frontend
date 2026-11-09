import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import AdminRegister from "../pages/AdminRegister";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDrives from "../pages/AdminDrives";
import AdminStudents from "../pages/AdminStudents";
import AdminQueries from "../pages/AdminQueries";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student & Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/student-dashboard" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminDashboard defaultTab="overview" />} />
        <Route path="/admin/drives" element={<AdminDrives />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/queries" element={<AdminQueries />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
