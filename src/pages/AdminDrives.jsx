import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { driveDateToInputValue, formatDriveDate, getDriveStatus } from '../utils/driveDates';

const API_BASE = 'http://localhost:7500/api';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextDateString = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  return getLocalDateString(new Date(year, month - 1, day + 1));
};

const formatPackage = (value) => {
  const packageText = String(value ?? '');
  return /lpa/i.test(packageText) ? packageText : `${packageText} LPA`;
};

const minimumMarkFields = [
  ['min_tenth_marks', '10th (%)'],
  ['min_twelfth_marks', '12th (%)'],
  ['min_degree_marks', 'Degree (%)'],
  ['min_cmce_marks', 'CMCE (%)'],
  ['min_ccee_marks', 'CCEE (%)']
];

const emptyDriveForm = () => ({
  company: '',
  role: '',
  package: '',
  location: '',
  drive_date: '',
  deadline_date: '',
  criteria: '',
  min_tenth_marks: '',
  min_twelfth_marks: '',
  min_degree_marks: '',
  min_cmce_marks: '',
  min_ccee_marks: ''
});

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [shortlistDrive, setShortlistDrive] = useState(null);
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [shortlistError, setShortlistError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingDriveId, setEditingDriveId] = useState(null);
  
  const [driveForm, setDriveForm] = useState(emptyDriveForm);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await fetch(`${API_BASE}/drives`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load drives.');
      }

      const driveList = data.drives || [];
      setDrives(driveList);
    } catch (err) {
      console.error('Error fetching drives:', err);
    }
  };

  const openShortlistedStudents = async (drive) => {
    setShortlistDrive(drive);
    setShortlistedStudents([]);
    setShortlistError('');
    setShortlistLoading(true);
    try {
      const response = await fetch(`${API_BASE}/drives/${drive.id}/shortlist`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load shortlisted students.');
      }
      setShortlistedStudents(data.shortlistedStudents || []);
    } catch (error) {
      setShortlistError(error.message || 'Unable to load shortlisted students.');
    } finally {
      setShortlistLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = window.setTimeout(fetchDrives, nextMidnight.getTime() - now.getTime() + 1000);
    return () => window.clearTimeout(timer);
  }, [drives]);

  const resetDriveForm = () => {
    setDriveForm(emptyDriveForm());
    setEditingDriveId(null);
  };

  const openEditDrive = (drive) => {
    setDriveForm({
      company: drive.company || '',
      role: drive.role || '',
      package: Number.parseFloat(String(drive.package || '')) || '',
      location: drive.location || '',
      drive_date: driveDateToInputValue(drive.drive_date),
      deadline_date: driveDateToInputValue(drive.deadline_date),
      criteria: drive.criteria || '',
      ...Object.fromEntries(minimumMarkFields.map(([field]) => [
        field,
        drive[field] === null || drive[field] === undefined ? '' : String(drive[field])
      ]))
    });
    setEditingDriveId(drive.id);
    setFormError('');
    setShowCreateModal(true);
  };

  const handleSaveDrive = async (e) => {
    e.preventDefault();
    const today = getLocalDateString();
    const packageValue = Number(driveForm.package);

    if (!Number.isFinite(packageValue) || packageValue <= 0) {
      setFormError('Package must be a positive number in LPA.');
      return;
    }
    if (driveForm.drive_date < today) {
      setFormError('Drive date cannot be before today.');
      return;
    }
    if (driveForm.deadline_date <= driveForm.drive_date) {
      setFormError('Application deadline must be after the drive date.');
      return;
    }

    setFormError('');
    try {
      const payload = {
        ...driveForm,
        package: packageValue,
        ...Object.fromEntries(minimumMarkFields.map(([field]) => [
          field,
          driveForm[field] === '' ? null : Number(driveForm[field])
        ]))
      };

      const res = await fetch(`${API_BASE}/admin/drives${editingDriveId ? `/${editingDriveId}` : ''}`, {
        method: editingDriveId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        resetDriveForm();
        await fetchDrives();
      } else {
        setFormError(data.message || 'Failed to create drive.');
      }
    } catch (err) {
      setFormError('Error connecting to backend server.');
    }
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/drives/${id}`, { method: 'DELETE' });
      const res = await response.json();
      if (!response.ok || !res.success) {
        window.alert(res.message || 'Failed to delete drive.');
        return;
      }
      await fetchDrives();
    } catch (err) {
      window.alert('Failed to delete drive.');
    }
  };

  const handleDriveStatusChange = async (drive, nextStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/drives/${drive.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        window.alert(data.message || 'Unable to update drive status.');
        return;
      }
      await fetchDrives();
    } catch (err) {
      console.error('Error updating drive status:', err);
      window.alert('Unable to connect to the server. Please try again.');
    }
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
            onClick={() => {
              resetDriveForm();
              setFormError('');
              setShowCreateModal(true);
            }}
            style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Create New Drive
          </button>
        </div>

        {/* Drives Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {drives.map((drv) => {
            const driveStatus = getDriveStatus(drv);
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
                    <div>💰 <strong>Package:</strong> {formatPackage(drv.package)}</div>
                    <div>📍 <strong>Location:</strong> {drv.location}</div>
                    <div>📅 <strong>Drive Date:</strong> {formatDriveDate(drv.drive_date)}</div>
                    {drv.deadline_date && <div>⏳ <strong>Application Deadline:</strong> {formatDriveDate(drv.deadline_date)}</div>}
                    <div>📋 <strong>Additional Criteria:</strong> {drv.criteria || 'None'}</div>
                    {minimumMarkFields.some(([field]) => drv[field] !== null && drv[field] !== undefined) && (
                      <div>
                        🎓 <strong>Minimum Marks:</strong>{' '}
                        {minimumMarkFields
                          .filter(([field]) => drv[field] !== null && drv[field] !== undefined)
                          .map(([field, label]) => `${label} ${drv[field]}`)
                          .join(' · ')}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => openShortlistedStudents(drv)}
                    style={{ width: '100%', background: '#dbeafe', color: '#1e40af', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View Shortlisted Students ({drv.shortlisted_count || 0})
                  </button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {driveStatus.label !== 'Completed' && (
                      <button
                        onClick={() => openEditDrive(drv)}
                        style={{ flex: 1, background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Edit Drive
                      </button>
                    )}
                    {driveStatus.label !== 'Completed' && (
                      <button
                        onClick={() => handleDeleteDrive(drv.id)}
                        style={{ flex: 1, background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete Drive
                      </button>
                    )}
                  </div>
                  {driveStatus.label !== 'Completed' && (
                    <button
                      onClick={() => handleDriveStatusChange(drv, 'Completed')}
                      style={{ width: '100%', background: '#f1f5f9', color: '#334155', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {shortlistDrive && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '520px', maxWidth: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>
                Shortlisted Students — {shortlistDrive.company}
              </h2>
              <p style={{ margin: '6px 0 12px', color: '#64748b', fontSize: '13px' }}>{shortlistDrive.role}</p>
              {shortlistError && <p role="alert" style={{ color: '#b91c1c' }}>{shortlistError}</p>}
              <div style={{ overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '16px' }}>
                {shortlistLoading ? (
                  <p style={{ color: '#64748b', textAlign: 'center' }}>Loading students…</p>
                ) : shortlistError ? null : shortlistedStudents.length ? (
                  shortlistedStudents.map((student) => (
                    <div key={student.student_id} style={{ padding: '9px 4px', borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                      <strong>{student.name}</strong> <span style={{ color: '#64748b' }}>({student.prn})</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b', textAlign: 'center' }}>No students shortlisted for this drive.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShortlistDrive(null)}
                style={{ alignSelf: 'flex-end', padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Create Drive Modal */}
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <form onSubmit={handleSaveDrive} style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '420px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{editingDriveId ? 'Edit Placement Drive' : 'Create Placement Drive'}</h3>
              {formError && <p role="alert" style={{ color: '#b91c1c', fontSize: '13px', margin: 0 }}>{formError}</p>}
              
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
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Package in LPA"
                  required 
                  value={driveForm.package} 
                  onChange={(e) => {
                    setFormError('');
                    setDriveForm({ ...driveForm, package: e.target.value });
                  }}
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
                  min={getLocalDateString()}
                  value={driveForm.drive_date} 
                  onChange={(e) => {
                    setFormError('');
                    setDriveForm({
                      ...driveForm,
                      drive_date: e.target.value,
                      deadline_date: driveForm.deadline_date > e.target.value ? driveForm.deadline_date : ''
                    });
                  }}
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Application Deadline *</label>
                <input
                  type="date"
                  required
                  min={getNextDateString(driveForm.drive_date)}
                  value={driveForm.deadline_date}
                  onChange={(e) => {
                    setFormError('');
                    setDriveForm({ ...driveForm, deadline_date: e.target.value });
                  }}
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <h4 style={{ margin: '8px 0 0', color: '#0f172a' }}>Minimum Academic Requirements</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Leave a field blank if there is no minimum. Students meeting every entered minimum will be shortlisted automatically.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {minimumMarkFields.map(([field, label]) => (
                  <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                    Minimum {label}
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="No minimum"
                      value={driveForm[field]}
                      onChange={(e) => {
                        setFormError('');
                        setDriveForm({ ...driveForm, [field]: e.target.value });
                      }}
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    />
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Additional Criteria (informational)</label>
                <input
                  placeholder="Additional criteria (informational)"
                  value={driveForm.criteria}
                  onChange={(e) => setDriveForm({ ...driveForm, criteria: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => { setShowCreateModal(false); resetDriveForm(); }} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 14px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{editingDriveId ? 'Save Changes' : 'Save Drive'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}