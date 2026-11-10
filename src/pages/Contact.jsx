import React, { useState } from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
import "./Contact.css";

const ADMIN_GMAIL =
  "piyush.kolhe.cmaug26@gmail.com,vivek.tripathi.cmaug26@gmail.com,yash.patel.cmaug26@gmail.com";

function Contact() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    name: storedUser?.name || "",
    prn: storedUser?.prn || "",
    email: storedUser?.email || "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitted(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const mailSubject = encodeURIComponent(
      `[CDAC Placement Query] ${form.subject} (${form.prn || form.name})`
    );
    const mailBody = encodeURIComponent(
      `Student Name: ${form.name}\nPRN No: ${form.prn || "N/A"}\nStudent Email: ${form.email}\n\nQuery / Question:\n${form.message}`
    );

    // Opens Gmail Web Compose directly in a new tab addressed to all 3 Admin Gmails
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      ADMIN_GMAIL
    )}&su=${mailSubject}&body=${mailBody}`;

    window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    setForm({ ...form, subject: "", message: "" });
  }

  return (
    <>
      <StudentNavbar />

      <main className="contact-page">
        <section className="contact-header">
          <span className="contact-eyebrow">CDAC EMAIL SUPPORT</span>
          <h1>Contact CDAC Placement Support</h1>
          <p>
            Have a question regarding placement drives, eligibility, or academic
            verification? Send your query directly to the Admin&apos;s Gmail below.
          </p>
        </section>

        <section className="contact-layout">
          {/* Left Column: CDAC Support Email & Office Details */}
          <div className="contact-info-panel">
            <h2>CDAC Placement Cell</h2>
            <p className="info-subtext">
              All student placement queries are handled via our official
              placement admin Gmail desk.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <strong>Admin Support Gmail</strong>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      marginTop: "5px"
                    }}
                  >
                    {ADMIN_GMAIL.split(",").map((email) => (
                      <a
                        key={email}
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                          email.trim()
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="support-email-link"
                        style={{ wordBreak: "break-all", fontSize: "12.5px" }}
                      >
                        {email.trim()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="info-icon">📞</span>
                <div>
                  <strong>Placement Helpline</strong>
                  <p>+91 20 2550 3100 / +91 98220 11223</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Campus Address</strong>
                  <p>
                    Raintree Marg, Near Bharati Vidyapeeth, Opposite Kharghar
                    Railway Station, Sector 7, CBD Belapur, Navi Mumbai,
                    Maharashtra 400614
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <strong>Support Hours</strong>
                  <p>Monday – Saturday: 9:30 AM to 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Gmail Query Form */}
          <div className="contact-form-panel">
            <h2>Send Query to Admin Gmail</h2>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="prn">PRN No</label>
                  <input
                    id="prn"
                    name="prn"
                    value={form.prn}
                    onChange={handleChange}
                    placeholder="Enter your PRN"
                  />
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="email">Your Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Drive Shortlist / Marks Update"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="message">Your Question / Query</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your query in detail to send to Admin Support Gmail..."
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Send via Gmail to Admin Support →
              </button>

              {submitted && (
                <p className="contact-success-msg">
                  ✓ Gmail compose tab opened for Admin Support. Click{" "}
                  <strong>Send</strong> in Gmail to complete.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;