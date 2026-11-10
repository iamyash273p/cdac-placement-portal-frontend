import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const API_BASE = 'http://localhost:7500/api';

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Pagination states (10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_BASE}/admins`).then((r) => r.json());
      if (res.success) setAdmins(res.admins || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setAdminForm({ name: '', email: '', phone: '', password: '' });
        fetchAdmins();
      } else {
        alert(data.message || 'Error creating admin.');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin account?')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/admins/${id}`, { method: 'DELETE' });
      const res = await response.json();
      if (!response.ok || !res.success) throw new Error(res.message || 'Failed to delete admin.');
      fetchAdmins();
    } catch (err) {
      alert(err.message || 'Error deleting admin.');
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = admins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(admins.length / itemsPerPage) || 1;

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Accounts Management</h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Manage authorized placement officers and administrator accounts (10 per page).</p>
          </div>
          <button
            onClick={() => {
              setAdminForm({ name: '', email: '', phone: '', password: '' });
              setShowAddModal(true);
            }}
            style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Add New Admin
          </button>
        </div>

        {/* Admins Table Card */}
        <div style={{ background: '#fff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>Admin Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Phone</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No admin accounts found.</td>
                </tr>
              ) : (
                currentAdmins.map((adm) => (
                  <tr key={adm.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{adm.name}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>{adm.email}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>{adm.phone || '-'}</td>
                    <td style={{ padding: '12px', color: '#1d4ed8', fontWeight: 600 }}>{adm.role ? adm.role.charAt(0).toUpperCase() + adm.role.slice(1) : 'Admin'}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => handleDeleteAdmin(adm.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {admins.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, admins.length)} of {admins.length} entries
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{ padding: '6px 12px', background: currentPage === 1 ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <span style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{ padding: '6px 12px', background: currentPage === totalPages ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <form onSubmit={handleAddAdmin} style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3>Create New Admin</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Full Name *</label>
                <input placeholder="Enter administrator name" required value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Email *</label>
                <input placeholder="Enter administrator email" type="email" required value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Phone Number</label>
                <input placeholder="Enter phone number" value={adminForm.phone} onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Password *</label>
                <input placeholder="Password" type="password" required value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 14px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Register Admin</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}