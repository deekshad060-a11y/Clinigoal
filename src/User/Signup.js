import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthForms.css";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success or error
  const [showPassword, setShowPassword] = useState(false);
const API = "https://clinigoal2025.onrender.com"; // production backend URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://clinigoal2025.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (data.message && data.message.toLowerCase().includes("success")) {
        setMsg("✅ Account created successfully! Please login.");
        setMsgType("success");
      } else {
        setMsg(data.error || data.message || "❌ Signup failed");
        setMsgType("error");
      }
    } catch (err) {
      setMsg("⚠️ Signup failed, please try again.");
      setMsgType("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card glass-effect">
          <h2 className="login-title">Create Account ✨</h2>
          <p className="login-subtitle">
            Join <span>Clinigoal</span> and start learning
          </p>

          {msg && <div className={`message-box ${msgType}`}>{msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group password-group">
              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label className="form-label">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="dropdown"
              >
                <option value="student" className="d">Student</option>
                <option value="admin" className="d">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn-login">
              Sign Up
            </button>
          </form>

          <div className="auth-links">
            <a href="/login">Already have an account?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
