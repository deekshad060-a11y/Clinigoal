import React, { useState, useEffect, useRef } from "react";
import {
  FaCamera,
  FaTrash,
  FaSignOutAlt,
  FaShieldAlt,
  FaUserEdit,
  FaUserCircle,
  FaSave,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentSettings.css";

export default function ProfileSettings({ user, setUser }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({ 
    name: "", 
    email: "",
    bio: "",
    phone: ""
  });
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const saveChanges = async () => {
    try {
      const updatedUser = { ...user, ...form };
      setUser(updatedUser);
      
      // Save to backend if needed
      const token = localStorage.getItem("token");
      await fetch("https://clinigoal2025-1.onrender.com/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedUser)
      });
      
      alert("✅ Profile updated successfully!");
      setActiveTab("overview");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile");
    }
  };

  const handleImageChange = (file) => {
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, profilePic: reader.result };
      setUser(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    const updatedUser = { ...user, profilePic: "" };
    setUser(updatedUser);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://clinigoal2025-1.onrender.com/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("✅ Password changed successfully!");
        setShowSecurityModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("❌ Error changing password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (!user) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-settings-container">
      {/* Header */}
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {/* Main Content Grid */}
      <div className="profile-content-grid">
        {/* Left Side - Navigation & Quick Actions */}
        <div className="profile-sidebar">
          <div className="profile-quick-actions">
            <button 
              className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <FaUserCircle />
              Overview
            </button>
            <button 
              className={`nav-btn ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              <FaUserEdit />
              Edit Profile
            </button>
            <button 
              className="nav-btn security"
             onClick={() => navigate("/forgot-password")}
            >
              <FaShieldAlt />
              Security
            </button>
          </div>

          {/* Profile Photo Section */}
         
{/* Profile Photo Section - Only for profile page */}
<div className="profile-page-photo-section">
  <div className="profile-page-photo-container">
    {user?.profilePic ? (
      <img src={user.profilePic} alt="profile" className="profile-page-photo" />
    ) : (
      <div className="profile-page-photo-placeholder">
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    )}
    
    <div className="profile-page-photo-overlay">
      <label className="profile-page-upload-btn">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleImageChange(e.target.files[0])}
          accept="image/*"
          className="hidden"
        />
        <FaCamera />
      </label>
      {user?.profilePic && (
        <button 
          className="profile-page-remove-btn"
          onClick={removePhoto}
        >
          <FaTrash />
        </button>
      )}
    </div>
  </div>
  
  <h3 className="profile-page-user-name">{user.name}</h3>
  <p className="profile-page-user-email">{user.email}</p>
</div>
        </div>

        {/* Right Side - Content */}
        <div className="profile-main-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{user.name || "Not set"}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{user.phone || "Not set"}</p>
                  </div>
                  <div className="info-item full-width">
                    <label>Bio</label>
                    <p className="bio-text">{user.bio || "No bio available"}</p>
                  </div>
                </div>
              </div>

              
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === "edit" && (
            <div className="edit-tab">
              <div className="edit-form-card">
                <h3>Edit Profile Information</h3>
                <form onSubmit={(e) => { e.preventDefault(); saveChanges(); }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  </div>
                  
                  <button type="submit" className="save-changes-btn">
                    <FaSave /> Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="modal-overlay" onClick={() => setShowSecurityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="modal-close"
                onClick={() => setShowSecurityModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  <FaLock /> Change Password
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowSecurityModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}