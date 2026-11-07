
import React, { useState } from "react";
import "./AdminRegister.css";
import { PublicNavbar } from "../components/Navbar/Navbar";

function AdminRegister() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Admin registration form submitted!");

    console.log(formData);
  }

  return (
    <div className="admin-register-container">
      <PublicNavbar/>

      <form className="admin-register-form" onSubmit={handleSubmit}>

        <h2>Admin Registration</h2>
        <p>Create an administrator account</p>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <label>Admin Invitation Key</label>
        <input
          type="password"
          name="adminKey"
          placeholder="Enter invitation key"
          value={formData.adminKey}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Create Admin Account
        </button>

        <p className="admin-login-link">
          Already registered? <a href="/login">Login</a>
        </p>

      </form>
    </div>
  );
}

export default AdminRegister;
