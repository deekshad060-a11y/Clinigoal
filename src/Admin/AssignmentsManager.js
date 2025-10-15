import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssignmentsManager.css";

export default function AssignmentsManager() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [editAssignment, setEditAssignment] = useState(null);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState(null);
  const [popup, setPopup] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // 👈 new state to toggle views
  const lecturerId = "L123";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`https://clinigoal2025.onrender.com/courses/lecturer/${lecturerId}`);
        setCourses(res.data);
      } catch {
        showPopup("Failed to fetch courses", "error");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (activeTab === "view" && courseId) fetchAssignments();
  }, [courseId, activeTab]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`https://clinigoal2025.onrender.com/assignments/${courseId}`);
      setAssignments(res.data);
    } catch {
      showPopup("Failed to fetch assignments", "error");
    }
  };

  const showPopup = (msg, type = "info") => {
    setPopup({ msg, type });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return showPopup("Please select a course", "error");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dueDate", dueDate);
      formData.append("courseId", courseId);
      formData.append("lecturerId", lecturerId);
      files.forEach(f => formData.append("files", f));

      const res = await axios.post("https://clinigoal2025.onrender.com/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAssignments([...assignments, res.data]);
      setTitle(""); setDescription(""); setDueDate(""); setFiles([]);
      showPopup("Assignment created successfully!", "success");
    } catch {
      showPopup("Something went wrong!", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://clinigoal2025.onrender.com/assignments/${id}`);
      setAssignments(assignments.filter(a => a._id !== id));
      showPopup("Assignment deleted successfully!", "success");
      setDeleteAssignmentId(null);
    } catch {
      showPopup("Failed to delete assignment", "error");
    }
  };

  const handleSaveEdit = async (updatedAssignment) => {
    try {
      const formData = new FormData();
      formData.append("title", updatedAssignment.title);
      formData.append("description", updatedAssignment.description);
      formData.append("dueDate", updatedAssignment.dueDate);
      if (updatedAssignment.newFiles) {
        updatedAssignment.newFiles.forEach(f => formData.append("files", f));
      }

      const res = await axios.put(
        `http://localhost:5000/assignments/${updatedAssignment._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAssignments(assignments.map(a => (a._id === updatedAssignment._id ? res.data : a)));
      setEditAssignment(null);
      showPopup("Assignment updated successfully!", "success");
    } catch {
      showPopup("Failed to update assignment", "error");
    }
  };

  const downloadFile = (base64Data, filename) => {
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
  };

  return (
    <div className="assignments-container">
      <h2>Assignments Manager</h2>
      <p>⚠️ This is a space to upload your assignments please make sure that you had read all the guidelines and then proceed to upload .</p>
      <p>⚠️ Please select appropriate course before uploading assignments</p>


      {/* 👇 Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          📤 Upload Assignment
        </button>
        <button
          className={activeTab === "view" ? "active" : ""}
          onClick={() => setActiveTab("view")}
        >
          📚 View All Assignments
        </button>
      </div>

      {/* Upload Assignment Section */}
     {/* Upload Assignment Section */}
{activeTab === "upload" && (
  <form className="assignment-form" onSubmit={handleSubmit}>
    {/* Course Selection */}
    <div className="form-group">
      <label>Select Course</label>
      <select value={courseId} onChange={e => setCourseId(e.target.value)} required>
        <option value="">-- Select Course --</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
    </div>

    {/* Title */}
    <div className="form-group">
      <label>Assignment Title</label>
      <input
        type="text"
        placeholder="Enter assignment title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
    </div>

    {/* Description */}
    <div className="form-group">
      <label>Description</label>
      <textarea
        placeholder="Provide a brief description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
    </div>

    {/* Due Date */}
    <div className="form-group">
      <label>Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        required
      />
    </div>

    {/* File Upload */}
    <div className="form-group">
      <label>Upload Files</label>
      <input
        type="file"
        multiple
        onChange={e => setFiles([...e.target.files])}
      />
      <p className="file-guidelines">
        Supported formats: PDF, JPG, PNG. Max file size: 10MB
      </p>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="file-preview">
          {files.map((f, i) => (
            <div key={i} className="file-card">
              <span>📄 {f.name}</span>
              <span>{(f.size / 1024).toFixed(2)} KB</span>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Submit Button */}
    <button type="submit" className="btn-submit">Create Assignment</button>
  </form>
)}

      {/* View Assignments Section */}
      {/* View Assignments Section */}
{activeTab === "view" && (
  <div className="view-section">
    <label>
      Select Course
      <select value={courseId} onChange={e => setCourseId(e.target.value)}>
        <option value="">-- Select Course --</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
    </label>

    {courseId && assignments.length === 0 && (
      <div className="no-assignments">
        <span>📭</span> No assignments yet for this course.
      </div>
    )}

    {assignments.length > 0 && (
      <div className="assignments-cards">
        {assignments.map(a => (
          <div className="assignment-card" key={a._id}>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
            <p className="due-date">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
            <div className="card-actions">
              <button className="edit" onClick={() => setEditAssignment(a)}>✏️ Edit</button>
              <button className="delete" onClick={() => setDeleteAssignmentId(a._id)}> 🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


      {/* Toast Popup */}
      {popup && (
        <div className={`toast-popup ${popup.type}`}>
          {popup.type === "success" && "✅ "}
          {popup.type === "error" && "❌ "}
          {popup.msg}
        </div>
      )}

      {editAssignment && (
  <div className="edit-assignment-overlay">
    <div className="edit-assignment-modal">
      <div className="edit-assignment-header">
        <h2>Edit Assignment</h2>
      </div>

      <form
        className="edit-assignment-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveEdit(editAssignment);
        }}
      >
        <label className="edit-assignment-label">
          Title
          <input
            type="text"
            className="edit-assignment-input"
            value={editAssignment.title}
            onChange={(e) =>
              setEditAssignment({ ...editAssignment, title: e.target.value })
            }
          />
        </label>

        <label className="edit-assignment-label">
          Description
          <textarea
            className="edit-assignment-textarea"
            value={editAssignment.description}
            onChange={(e) =>
              setEditAssignment({
                ...editAssignment,
                description: e.target.value,
              })
            }
          />
        </label>

        <label className="edit-assignment-label">
          Due Date
          <input
            type="date"
            className="edit-assignment-date"
            value={editAssignment.dueDate?.split("T")[0]}
            onChange={(e) =>
              setEditAssignment({ ...editAssignment, dueDate: e.target.value })
            }
          />
        </label>

        <label className="edit-assignment-label">
          Add New Files
          <input
            type="file"
            multiple
            className="edit-assignment-file"
            onChange={(e) =>
              setEditAssignment({
                ...editAssignment,
                newFiles: [...e.target.files],
              })
            }
          />
        </label>

        <div className="edit-assignment-actions">
          <button type="submit" className="edit-assignment-save">
            Save Changes
          </button>
          <button
            type="button"
            className="edit-assignment-cancel"
            onClick={() => setEditAssignment(null)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Delete Modal */}
      {deleteAssignmentId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this assignment? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-delete" onClick={() => handleDelete(deleteAssignmentId)}>Yes, Delete</button>
              <button className="btn-cancel" onClick={() => setDeleteAssignmentId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
