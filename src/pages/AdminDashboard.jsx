import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import "./AdminDashboard.css";

export const initialDrives = [
  {
    id: 1,
    company: "TCS",
    role: "Java Developer",
    package: "7.0 LPA",
    location: "Pune",
    date: "15 Nov 2026",
    criteria: "60% throughout",
    status: "Active"
  },
  {
    id: 2,
    company: "Infosys",
    role: "Software Engineer",
    package: "6.5 LPA",
    location: "Bengaluru",
    date: "18 Nov 2026",
    criteria: "No active backlogs",
    status: "Active"
  },
  {
    id: 3,
    company: "Wipro",
    role: "Full Stack Developer",
    package: "5.5 LPA",
    location: "Mumbai",
    date: "22 Nov 2026",
    criteria: "60% in Graduation",
    status: "Pending"
  },
  {
    id: 4,
    company: "Tech Mahindra",
    role: "Graduate Engineer Trainee",
    package: "5.0 LPA",
    location: "Pune",
    date: "25 Nov 2026",
    criteria: "60% throughout",
    status: "Active"
  }
];

export const initialStudents = [
  {
    prn: "CDAC2026001",
    name: "Aarav Deshmukh",
    phone: "9876543210",
    address: "Kothrud, Pune",
    tenthMarks: "84%",
    twelfthMarks: "79%",
    degreeMarks: "74%",
    cmceMarks: "82",
    cceeMarks: "86",
    company: "TCS (7.0 LPA)",
    status: "Placed",
    photo: ""
  },
  {
    prn: "CDAC2026002",
    name: "Sneha Kulkarni",
    phone: "9823012345",
    address: "Wakad, Pune",
    tenthMarks: "88%",
    twelfthMarks: "83%",
    degreeMarks: "81%",
    cmceMarks: "89",
    cceeMarks: "91",
    company: "Infosys (9.5 LPA)",
    status: "Placed",
    photo: ""
  },
  {
    prn: "CDAC2026003",
    name: "Rohan Patil",
    phone: "9765432109",
    address: "Andheri, Mumbai",
    tenthMarks: "72%",
    twelfthMarks: "70%",
    degreeMarks: "68%",
    cmceMarks: "74",
    cceeMarks: "71",
    company: "-",
    status: "Unplaced",
    photo: ""
  },
  {
    prn: "CDAC2026004",
    name: "Priya Nair",
    phone: "9890123456",
    address: "Baner, Pune",
    tenthMarks: "85%",
    twelfthMarks: "80%",
    degreeMarks: "77%",
    cmceMarks: "84",
    cceeMarks: "80",
    company: "Accenture (6.5 LPA)",
    status: "Placed",
    photo: ""
  },
  {
    prn: "CDAC2026005",
    name: "Vikram Joshi",
    phone: "9922334455",
    address: "Cidco, Nashik",
    tenthMarks: "70%",
    twelfthMarks: "68%",
    degreeMarks: "65%",
    cmceMarks: "69",
    cceeMarks: "67",
    company: "-",
    status: "Unplaced",
    photo: ""
  }
];

function AdminDashboard({ defaultTab = "overview" }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // "overview" | "drives" | "students"
  const [batchFilter, setBatchFilter] = useState("all"); // "all" | "Placed" | "Unplaced"
  const [drives, setDrives] = useState(initialDrives);
  const [students, setStudents] = useState(initialStudents);
  const [admins, setAdmins] = useState([{ id: 1, name: "Main Admin" }]);

  // Modals state
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const navigate = useNavigate();

  // 1. Create Drive Form State
  const [driveForm, setDriveForm] = useState({
    company: "",
    role: "",
    package: "",
    location: "",
    date: "",
    criteria: "",
    status: "Active"
  });

  // 2. Create Admin Form State (name, create pass)
  const [adminForm, setAdminForm] = useState({
    name: "",
    password: ""
  });

  // 3. Add Student Form State (photo, name, phone, student address, Prn no, Password, 10th Marks, 12th, degree marks, CMCE marks, CCEE marks)
  const [studentForm, setStudentForm] = useState({
    photo: "",
    name: "",
    phone: "",
    address: "",
    prn: "",
    password: "",
    tenthMarks: "",
    twelfthMarks: "",
    degreeMarks: "",
    cmceMarks: "",
    cceeMarks: "",
    status: "Unplaced"
  });

  const placedStudents = students.filter((s) => s.status === "Placed");
  const unplacedStudents = students.filter((s) => s.status === "Unplaced");

  const filteredBatchStudents = students.filter((s) =>
    batchFilter === "all" ? true : s.status === batchFilter
  );

  const stats = [
    { label: "Current Batch Students", value: students.length, note: "Total registered in batch", icon: "🎓" },
    { label: "Placed Students", value: placedStudents.length, note: "Offers received", icon: "✅" },
    { label: "Unplaced Students", value: unplacedStudents.length, note: "Eligible for upcoming drives", icon: "⏳" },
    { label: "Total Drives", value: drives.length, note: `${admins.length} Admin(s) active`, icon: "💼" }
  ];

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "overview") navigate("/admin");
    if (tab === "drives") navigate("/admin/drives");
    if (tab === "students") navigate("/admin/students");
  };

  // Handlers
  const handleCreateDrive = (e) => {
    e.preventDefault();
    setDrives([{ id: Date.now(), ...driveForm }, ...drives]);
    setDriveForm({
      company: "",
      role: "",
      package: "",
      location: "",
      date: "",
      criteria: "",
      status: "Active"
    });
    setShowDriveModal(false);
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    setAdmins([...admins, { id: Date.now(), name: adminForm.name }]);
    setAdminForm({ name: "", password: "" });
    setShowAdminModal(false);
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

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      ...studentForm,
      company: studentForm.status === "Placed" ? "Placed" : "-"
    };
    setStudents([newStudent, ...students]);
    setStudentForm({
      photo: "",
      name: "",
      phone: "",
      address: "",
      prn: "",
      password: "",
      tenthMarks: "",
      twelfthMarks: "",
      degreeMarks: "",
      cmceMarks: "",
      cceeMarks: "",
      status: "Unplaced"
    });
    setShowStudentModal(false);
  };

  return (
    <AdminLayout>
      {/* Top Heading + Quick Action Buttons (Create New Admin, Add Student, Menu Tabs) */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">ADMIN PORTAL — CURRENT BATCH 2026</p>
          <h1>
            {activeTab === "overview" && "Batch Placement Dashboard"}
            {activeTab === "drives" && "Manage Company Drives"}
            {activeTab === "students" && "All Registered Students"}
          </h1>
          <p className="page-subtitle">
            Track placed & unplaced students, create campus drives, and manage student or admin accounts.
          </p>
        </div>

        <div className="header-actions-wrap">
          <button
            type="button"
            className="action-btn secondary-action"
            onClick={() => setShowAdminModal(true)}
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
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB: Placed and Unplaced Students from Current Batch */}
      {activeTab === "overview" && (
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
                <p>Filter between placed and unplaced students from the current CDAC batch</p>
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
                    <th>PRN No</th>
                    <th>Phone</th>
                    <th>Degree %</th>
                    <th>CMCE / CCEE</th>
                    <th>Placement Status</th>
                    <th>Company / Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatchStudents.map((stu) => (
                    <tr key={stu.prn}>
                      <td>
                        <div className="student-name-cell">
                          {stu.photo ? (
                            <img src={stu.photo} alt={stu.name} className="table-avatar" />
                          ) : (
                            <span className="table-avatar-placeholder">
                              {stu.name.charAt(0)}
                            </span>
                          )}
                          <span className="company-cell">{stu.name}</span>
                        </div>
                      </td>
                      <td>{stu.prn}</td>
                      <td>{stu.phone}</td>
                      <td>{stu.degreeMarks}</td>
                      <td>
                        {stu.cmceMarks} / {stu.cceeMarks}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            stu.status === "Placed" ? "active" : "pending"
                          }`}
                        >
                          {stu.status}
                        </span>
                      </td>
                      <td>{stu.company || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* DRIVES TAB: Create Drive Button + Popup Form + List of All Drives */}
      {activeTab === "drives" && (
        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>All Placement Drives</h2>
              <p>Create new campus drives and view all scheduled company drives</p>
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
                  <th>Eligibility Criteria</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((drive) => (
                  <tr key={drive.id}>
                    <td className="company-cell">{drive.company}</td>
                    <td>{drive.role}</td>
                    <td>{drive.package}</td>
                    <td>{drive.location}</td>
                    <td>{drive.date}</td>
                    <td>{drive.criteria}</td>
                    <td>
                      <span className={`status-pill ${drive.status.toLowerCase()}`}>
                        {drive.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* STUDENTS TAB: Full Students List + Add Student Button */}
      {activeTab === "students" && (
        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>All Registered Students</h2>
              <p>Complete student directory with 10th, 12th, Degree, CMCE & CCEE marks</p>
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
                  <th>PRN No</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>10th / 12th</th>
                  <th>Degree</th>
                  <th>CMCE</th>
                  <th>CCEE</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.prn}>
                    <td>
                      <div className="student-name-cell">
                        {stu.photo ? (
                          <img src={stu.photo} alt={stu.name} className="table-avatar" />
                        ) : (
                          <span className="table-avatar-placeholder">
                            {stu.name.charAt(0)}
                          </span>
                        )}
                        <span className="company-cell">{stu.name}</span>
                      </div>
                    </td>
                    <td>{stu.prn}</td>
                    <td>{stu.phone}</td>
                    <td>{stu.address}</td>
                    <td>
                      {stu.tenthMarks} / {stu.twelfthMarks}
                    </td>
                    <td>{stu.degreeMarks}</td>
                    <td>{stu.cmceMarks}</td>
                    <td>{stu.cceeMarks}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          stu.status === "Placed" ? "active" : "pending"
                        }`}
                      >
                        {stu.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MODAL 1: CREATE NEW ADMIN POPUP (Name, Create Password) */}
      {showAdminModal && (
        <div className="modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Admin</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowAdminModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="drive-form">
              <div className="form-group">
                <label>Admin Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter admin full name"
                  value={adminForm.name}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Create Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create password for admin"
                  value={adminForm.password}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAdminModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-drive-btn">
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW STUDENT POPUP (Photo, Name, Phone, Address, PRN, Password, 10th, 12th, Degree, CMCE, CCEE) */}
      {showStudentModal && (
        <div className="modal-backdrop" onClick={() => setShowStudentModal(false)}>
          <div
            className="modal-box student-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Add New Student</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowStudentModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="drive-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Student Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStudentPhotoUpload}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter student name"
                    value={studentForm.name}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>PRN No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CDAC2026006"
                    value={studentForm.prn}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, prn: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Create student password"
                    value={studentForm.password}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={studentForm.phone}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, phone: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Placement Status</label>
                  <select
                    value={studentForm.status}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, status: e.target.value })
                    }
                  >
                    <option value="Unplaced">Unplaced</option>
                    <option value="Placed">Placed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Student Address</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full residential address"
                  value={studentForm.address}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, address: e.target.value })
                  }
                />
              </div>

              <div className="form-row three-col">
                <div className="form-group">
                  <label>10th Marks (%)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 82%"
                    value={studentForm.tenthMarks}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, tenthMarks: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>12th Marks (%)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 78%"
                    value={studentForm.twelfthMarks}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        twelfthMarks: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Degree Marks (%)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 75%"
                    value={studentForm.degreeMarks}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        degreeMarks: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CMCE Marks</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 80"
                    value={studentForm.cmceMarks}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, cmceMarks: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>CCEE Marks</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 85"
                    value={studentForm.cceeMarks}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, cceeMarks: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowStudentModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-drive-btn">
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE DRIVE POPUP */}
      {showDriveModal && (
        <div className="modal-backdrop" onClick={() => setShowDriveModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Placement Drive</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowDriveModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="drive-form">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS, Infosys"
                  value={driveForm.company}
                  onChange={(e) =>
                    setDriveForm({ ...driveForm, company: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Job Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java Developer"
                  value={driveForm.role}
                  onChange={(e) =>
                    setDriveForm({ ...driveForm, role: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Package (CTC)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7.0 LPA"
                    value={driveForm.package}
                    onChange={(e) =>
                      setDriveForm({ ...driveForm, package: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={driveForm.location}
                    onChange={(e) =>
                      setDriveForm({ ...driveForm, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Drive Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 28 Nov 2026"
                    value={driveForm.date}
                    onChange={(e) =>
                      setDriveForm({ ...driveForm, date: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={driveForm.status}
                    onChange={(e) =>
                      setDriveForm({ ...driveForm, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Eligibility Criteria</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 60% throughout academics, No backlogs"
                  value={driveForm.criteria}
                  onChange={(e) =>
                    setDriveForm({ ...driveForm, criteria: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowDriveModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-drive-btn">
                  Save Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
