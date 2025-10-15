import React from "react";
import { motion } from "framer-motion";

export default function RecentActivity({ students, courses }) {
  return (
    <motion.div
      className="recent-activity-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="section-title">🕒 Recent Activities</h3>
      <div className="activity-list">
        {/* Recent Students */}
        {students.slice(0, 5).map((s, idx) => (
          <motion.div
            key={s._id}
            className="activity-card"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <span className="activity-icon">👩‍🎓</span>
            <div className="activity-content">
              <h4>New Student Registered</h4>
              <p>{s.name}</p>
            </div>
            <span className="activity-time">{idx + 1}h ago</span>
          </motion.div>
        ))}

        {/* Recent Courses */}
        {courses.slice(0, 3).map((c, idx) => (
          <motion.div
            key={c._id}
            className="activity-card"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <span className="activity-icon">📘</span>
            <div className="activity-content">
              <h4>New Course Added</h4>
              <p>{c.title}</p>
            </div>
            <span className="activity-time">{idx + 2}h ago</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
