import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./CourseDetails.css";
import Header from "../component/Header";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = "https://clinigoal2025-1.onrender.com"; // production backend URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, assignmentRes, quizRes] = await Promise.all([
          axios.get(`${API}/courses/${id}`),
          axios.get(`${API}/assignments/${id}`),
          axios.get(`${API}/quizzes/${id}`),
        ]);
        setCourse(courseRes.data);
        setAssignments(assignmentRes.data);
        setQuizzes(quizRes.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          ⏳
        </motion.div>
        Loading course details...
      </div>
    );

  if (!course) return <p>Course not found.</p>;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25 } },
  };

  return (
    <div>
      <Header />

      <motion.div
        className="course-details-container"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Header */}
        <motion.div className="course-header" variants={fadeInUp}>
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <p className="course-duration">
            <strong>Duration:</strong> {course.duration}
          </p>
        </motion.div>

        {/* Restricted Section */}
        <motion.section className="restricted-section" variants={fadeInUp}>
          <motion.div
            className="lock-box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              className="lock-icon"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🔒
            </motion.div>
            <h2>Access Restricted</h2>
            <p>
              Please <strong>register</strong> or <strong>log in</strong> to
              access exclusive content, course videos, and premium resources.
            </p>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button"
            >
              🚀 Register Now
            </motion.a>
          </motion.div>
        </motion.section>

        {/* Course Materials */}
        <motion.section className="materials-section" variants={fadeInUp}>
          <h2>📘 Course Materials</h2>
          {course.materials?.length > 0 ? (
            <div className="grid-section">
              {course.materials.map((m, i) => (
                <motion.div
                  key={i}
                  className="card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="card-header">
                    <h4>{m.name || `Material ${i + 1}`}</h4>
                  </div>
                  <p className="card-text">
                    Learn and practice with curated materials prepared by experts.
                  </p>
                  <button className="card-btn">Register ➡️ View Material</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="no-data">No materials available.</p>
          )}
        </motion.section>

        {/* Assignments */}
        <motion.section className="assignments-section" variants={fadeInUp}>
          <h2>📝 Assignments</h2>
          {assignments.length > 0 ? (
            <div className="grid-section">
              {assignments.map((a) => (
                <motion.div
                  key={a._id}
                  className="card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="card-header">
                    <h4>{a.title}</h4>
                  </div>
                  <p className="card-text">{a.description}</p>
                  <button className="card-btn">Register ➡️ View Assignment</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="no-data">No assignments for this course.</p>
          )}
        </motion.section>

        {/* Quizzes */}
        <motion.section className="quizzes-section" variants={fadeInUp}>
          <h2>🧩 Quizzes</h2>
          {quizzes.length > 0 ? (
            <div className="grid-section">
              {quizzes.map((q) => (
                <motion.div
                  key={q._id}
                  className="card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="card-header">
                    <h4>{q.title}</h4>
                  </div>
                  <p className="card-text">
                    Test your knowledge and track your progress with quizzes.
                  </p>
                  <button className="card-btn">Register ➡️ View Quiz</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="no-data">No quizzes available.</p>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
}
