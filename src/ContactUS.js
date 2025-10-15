import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "./component/Header";
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post("/api/contact", formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div>
      <Header />
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      style={{
        minHeight: "100vh",
        padding: "50px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "15px",
          padding: "40px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          style={{ marginBottom: "10px", fontSize: "2.2rem", color: "#1e3a8a", position: "relative" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
          <motion.span
            style={{
              position: "absolute",
              left: 0,
              bottom: -5,
              width: 0,
              height: 4,
              background: "#1e40af",
              borderRadius: "2px"
            }}
            initial={{ width: 0 }}
            animate={{ width: "50px" }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />
        </motion.h1>

        <motion.p
          style={{ marginBottom: "30px", color: "#334155" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Have questions or feedback? Send us a message!
        </motion.p>

        <motion.form onSubmit={handleSubmit} initial="hidden" animate="visible" variants={fadeInUp}>
          {["name", "email", "subject", "message"].map((field, idx) => (
            <motion.div
              key={field}
              style={{ marginBottom: "20px" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", color: "#1e3a8a" }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}{field !== "subject" ? "*" : ""}
              </label>
              {field !== "message" ? (
                <motion.input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "1rem",
                    transition: "all 0.3s ease"
                  }}
                  whileFocus={{ scale: 1.02, borderColor: "#1e3a8a", boxShadow: "0 0 10px rgba(30,58,138,0.2)" }}
                  required={field !== "subject"}
                />
              ) : (
                <motion.textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "1rem",
                    transition: "all 0.3s ease"
                  }}
                  whileFocus={{ scale: 1.02, borderColor: "#1e3a8a", boxShadow: "0 0 10px rgba(30,58,138,0.2)" }}
                  required
                />
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            style={{
              padding: "12px 25px",
              backgroundColor: "#1e3a8a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600"
            }}
            whileHover={{ scale: 1.05, backgroundColor: "#1e40af" }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>

        {status && (
          <motion.p
            style={{
              marginTop: "25px",
              color: status.includes("success") ? "green" : "red",
              fontWeight: "500"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {status}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
    </div>
  );
}
