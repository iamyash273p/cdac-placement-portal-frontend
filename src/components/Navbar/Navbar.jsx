import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({
  title,
  links,
  showLogin = false,
  showProfile = true,
  onLogout,
  userProfile,
  onSaveProfile
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(
    userProfile || {
      name: "",
      email: "",
      phone: "",
      photo: ""
    }
  );

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

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

        {showProfile && (
          <div className="portal-nav-actions">
            <div className="profile-dropdown-wrap">
              <button
                type="button"
                className="profile-trigger-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {formData.photo ? (
                  <img src={formData.photo} alt="Profile" className="nav-profile-img" />
                ) : (
                  <span className="nav-profile-avatar">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
                <span>{formData.name || "Profile"} ▾</span>
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-user-summary">
                    {formData.name && <strong>{formData.name}</strong>}
                    {formData.email && <span>{formData.email}</span>}
                    {formData.phone && <span>📞 {formData.phone}</span>}
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
        )}
      </nav>

      {showEditModal && (
        <div className="nav-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="nav-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="nav-modal-header">
              <h3>Edit Profile</h3>
              <button type="button" className="nav-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="nav-profile-form">
              <div className="nav-photo-preview-row">
                {formData.photo ? (
                  <img src={formData.photo} alt="Preview" className="modal-photo-preview" />
                ) : (
                  <div className="modal-photo-placeholder">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="nav-form-group" style={{ flex: 1 }}>
                  <label>Update Profile Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                </div>
              </div>

              <div className="nav-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="nav-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="nav-modal-actions">
                <button type="button" className="nav-cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="nav-save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function StudentNavbar({ onLogout, showProfile = true }) {
  const navigate = useNavigate();
  const hasStudentSession =
    Boolean(localStorage.getItem("token")) &&
    localStorage.getItem("role")?.toLowerCase() === "student";
  const [studentProfile, setStudentProfile] = useState(() => {
    const parsed = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      name: parsed.name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      photo: parsed.photo || ""
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  };

  const handleSaveProfile = (updatedProfile) => {
    setStudentProfile(updatedProfile);
    const existing = JSON.parse(localStorage.getItem("user")) || {};
    localStorage.setItem("user", JSON.stringify({ ...existing, ...updatedProfile }));
  };

  return (
    <Navbar
      title="CDAC Placement Portal"
      onLogout={handleLogout}
      userProfile={studentProfile}
      onSaveProfile={handleSaveProfile}
      links={[
        { name: "Home", path: "/student-dashboard" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" }
      ]}
      showLogin={false}
      showProfile={showProfile && hasStudentSession}
    />
  );
}

export function PublicNavbar({ showLoginLink = true }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <StudentNavbar />;
  }

  return (
    <Navbar
      title="CDAC Placement Portal"
      links={[
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        ...(showLoginLink ? [{ name: "Login", path: "/login" }] : [])
      ]}
      showProfile={false}
    />
  );
}

export function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      photo: user.photo || ""
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <Navbar
      title="CDAC Placement Portal (Admin)"
      onLogout={handleLogout}
      userProfile={adminProfile}
      onSaveProfile={setAdminProfile}
      links={[
        { name: "Home", path: "/admin" },
        { name: "Drives", path: "/admin/drives" },
        { name: "Students", path: "/admin/students" }
      ]}
      showLogin={false}
    />
  );
}

export default Navbar;