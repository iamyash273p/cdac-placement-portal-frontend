import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

const API_BASE = 'http://localhost:7500/api';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [shortlistedDrives, setShortlistedDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Fetch fresh student profile from backend to get updated calls and status
        fetch(`${API_BASE}/students`)
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              const freshStudent = data.students.find(s => s.id === parsedUser.id || s.email === parsedUser.email);
              if (freshStudent) {
                setStudent(freshStudent);
                fetchShortlistedDrives(freshStudent);
                return;
              }
            }
            setStudent(parsedUser);
            fetchShortlistedDrives(parsedUser);
          })
          .catch(() => {
            setStudent(parsedUser);
            fetchShortlistedDrives(parsedUser);
          });
      } else {
        setError('No active student session found. Please log in.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load user session.');
      setLoading(false);
    }
  }, []);

  const fetchShortlistedDrives = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/student/shortlisted-drives?studentId=${userData.id}&email=${userData.email}&prn=${userData.prn}`);
      const data = await res.json();
      if (data.success) {
        setShortlistedDrives(data.drives || []);
      }
    } catch (err) {
      console.error('Error fetching shortlisted drives:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="student-dashboard-page">
        <div className="student-main-container">
          <p className="dashboard-message">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="student-dashboard-page">
        <div className="student-main-container">
          <p className="dashboard-error">{error || 'Unauthorized'}</p>
        </div>
      </div>
    );
  }

  // Calculate remaining calls dynamically from allocated calls
  const totalCallsNum = parseInt(student.calls) || 0;
  const callsUsedNum = student.calls_used || 0;
  const callsLeft = Math.max(0, totalCallsNum - callsUsedNum);

  return (
    <div className="student-dashboard-page">
      <div className="student-main-container">
        
        {/* Welcome Banner */}
        <div className="student-welcome-card">
          <h1>Welcome back, {student.name}!</h1>
          <p>Here is your personal profile summary, placement call quota based on your marks, and shortlisted company drives.</p>
        </div>

        {/* Profile Details & Calls Tracker Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '2.5rem' }}>
          
          {/* Personal Details */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              👤 Personal & Academic Profile
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#475569' }}>
              <div><strong>PRN No:</strong> {student.prn || 'N/A'}</div>
              <div><strong>Email:</strong> {student.email}</div>
              <div><strong>Phone:</strong> {student.phone || 'Not Provided'}</div>
              <div><strong>Passout Year:</strong> {student.passout_year || '2026'}</div>
              <div><strong>Status:</strong> <span style={{ color: student.status === 'Placed' ? '#166534' : '#92400e', fontWeight: 600 }}>{student.status} {student.company && student.company !== '-' ? `(${student.company})` : ''}</span></div>
            </div>
          </div>

          {/* Placement Calls Tracker Card */}
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              📞 Placement Calls Tracker
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center', margin: '10px 0' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Allocated</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{student.calls || 'Pending'}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Used</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#d97706' }}>{callsUsedNum}</span>
              </div>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>Calls Left</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#1d4ed8' }}>{student.calls ? callsLeft : 'Pending'}</span>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0', textAlign: 'center' }}>
              Calculated automatically based on your CMCE and CEE average marks.
            </p>
          </div>

        </div>

        {/* Shortlisted Company Drives Section */}
        <h2 className="section-title">My Shortlisted Company Drives</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '-1rem', marginBottom: '1.5rem' }}>
          Only drives for which the Placement Admin has shortlisted you appear below.
        </p>

        {shortlistedDrives.length === 0 ? (
          <div className="drive-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 className="drive-company-name">No Shortlisted Drives Yet</h3>
            <p className="drive-meta" style={{ marginTop: '0.5rem' }}>
              Once the Admin shortlists you for a company drive in the Admin Portal, that drive card will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="drives-grid">
            {shortlistedDrives.map((drv) => (
              <div key={drv.id} className="drive-card">
                <div>
                  <div className="drive-card-header">
                    <h3 className="drive-company-name">{drv.company}</h3>
                    <span className="drive-status-badge active">{drv.status || 'Shortlisted'}</span>
                  </div>
                  <p className="drive-role">{drv.role}</p>
                  <p className="drive-package">{drv.package}</p>
                  <p className="drive-meta">📍 <strong>Location:</strong> {drv.location}</p>
                  <p className="drive-meta">📅 <strong>Drive Date:</strong> {drv.drive_date}</p>
                  <p className="drive-meta">📋 <strong>Criteria:</strong> {drv.criteria || 'Standard CDAC norms'}</p>
                </div>
                <button className="apply-btn" onClick={() => alert(`Viewing details for ${drv.company} drive.`)}>
                  View Drive Details
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}