import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_BASE, getSession, clearSession } from "../../services/api";
import "./Navbar.css";

function Navbar({
  title,
  subtitle,
  links,
  showLogin = false,
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (onSaveProfile) {
      await onSaveProfile(formData);
    }
    setShowEditModal(false);
  };

  const homePath = userProfile?.role === "admin" ? "/admin" : showLogin ? "/login" : "/student-dashboard";

  return (
    <>
      <nav className="portal-navbar">
        <NavLink to={homePath} className="portal-brand">
          <span className="portal-brand-badge">CD</span>
          <div className="portal-brand-text">
            <strong>{title}</strong>
            {subtitle && <span>{subtitle}</span>}
          </div>
        </NavLink>

        {links && links.length > 0 && (
          <div className="portal-nav-links">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/student-dashboard" || link.path === "/admin"}
                className={({ isActive }) =>
                  isActive ? "portal-nav-link active" : "portal-nav-link"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}

        <div className="portal-nav-actions">
          {showLogin ? (
            <NavLink to="/login" className="silver-login-btn">
              Sign In
            </NavLink>
          ) : (
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
                <span className="nav-profile-name">{formData.name || "Profile"}</span>
                <span className="caret-icon">▾</span>
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-user-summary">
                    <strong>{formData.name}</strong>
                    <span>{formData.email}</span>
                    {formData.prn && <span>PRN: {formData.prn}</span>}
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
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="nav-modal-backdrop" onClick={() => setShowEditModal(false)}>
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
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
  const navigate = useNavigate();
  const session = getSession();

  const [studentProfile, setStudentProfile] = useState(() => {
    if (session?.user) {
      return {
        id: session.user.id,
        name: session.user.name || "Student",
        email: session.user.email || "student@cdac.in",
        prn: session.user.prn || "",
        phone: session.user.phone || "9876543210",
        photo: session.user.photo || "",
        role: session.role || "student"
      };
    }
    return {
      name: "Student",
      email: "student@cdac.in",
      phone: "9876543210",
      photo: "",
      role: "student"
    };
  });

  const handleLogout = () => {
    clearSession();
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  };

  const handleSaveProfile = async (updatedProfile) => {
    setStudentProfile(updatedProfile);
    const current = getSession();
    if (current) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...current.user, ...updatedProfile })
      );
      if (current.user?.id) {
        try {
          await fetch(`${API_BASE}/auth/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: current.user.id,
              role: current.role,
              email: updatedProfile.email,
              phone: updatedProfile.phone,
              photo: updatedProfile.photo
            })
          });
        } catch (err) {
          console.error("Failed syncing profile:", err);
        }
      }
    }
  };

  const navLinks =
    session?.role === "admin"
      ? [
          { name: "Admin Dashboard", path: "/admin" },
          { name: "About Us", path: "/about" },
          { name: "Contact Us", path: "/contact" }
        ]
      : [
          { name: "Dashboard", path: "/student-dashboard" },
          { name: "About Us", path: "/about" },
          { name: "Contact Us", path: "/contact" }
        ];

  return (
    <Navbar
      title="CDAC Placement Portal"
      subtitle={session?.role === "admin" ? "Admin Session" : "Student Session"}
      onLogout={handleLogout}
      userProfile={studentProfile}
      onSaveProfile={handleSaveProfile}
      links={navLinks}
      showLogin={false}
    />
  );
}

export function PublicNavbar() {
  const session = getSession();
  if (session) {
    return <StudentNavbar />;
  }
  return (
    <Navbar
      title="CDAC Placement Portal"
      subtitle="Campus Recruitment & Career Cell"
      links={[]}
      showLogin={true}
    />
  );
}

export default Navbar;
