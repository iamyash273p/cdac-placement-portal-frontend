import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const API_BASE = 'http://localhost:7500/api';

const studentMarkFields = [
  ['tenth_marks', '10th Marks (%)'],
  ['twelfth_marks', '12th Marks (%)'],
  ['degree_marks', 'Degree Marks (%)'],
  ['cmce_marks', 'CMCE Marks (%)'],
  ['ccee_marks', 'CCEE Marks (%)']
];

const normalizeMarkInput = (value) => {
  const match = String(value ?? '').match(/^\s*(\d+(?:\.\d+)?)/);
  return match ? match[1] : '';
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [savingStudent, setSavingStudent] = useState(false);
  const [shortlistedDriveStudent, setShortlistedDriveStudent] = useState(null);
  const [shortlistedDrives, setShortlistedDrives] = useState([]);
  const [shortlistedDrivesLoading, setShortlistedDrivesLoading] = useState(false);
  const [shortlistedDrivesError, setShortlistedDrivesError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [studentForm, setStudentForm] = useState({
    name: '',
    prn: '',
    email: '',
    password: '',
    phone: '',
    status: 'Unplaced',
    tenth_marks: '',
    twelfth_marks: '',
    degree_marks: '',
    postgrad_marks: '',
    cmce_marks: '',
    ccee_marks: ''
  });

  const [editStudentId, setEditStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch(`${API_BASE}/students`).then((r) => r.json());
    if (res.success) setStudents(res.students || []);
  };

  const openShortlistedDrives = async (student) => {
    setShortlistedDriveStudent(student);
    setShortlistedDrives([]);
    setShortlistedDrivesError('');
    setShortlistedDrivesLoading(true);
    try {
      const response = await fetch(`${API_BASE}/student/shortlisted-drives?studentId=${student.id}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load shortlisted drives.');
      }
      setShortlistedDrives(data.drives || []);
    } catch (error) {
      setShortlistedDrivesError(error.message || 'Unable to load shortlisted drives.');
    } finally {
      setShortlistedDrivesLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSavingStudent(true);
    setFormError('');
    try {
      const res = await fetch(`${API_BASE}/admin/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentForm,
          tenthMarks: studentForm.tenth_marks,
          twelfthMarks: studentForm.twelfth_marks,
          degreeMarks: studentForm.degree_marks,
          cmceMarks: studentForm.cmce_marks,
          cceeMarks: studentForm.ccee_marks
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || 'Unable to add student.');
        return;
      }
      await fetchStudents();
      setShowAddModal(false);
      setStudentForm({
        name: '', prn: '', email: '', password: '', phone: '', status: 'Unplaced',
        tenth_marks: '', twelfth_marks: '', degree_marks: '', postgrad_marks: '', cmce_marks: '', ccee_marks: ''
      });
    } catch (err) {
      console.error('Error adding student:', err);
      setFormError('Unable to connect to the server. Please try again.');
    } finally {
      setSavingStudent(false);
    }
  };

  const openEditModal = (stu) => {
    setFormError('');
    setEditStudentId(stu.id);
    setStudentForm({
      name: stu.name || '',
      prn: stu.prn || '',
      email: stu.email || '',
      password: '',
      phone: stu.phone || '',
      status: stu.status || 'Unplaced',
      tenth_marks: normalizeMarkInput(stu.tenth_marks),
      twelfth_marks: normalizeMarkInput(stu.twelfth_marks),
      degree_marks: normalizeMarkInput(stu.degree_marks),
      postgrad_marks: '',
      cmce_marks: normalizeMarkInput(stu.cmce_marks),
      ccee_marks: normalizeMarkInput(stu.ccee_marks)
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSavingStudent(true);
    setFormError('');
    try {
      const res = await fetch(`${API_BASE}/admin/students/${editStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || 'Unable to update student.');
        return;
      }
      await fetchStudents();
      setShowEditModal(false);
      setEditStudentId(null);
    } catch (err) {
      console.error('Error updating student:', err);
      setFormError('Unable to connect to the server. Please try again.');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    const res = await fetch(`${API_BASE}/admin/students/${id}`, { method: 'DELETE' }).then((r) => r.json());
    if (res.success) fetchStudents();
  };

  // Function to download formatted CSV template
  const handleDownloadFormat = () => {
    const csvHeaders = "name,prn,email,password,phone,status,tenth_marks,twelfth_marks,degree_marks,cmce_marks,ccee_marks\n";
    const sampleRow = "Aarav Deshmukh,CDAC2026001,aarav@cdac.in,password123,9876543210,Unplaced,84%,,85%,,\n";
    
    const blob = new Blob([csvHeaders + sampleRow], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_upload_format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return alert('Please select a CSV file.');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) return alert('CSV file is empty or formatted incorrectly.');

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const parsedStudents = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const stu = {};
        headers.forEach((header, index) => {
          stu[header] = values[index] || '';
        });
        parsedStudents.push(stu);
      }

      try {
        const res = await fetch(`${API_BASE}/admin/students/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: parsedStudents })
        });
        const result = await res.json();
        alert(result.message);
        setShowCsvModal(false);
        setCsvFile(null);
        await fetchStudents();
      } catch (err) {
        alert('Failed to upload CSV data.');
      }
    };
    reader.readAsText(csvFile);
  };

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Batch Student Directory</h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Add, update, or remove student profiles (10 per page).</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowCsvModal(true)}
              style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
            >
              📂 Import CSV File
            </button>
            <button
              onClick={() => {
                setStudentForm({ name: '', prn: '', email: '', password: '', phone: '', status: 'Unplaced', tenth_marks: '', twelfth_marks: '', degree_marks: '', postgrad_marks: '', cmce_marks: '', ccee_marks: '' });
                setFormError('');
                setShowAddModal(true);
              }}
              style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
            >
              + Add New Student
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div style={{ background: '#fff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>Student</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>PRN No</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Calls Left</th>
                <th style={{ padding: '12px' }}>Shortlisted Drives</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((stu) => {
                const totalCalls = 20;
                const used = stu.calls_used || 0;
                const left = Math.max(0, totalCalls - used);
                return (
                  <tr key={stu.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{stu.name}</td>
                    <td style={{ padding: '12px' }}>{stu.email}</td>
                    <td style={{ padding: '12px' }}>{stu.prn}</td>
                    <td style={{ padding: '12px', color: '#1d4ed8', fontWeight: 600 }}>{stu.role ? stu.role.charAt(0).toUpperCase() + stu.role.slice(1) : 'Student'}</td>
                    <td style={{ padding: '12px' }}>{stu.status}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#1d4ed8' }}>{left} / {totalCalls}</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        type="button"
                        onClick={() => openShortlistedDrives(stu)}
                        style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        View Drives ({stu.shortlisted_companies?.length || 0})
                      </button>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button onClick={() => openEditModal(stu)} style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginRight: '6px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(stu.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {students.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, students.length)} of {students.length} entries
            </span>
            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
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

        {shortlistedDriveStudent && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '520px', maxWidth: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>
                Shortlisted Drives — {shortlistedDriveStudent.name}
              </h2>
              <p style={{ margin: '6px 0 12px', color: '#64748b', fontSize: '13px' }}>
                PRN: {shortlistedDriveStudent.prn}
              </p>
              {shortlistedDrivesError && <p role="alert" style={{ color: '#b91c1c' }}>{shortlistedDrivesError}</p>}
              <div style={{ overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '16px' }}>
                {shortlistedDrivesLoading ? (
                  <p style={{ color: '#64748b', textAlign: 'center' }}>Loading drives…</p>
                ) : shortlistedDrivesError ? null : shortlistedDrives.length ? (
                  shortlistedDrives.map((drive) => (
                    <div key={drive.id} style={{ padding: '10px 4px', borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                      <strong>{drive.company}</strong>
                      <div style={{ color: '#64748b', marginTop: '3px' }}>
                        {drive.role} · {drive.package} · {drive.location}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b', textAlign: 'center' }}>No shortlisted drives.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShortlistedDriveStudent(null)}
                style={{ alignSelf: 'flex-end', padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {(showAddModal || showEditModal) && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
            <form
              onSubmit={showEditModal ? handleUpdate : handleAdd}
              style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '520px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>
                {showEditModal ? 'Edit Student' : 'Add New Student'}
              </h2>
              {formError && <p role="alert" style={{ color: '#b91c1c', margin: 0, fontSize: '13px' }}>{formError}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ['name', 'Full Name', true],
                  ['prn', 'PRN Number', true],
                  ['email', 'Email Address', true],
                  ['phone', 'Phone Number', false],
                  ...studentMarkFields
                ].map(([field, label, required]) => (
                  <label key={field} style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>
                    {label}{required ? ' *' : ''}
                    <input
                      type={field === 'email' ? 'email' : studentMarkFields.some(([markField]) => markField === field) ? 'number' : 'text'}
                      min={studentMarkFields.some(([markField]) => markField === field) ? '0' : undefined}
                      max={studentMarkFields.some(([markField]) => markField === field) ? '100' : undefined}
                      step={studentMarkFields.some(([markField]) => markField === field) ? '0.01' : undefined}
                      required={required}
                      value={studentForm[field]}
                      onChange={(e) => setStudentForm({ ...studentForm, [field]: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                    />
                  </label>
                ))}
                {!showEditModal && (
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>
                    Password *
                    <input
                      type="password"
                      required
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                    />
                  </label>
                )}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>
                  Placement Status
                  <select
                    value={studentForm.status}
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', background: '#fff' }}
                  >
                    <option value="Unplaced">Unplaced</option>
                    <option value="Placed">Placed</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); setFormError(''); }} style={{ padding: '9px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '7px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={savingStudent} style={{ padding: '9px 14px', background: savingStudent ? '#64748b' : '#1e3a8a', color: '#fff', border: 'none', borderRadius: '7px', cursor: savingStudent ? 'wait' : 'pointer', fontWeight: 600 }}>
                  {savingStudent ? 'Saving...' : showEditModal ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        )}
        

        {showCsvModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <form onSubmit={handleCsvUpload} style={{ background: '#fff', padding: '24px', borderRadius: '14px', width: '440px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Import Students via CSV</h3>
              
              {/* Show Format / Download Template Button */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>Unsure about the columns? Download the sample template format:</p>
                <button
                  type="button"
                  onClick={handleDownloadFormat}
                  style={{ width: '100%', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  📥 Show Format in CSV (Download Template)
                </button>
              </div>

              <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCsvModal(false)} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Upload & Import</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}