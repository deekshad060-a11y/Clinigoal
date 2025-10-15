import React from "react";
import { motion } from "framer-motion";
import "./AdminDashboard.css";
export default function Sidebar({ tabs, activeTab, setActiveTab }) {
  return (
    <motion.div
      className="sidebar"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="logo">Lecturer Panel</h2>
      <div className="nav-button">
        {tabs.map((tab) => (
          <motion.button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`nav-btn ${activeTab === tab.name ? "active" : ""}`}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.icon} <span>{tab.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
