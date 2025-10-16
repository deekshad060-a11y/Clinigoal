import React, { useState } from "react";
import "./AuthForms.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // success or error
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://clinigoal2025.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.message) {
        setMsg("✅ Reset link sent to your email!");
        setMsgType("success");
        localStorage.setItem("resetEmail", email);
        setTimeout(() => {
          window.location.href = "/reset-password";
        }, 1500);
      } else {
        setMsg(data.error || "❌ Request failed");
        setMsgType("error");
      }
    } catch (err) {
      setMsg("⚠️ Request failed, try again.");
      setMsgType("error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card glass-effect">
          <h2 className="login-title">Forgot Password 🔑</h2>
          <p className="login-subtitle">
            Enter your email to reset your password
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

            <button type="submit" className="btn-login">
              Send Reset Link
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
