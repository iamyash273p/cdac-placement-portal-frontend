import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const API_BASE = 'http://localhost:7500/api';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [driveForm, setDriveForm] = useState({
    company: '',
    role: '',
    package: '',
    location: '',
    drive_date: '',
    criteria: '60% throughout academics'
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await fetch(`${API_BASE}/drives`).then((r) => r.json());
      if (res.success) setDrives(res.drives || []);
    } catch (err) {
      console.error('Error fetching drives:', err);
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      // Format calendar date (YYYY-MM-DD -> DD Mon YYYY)
      let formattedDate = driveForm.drive_date;
      if (formattedDate) {
        const dateObj = new Date(formattedDate);
        if (!isNaN(dateObj)) {
          formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      }

      const payload = { ...driveForm, drive_date: formattedDate };

      const res = await fetch(`${API_BASE}/admin/drives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setDriveForm({ company: '', role: '', package: '', location: '', drive_date: '', criteria: '60% throughout academics' });
        fetchDrives();
      } else {
        alert(data.message || 'Failed to create drive.');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    }
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/drives/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res.success) fetchDrives();
    } catch (err) {
      alert('Failed to delete drive.');
    }
  };

  // Helper to check Live or Expired status based on drive date
  const getDriveStatus = (dateStr) => {
    if (!dateStr) return { label: 'Live', bg: '#dcfce7', color: '#166534' };
    const parsedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isNaN(parsedDate) && parsedDate < today) {
      return { label: 'Expired', bg: '#fee2e2', color: '#b91c1c' };
    }
    return { label: 'Live', bg: '#dcfce7', color: '#166534' };
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Campus Placement Drives</h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Manage company placement drives, schedules, and student shortlists.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Create New Drive
          </button>
        </div>

        {/* Drives Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {drives.map((drv) => {
            const driveStatus = getDriveStatus(drv.drive_date);
            return (
              <div key={drv.id} style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{drv.company}</h3>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: driveStatus.bg, color: driveStatus.color }}>
                      {driveStatus.label}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#2563eb', fontWeight: 600 }}>{drv.role}</p>
                  
                  <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <div>💰 <strong>Package:</strong> {drv.package}</div>
                    <div>📍 <strong>Location:</strong> {drv.location}</div>
                    <div>📅 <strong>Drive Date:</strong> {drv.drive_date}</div>
                    <div>📋 <strong>Criteria:</strong> {drv.criteria || '60% throughout academics'}</div>
                    <div>👥 <strong>Shortlisted:</strong> {drv.shortlisted_count || 0} student(s)</div>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteDrive(drv.id)} 
                  style={{ width: '100%', background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Delete Drive
                </button>
              </div>
            );
          })}
        </div>

        {/* Create Drive Modal */}
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <form onSubmit={handleCreateDrive} style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '420px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Create Placement Drive</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Company Name *</label>
                <input 
                  placeholder="e.g. Google" 
                  required 
                  value={driveForm.company} 
                  onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })} 
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Job Role *</label>
                <input 
                  placeholder="e.g. Software Engineer" 
                  required 
                  value={driveForm.role} 
                  onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })} 
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Package *</label>
                <input 
                  placeholder="e.g. 15.0 LPA" 
                  required 
                  value={driveForm.package} 
                  onChange={(e) => setDriveForm({ ...driveForm, package: e.target.value })} 
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Location *</label>
                <input 
                  placeholder="e.g. Bengaluru / Remote" 
                  required 
                  value={driveForm.location} 
                  onChange={(e) => setDriveForm({ ...driveForm, location: e.target.value })} 
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Drive Date (Calendar) *</label>
                <input 
                  type="date"
                  required 
                  value={driveForm.drive_date} 
                  onChange={(e) => setDriveForm({ ...driveForm, drive_date: e.target.value })} 
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Eligibility Criteria</label>
                <input 
                  placeholder="e.g. 60% throughout academics" 
                  value={driveForm.criteria} 
                  onChange={(e) => setDriveForm({ ...driveForm, criteria: e.target.value })} 
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 14px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Drive</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}