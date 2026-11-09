import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:7500/api';

export default function AdminDashboard({ initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [batchFilter, setBatchFilter] = useState('All');

  const [selectedDriveForShortlist, setSelectedDriveForShortlist] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState([]);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', phone: '', password: '' });

  // Pagination states (10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setActiveTab(initialTab);
    setCurrentPage(1); // Reset page on tab switch
  }, [initialTab]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [stuRes, drvRes, admRes] = await Promise.all([
        fetch(`${API_BASE}/students`).then((r) => r.json()),
        fetch(`${API_BASE}/drives`).then((r) => r.json()),
        fetch(`${API_BASE}/admins`).then((r) => r.json()).catch(() => ({ success: true, admins: [] }))
      ]);
      if (stuRes.success) setStudents(stuRes.students || []);
      if (drvRes.success) setDrives(drvRes.drives || []);
      if (admRes.success) setAdmins(admRes.admins || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    const res = await fetch(`${API_BASE}/admin/students/${id}`, { method: 'DELETE' }).then((r) => r.json());
    if (res.success) fetchAllData();
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm('Delete this drive?')) return;
    const res = await fetch(`${API_BASE}/admin/drives/${id}`, { method: 'DELETE' }).then((r) => r.json());
    if (res.success) fetchAllData();
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin account?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/admins/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res.success) fetchAllData();
    } catch (err) {
      alert('Failed to delete admin.');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/admin/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminForm)
    }).then((r) => r.json());
    if (res.success) {
      alert('Admin created successfully!');
      setShowCreateAdminModal(false);
      setAdminForm({ name: '', email: '', phone: '', password: '' });
      fetchAllData();
    } else {
      alert(res.message || 'Error creating admin');
    }
  };

  const openShortlistModal = async (drive) => {
    setSelectedDriveForShortlist(drive);
    const res = await fetch(`${API_BASE}/drives/${drive.id}/shortlist`).then((r) => r.json());
    if (res.success) setShortlistedIds(res.shortlistedStudentIds || []);
  };

  const saveShortlist = async () => {
    const res = await fetch(`${API_BASE}/admin/drives/${selectedDriveForShortlist.id}/shortlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentIds: shortlistedIds })
    }).then((r) => r.json());
    if (res.success) {
      setSelectedDriveForShortlist(null);
      fetchAllData();
    }
  };

  const placedCount = students.filter((s) => s.status === 'Placed').length;
  const unplacedCount = students.length - placedCount;

  const filteredStudents = students.filter((s) => {
    if (batchFilter === 'Placed') return s.status === 'Placed';
    if (batchFilter === 'Unplaced') return s.status !== 'Placed';
    return true;
  });

  // Pagination Helper Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentFilteredStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const currentAllStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const currentDrives = drives.slice(indexOfFirstItem, indexOfLastItem);
  const currentAdmins = admins.slice(indexOfFirstItem, indexOfLastItem);

  const activeListLength = 
    activeTab === 'dashboard' ? filteredStudents.length :
    activeTab === 'students' ? students.length :
    activeTab === 'drives' ? drives.length : admins.length;

  const totalPages = Math.ceil(activeListLength / itemsPerPage) || 1;

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              ADMIN PORTAL — CURRENT BATCH 2026
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              {activeTab === 'dashboard' && 'Batch Placement Dashboard'}
              {activeTab === 'drives' && 'Campus Placement Drives'}
              {activeTab === 'students' && 'Batch Student Directory'}
              {activeTab === 'admins' && 'Admin Accounts Management'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              {activeTab === 'dashboard' && 'Overview of batch placement statistics and student records.'}
              {activeTab === 'drives' && 'Manage company placement drives and student shortlists.'}
              {activeTab === 'students' && 'View and manage registered student profiles and scores.'}
              {activeTab === 'admins' && 'Manage authorized admin accounts and placement officers (10 per page).'}
            </p>
          </div>

          {activeTab === 'admins' && (
            <button
              onClick={() => setShowCreateAdminModal(true)}
              style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
            >
              + Add New Admin
            </button>
          )}
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Current Batch Students</div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>{students.length}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total registered in batch</div>
              </div>

              <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Placed Students</div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>{placedCount}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Offers received</div>
              </div>

              <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Unplaced Students</div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '10px 0 4px' }}>{unplacedCount}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Eligible for upcoming drives</div>
              </div>
            </div>

            <div style={{ background: '#fff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>Current Batch — Placed & Unplaced Students</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['All', 'Placed', 'Unplaced'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setBatchFilter(tab); setCurrentPage(1); }}
                      style={{
                        padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        border: batchFilter === tab ? 'none' : '1px solid #cbd5e1',
                        background: batchFilter === tab ? '#1e3a8a' : '#fff',
                        color: batchFilter === tab ? '#fff' : '#334155'
                      }}
                    >
                      {tab === 'All' ? `All (${students.length})` : tab === 'Placed' ? `Placed (${placedCount})` : `Unplaced (${unplacedCount})`}
                    </button>
                  ))}
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px' }}>Student</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>PRN No</th>
                    <th style={{ padding: '12px' }}>CMCE / CEE</th>
                    <th style={{ padding: '12px' }}>Live Calls Left</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFilteredStudents.map((stu) => {
                    const totalCalls = 20;
                    const used = stu.calls_used || 0;
                    const left = Math.max(0, totalCalls - used);
                    return (
                      <tr key={stu.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{stu.name}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{stu.email}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{stu.prn}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{stu.cmce_marks || '-'} / {stu.ccee_marks || '-'}</td>
                        <td style={{ padding: '12px', color: '#1d4ed8', fontWeight: 600 }}>{left} / {totalCalls}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                            background: stu.status === 'Placed' ? '#dcfce7' : '#fef3c7',
                            color: stu.status === 'Placed' ? '#166534' : '#92400e'
                          }}>
                            {stu.status === 'Placed' ? `Placed (${stu.company})` : 'Unplaced'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* DRIVES VIEW */}
        {activeTab === 'drives' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {currentDrives.map((drv) => (
              <div key={drv.id} style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>{drv.company}</h3>
                <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#2563eb', fontWeight: 600 }}>{drv.role}</p>
                <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                  <div>💰 <strong>Package:</strong> {drv.package}</div>
                  <div>📍 <strong>Location:</strong> {drv.location}</div>
                  <div>📅 <strong>Date:</strong> {drv.drive_date}</div>
                  <div>👥 <strong>Shortlisted:</strong> {drv.shortlisted_count || 0} student(s)</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openShortlistModal(drv)} style={{ flex: 1, background: '#1e3a8a', color: '#fff', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Shortlist Students
                  </button>
                  <button onClick={() => handleDeleteDrive(drv.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '9px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STUDENTS VIEW */}
        {activeTab === 'students' && (
          <div style={{ background: '#fff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px' }}>Student</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>PRN No</th>
                  <th style={{ padding: '12px' }}>CMCE / CEE</th>
                  <th style={{ padding: '12px' }}>Calls Left</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAllStudents.map((stu) => {
                  const totalCalls = 20;
                  const used = stu.calls_used || 0;
                  const left = Math.max(0, totalCalls - used);
                  return (
                    <tr key={stu.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{stu.name}</td>
                      <td style={{ padding: '12px' }}>{stu.email}</td>
                      <td style={{ padding: '12px' }}>{stu.prn}</td>
                      <td style={{ padding: '12px' }}>{stu.cmce_marks || '-'} / {stu.ccee_marks || '-'}</td>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#1d4ed8' }}>{left} / {totalCalls}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteStudent(stu.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ADMINS VIEW */}
        {activeTab === 'admins' && (
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
                      <td style={{ padding: '12px', color: '#1d4ed8', fontWeight: 600 }}>Placement Officer</td>
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
          </div>
        )}

        {/* Unified Pagination Footer */}
        {activeListLength > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', background: '#fff', padding: '16px 22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, activeListLength)} of {activeListLength} entries
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
        )}

        {/* Create Admin Modal */}
        {showCreateAdminModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <form onSubmit={handleCreateAdmin} style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3>Create New Admin</h3>
              <input placeholder="Full Name *" required value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input placeholder="Email *" type="email" required value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input placeholder="Phone" value={adminForm.phone} onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input placeholder="Password *" type="password" required value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateAdminModal(false)} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 14px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Register Admin</button>
              </div>
            </form>
          </div>
        )}

        {/* Shortlist Modal */}
        {selectedDriveForShortlist && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <h3>Shortlist for {selectedDriveForShortlist.company}</h3>
              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', margin: '12px 0' }}>
                {students.map((stu) => (
                  <label key={stu.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={shortlistedIds.includes(stu.id)}
                      onChange={() => setShortlistedIds(prev => prev.includes(stu.id) ? prev.filter(id => id !== stu.id) : [...prev, stu.id])}
                    />
                    <span style={{ fontWeight: 600 }}>{stu.name}</span> ({stu.prn})
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={() => setSelectedDriveForShortlist(null)} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveShortlist} style={{ padding: '8px 14px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Shortlist</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}