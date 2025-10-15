import React, { useState, useEffect, useRef } from "react";
import {
  FaCamera,
  FaTrash,
  FaSignOutAlt,
  FaShieldAlt,
  FaUserEdit,
  FaUserCircle,
  FaSave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentSettings.css";

export default function ProfileSettings({ user, setUser }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({ name: "", bio: "" });
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const userKey = user?.id ? `user_${user.id}` : `user_${user?.email}`;

  useEffect(() => {
    if (!user) return;

    const storedUser = localStorage.getItem(userKey);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setForm({ name: parsed.name || "", bio: parsed.bio || "" });
      setUser(parsed);
    } else {
      localStorage.setItem(userKey, JSON.stringify(user));
      setForm({ name: user.name || "", bio: user.bio || "" });
    }
  }, [user, userKey, setUser]);

  const saveChanges = () => {
    const updatedUser = { ...user, ...form };
    setUser(updatedUser);
    localStorage.setItem(userKey, JSON.stringify(updatedUser));
    alert("✅ Profile updated successfully!");
    setActiveTab("overview");
  };

  const handleImageChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, profilePic: reader.result };
      setUser(updatedUser);
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    const updatedUser = { ...user, profilePic: "" };
    setUser(updatedUser);
    localStorage.setItem(userKey, JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem(userKey);
    navigate("/login");
  };

  if (!user) return <div className="loading-message">Loading profile...</div>;

  return (
    <div className="profile-settings">
      {/* Top Tabs + Security Button */}
      <div className="profile-top-row">
        <div className="profile-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <FaUserCircle /> Overview
          </button>
          <button
            className={activeTab === "edit" ? "active" : ""}
            onClick={() => setActiveTab("edit")}
          >
            <FaUserEdit /> Edit Profile
          </button>
        </div>

        <button
          className="security-btn"
          onClick={() => setShowSecurityModal(true)}
          title="Security Settings"
        >
          <FaShieldAlt /> Security
        </button>
      </div>

      {/* Profile Photo Section */}
      <div className="profile-photo-section">
        {user?.profilePic ? (
          <img src={user.profilePic} alt="profile" className="profile-photo" />
        ) : (
          <div className="profile-photo-placeholder">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <div className="photo-buttons">
          <label style={{ cursor: "pointer" }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleImageChange(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <FaCamera className="photo-icon" title="Upload Photo" />
          </label>

          {user?.profilePic && (
            <FaTrash
              onClick={removePhoto}
              className="photo-icon delete"
              title="Remove Photo"
            />
          )}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="overview-section">
          <h2>{form.name || "No Name"}</h2>
          <p className="bio">{form.bio || "No bio available."}</p>
        </div>
      )}

      {/* Edit Tab */}
      {activeTab === "edit" && (
        <div className="edit-section">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
          />
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Write your bio..."
          />
          <button onClick={saveChanges} className="save-btn">
            <FaSave /> Save Changes
          </button>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="security-modal-overlay">
          <div className="security-modal">
            <h3>Security Options</h3>
            <p>Would you like to reset your password?</p>
            <div className="security-actions">
              <button
                onClick={() => navigate("/forgot-password")}
                className="security-forgot-btn"
              >
                Forgot Password
              </button>
              <button
                className="security-cancel-btn"
                onClick={() => setShowSecurityModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}
