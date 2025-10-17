import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MyCourseDetails({ user }) {
  const { courseId } = useParams();
  const token = localStorage.getItem("token"); // ✅ ensure token is defined

  const [course, setCourse] = useState(null);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [quizModal, setQuizModal] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const API = "https://clinigoal2025-1.onrender.com";

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const [resCourse, resAssignments, resQuizzes] = await Promise.all([
          axios.get(`${API}/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/assignments/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/quizzes/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const courseData = resCourse.data;

        // Add submitted flag for assignments
        courseData.assignments = resAssignments.data.map((a) => ({
          ...a,
          submitted: a.submissions?.some((s) => s.studentId === user?._id),
        }));

        // Add submitted flag for quizzes
        courseData.quizzes = resQuizzes.data.map((q) => ({
          ...q,
          submitted: q.submissions?.some((s) => s.studentId === user?._id),
        }));

        // Mark course completed if all assignments & quizzes submitted
        courseData.completed =
          courseData.assignments.every((a) => a.submitted) &&
          courseData.quizzes.every((q) => q.submitted);

        setCourse(courseData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user?._id, token]);

  // Download file helper
  const downloadFile = (base64Data, filename) => {
    if (!base64Data) return alert("File not available");
    const arr = base64Data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    const blob = new Blob([u8arr], { type: mime });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Submit Assignment
  const handleSubmitAssignment = async (assignmentId) => {
    if (!assignmentFile) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("file", assignmentFile);

    try {
      setLoading(true);
      const res = await axios.post(
        `${API}/assignments/submit/${assignmentId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message || "Submitted!");
      setAssignmentFile(null);

      // Update state for this assignment
      setCourse((prev) => {
        const updatedAssignments = prev.assignments.map((a) =>
          a._id === assignmentId ? { ...a, submitted: true } : a
        );
        const updatedCourse = {
          ...prev,
          assignments: updatedAssignments,
          completed: updatedAssignments.every((a) => a.submitted) && prev.quizzes.every((q) => q.submitted),
        };
        return updatedCourse;
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  // Open Quiz Modal
  const openQuiz = (quiz) => {
    setQuizModal(quiz);
    const initialAnswers = {};
    quiz.questions.forEach((q, i) => (initialAnswers[i] = ""));
    setUserAnswers(initialAnswers);
  };

  // Handle quiz answer selection
  const handleQuizAnswer = (index, answer) => {
    setUserAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  // Submit Quiz
  const submitQuiz = async () => {
    if (!quizModal) return;

    try {
      const res = await axios.post(
        `${API}/quizzes/submit/${quizModal._id}`,
        {
          studentId: user?._id,
          answers: Object.values(userAnswers),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Score: ${res.data.score}/${res.data.total}`);

      // Update state for this quiz
      setCourse((prev) => {
        const updatedQuizzes = prev.quizzes.map((q) =>
          q._id === quizModal._id ? { ...q, submitted: true } : q
        );
        const updatedCourse = {
          ...prev,
          quizzes: updatedQuizzes,
          completed: prev.assignments.every((a) => a.submitted) && updatedQuizzes.every((q) => q.submitted),
        };
        return updatedCourse;
      });

      setQuizModal(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting quiz.");
    }
  };

  if (loading || !course) return <p>Loading course...</p>;

  return (
    <div className="course-details-page">
      <h2>{course.title}</h2>
      <p>{course.description}</p>

      {/* Videos */}
      {course.videos?.length > 0 && (
        <section>
          <h3>🎥 Videos</h3>
          {course.videos.map((v, i) => (
            <video key={i} src={v} controls width="100%" style={{ marginBottom: "10px" }} />
          ))}
        </section>
      )}

      {/* Assignments */}
      <section>
        <h3>📘 Assignments</h3>
        {course.assignments.length === 0 ? (
          <p>No assignments yet</p>
        ) : (
          course.assignments.map((a) => (
            <div key={a._id} className="assignment-card">
              <h4>{a.title} {a.submitted ? "✅" : "🕒"}</h4>
              <p>{a.description}</p>

              {a.files?.map((f, i) => (
                <button key={i} onClick={() => downloadFile(f.data, f.name)}>
                  {f.name}
                </button>
              ))}

              {!a.submitted && (
                <div>
                  <input type="file" onChange={(e) => setAssignmentFile(e.target.files[0])} />
                  <button onClick={() => handleSubmitAssignment(a._id)}>Submit</button>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Quizzes */}
      <section>
        <h3>🧩 Quizzes</h3>
        {course.quizzes.length === 0 ? (
          <p>No quizzes yet</p>
        ) : (
          course.quizzes.map((q) => (
            <div key={q._id} className="quiz-card">
              <h4>{q.title} {q.submitted ? "✅" : "🕒"}</h4>
              <p>{q.questions.length} questions</p>
              {!q.submitted && <button onClick={() => openQuiz(q)}>Take Quiz</button>}
            </div>
          ))
        )}
      </section>

      {/* Quiz Modal */}
      {quizModal && (
        <div className="modal-overlay" onClick={() => setQuizModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{quizModal.title}</h2>
            {quizModal.questions.map((q, i) => (
              <div key={i}>
                <p>{q.question}</p>
                {q.options.map((opt, j) => (
                  <label key={j}>
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      onChange={() => handleQuizAnswer(i, opt)}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <button onClick={submitQuiz}>Submit Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
}
