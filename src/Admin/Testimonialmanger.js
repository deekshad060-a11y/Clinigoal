import axios from "axios";
import React, { useState, useEffect } from "react";
import "./AdminDashboard.css"; // Custom CSS

export default function TestimonialManager({ limit = null }) {
  const API = "https://clinigoal2025-1.onrender.com";
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API}/api/feedback`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Sort by newest first and apply limit
  const displayedFeedbacks = [...feedbacks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit || feedbacks.length);

  return (
    <div className="testimonial-section">
      <h2 className="testimonial-title">🗣 What Our Students Say</h2>
      <div className="testimonial-grid">
        {displayedFeedbacks.length === 0 ? (
          <p className="no-feedback">No feedback yet.</p>
        ) : (
          displayedFeedbacks.map((fb) => (
            <div key={fb._id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="student-avatar">
                  {fb.userId?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <h4 className="student-name">{fb.userId?.name || "Anonymous"}</h4>
                  <span className="course-name">{fb.courseId?.title || "Unknown Course"}</span>
                </div>
              </div>

              <div className="testimonial-rating">
                {"★".repeat(fb.rating || 0) + "☆".repeat(5 - (fb.rating || 0))}
              </div>

              <p className="testimonial-comment">"{fb.comment || "No comment provided."}"</p>

              <small className="feedback-date">
                {new Date(fb.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
