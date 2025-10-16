import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  const navigate = useNavigate(); // React Router hook

  return (
    <div className="welcome-container">
      
      {/* Navbar */}
      <nav className="nav">
        <h1 className="logo"> Welcome to Clinigoal </h1>
        <div className="nav-buttons">
          <button 
            className="btn-btn-primary" 
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button 
            className="btn-btn-outline" 
            onClick={() => navigate("/signup")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="title"
      >
        Clinigoal – Clinical Educational Platform
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="subtitle"
      >
        Welcome to <span className="highlight">Clinigoal</span>, 
        your gateway to modern clinical education. Explore interactive courses, 
        expert lectures, and real-world clinical case studies.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="action-buttons"
      >
        <button 
          className="btn btn-large btn-primary" 
          onClick={() => navigate("/home")}
        >
          Get Started
        </button>
      </motion.div>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Clinigoal – Clinical Educational. All Rights Reserved.
      </footer>
    </div>
  );
}
