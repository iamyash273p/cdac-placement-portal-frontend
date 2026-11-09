import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import AdminRegister from "../pages/AdminRegister";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDrives from "../pages/AdminDrives";
import AdminStudents from "../pages/AdminStudents";
import { getSession } from "../services/api";

// Requires user to be logged in (Redirects to /login if not authenticated)
function ProtectedRoute({ children, allowedRole }) {
  const session = getSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && session.role !== allowedRole) {
    return (
      <Navigate
        to={session.role === "admin" ? "/admin" : "/student-dashboard"}
        replace
      />
    );
  }
  return children;
}

// Redirects root "/" to "/login" if not signed in, or to the user's dashboard if signed in
function RootRedirect() {
  const session = getSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Navigate
      to={session.role === "admin" ? "/admin" : "/student-dashboard"}
      replace
    />
  );
}

// Prevents logged-in users from seeing the login screen unless they logout
function PublicOnlyRoute({ children }) {
  const session = getSession();
  if (session) {
    return (
      <Navigate
        to={session.role === "admin" ? "/admin" : "/student-dashboard"}
        replace
      />
    );
  }
  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* First screen is always Login unless an active session exists */}
        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Protected Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard defaultTab="overview" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drives"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDrives />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminStudents />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirects to "/" which routes to "/login" or active session dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
