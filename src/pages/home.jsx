import React from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
import "./Home.css";

function Home() {
  const student = {
    name: "Student",
    course: "PG-DAC",
    prn: "CDAC2026001"
  };

  // Single On-Campus Company Drives list with corner status, interview rounds completed, date & details
  const campusDrives = [
    {
      company: "TCS",
      role: "Java Full Stack Developer",
      package: "7.0 LPA",
      location: "Pune",
      date: "15 Nov 2026",
      eligibility: "60% throughout academics",
      status: "Shortlisted",
      roundsCompleted: 3,
      totalRounds: 3
    },
    {
      company: "Infosys",
      role: "Specialist Programmer",
      package: "9.5 LPA",
      location: "Pune / Hyderabad",
      date: "18 Nov 2026",
      eligibility: "No active backlogs",
      status: "Ongoing",
      roundsCompleted: 2,
      totalRounds: 4
    },
    {
      company: "Accenture",
      role: "Advanced App Engineering Analyst",
      package: "6.5 LPA",
      location: "Mumbai",
      date: "20 Nov 2026",
      eligibility: "60% in Graduation",
      status: "Shortlisted",
      roundsCompleted: 2,
      totalRounds: 3
    },
    {
      company: "Wipro",
      role: "Project Engineer",
      package: "5.5 LPA",
      location: "Pune",
      date: "22 Nov 2026",
      eligibility: "60% throughout academics",
      status: "Ongoing",
      roundsCompleted: 1,
      totalRounds: 3
    },
    {
      company: "Capgemini",
      role: "Senior Analyst",
      package: "7.5 LPA",
      location: "Mumbai / Pune",
      date: "25 Nov 2026",
      eligibility: "65% throughout academics",
      status: "Ongoing",
      roundsCompleted: 1,
      totalRounds: 4
    },
    {
      company: "Siemens",
      role: "R&D Software Engineer",
      package: "11.0 LPA",
      location: "Bengaluru / Pune",
      date: "28 Nov 2026",
      eligibility: "70% in Graduation",
      status: "Shortlisted",
      roundsCompleted: 3,
      totalRounds: 4
    }
  ];

  // Calculate total interview rounds completed for the top card
  const totalRoundsCompleted = campusDrives.reduce(
    (sum, drive) => sum + drive.roundsCompleted,
    0
  );

  const getStatusBadgeStyle = (status) => {
    if (status === "Shortlisted") return "bg-green-100 text-green-700 border-green-200";
    if (status === "Ongoing") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />

      <StudentNavbar />

      <main className="dashboard min-h-screen bg-gray-50 px-6 py-8 md:px-12 text-gray-800">
        {/* Welcome Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-blue-700">
              STUDENT DASHBOARD
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              Welcome back, {student.name}!
            </h1>
            <p className="text-sm text-gray-500">
              Track your on-campus company drives and completed interview rounds.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{student.name}</h3>
              <p className="text-xs text-gray-500">
                {student.course} | {student.prn}
              </p>
            </div>
          </div>
        </section>

        {/* Only Interview Rounds Count on Top */}
        <section className="mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm inline-flex items-center gap-4 min-w-full sm:min-w-0 sm:w-80">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-2xl">
              🎙️
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Interview Rounds Completed
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {String(totalRoundsCompleted).padStart(2, "0")} Rounds
              </h2>
            </div>
          </div>
        </section>

        {/* Single Card Grid: On-Campus Company Drives */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              On-Campus Company Drives
            </h2>
            <p className="text-xs text-gray-500">
              Company drive status, completed interview rounds, drive dates, and package details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campusDrives.map((job) => (
              <article
                key={job.company}
                className="custom-card bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Corner: Logo + Status Badge (Shortlisted / Ongoing) */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                      {job.company.charAt(0)}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  {/* Company & Role */}
                  <h3 className="text-lg font-bold text-gray-900">{job.company}</h3>
                  <p className="text-xs text-gray-500 mb-4">{job.role}</p>

                  {/* Interview Rounds Completed Box */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-gray-600 font-medium">
                        Interview Rounds Completed
                      </span>
                      <strong className="text-blue-700">
                        {job.roundsCompleted} / {job.totalRounds}
                      </strong>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          job.status === "Shortlisted" ? "bg-green-600" : "bg-blue-600"
                        }`}
                        style={{
                          width: `${(job.roundsCompleted / job.totalRounds) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Drive Date & Other Details */}
                  <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Drive Date</span>
                      <strong className="text-gray-800">{job.date}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Package</span>
                      <strong className="text-gray-800">{job.package}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <strong className="text-gray-800">{job.location}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-500">Criteria</span>
                      <strong className="text-gray-800">{job.eligibility}</strong>
                    </p>
                  </div>
                </div>

                <button className="w-full mt-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition">
                  View Drive Details
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
