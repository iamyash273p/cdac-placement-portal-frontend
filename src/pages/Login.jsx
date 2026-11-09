import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicNavbar } from "../components/Navbar/Navbar";
import { API_BASE, saveSession } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isStudent = loginType === "student";

  function switchLoginType() {
    setLoginType(isStudent ? "admin" : "student");
    setEmail("");
    setPassword("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        saveSession(data.token, data.user, data.role);
        setMessage("Login successful! Redirecting...");

        setTimeout(() => {
          navigate(data.role === "admin" ? "/admin" : "/student-dashboard", {
            replace: true
          });
        }, 500);
      } else {
        setMessage(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setMessage("Network error. Make sure backend server is running on port 7500.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-register-page">
      <PublicNavbar />
      <main className="admin-register-main">
        <section className="admin-register-card login-card">
          <div className="admin-register-heading">
            <div className="admin-register-icon" aria-hidden="true">
              {isStudent ? "S" : "A"}
            </div>
            <span className="admin-register-eyebrow">CDAC PLACEMENT PORTAL</span>
            <h1>{isStudent ? "Student Login" : "Admin Login"}</h1>
            <p>
              {isStudent
                ? "Sign in using your registered student email and password."
                : "Sign in using your admin email and password."}
            </p>
          </div>

          <button className="login-switch" type="button" onClick={switchLoginType}>
            Switch to {isStudent ? "Admin" : "Student"} Login
            <span aria-hidden="true">↗</span>
          </button>

          <form className="admin-register-form" onSubmit={handleSubmit}>
            <div className="admin-form-field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder={isStudent ? "aarav@cdac.in" : "admin@cdac.in"}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                }}
                autoComplete="email"
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
              {loading ? "Signing in..." : `Login as ${isStudent ? "Student" : "Admin"}`}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="admin-register-footer">
            Default Student: <strong>aarav@cdac.in</strong> / <strong>student123</strong>
            <br />
            Default Admin: <strong>admin@cdac.in</strong> / <strong>admin123</strong>
          </p>
        </section>
        <p className="admin-register-note">Secure Session Management · CDAC Placement Portal</p>
      </main>
    </div>
  );
}

export default Login;
