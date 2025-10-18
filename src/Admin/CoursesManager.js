import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CoursesManager.css";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

export default function CoursesManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [fees, setFees] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videos, setVideos] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [popup, setPopup] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [showGuide, setShowGuide] = useState(false); // 🔹 NEW STATE

  const lecturerId = "L123";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `https://clinigoal2025-1.onrender.com/courses/lecturer/${lecturerId}`
      );

      const formattedCourses = res.data.map((course) => ({
        ...course,
        videos: (course.videos || []).map((v, i) => ({
          filename: `video-${i + 1}.mp4`,
          data: v,
        })),
        materials: (course.materials || []).map((m, i) => ({
          filename: `material-${i + 1}`,
          data: m,
        })),
      }));

      setCourses(formattedCourses);
    } catch (err) {
      console.error(err);
      showPopup("Failed to fetch courses", "error");
    }
  };

  const showPopup = (msg, type = "info") => {
    let icon = "";
    if (type === "success") icon = "✅";
    else if (type === "error") icon = "❌";
    else if (type === "info") icon = "ℹ️";

    setPopup({ msg: `${icon} ${msg}`, type });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const duplicate = courses.find(
      (c) => c.title.trim().toLowerCase() === title.trim().toLowerCase()
    );
    if (duplicate) {
      showPopup("A course with this title already exists!", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("duration", duration);
      formData.append("lecturerId", lecturerId);
      formData.append("fees", fees);
      if (image) formData.append("image", image);
      videos.forEach((v) => formData.append("videos", v));
      materials.forEach((m) => formData.append("materials", m));

      await axios.post("https://clinigoal2025-1.onrender.com/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showPopup("Course uploaded successfully!", "success");
      setTitle("");
      setDescription("");
      setDuration("");
      setFees("");
      setImage(null);
      setImagePreview(null);
      setVideos([]);
      setMaterials([]);
      fetchCourses();
    } catch (err) {
      console.error(err);
      showPopup("Something went wrong while uploading", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://clinigoal2025-1.onrender.com/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      if (selectedCourse?._id === id) setSelectedCourse(null);
      setDeleteCourseId(null);
      showPopup("Course deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Failed to delete course", "error");
    }
  };

  const handleSaveEdit = async (updatedCourse) => {
    try {
      const formData = new FormData();
      formData.append("title", updatedCourse.title);
      formData.append("description", updatedCourse.description);
      formData.append("duration", updatedCourse.duration);
      formData.append("fees", updatedCourse.fees || "");
      if (updatedCourse.newImage)
        formData.append("image", updatedCourse.newImage);
      updatedCourse.newVideos?.forEach((v) => formData.append("videos", v));
      updatedCourse.newMaterials?.forEach((m) =>
        formData.append("materials", m)
      );

      await axios.put(
        `https://clinigoal2025-1.onrender.com/courses/${updatedCourse._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCourses(
        courses.map((c) =>
          c._id === updatedCourse._id ? { ...c, ...updatedCourse } : c
        )
      );
      setEditCourse(null);
      showPopup("Course updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Failed to update course", "error");
    }
  };

  const downloadFile = (base64Data, filename) => {
    if (!base64Data) {
      alert("File data not available for download!");
      return;
    }
    try {
      const arr = base64Data.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      const blob = new Blob([u8arr], { type: mime });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert("Failed to download file!");
    }
  };

  return (
    <div className="courses-container">
      <h2>Course Management</h2>
      <p>⚠️ This is a space to upload your courses please make sure that you had read all the guidelines and then proceed to upload </p>
      <p>⚠️ After uploading a course you can move forward for uploding assignmnets and quizzes</p>
      
      {/* Navigation Tabs */}
      <div className="tab-buttons">
        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          Upload a Course
        </button>
        <button
          className={activeTab === "view" ? "active" : ""}
          onClick={() => setActiveTab("view")}
        >
          View All Courses
        </button>
        <button
          className={activeTab === "enrollment" ? "active" : ""}
          onClick={() => setActiveTab("enrollment")}
        >
          View Enrollment Details
        </button>
      </div>

      {activeTab === "upload" && (
  <motion.div
    className="upload-card"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {/* Upload Guidelines Toggle */}
    <div className="guidelines-toggle">
      <button
        className="btn-secondary"
        onClick={() => setShowGuide(!showGuide)}
        type="button"
      >
        {showGuide ? "⬆️ Hide Upload Guidelines" : "📋 Show Upload Guidelines"}
      </button>
    </div>

    <AnimatePresence>
      {showGuide && (
        <motion.div
          className="guidelines-box"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4>📝 Course Upload Guidelines</h4>
          <ul>
            <li>✅ Use a clear, descriptive course title (3-8 words)</li>
            <li>✅ Write a compelling description (150-300 characters)</li>
            <li>✅ Set appropriate duration (e.g., "6 weeks", "3 months")</li>
            <li>✅ Add reasonable course fees (numeric only)</li>
            <li>✅ Upload high-quality course image (1200×800px recommended)</li>
            <li>✅ Include engaging videos (MP4, max 100MB each)</li>
            <li>✅ Provide helpful materials (PDF/DOC/PPT, max 10MB each)</li>
            <li>✅ Ensure no duplicate course titles</li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Enhanced Form */}
    <form className="styled-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        
        {/* Basic Information Section */}
        <h4 className="form-section-header">📚 Basic Information</h4>
        
        <div className="form-group full-width">
          <label className="required-field">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Advanced Clinical Research Methods"
            required
            maxLength={100}
          />
          <div className="char-counter">{title.length}/100</div>
        </div>

        <div className="form-group">
          <label className="required-field">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 8 weeks, 3 months"
            required
          />
          <div className="form-help-text">Estimated time to complete</div>
        </div>

        <div className="form-group">
          <label className="required-field">Course Fees (₹)</label>
            <input
            type="number"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            placeholder="Enter amount"
            required
            min="0"
          />
          <div className="form-help-text">Set to 0 for free courses</div>
        </div>

        <div className="form-group full-width">
          <label className="required-field">Course Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what students will learn, key topics covered, and learning outcomes..."
            rows="4"
            required
            maxLength={500}
          />
          <div className="char-counter">{description.length}/500</div>
        </div>

        {/* Media Upload Section */}
        <h4 className="form-section-header">🖼️ Course Media</h4>

        <div className="form-group">
          <label className="required-field">Course Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setImagePreview(file ? URL.createObjectURL(file) : null);
            }}
            required
          />
          {imagePreview && (
            <div className="image-preview-container">
              <img
                src={imagePreview}
                alt="Course preview"
                className="course-image-preview"
              />
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                Remove
              </button>
            </div>
          )}
          <div className="form-help-text">JPG/PNG, 1200×800px recommended</div>
        </div>

        <div className="form-group">
          <label>Course Videos</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => setVideos([...e.target.files])}
          />
          {videos.length > 0 && (
            <span className="file-count-badge">
              {videos.length} video{videos.length !== 1 ? 's' : ''} selected
            </span>
          )}
          <div className="form-help-text">MP4/MOV, max 100MB each</div>
        </div>

        <div className="form-group">
          <label>Course Materials</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            onChange={(e) => setMaterials([...e.target.files])}
          />
          {materials.length > 0 && (
            <span className="file-count-badge">
              {materials.length} file{materials.length !== 1 ? 's' : ''} selected
            </span>
          )}
          <div className="form-help-text">PDF/DOC/PPT/TXT, max 10MB each</div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="upload-button-container">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="btn-upload"
          disabled={!title || !description || !duration || !fees || !image}
        >
          🚀 Upload Course
        </motion.button>
        
        {/* Form Status */}
        <div className="form-status">
          {!title || !description || !duration || !fees || !image ? (
            <span className="form-help-text">
              Please fill all required fields to upload
            </span>
          ) : (
            <span className="form-help-text success">
              ✅ All set! Ready to upload your course
            </span>
          )}
        </div>
      </div>
    </form>
  </motion.div>
)}
      {/* Rest of your existing “View” and “Enrollment” sections remain same */}
      {/* ✅ (No changes needed below this line) */}


      {/* Courses Table */}
      {activeTab === "view" && (
  <motion.div
    className="view-courses-section"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h3 className="section-title">📚 Your Uploaded Courses</h3>

    {courses.length === 0 ? (
      <p className="no-data">No courses uploaded yet.</p>
    ) : (
      <div className="c-grids">
        {courses.map((course) => (
          <motion.div
            key={course._id}
            className="c-cards"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div className="course-headers">
              <img
                src={course.image || "/default-course.jpg"}
                alt={course.title}
                className="course-thumb"
              />
            </div>

            <div className="c-body">
              <h4 className="c-title">{course.title}</h4>
              <p className="c-description">
                {course.description.length > 90
                  ? course.description.slice(0, 90) + "..."
                  : course.description}
              </p>
              <div className="c-info">
                <span>🕒 {course.duration}</span>
                <span>💰 ₹{course.fees || "N/A"}</span>
              </div>
            </div>

            <div className="course-actions">
              <button
                className="btn-action edit"
                onClick={() => setEditCourse(course)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn-action delete"
                onClick={() => setDeleteCourseId(course._id)}
              >
                🗑 Delete
              </button>
              <button
                className="btn-action view"
                onClick={() => setSelectedCourse(course)}
              >
                👁 View
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
)}

      {/* Enrollment Details */}
      {activeTab === "enrollment" && (
        <div>
          <h3 className="section-title">Enrollment Details</h3>
          
            {courses.length === 0 ? (
              <p className="no-data">No courses found</p>
            ) : (
              <div className="enrollment-grid">
                {courses.map((course) => (
                  <motion.div
                    key={course._id}
                    className="enrollment-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="enrollment-info">
                      <h4>{course.title}</h4>
                      <p>
                        <strong>
                          {course.enrolledStudents?.length || 0}
                        </strong>{" "}
                        students enrolled
                      </p>
                    </div>
                    <div className="enrollment-icon">
                      <Users size={26} color="#4f46e5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Existing course details, modals, and toast popup remain unchanged */}
      {selectedCourse && (
  <div className="course-details-card">
    <div className="course-headers">
      <h3 className="details-title">📘 {selectedCourse.title}</h3><br></br>
      
    </div>

    <div className="course-info-section">
      <p><strong>Duration:</strong> {selectedCourse.duration}</p>
      <p><strong>Fees:</strong> ₹{selectedCourse.fees || "N/A"}</p>
    </div>

    <div className="course-description-section">
      <p>{selectedCourse.description}</p>
    </div>

    {selectedCourse.videos?.length > 0 && (
      <div className="course-media-section">
        <h4>🎬 Videos</h4>
        <div className="videos-grid">
          {selectedCourse.videos.map((v, i) => (
            <div key={i} className="video-card">
              <video src={v.data} controls />
            </div>
          ))}
        </div>
      </div>
    )}

    {selectedCourse.materials?.length > 0 && (
      <div className="course-media-section">
        <h4>📂 Materials</h4>
        <div className="materials-grid">
          {selectedCourse.materials.map((m, i) => (
            <div key={i} className="material-card">
              {/\.(jpg|jpeg|png|gif)$/i.test(m.filename) && m.data ? (
                <img src={m.data} alt={m.filename} className="material-img"/>
              ) : (
                <button
                  className="btn-download"
                  onClick={() => downloadFile(m.data, m.filename)}
                >
                  Download {m.filename}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

      {popup && <div className={`toast-popup ${popup.type}`}>{popup.msg}</div>}
     {editCourse && (
  <div className="ec-overlay">
    <div className="ec-modal">
      {/* Modal Header */}
      <div className="ec-header">
        <h2>Edit Course</h2>
        <button className="ec-close" onClick={() => setEditCourse(null)}>×</button>
      </div>

      {/* Modal Body */}
      <div className="ec-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEdit(editCourse);
          }}
        >
          {/* Title, Duration, Fees, Description */}
          <div className="ec-form-group">
            <label>Title</label>
            <input
              type="text"
              value={editCourse.title}
              onChange={(e) =>
                setEditCourse({ ...editCourse, title: e.target.value })
              }
            />
          </div>

          <div className="ec-form-group">
            <label>Duration</label>
            <input
              type="text"
              value={editCourse.duration}
              onChange={(e) =>
                setEditCourse({ ...editCourse, duration: e.target.value })
              }
            />
          </div>

          <div className="ec-form-group">
            <label>Fees (₹)</label>
            <input
              type="number"
              value={editCourse.fees || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse, fees: e.target.value })
              }
            />
          </div>

          <div className="ec-form-group">
            <label>Description</label>
            <textarea
              value={editCourse.description}
              onChange={(e) =>
                setEditCourse({ ...editCourse, description: e.target.value })
              }
            />
          </div>

          {/* Change Course Image */}
          <div className="ec-form-group">
            <label>Change Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditCourse({ ...editCourse, newImage: e.target.files[0] })
              }
            />
            {editCourse.image && !editCourse.newImage && (
              <img src={editCourse.image} alt="Current" className="ec-image-preview" />
            )}
            {editCourse.newImage && (
              <img
                src={URL.createObjectURL(editCourse.newImage)}
                alt="New Preview"
                className="ec-image-preview"
              />
            )}
          </div>

          {/* Existing Videos */}
          {editCourse.videos?.length > 0 && (
            <div className="ec-form-group">
              <label>Existing Videos</label>
              <div className="ec-videos-grid">
                {editCourse.videos.map((v, i) => (
                  <div key={i} className="ec-video-card">
                    <video src={v.data} controls />
                    <button
                      type="button"
                      onClick={() =>
                        setEditCourse({
                          ...editCourse,
                          videos: editCourse.videos.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Videos */}
          <div className="ec-form-group">
            <label>Upload New Videos</label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setEditCourse({
                  ...editCourse,
                  newVideos: [...(editCourse.newVideos || []), ...e.target.files],
                })
              }
            />
            {editCourse.newVideos?.length > 0 && (
              <div className="ec-videos-grid">
                {Array.from(editCourse.newVideos).map((v, i) => (
                  <div key={i} className="ec-video-card">
                    <video src={URL.createObjectURL(v)} controls />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing Materials */}
          {editCourse.materials?.length > 0 && (
            <div className="ec-form-group">
              <label>Existing Materials</label>
              <div className="ec-materials-grid">
                {editCourse.materials.map((m, i) => (
                  <div key={i} className="ec-material-card">
                    {/\.(jpg|jpeg|png|gif)$/i.test(m.filename) ? (
                      <img src={m.data} alt={m.filename} />
                    ) : (
                      <button type="button" onClick={() => downloadFile(m.data, m.filename)}>
                        Download {m.filename}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setEditCourse({
                          ...editCourse,
                          materials: editCourse.materials.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Materials */}
          <div className="ec-form-group">
            <label>Upload New Materials</label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setEditCourse({
                  ...editCourse,
                  newMaterials: [...(editCourse.newMaterials || []), ...e.target.files],
                })
              }
            />
            {editCourse.newMaterials?.length > 0 && (
              <div className="ec-materials-grid">
                {Array.from(editCourse.newMaterials).map((m, i) => (
                  <div key={i} className="ec-material-card">
                    <span>{m.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Modal Actions */}
      <div className="ec-actions">
        <button className="ec-save-btn" onClick={() => handleSaveEdit(editCourse)}>Save</button>
        <button className="ec-cancel-btn" onClick={() => setEditCourse(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}


      {deleteCourseId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this course?</p>
            <div className="modal-actions">
              <button
                className="btn-delete"
                onClick={() => handleDelete(deleteCourseId)}
              >
                Yes, Delete
              </button>
              <button
                className="btn-cancel"
                onClick={() => setDeleteCourseId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
