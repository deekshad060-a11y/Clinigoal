import React from "react";
import { motion } from "framer-motion";
import "./AdminDashboard.css";
export default function QuickActions({ setActiveTab }) {
  return (
    <motion.div className="quick-actions-section" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h3 className="section-title">⚡ Quick Actions</h3>
      <div className="quick-actions-grid">
        <motion.div className="action-card" whileHover={{ scale: 1.07 }} onClick={() => setActiveTab("Courses")}>
          <span>➕</span>
          <h4>Create New Course</h4>
          <p>Design and upload a new learning module.</p>
        </motion.div>
        <motion.div className="action-card" whileHover={{ scale: 1.07 }} onClick={() => setActiveTab("Assignments")}>
          <span>📝</span>
          <h4>Create Assignment</h4>
          <p>Add assignments and track student performance.</p>
        </motion.div>
        <motion.div className="action-card" whileHover={{ scale: 1.07 }} onClick={() => setActiveTab("Quizzes")}>
          <span>❓</span>
          <h4>Create Quiz</h4>
          <p>Prepare engaging quizzes for assessments.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
