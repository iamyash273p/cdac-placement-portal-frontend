import React, { useState } from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
import "./Contact.css";

const SUPPORT_EMAIL = "placements@cdac.in";

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

    // Compose email to CDAC Placement Support
    const mailSubject = encodeURIComponent(
      `[CDAC Placement Query] ${form.subject} (${form.prn || form.name})`
    );
    const mailBody = encodeURIComponent(
      `Student Name: ${form.name}\nPRN No: ${form.prn || "N/A"}\nStudent Email: ${form.email}\n\nQuery / Question:\n${form.message}`
    );

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
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
            verification? Send your query directly to our support email below.
          </p>
        </section>

        <section className="contact-layout">
          {/* Left Column: CDAC Support Email & Office Details */}
          <div className="contact-info-panel">
            <h2>CDAC Placement Cell</h2>
            <p className="info-subtext">
              All student placement queries are handled via our official
              placement support email desk.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <strong>Official Support Email</strong>
                  <p>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="support-email-link">
                      {SUPPORT_EMAIL}
                    </a>
                  </p>
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
                  <p>Raintree Marg, Near Bharati Vidyapeeth, Opposite Kharghar Railway Station, Sector 7, CBD Belapur, Navi Mumbai, Maharashtra 400614</p>
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

          {/* Right Column: Email Query Form */}
          <div className="contact-form-panel">
            <h2>Send Query to Support Email</h2>

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
                  placeholder="Write your query in detail to send to placements@cdac.in..."
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Email to {SUPPORT_EMAIL} →
              </button>

              {submitted && (
                <p className="contact-success-msg">
                  ✓ Your email query has been prepared for{" "}
                  <strong>{SUPPORT_EMAIL}</strong>.
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