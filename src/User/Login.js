import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthForms.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success or error
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://clinigoal2025-1.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (data.token) {
        setMsg("✅ Login successful! Redirecting...");
        setMsgType("success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        setTimeout(() => {
          if (role === "admin") navigate("/admin-dashboard");
          else if (role === "student") navigate("/student-dashboard");
        }, 1200);
      } else {
        setMsg(data.message || "❌ Invalid credentials");
        setMsgType("error");
      }
    } catch (err) {
      setMsg("⚠️ Login failed, please try again.");
      setMsgType("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card glass-effect">
          <h2 className="login-title">Welcome Back 👋</h2>
          <p className="login-subtitle">
            Login to continue to <span>Clinigoal</span>
          </p>

          {msg && <div className={`message-box ${msgType}`}>{msg}</div>}

          <form onSubmit={handleSubmit}>
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
              Login
            </button>
          </form>

          <div className="auth-links">
            <a href="/signup">Create Account |</a> {" "}
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
