import React, { useState } from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    prn: "",
    email: "",
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
    setSubmitted(true);
    setForm({ name: "", prn: "", email: "", subject: "", message: "" });
  }

  return (
    <>
      <StudentNavbar />

      <main className="contact-page">
        <section className="contact-header">
          <span className="contact-eyebrow">PLACEMENT CELL SUPPORT</span>
          <h1>Contact the CDAC Placement Team</h1>
          <p>
            Need assistance with company drive eligibility, PRN verification, or
            interview schedules? Reach out to the placement cell below.
          </p>
        </section>

        <section className="contact-layout">
          {/* Left Column: Placement Office Details */}
          <div className="contact-info-panel">
            <h2>Placement Office Details</h2>
            <p className="info-subtext">
              Students and recruiting partners can contact our placement
              coordinators during working hours.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Campus Address</strong>
                  <p>CDAC Innovation Park, Panchavati, Pashan, Pune - 411008</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <strong>Placement Cell Email</strong>
                  <p>placements@cdac.in</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="info-icon">📞</span>
                <div>
                  <strong>Helpline Numbers</strong>
                  <p>+91 20 2550 3100 / +91 98220 11223</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <strong>Office Hours</strong>
                  <p>Monday – Saturday: 9:30 AM to 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Student / Recruiter Inquiry Form */}
          <div className="contact-form-panel">
            <h2>Send a Query</h2>

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
                    placeholder="Enter your name"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="prn">PRN No (Optional)</label>
                  <input
                    id="prn"
                    name="prn"
                    value={form.prn}
                    onChange={handleChange}
                    placeholder="e.g. CDAC2026001"
                  />
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="subject">Query Topic</label>
                  <input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Drive Eligibility / Marks Update"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Describe your question or issue clearly..."
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Submit Query
              </button>

              {submitted && (
                <p className="contact-success-msg">
                  ✓ Your message has been sent to the CDAC Placement Cell.
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