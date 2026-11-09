import React, { useState, useEffect } from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
import "./StudentDashboard.css"; // Optional if you have custom styles

const API_BASE = "http://192.168.0.200:7500/api";

export default function StudentDashboard() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user")) || { name: "Student" };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch(`${API_BASE}/drives`);
        const data = await response.json();
        if (response.ok && data.success) {
          setDrives(data.drives);
        } else {
          setError("Failed to fetch placement drives.");
        }
      } catch (err) {
        setError("Network error connecting to backend server.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      <StudentNavbar />
      
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", padding: "2.5rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
            Welcome back, {storedUser.name}! 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: "1rem" }}>
            Explore active placement opportunities retrieved live from your CDAC database.
          </p>
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem" }}>
          Active Placement Drives
        </h2>

        {loading && <p>Loading live drives from database...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {!loading && !error && drives.length === 0 && (
          <p style={{ color: "#64748b" }}>No placement drives currently listed in the database.</p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {drives.map((drive) => (
            <div key={drive.id} style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b", fontWeight: 700 }}>{drive.company}</h3>
                <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "20px", background: drive.status === "Active" ? "#dcfce7" : "#fef9c3", color: drive.status === "Active" ? "#166534" : "#854d0e", fontWeight: 700 }}>
                  {drive.status}
                </span>
              </div>
              <p style={{ margin: "0 0 0.5rem", color: "#475569", fontWeight: 600 }}>{drive.role}</p>
              <p style={{ margin: "0 0 0.5rem", color: "#059669", fontWeight: 700 }}>Package: {drive.package}</p>
              <p style={{ margin: "0 0 0.5rem", color: "#64748b", fontSize: "0.9rem" }}>Location: {drive.location}</p>
              <p style={{ margin: "0 0 1rem", color: "#64748b", fontSize: "0.9rem" }}>Criteria: {drive.criteria}</p>
              <button 
                onClick={() => alert(`Applied for ${drive.company} successfully!`)}
                style={{ width: "100%", padding: "10px", background: "#263b80", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}