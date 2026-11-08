import React from "react";
import { StudentNavbar } from "../components/Navbar/Navbar";
import "./About.css";

function About() {
  const highlights = [
    { number: "92%", label: "Placement Track Record" },
    { number: "150+", label: "Hiring Partners" },
    { number: "12 LPA", label: "Highest Campus Package" },
    { number: "6.5 LPA", label: "Average Package" }
  ];

  const courses = [
    {
      code: "PG-DAC",
      name: "Post Graduate Diploma in Advanced Computing",
      focus: "Full-Stack Java, .NET, React, Spring Boot, Microservices & Cloud"
    },
    {
      code: "PG-DBDA",
      name: "Post Graduate Diploma in Big Data Analytics",
      focus: "Python, Machine Learning, Spark, Hadoop, SQL & Data Engineering"
    },
    {
      code: "PG-DESD",
      name: "Post Graduate Diploma in Embedded Systems Design",
      focus: "Embedded C, RTOS, IoT, ARM Architecture & Linux Device Drivers"
    }
  ];

  const features = [
    {
      icon: "🎯",
      title: "Centralized Campus Drives",
      text: "Track upcoming company placement drives, eligibility criteria,CTC packages, and drive dates in one unified dashboard."
    },
    {
      icon: "🎙️",
      title: "Real-Time Interview Tracking",
      text: "Monitor completed interview rounds, technical assessments, and shortlisting status transparently at every stage."
    },
    {
      icon: "🎓",
      title: "Verified Academic Profiles",
      text: "Maintain verified 10th, 12th, graduation, CMCE, and CCEE scores for instant shortlisting by placement officers."
    }
  ];

  return (
    <>
      <StudentNavbar />

      <main className="about-page">
        {/* Hero Banner */}
        <section className="about-hero">
          <span className="about-eyebrow">ABOUT CDAC PLACEMENT PORTAL</span>
          <h1>Bridging CDAC Talent with Leading Technology Companies</h1>
          <p>
            Our placement portal streamlines campus recruitment by connecting
            trained post-graduate diploma students with top IT and R&D
            recruiters across India.
          </p>
        </section>

        {/* Placement Highlights Bar */}
        <section className="about-stats-grid">
          {highlights.map((item) => (
            <div className="about-stat-card" key={item.label}>
              <strong>{item.number}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        {/* Core Portal Features */}
        <section className="about-section">
          <div className="about-section-header">
            <h2>How the Portal Helps</h2>
            <p>Designed for CDAC students and placement coordinators</p>
          </div>

          <div className="about-grid-3">
            {features.map((item) => (
              <article className="about-card" key={item.title}>
                <div className="about-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Participating CDAC Courses */}
        <section className="about-section">
          <div className="about-section-header">
            <h2>Participating CDAC Programs</h2>
            <p>Industry-ready cohorts trained in specialized technology stacks</p>
          </div>

          <div className="about-grid-3">
            {courses.map((course) => (
              <article className="about-course-card" key={course.code}>
                <span className="course-badge">{course.code}</span>
                <h3>{course.name}</h3>
                <p>{course.focus}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default About;