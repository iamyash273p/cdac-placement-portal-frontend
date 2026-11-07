import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({
  title,
  links,
  showLogin = true,
  onLogout,
  userProfile,
  onSaveProfile
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(
    userProfile || {
      name: "Student",
      email: "student@cdac.in",
      phone: "9876543210",
      photo: ""
    }
  );

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile(formData);
    }
    setShowEditModal(false);
  };

  return (
    <>
      <nav className="portal-navbar">
        <NavLink to="/" className="portal-brand">
          <span className="portal-brand-badge">CD</span>
          <span>{title}</span>
        </NavLink>

        <div className="portal-nav-links">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                isActive ? "portal-nav-link active" : "portal-nav-link"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="portal-nav-actions">
          {/* Profile Dropdown Button */}
          <div className="profile-dropdown-wrap">
            <button
              type="button"
              className="profile-trigger-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Profile"
                  className="nav-profile-img"
                />
              ) : (
                <span className="nav-profile-avatar">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
              <span>Profile ▾</span>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-user-summary">
                  <strong>{formData.name}</strong>
                  <span>{formData.email}</span>
                  <span>📞 {formData.phone}</span>
                </div>
                <button
                  type="button"
                  className="dropdown-item-btn"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowEditModal(true);
                  }}
                >
                  ✏️ Edit Profile
                </button>
                {showLogin ? (
                  <NavLink
                    to="/login"
                    className="dropdown-item-link"
                    onClick={() => setDropdownOpen(false)}
                  >
                    🔑 Login
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    className="dropdown-item-btn danger"
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                  >
                    🚪 Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Edit Profile Popup Modal (Update Photo, Email, Phone No) */}
      {showEditModal && (
        <div
          className="nav-modal-backdrop"
          onClick={() => setShowEditModal(false)}
        >
          <div className="nav-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="nav-modal-header">
              <h3>Edit Profile</h3>
              <button
                type="button"
                className="nav-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="nav-profile-form">
              <div className="nav-photo-preview-row">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="modal-photo-preview"
                  />
                ) : (
                  <div className="modal-photo-placeholder">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="nav-form-group" style={{ flex: 1 }}>
                  <label>Update Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              <div className="nav-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter new email"
                />
              </div>

              <div className="nav-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="nav-modal-actions">
                <button
                  type="button"
                  className="nav-cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="nav-save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function StudentNavbar({ onLogout }) {
  const [studentProfile, setStudentProfile] = useState({
    name: "Student",
    email: "student.dac@cdac.in",
    phone: "+91 9876543210",
    photo: ""
  });

  return (
    <Navbar
      title="CDAC Placement Portal"
      onLogout={onLogout}
      userProfile={studentProfile}
      onSaveProfile={setStudentProfile}
      links={[
        { name: "Student Dashboard", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Admin Portal", path: "/admin" }
      ]}
      showLogin={!onLogout}
    />
  );
}

export function PublicNavbar() {
  return <StudentNavbar />;
}

export function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();
  return (
    <Navbar
      title="CDAC Placement Portal"
      onLogout={onLogout || (() => navigate("/login"))}
      links={[{ name: "Admin Panel", path: "/admin" }]}
    />
  );
}

export default Navbar;
