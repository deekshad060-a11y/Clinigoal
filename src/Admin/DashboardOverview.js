import React from "react";
import { motion } from "framer-motion";
import "./AdminDashboard.css";
export default function DashboardOverview({ students, courses, totalEnrollment }) {
  return (
    <div className="dashboard-overview">
      <div className="stats-cards">
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          👩‍🎓 <span>Total Students</span>
          <h3>{students.length}</h3>
        </motion.div>
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          📘 <span>Total Courses</span>
          <h3>{courses.length}</h3>
        </motion.div>
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          📝 <span>Total Enrollment</span>
          <h3>{totalEnrollment}</h3>
        </motion.div>
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          📊 <span>Avg. Progress</span>
          <h3>82%</h3>
        </motion.div>
      </div>
    </div>
  );
}
