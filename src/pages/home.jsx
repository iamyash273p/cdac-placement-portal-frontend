import React, { useState, useEffect } from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
import { API_BASE } from "../services/api";
import "./Home.css";

function Home() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const student = {
    id: storedUser?.id || 1,
    name: storedUser?.name || "Aarav Deshmukh",
    email: storedUser?.email || "aarav@cdac.in",
    course: "PG-DAC",
    prn: storedUser?.prn || "CDAC2026001"
  };

  const [shortlistedDrives, setShortlistedDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParam = storedUser?.id
      ? `studentId=${encodeURIComponent(storedUser.id)}`
      : `email=${encodeURIComponent(student.email)}`;

    fetch(`${API_BASE}/student/shortlisted-drives?${queryParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.drives)) {
          setShortlistedDrives(data.drives);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch shortlisted drives:", err);
      })
      .finally(() => setLoading(false));
  }, [storedUser?.id, student.email]);

  // Calculate total interview rounds completed across shortlisted drives
  const totalRoundsCompleted = shortlistedDrives.reduce(
    (sum, drive) => sum + (Number(drive.rounds_completed ?? drive.roundsCompleted) || 0),
    0
  );

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
              Viewing placement drives where you have been shortlisted by the Admin.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{student.name}</h3>
              <p className="text-xs text-gray-500">
                {student.email} | {student.prn}
              </p>
            </div>
          </div>
        </section>

        {/* Interview Rounds Count on Top */}
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

        {/* Shortlisted Drives Card Grid */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              My Shortlisted Company Drives
            </h2>
            <p className="text-xs text-gray-500">
              Only drives for which the Placement Admin has shortlisted you appear below.
            </p>
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-sm text-gray-500">
              Loading your shortlisted drives...
            </div>
          ) : shortlistedDrives.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <p className="text-base font-bold text-gray-800 mb-1">
                No Shortlisted Drives Yet
              </p>
              <p className="text-xs text-gray-500">
                Once the Admin shortlists you for a company drive in the Admin Portal, that drive card will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shortlistedDrives.map((job) => {
                const roundsDone = Number(job.rounds_completed ?? 2);
                const totalRounds = Number(job.total_rounds ?? 3);
                const driveDate = job.drive_date || job.date || "Upcoming";
                const driveCriteria = job.criteria || "60% throughout";

                return (
                  <article
                    key={job.id}
                    className="custom-card bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                          {job.company.charAt(0)}
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-700 border-green-200">
                          ✓ Shortlisted
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900">{job.company}</h3>
                      <p className="text-xs text-gray-500 mb-4">{job.role}</p>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-gray-600 font-medium">
                            Interview Rounds Completed
                          </span>
                          <strong className="text-blue-700">
                            {roundsDone} / {totalRounds}
                          </strong>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-600"
                            style={{
                              width: `${Math.min(100, (roundsDone / totalRounds) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Drive Date</span>
                          <strong className="text-gray-800">{driveDate}</strong>
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
                          <strong className="text-gray-800">{driveCriteria}</strong>
                        </p>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition">
                      Shortlisted for Drive
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Home;
