import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://192.168.0.200:7500/api";

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isStudent = loginType === "student";

  function switchLoginType() {
    setLoginType(isStudent ? "admin" : "student");
    setIdentifier("");
    setPassword("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = isStudent 
      ? { prn: identifier, password } 
      : { email: identifier, password };

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setTimeout(() => {
          navigate(data.role === "admin" || !isStudent ? "/admin" : "/student-dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setMessage("Network error. Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-register-page">
      <main className="admin-register-main">
        <section className="admin-register-card login-card">
          <div className="admin-register-heading">
            <div className="admin-register-icon" aria-hidden="true">{isStudent ? "S" : "A"}</div>
            <span className="admin-register-eyebrow">CDAC PLACEMENT PORTAL</span>
            <h1>{isStudent ? "Student Login" : "Admin Login"}</h1>
            <p>{isStudent ? "Sign in using your PRN and password." : "Sign in using your admin email and password."}</p>
          </div>

          <button className="login-switch" type="button" onClick={switchLoginType}>
            Switch to {isStudent ? "Admin" : "Student"} Login
            <span aria-hidden="true">↗</span>
          </button>

          <form className="admin-register-form" onSubmit={handleSubmit}>
            <div className="admin-form-field">
              <label htmlFor="login-identifier">{isStudent ? "PRN" : "Email address"}</label>
              <input
                id="login-identifier"
                type={isStudent ? "text" : "email"}
                name="identifier"
                placeholder={isStudent ? "Enter your PRN" : "admin@cdac.gov.in"}
                value={identifier}
                onChange={(event) => { setIdentifier(event.target.value); setMessage(""); }}
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
                onChange={(event) => { setPassword(event.target.value); setMessage(""); }}
                required
              />
            </div>

            {message && (
              <p className={`admin-form-message ${message.includes("successful") ? "success" : "error"}`} role="status">
                {message}
              </p>
            )}

            <button className="admin-register-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : `Login as ${isStudent ? "Student" : "Admin"}`} <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="admin-register-footer">Need help accessing your account? Contact the placement team.</p>
        </section>
        <p className="admin-register-note">Secure access · CDAC Placement Portal</p>
      </main>
    </div>
  );
}

export default Login;