import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PublicNavbar } from "../components/Navbar/Navbar";
import { API_BASE } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [redirectTo] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role")?.toLowerCase();

    if (token && role === "admin") return "/admin";
    if (token && role === "student") return "/student-dashboard";
    return null;
  });
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const role = typeof data.role === "string" ? data.role.toLowerCase() : "";
        if (role !== "admin" && role !== "student") {
          setMessage("Unable to determine account type. Please contact support.");
          return;
        }

        setMessage("Login successful! Redirecting...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", role);

        // Use replace: true so the login screen is replaced in history
        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/student-dashboard", { replace: true });
          }
        }, 700);
      } else {
        setMessage(data.message || "Invalid email/PRN or password.");
      }
    } catch (err) {
      setMessage("Network error. Make sure backend server is running on port 7500.");
    } finally {
      setLoading(false);
    }
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="admin-register-page">
      <PublicNavbar showLoginLink={false} />
      <main className="admin-register-main">
        <section className="admin-register-card login-card">
          <div className="admin-register-heading">
            <div className="admin-register-icon" aria-hidden="true">🔐</div>
            <span className="admin-register-eyebrow">CDAC PLACEMENT PORTAL</span>
            <h1>Portal Sign In</h1>
          </div>

          <form className="admin-register-form" onSubmit={handleSubmit}>
            <div className="admin-form-field">
              <label htmlFor="login-identifier">Email Address or PRN</label>
              <input
                id="login-identifier"
                type="text"
                name="identifier"
                placeholder="Enter your email address or PRN"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  setMessage("");
                }}
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setMessage("");
                }}
                autoComplete="current-password"
                required
              />
            </div>

            {message && (
              <p
                className={`admin-form-message ${
                  message.includes("successful") ? "success" : "error"
                }`}
                role="status"
              >
                {message}
              </p>
            )}

            <button className="admin-register-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"} <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>
        <p className="admin-register-note">Secure access · CDAC Placement Portal</p>
      </main>
    </div>
  );
}

export default Login;