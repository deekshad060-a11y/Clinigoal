import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import './CoursesPage.css';
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";


export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = "https://clinigoal2025.onrender.com"; // production backend URL

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          ⏳
        </motion.div>
        Loading Courses...
      </div>
    );
  }

  return (
    <div>
            <Header />
    <div className="courses-page">
        
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Explore All Courses
      </motion.h1>

      <div className="courses-grid">
        {courses.map((course) => (
          <motion.div
            key={course._id}
            className="course-card"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            onClick={() => navigate(`/course/${course._id}`)}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p className="duration">Duration: {course.duration}</p>
            <motion.button
              className="btn-view"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details →
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
    </div>
  );
}
