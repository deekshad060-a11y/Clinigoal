import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quizzesmanager.css"; // Make sure to style accordingly

export default function QuizzesManager() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", ""], correctAnswer: "" }]);
  const [quizzes, setQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);
  const [deleteQuizId, setDeleteQuizId] = useState(null);
  const [popup, setPopup] = useState(null);
  const [viewMode, setViewMode] = useState("upload");

  const lecturerId = "L123";

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`https://clinigoal2025-1.onrender.com/courses/lecturer/${lecturerId}`);
        setCourses(res.data);
      } catch {
        showPopup("Failed to fetch courses", "error");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId && viewMode === "view") fetchQuizzes();
  }, [courseId, viewMode]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`https://clinigoal2025-1.onrender.com/quizzes/${courseId}`);
      setQuizzes(res.data);
    } catch {
      showPopup("Failed to fetch quizzes", "error");
    }
  };

  const showPopup = (msg, type = "info") => {
    setPopup({ msg, type });
    setTimeout(() => setPopup(null), 3000);
  };

  // --- Question Handlers ---
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () =>
    setQuestions([...questions, { question: "", options: ["", "", ""], correctAnswer: "" }]);

  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  // --- Create Quiz ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return showPopup("Please select a course", "error");

    try {
      const res = await axios.post("https://clinigoal2025-1.onrender.com/quizzes", { title, duration, courseId, questions });
      setQuizzes([...quizzes, res.data]);
      showPopup("Quiz created successfully!", "success");
      setTitle("");
      setDuration("");
      setQuestions([{ question: "", options: ["", "", ""], correctAnswer: "" }]);
    } catch {
      showPopup("Failed to save quiz", "error");
    }
  };

  // --- Edit Quiz ---
  const openEditModal = (quiz) => {
    setEditQuiz(quiz);
    setTitle(quiz.title);
    setDuration(quiz.duration);
    setQuestions(quiz.questions);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://clinigoal2025-1.onrender.com/quizzes/${editQuiz._id}`, { title, duration, courseId, questions });
      setQuizzes(quizzes.map((q) => (q._id === editQuiz._id ? { ...q, title, duration, questions } : q)));
      showPopup("Quiz updated successfully!", "success");
      setEditQuiz(null);
      setTitle("");
      setDuration("");
      setQuestions([{ question: "", options: ["", "", ""], correctAnswer: "" }]);
    } catch {
      showPopup("Failed to update quiz", "error");
    }
  };

  // --- Delete Quiz ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://clinigoal2025-1.onrender.com/quizzes/${id}`);
      setQuizzes(quizzes.filter((q) => q._id !== id));
      showPopup("Quiz deleted successfully!", "success");
      setDeleteQuizId(null);
    } catch {
      showPopup("Failed to delete quiz", "error");
    }
  };

  return (
    <div className="assignments-container">
      <h2> Quiz Manager</h2>
      <p>⚠️ This is a space to upload your quizzes please make sure that you had read all the guidelines and then proceed to upload .</p>
      <p>⚠️ Please select appropriate course before uploading quizzes</p>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button className={viewMode === "upload" ? "active" : ""} onClick={() => setViewMode("upload")}>
          Upload Quiz
        </button>
        <button className={viewMode === "view" ? "active" : ""} onClick={() => setViewMode("view")}>
          View All Quizzes
        </button>
        <button className={viewMode === "guidelines" ? "active" : ""} onClick={() => setViewMode("guidelines")}>
          Quiz Guidelines
        </button>
      </div>

      {/* --- Guidelines Section --- */}
      {viewMode === "guidelines" && (
        <div className="guidelines-section">
          <h2>📘 Quiz Guidelines</h2>
          <p className="intro-text">
            Welcome to the Quiz Management section! Please review the following guidelines before creating or managing quizzes.
          </p>

          <div className="guidelines-box">
            <h3>📋 For Lecturers</h3>
            <ul>
              <li>Ensure all quizzes are clearly titled and assigned to the correct course.</li>
              <li>Each quiz should include a minimum of 3 questions with valid options.</li>
              <li>Set a reasonable duration to allow students to complete the quiz comfortably.</li>
              <li>Use diverse question types (objective, reasoning, short answers) for balanced assessment.</li>
              <li>Regularly review quiz content to maintain relevance and accuracy.</li>
            </ul>
          </div>

          <div className="guidelines-box">
            <h3>⚙️ Scoring & Evaluation</h3>
            <ul>
              <li>Each correct answer grants 1 point unless specified otherwise.</li>
              <li>Final scores are automatically calculated and stored in the system database.</li>
              <li>Lecturers can review performance analytics and export quiz reports.</li>
            </ul>
          </div>

          <div className="guidelines-box tips">
            <h3>💡 Tips for Best Practices</h3>
            <p>
              Use clear and concise language in questions, avoid ambiguity, and ensure fairness across all assessments.
            </p>
          </div>

          <button className="btn-back" onClick={() => setViewMode("upload")}>← Back to Quiz Creation</button>
        </div>
      )}

      {/* Upload Quiz */}
      {viewMode === "upload" && (
        <form className="assignment-form" onSubmit={handleSubmit}>

          <label>Select Course</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          <label>Quiz Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Duration (minutes)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />

          <h3>Questions</h3>
          {questions.map((q, i) => (
            <div key={i} className="assignment-card">
              <input placeholder="Question" value={q.question} onChange={(e) => handleQuestionChange(i, "question", e.target.value)} />
              <div className="options">
                {q.options.map((opt, j) => (
                  <input key={j} placeholder={`Option ${j + 1}`} value={opt} onChange={(e) => handleOptionChange(i, j, e.target.value)} />
                ))}
              </div>
              <input placeholder="Correct Answer" value={q.correctAnswer} onChange={(e) => handleQuestionChange(i, "correctAnswer", e.target.value)} />
              <button type="button" className="btn-delete" onClick={() => removeQuestion(i)}>Remove Question</button>
            </div>
          ))}

          <button type="button" className="btn-save" onClick={addQuestion}>Add Question</button>
          <button type="submit" className="btn-submit">Create Quiz</button>
        </form>
      )}

      {/* View Quizzes */}
      {viewMode === "view" && (
        <div className="assignment-form">
          <label>Select Course</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>

          {courseId && quizzes.length === 0 && <p>No quizzes available.</p>}

          <div className="assignments-cards">
            {quizzes.map((q) => (
              <div key={q._id} className="assignment-card">
                <h3>{q.title}</h3>
                <p>Duration: {q.duration} minutes</p>
                <p>Questions: {q.questions.length}</p>
                <div className="card-actions">
                  <button className="edit" onClick={() => openEditModal(q)}>Edit</button>
                  <button className="delete" onClick={() => setDeleteQuizId(q._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Popup */}
      {popup && <div className={`toast-popup ${popup.type}`}>{popup.msg}</div>}

      {/* Delete Modal */}
      {deleteQuizId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this quiz?</p>
            <div className="card-actions">
              <button className="delete" onClick={() => handleDelete(deleteQuizId)}>Yes</button>
              <button className="edit" onClick={() => setDeleteQuizId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editQuiz && (
        <div className="modal-overlay">
          <div className="modal modal-edit">
            <div className="modal-header">
              <h2>Edit Quiz</h2>
              <button className="close-btn" onClick={() => setEditQuiz(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Quiz Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration"
                />
              </div>

              <h3 className="section-title">Questions</h3>
              {questions.map((q, i) => (
                <div key={i} className="question-block">
                  <div className="question-header">
                    <h4>Question {i + 1}</h4>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeQuestion(i)}
                    >
                      ✖
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Question text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(i, "question", e.target.value)}
                  />

                  <div className="options-grid">
                    {q.options.map((opt, j) => (
                      <input
                        key={j}
                        type="text"
                        placeholder={`Option ${j + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(i, j, e.target.value)}
                      />
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(i, "correctAnswer", e.target.value)}
                  />
                </div>
              ))}

              <button type="button" className="btn-add-question" onClick={addQuestion}>
                ➕ Add Question
              </button>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-save" onClick={handleUpdate}>💾 Update Quiz</button>
              <button type="button" className="btn-cancel" onClick={() => setEditQuiz(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
