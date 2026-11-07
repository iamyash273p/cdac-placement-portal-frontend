import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [adminProfile, setAdminProfile] = useState({
    name: "Placement Officer",
    email: "admin.placement@cdac.in",
    phone: "+91 9822011223",
    photo: ""
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setShowEditProfile(false);
  };

  function handleLogout() {
    navigate("/login");
  }

  return (
    <>
      <header className="admin-topbar">
        <Link to="/admin" className="admin-topbar-brand">
          <div className="admin-brand-badge">CD</div>
          <div>
            <h2>CDAC Placement Portal</h2>
            <span>Admin Control Panel</span>
          </div>
        </Link>

        <div className="admin-topbar-right">
          <Link to="/" className="student-view-link">
            Student View ↗
          </Link>

          {/* Profile Button with Dropdown List */}
          <div className="admin-profile-dropdown">
            <button
              type="button"
              className="admin-profile-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {adminProfile.photo ? (
                <img
                  src={adminProfile.photo}
                  alt="Admin"
                  className="admin-avatar-img"
                />
              ) : (
                <span className="admin-avatar-circle">
                  {adminProfile.name.charAt(0)}
                </span>
              )}
              <span className="admin-profile-label">{adminProfile.name}</span>
              <span>▾</span>
            </button>

            {dropdownOpen && (
              <div className="admin-dropdown-menu">
                <div className="admin-dropdown-info">
                  <strong>{adminProfile.name}</strong>
                  <span>{adminProfile.email}</span>
                  <span>📞 {adminProfile.phone}</span>
                </div>

                <button
                  type="button"
                  className="admin-dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowEditProfile(true);
                  }}
                >
                  ✏️ Edit Profile
                </button>

                <button
                  type="button"
                  className="admin-dropdown-item logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Edit Profile Modal (Update Photo, Email, or Phone No) */}
      {showEditProfile && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowEditProfile(false)}
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-top">
              <h3>Edit Admin Profile</h3>
              <button
                type="button"
                className="admin-close-btn"
                onClick={() => setShowEditProfile(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="admin-profile-form">
              <div className="admin-photo-row">
                {adminProfile.photo ? (
                  <img
                    src={adminProfile.photo}
                    alt="Admin Preview"
                    className="admin-photo-preview"
                  />
                ) : (
                  <div className="admin-photo-placeholder">
                    {adminProfile.name.charAt(0)}
                  </div>
                )}
                <div className="admin-field" style={{ flex: 1 }}>
                  <label>Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  value={adminProfile.email}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, email: e.target.value })
                  }
                  placeholder="Enter admin email"
                />
              </div>

              <div className="admin-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={adminProfile.phone}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
