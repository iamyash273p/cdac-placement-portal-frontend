import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { API_BASE } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard({ defaultTab = "overview" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [batchFilter, setBatchFilter] = useState("all");
  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [queries, setQueries] = useState([]);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState("");
  const [adminReplyText, setAdminReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);

  // Shortlist Students Modal State
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [activeDriveForShortlist, setActiveDriveForShortlist] = useState(null);
  const [checkedStudentIds, setCheckedStudentIds] = useState([]);
  const [savingShortlist, setSavingShortlist] = useState(false);

  // Form states
  const [adminError, setAdminError] = useState("");
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [studentForm, setStudentForm] = useState({
    photo: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    prn: "",
    password: "",
    tenthMarks: "",
    twelfthMarks: "",
    degreeMarks: "",
    cmceMarks: "",
    cceeMarks: "",
    status: "Unplaced",
    passout_year: "2026"
  });

  const [editStudentData, setEditStudentData] = useState(null);

  const [driveForm, setDriveForm] = useState({
    company: "",
    role: "",
    package: "",
    location: "",
    drive_date: "",
    passout_year: "2026",
    criteria: "",
    status: "Active"
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [studentsRes, drivesRes, queriesRes] = await Promise.all([
        fetch(`${API_BASE}/students`),
        fetch(`${API_BASE}/drives`),
        fetch(`${API_BASE}/queries`)
      ]);
      const studentsData = await studentsRes.json();
      const drivesData = await drivesRes.json();
      const queriesData = await queriesRes.json();

      if (studentsData.success) setStudents(studentsData.students);
      if (drivesData.success) setDrives(drivesData.drives);
      if (queriesData.success) {
        setQueries(queriesData.queries);
        if (!selectedStudentEmail && queriesData.queries.length > 0) {
          setSelectedStudentEmail(queriesData.queries[0].student_email);
        }
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    fetchData();
  }, []);

  const placedStudents = students.filter((s) => s.status === "Placed");
  const unplacedStudents = students.filter((s) => s.status === "Unplaced");

  const filteredBatchStudents = students.filter((s) =>
    batchFilter === "all" ? true : s.status === batchFilter
  );

  // Group queries by student_email for the Admin Chat / Queries view
  const studentThreads = React.useMemo(() => {
    const map = new Map();
    queries.forEach((q) => {
      if (!map.has(q.student_email)) {
        map.set(q.student_email, {
          student_email: q.student_email,
          student_name: q.student_name,
          prn: q.prn,
          lastMessage: q.message,
          messages: []
        });
      }
      const thread = map.get(q.student_email);
      thread.lastMessage = q.message;
      thread.messages.push(q);
    });
    return Array.from(map.values());
  }, [queries]);

  const activeThread = studentThreads.find(
    (t) => t.student_email === selectedStudentEmail
  ) || studentThreads[0];

  const stats = [
    { label: "Current Batch Students", value: students.length, note: "Total registered in batch", icon: "🎓" },
    { label: "Placed Students", value: placedStudents.length, note: "Offers received", icon: "✅" },
    { label: "Unplaced Students", value: unplacedStudents.length, note: "Eligible for upcoming drives", icon: "⏳" },
    { label: "Student Queries", value: studentThreads.length, note: "Active chat threads", icon: "💬" }
  ];

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "overview") navigate("/admin");
    if (tab === "drives") navigate("/admin/drives");
    if (tab === "students") navigate("/admin/students");
    if (tab === "queries") navigate("/admin/queries");
  };

  // Open Shortlist Modal for a specific drive and load currently checked students
  const openShortlistModal = async (drive) => {
    setActiveDriveForShortlist(drive);
    setShowShortlistModal(true);
    try {
      const res = await fetch(`${API_BASE}/drives/${drive.id}/shortlist`);
      const data = await res.json();
      if (data.success && Array.isArray(data.shortlistedStudentIds)) {
        setCheckedStudentIds(data.shortlistedStudentIds);
      } else {
        setCheckedStudentIds([]);
      }
    } catch (err) {
      setCheckedStudentIds([]);
    }
  };

  const toggleStudentCheckbox = (studentId) => {
    setCheckedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    if (checkedStudentIds.length === students.length) {
      setCheckedStudentIds([]);
    } else {
      setCheckedStudentIds(students.map((s) => s.id));
    }
  };

  const handleSaveShortlist = async (e) => {
    e.preventDefault();
    if (!activeDriveForShortlist) return;
    setSavingShortlist(true);
    try {
      const res = await fetch(
        `${API_BASE}/admin/drives/${activeDriveForShortlist.id}/shortlist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentIds: checkedStudentIds })
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setShowShortlistModal(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed saving shortlist:", err);
    } finally {
      setSavingShortlist(false);
    }
  };

  const handleSendAdminReply = async (e) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeThread) return;

    try {
      const res = await fetch(`${API_BASE}/queries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: activeThread.student_name,
          student_email: activeThread.student_email,
          prn: activeThread.prn || "",
          subject: "Admin Reply",
          sender_role: "admin",
          message: adminReplyText
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminReplyText("");
        fetchData();
      }
    } catch (err) {
      console.error("Failed sending reply:", err);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (adminForm.password !== adminForm.confirmPassword) {
      setAdminError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/admin/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setShowAdminModal(false);
        setAdminForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
        setAdminError("");
      } else {
        setAdminError(data.message || "Failed to create admin.");
      }
    } catch (err) {
      setAdminError("Network error connecting to backend server.");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setShowStudentModal(false);
        fetchData();
      }
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/students/${editStudentData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editStudentData.name,
          prn: editStudentData.prn,
          email: editStudentData.email,
          phone: editStudentData.phone,
          address: editStudentData.address || "",
          status: editStudentData.status,
          company: editStudentData.company || "-",
          tenth_marks: editStudentData.tenth_marks || "",
          twelfth_marks: editStudentData.twelfth_marks || "",
          degree_marks: editStudentData.degree_marks || "",
          cmce_marks: editStudentData.cmce_marks || "",
          ccee_marks: editStudentData.ccee_marks || ""
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setShowEditStudentModal(false);
        fetchData();
      }
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/admin/students/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleDeleteDrive = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/admin/drives/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting drive:", err);
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/drives`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driveForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setShowDriveModal(false);
        setDriveForm({
          company: "",
          role: "",
          package: "",
          location: "",
          drive_date: "",
          passout_year: "2026",
          criteria: "",
          status: "Active"
        });
        fetchData();
      }
    } catch (err) {
      console.error("Error creating drive:", err);
    }
  };

  const handleStudentPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentForm((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ADMIN PORTAL — CURRENT BATCH 2026</p>
          <h1>
            {activeTab === "overview" && "Batch Placement Dashboard"}
            {activeTab === "drives" && "Manage Company Drives & Shortlisting"}
            {activeTab === "students" && "All Registered Students"}
            {activeTab === "queries" && "Student Queries & Support Chat"}
          </h1>
          <p className="page-subtitle">
            Shortlist students for drives, answer student chat queries, and manage batch placement records.
          </p>
        </div>

        <div className="header-actions-wrap">
          <button
            type="button"
            className="action-btn secondary-action"
            onClick={() => {
              setAdminError("");
              setShowAdminModal(true);
            }}
          >
            + Create New Admin
          </button>
          <button
            type="button"
            className="action-btn primary-action"
            onClick={() => setShowStudentModal(true)}
          >
            + Add New Student
          </button>

          <div className="admin-menu-tabs">
            <button
              type="button"
              className={`menu-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => handleTabSwitch("overview")}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`menu-tab-btn ${activeTab === "drives" ? "active" : ""}`}
              onClick={() => handleTabSwitch("drives")}
            >
              Drives
            </button>
            <button
              type="button"
              className={`menu-tab-btn ${activeTab === "students" ? "active" : ""}`}
              onClick={() => handleTabSwitch("students")}
            >
              Students
            </button>
            <button
              type="button"
              className={`menu-tab-btn ${activeTab === "queries" ? "active" : ""}`}
              onClick={() => handleTabSwitch("queries")}
            >
              Student Queries ({studentThreads.length})
            </button>
          </div>
        </div>
      </div>

      {loading && <p>Loading portal data from database...</p>}

      {/* 1. OVERVIEW TAB */}
      {!loading && activeTab === "overview" && (
        <>
          <section className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <span>{stat.label}</span>
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <strong className="stat-value">{stat.value}</strong>
                <span className="stat-note">{stat.note}</span>
              </article>
            ))}
          </section>

          <section className="content-panel">
            <div className="panel-heading">
              <div>
                <h2>Current Batch — Placed & Unplaced Students</h2>
                <p>Filter between placed and unplaced students from the current batch</p>
              </div>

              <div className="batch-filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${batchFilter === "all" ? "active" : ""}`}
                  onClick={() => setBatchFilter("all")}
                >
                  All Batch ({students.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill placed ${batchFilter === "Placed" ? "active" : ""}`}
                  onClick={() => setBatchFilter("Placed")}
                >
                  Placed ({placedStudents.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill unplaced ${batchFilter === "Unplaced" ? "active" : ""}`}
                  onClick={() => setBatchFilter("Unplaced")}
                >
                  Unplaced ({unplacedStudents.length})
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>PRN No</th>
                    <th>Phone</th>
                    <th>Degree</th>
                    <th>CMCE / CCEE</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatchStudents.map((stu) => (
                    <tr key={stu.id}>
                      <td>
                        <div className="student-name-cell">
                          {stu.photo ? (
                            <img src={stu.photo} alt={stu.name} className="table-avatar" />
                          ) : (
                            <span className="table-avatar-placeholder">{stu.name.charAt(0)}</span>
                          )}
                          <span className="company-cell">{stu.name}</span>
                        </div>
                      </td>
                      <td>{stu.email}</td>
                      <td>{stu.prn}</td>
                      <td>{stu.phone || "-"}</td>
                      <td>{stu.degree_marks || "-"}</td>
                      <td>
                        {stu.cmce_marks || "-"} / {stu.ccee_marks || "-"}
                      </td>
                      <td>
                        <span className={`status-pill ${stu.status === "Placed" ? "active" : "pending"}`}>
                          {stu.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setEditStudentData(stu);
                            setShowEditStudentModal(true);
                          }}
                          className="table-action-btn edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(stu.id)}
                          className="table-action-btn delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* 2. DRIVES TAB (With "Shortlist Students" Button & Checkbox Popup) */}
      {!loading && activeTab === "drives" && (
        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>All Placement Drives & Student Shortlisting</h2>
              <p>
                Click <strong>Shortlist Students</strong> on any drive and check the students to make that drive visible on their Student Dashboard.
              </p>
            </div>
            <button
              type="button"
              className="create-drive-btn"
              onClick={() => setShowDriveModal(true)}
            >
              + Create Drive
            </button>
          </div>

          <div className="table-wrap">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Location</th>
                  <th>Drive Date</th>
                  <th>Criteria</th>
                  <th>Shortlisted Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((drive) => (
                  <tr key={drive.id}>
                    <td className="company-cell">{drive.company}</td>
                    <td>{drive.role}</td>
                    <td>{drive.package}</td>
                    <td>{drive.location}</td>
                    <td>{drive.drive_date || "-"}</td>
                    <td>{drive.criteria || "-"}</td>
                    <td>
                      <span className="status-pill active">
                        {drive.shortlisted_count || 0} Student(s) Shortlisted
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() => openShortlistModal(drive)}
                          className="shortlist-drive-btn"
                        >
                          ☑️ Shortlist Students
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDrive(drive.id)}
                          className="table-action-btn delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. STUDENTS TAB */}
      {!loading && activeTab === "students" && (
        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>All Registered Students</h2>
              <p>Complete student directory from the MySQL database</p>
            </div>
            <button
              type="button"
              className="create-drive-btn"
              onClick={() => setShowStudentModal(true)}
            >
              + Add New Student
            </button>
          </div>

          <div className="table-wrap">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>PRN No</th>
                  <th>Phone</th>
                  <th>10th / 12th</th>
                  <th>Degree</th>
                  <th>CMCE / CCEE</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.id}>
                    <td>
                      <div className="student-name-cell">
                        {stu.photo ? (
                          <img src={stu.photo} alt={stu.name} className="table-avatar" />
                        ) : (
                          <span className="table-avatar-placeholder">{stu.name.charAt(0)}</span>
                        )}
                        <span className="company-cell">{stu.name}</span>
                      </div>
                    </td>
                    <td>{stu.email}</td>
                    <td>{stu.prn}</td>
                    <td>{stu.phone || "-"}</td>
                    <td>
                      {stu.tenth_marks || "-"} / {stu.twelfth_marks || "-"}
                    </td>
                    <td>{stu.degree_marks || "-"}</td>
                    <td>
                      {stu.cmce_marks || "-"} / {stu.ccee_marks || "-"}
                    </td>
                    <td>
                      <span className={`status-pill ${stu.status === "Placed" ? "active" : "pending"}`}>
                        {stu.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setEditStudentData(stu);
                          setShowEditStudentModal(true);
                        }}
                        className="table-action-btn edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(stu.id)}
                        className="table-action-btn delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. STUDENT QUERIES / CHAT SYSTEM TAB */}
      {!loading && activeTab === "queries" && (
        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>Student Queries & Support Chat</h2>
              <p>View questions submitted from the Student Contact page and reply directly</p>
            </div>
            <button type="button" className="action-btn secondary-action" onClick={fetchData}>
              ↻ Refresh Queries
            </button>
          </div>

          {studentThreads.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "13px" }}>
              No student queries have been submitted yet.
            </p>
          ) : (
            <div className="admin-chat-container">
              {/* Left Sidebar: Student Thread List */}
              <div className="admin-chat-sidebar">
                {studentThreads.map((thread) => (
                  <button
                    key={thread.student_email}
                    type="button"
                    className={`admin-thread-item ${
                      activeThread?.student_email === thread.student_email ? "active" : ""
                    }`}
                    onClick={() => setSelectedStudentEmail(thread.student_email)}
                  >
                    <div className="thread-avatar">
                      {thread.student_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="thread-meta">
                      <strong>{thread.student_name}</strong>
                      <span>{thread.student_email}</span>
                      <p>{thread.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Chat Window */}
              {activeThread && (
                <div className="admin-chat-window">
                  <div className="admin-chat-header">
                    <div>
                      <h3>{activeThread.student_name}</h3>
                      <span>
                        {activeThread.student_email} {activeThread.prn ? `• PRN: ${activeThread.prn}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="admin-chat-messages">
                    {activeThread.messages.map((msg) => {
                      const isAdmin = msg.sender_role === "admin";
                      return (
                        <div
                          key={msg.id}
                          className={`admin-msg-row ${isAdmin ? "sent" : "received"}`}
                        >
                          <div className="admin-msg-bubble">
                            <div className="admin-msg-top">
                              <strong>{isAdmin ? "You (Admin)" : msg.student_name}</strong>
                              {msg.subject && <span>{msg.subject}</span>}
                            </div>
                            <p>{msg.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendAdminReply} className="admin-chat-input-bar">
                    <input
                      type="text"
                      placeholder={`Reply to ${activeThread.student_name}...`}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      required
                    />
                    <button type="submit" className="create-drive-btn">
                      Send Reply →
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* SHORTLIST STUDENTS CHECKBOX MODAL */}
      {showShortlistModal && activeDriveForShortlist && (
        <div className="modal-backdrop" onClick={() => setShowShortlistModal(false)}>
          <div className="modal-box student-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Shortlist Students — {activeDriveForShortlist.company}</h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>
                  Check the students below. Checked students will see the{" "}
                  <strong>{activeDriveForShortlist.company} ({activeDriveForShortlist.role})</strong>{" "}
                  drive card on their Student Dashboard.
                </p>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowShortlistModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShortlist}>
              <div className="shortlist-toolbar">
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={
                      students.length > 0 && checkedStudentIds.length === students.length
                    }
                    onChange={handleSelectAllStudents}
                  />
                  <span>Select All Students ({students.length})</span>
                </label>
                <span className="selected-count-badge">
                  {checkedStudentIds.length} Selected
                </span>
              </div>

              <div className="shortlist-student-list">
                {students.map((stu) => {
                  const isChecked = checkedStudentIds.includes(stu.id);
                  return (
                    <label
                      key={stu.id}
                      className={`shortlist-student-row ${isChecked ? "checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleStudentCheckbox(stu.id)}
                      />
                      <div className="shortlist-stu-info">
                        <strong>
                          {stu.name} <span className="prn-tag">({stu.prn})</span>
                        </strong>
                        <span>
                          {stu.email} • Degree: {stu.degree_marks || "-"} • CCEE: {stu.ccee_marks || "-"}
                        </span>
                      </div>
                      <span className={`status-pill ${isChecked ? "active" : "pending"}`}>
                        {isChecked ? "Shortlisted" : "Not Selected"}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="modal-actions" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowShortlistModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-drive-btn" disabled={savingShortlist}>
                  {savingShortlist ? "Saving..." : "Save Shortlisted Students"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {showEditStudentModal && editStudentData && (
        <div className="modal-backdrop" onClick={() => setShowEditStudentModal(false)}>
          <div className="modal-box student-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Student Record</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowEditStudentModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUpdateStudent} className="drive-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required value={editStudentData.name} onChange={(e) => setEditStudentData({ ...editStudentData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>PRN No</label>
                  <input type="text" required value={editStudentData.prn} onChange={(e) => setEditStudentData({ ...editStudentData, prn: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required value={editStudentData.email} onChange={(e) => setEditStudentData({ ...editStudentData, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" required value={editStudentData.phone} onChange={(e) => setEditStudentData({ ...editStudentData, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={editStudentData.address || ""} onChange={(e) => setEditStudentData({ ...editStudentData, address: e.target.value })} />
              </div>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>10th Marks (%)</label>
                  <input type="text" value={editStudentData.tenth_marks || ""} onChange={(e) => setEditStudentData({ ...editStudentData, tenth_marks: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>12th Marks (%)</label>
                  <input type="text" value={editStudentData.twelfth_marks || ""} onChange={(e) => setEditStudentData({ ...editStudentData, twelfth_marks: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Degree Marks (%)</label>
                  <input type="text" value={editStudentData.degree_marks || ""} onChange={(e) => setEditStudentData({ ...editStudentData, degree_marks: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CMCE Marks</label>
                  <input type="text" value={editStudentData.cmce_marks || ""} onChange={(e) => setEditStudentData({ ...editStudentData, cmce_marks: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>CCEE Marks</label>
                  <input type="text" value={editStudentData.ccee_marks || ""} onChange={(e) => setEditStudentData({ ...editStudentData, ccee_marks: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={editStudentData.status} onChange={(e) => setEditStudentData({ ...editStudentData, status: e.target.value })}>
                    <option value="Unplaced">Unplaced</option>
                    <option value="Placed">Placed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Placed Company</label>
                  <input type="text" value={editStudentData.company || ""} onChange={(e) => setEditStudentData({ ...editStudentData, company: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: "1rem" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowEditStudentModal(false)}>Cancel</button>
                <button type="submit" className="submit-drive-btn">Update Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {showAdminModal && (
        <div className="modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Admin</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowAdminModal(false)}>✕</button>
            </div>
            {adminError && <div style={{ marginBottom: "12px", padding: "10px", background: "#fff0f0", color: "#a32626", borderRadius: "7px", fontSize: "12px", fontWeight: 600 }}>{adminError}</div>}
            <form onSubmit={handleCreateAdmin} className="drive-form">
              <div className="form-group">
                <label>Admin Name</label>
                <input type="text" required placeholder="Enter admin full name" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required placeholder="admin@cdac.in" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" required placeholder="9890123456" value={adminForm.phone} onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" required placeholder="Password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" required placeholder="Confirm Password" value={adminForm.confirmPassword} onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAdminModal(false)}>Cancel</button>
                <button type="submit" className="submit-drive-btn">Create Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showStudentModal && (
        <div className="modal-backdrop" onClick={() => setShowStudentModal(false)}>
          <div className="modal-box student-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowStudentModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddStudent} className="drive-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Student Photo</label>
                  <input type="file" accept="image/*" onChange={handleStudentPhotoUpload} style={{ padding: "6px" }} />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required placeholder="Enter student name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>PRN No</label>
                  <input type="text" required placeholder="e.g. CDAC2026005" value={studentForm.prn} onChange={(e) => setStudentForm({ ...studentForm, prn: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required placeholder="student@cdac.in" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" required placeholder="Student password" value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" required placeholder="9876543210" value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Student Address</label>
                <input type="text" required placeholder="Enter residential address" value={studentForm.address} onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })} />
              </div>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>10th Marks (%)</label>
                  <input type="text" placeholder="82%" value={studentForm.tenthMarks} onChange={(e) => setStudentForm({ ...studentForm, tenthMarks: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>12th Marks (%)</label>
                  <input type="text" placeholder="78%" value={studentForm.twelfthMarks} onChange={(e) => setStudentForm({ ...studentForm, twelfthMarks: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Degree Marks (%)</label>
                  <input type="text" placeholder="75%" value={studentForm.degreeMarks} onChange={(e) => setStudentForm({ ...studentForm, degreeMarks: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CMCE Marks</label>
                  <input type="text" placeholder="80" value={studentForm.cmceMarks} onChange={(e) => setStudentForm({ ...studentForm, cmceMarks: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>CCEE Marks</label>
                  <input type="text" placeholder="85" value={studentForm.cceeMarks} onChange={(e) => setStudentForm({ ...studentForm, cceeMarks: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: "8px" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowStudentModal(false)}>Cancel</button>
                <button type="submit" className="submit-drive-btn">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DRIVE MODAL */}
      {showDriveModal && (
        <div className="modal-backdrop" onClick={() => setShowDriveModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Placement Drive</h3>
              <button type="button" className="close-modal-btn" onClick={() => setShowDriveModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateDrive} className="drive-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" required placeholder="e.g. TCS" value={driveForm.company} onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Job Role</label>
                  <input type="text" required placeholder="e.g. Software Engineer" value={driveForm.role} onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Package (CTC)</label>
                  <input type="text" required placeholder="e.g. 7.0 LPA" value={driveForm.package} onChange={(e) => setDriveForm({ ...driveForm, package: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" required placeholder="e.g. Pune" value={driveForm.location} onChange={(e) => setDriveForm({ ...driveForm, location: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Drive Date</label>
                  <input type="text" required placeholder="e.g. 20 Nov 2026" value={driveForm.drive_date} onChange={(e) => setDriveForm({ ...driveForm, drive_date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Passout Year</label>
                  <input type="text" required placeholder="2026" value={driveForm.passout_year} onChange={(e) => setDriveForm({ ...driveForm, passout_year: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Eligibility Criteria</label>
                  <input type="text" required placeholder="e.g. 60% throughout" value={driveForm.criteria} onChange={(e) => setDriveForm({ ...driveForm, criteria: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={driveForm.status} onChange={(e) => setDriveForm({ ...driveForm, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "1rem" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowDriveModal(false)}>Cancel</button>
                <button type="submit" className="submit-drive-btn">Save Drive</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
