import React, { useState, useEffect } from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
<<<<<<< Updated upstream
import { API_BASE } from "../services/api";
=======
import { getSession } from "../services/api";
>>>>>>> Stashed changes
import "./Contact.css";

function Contact() {
  const session = getSession();
  const storedUser = session?.user;

  const [studentName, setStudentName] = useState(storedUser?.name || "Aarav Deshmukh");
  const [studentEmail, setStudentEmail] = useState(storedUser?.email || "aarav@cdac.in");
  const [prn, setPrn] = useState(storedUser?.prn || "CDAC2026001");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sending, setSending] = useState(false);

  const fetchMessages = async (emailToFetch) => {
    if (!emailToFetch) return;
    try {
      const res = await fetch(`${API_BASE}/queries?email=${encodeURIComponent(emailToFetch)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.queries)) {
        setChatHistory(data.queries);
      }
    } catch (err) {
      console.error("Error loading chat messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages(studentEmail);
  }, [studentEmail]);

  async function handleSendQuery(e) {
    e.preventDefault();
    if (!messageText.trim() || !studentEmail.trim()) return;

<<<<<<< Updated upstream
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/queries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: storedUser?.id || null,
          student_name: studentName,
          student_email: studentEmail,
          prn,
          subject: subject || "Placement Support Query",
          sender_role: "student",
          message: messageText
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessageText("");
        fetchMessages(studentEmail);
      }
    } catch (err) {
      console.error("Failed to send query:", err);
    } finally {
      setSending(false);
    }
=======
    const mailSubject = encodeURIComponent(
      `[CDAC Placement Query] ${form.subject} (${form.prn || form.name})`
    );
    const mailBody = encodeURIComponent(
      `Student Name: ${form.name}
PRN No: ${form.prn || "N/A"}
Student Email: ${form.email}

Query / Question:
${form.message}`
    );

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
    setSubmitted(true);
    setForm({ ...form, subject: "", message: "" });
>>>>>>> Stashed changes
  }

  return (
    <>
      <StudentNavbar />

      <main className="contact-page">
        <section className="contact-header">
          <span className="contact-eyebrow">STUDENT SUPPORT & ADMIN CHAT</span>
          <h1>Ask a Question to the Placement Admin</h1>
          <p>
            Send your placement queries directly to the Admin. Your messages and
            the Admin&apos;s replies appear in real time in the conversation thread.
          </p>
        </section>

        <section className="contact-layout">
<<<<<<< Updated upstream
          {/* Left Column: Live Chat History with Admin */}
          <div className="chat-thread-panel">
            <div className="chat-thread-header">
              <div>
                <h2>Conversation with Admin</h2>
                <span>Showing messages for {studentEmail}</span>
=======
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
>>>>>>> Stashed changes
              </div>
              <button
                type="button"
                className="refresh-chat-btn"
                onClick={() => fetchMessages(studentEmail)}
              >
                ↻ Refresh Chat
              </button>
            </div>

<<<<<<< Updated upstream
            <div className="chat-messages-box">
              {chatHistory.length === 0 ? (
                <p className="empty-chat-text">
                  No messages yet. Send a question using the form on the right to start chatting with the Placement Admin.
                </p>
              ) : (
                chatHistory.map((msg) => {
                  const isAdmin = msg.sender_role === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${isAdmin ? "from-admin" : "from-student"}`}
                    >
                      <div className="chat-bubble">
                        <div className="chat-bubble-meta">
                          <strong>{isAdmin ? "🛡️ Placement Admin" : `🎓 ${msg.student_name}`}</strong>
                          {msg.subject && <span className="chat-topic-tag">{msg.subject}</span>}
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Send Query / Chat Input Form */}
=======
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
                  <p>CDAC Innovation Park, Panchavati, Pashan, Pune - 411008</p>
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

>>>>>>> Stashed changes
          <div className="contact-form-panel">
            <h2>Send a New Query / Message</h2>

            <form onSubmit={handleSendQuery} className="contact-form">
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="prn">PRN No</label>
                  <input
                    id="prn"
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    placeholder="e.g. CDAC2026001"
                  />
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="email">Your Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    placeholder="aarav@cdac.in"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="subject">Subject / Drive Name</label>
                  <input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. TCS Shortlist / Interview Date"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="message">Your Question or Message</label>
                <textarea
                  id="message"
                  rows="4"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  required
                  placeholder="Type your question for the Placement Admin..."
                />
              </div>

              <button type="submit" className="contact-submit-btn" disabled={sending}>
                {sending ? "Sending..." : "Send Message to Admin →"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;
