import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AuthForms.css";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success or error

  // 👁 password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMsg("❌ Passwords do not match");
      setMsgType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (data.message && data.message.toLowerCase().includes("successful")) {
        setMsg("✅ Password reset successful! Redirecting...");
        setMsgType("success");
        setTimeout(() => {
          localStorage.removeItem("resetEmail");
          window.location.href = "/login";
        }, 1500);
      } else {
        setMsg(data.error || data.message || "❌ Reset failed");
        setMsgType("error");
      }
    } catch (err) {
      setMsg("⚠️ Request failed, please try again.");
      setMsgType("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card glass-effect">
          <h2 className="login-title">Reset Password 🔒</h2>
          <p className="login-subtitle">
            Enter your <span>OTP</span> and new password
          </p>

          {msg && <div className={`message-box ${msgType}`}>{msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="form-label">OTP</label>
              <input
                type="text"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            {/* 👁 New Password with toggle */}
            <div className="input-group password-group">
              <label className="form-label">New Password</label>
              <div className="password-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* 👁 Confirm Password with toggle */}
            <div className="input-group password-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-login">
              Reset Password
            </button>
          </form>

          <div className="auth-links">
            <a href="/login">⬅ Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
