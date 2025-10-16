import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EnrollmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
    const API = "https://clinigoal2025.onrender.com";
  const token = localStorage.getItem("token");

  // Fetch course details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(`${API}/courses/${courseId}`);
        setCourse(courseRes.data);

        // Fetch assignments & quizzes
        const assignRes = await axios.get(`${API}/assignments/${courseId}`);
        const quizRes = await axios.get(`${API}/quizzes/${courseId}`);
        setAssignments(assignRes.data);
        setQuizzes(quizRes.data);
      } catch (err) {
        console.error("Error loading enrollment data:", err);
      }
    };
    fetchData();
  }, [courseId]);

  const handleConfirmEnrollment = async () => {
    try {
      const res = await axios.post(
        `${API}/courses/enroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setIsEnrolled(true);
        alert(`✅ Successfully enrolled in ${res.data.course.title}`);
        navigate("/user-dashboard"); // Go back to dashboard
      } else {
        alert(res.data.message || "Enrollment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Enrollment failed. Check console for details.");
    }
  };

  if (!course) return <p>Loading course details...</p>;

  return (
    <div className="enrollment-container">
      <h2>Enroll in {course.title}</h2>

      <div className="course-details">
        {course.videos?.[0] ? (
          <video src={course.videos[0]} controls width="100%" />
        ) : (
          <img
            src="https://via.placeholder.com/600x300"
            alt={course.title}
            className="course-thumbnail"
          />
        )}
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Duration:</strong> {course.duration}</p>
      </div>

      {!isEnrolled ? (
        <button className="btn btn-primary" onClick={handleConfirmEnrollment}>
          Confirm Enrollment
        </button>
      ) : (
        <p className="success-msg">✅ You are enrolled in this course!</p>
      )}

      {isEnrolled && (
        <div className="post-enrollment">
          <h3>📘 Assignments</h3>
          {assignments.length ? (
            <ul>
              {assignments.map((a) => (
                <li key={a._id}>{a.title}</li>
              ))}
            </ul>
          ) : (
            <p>No assignments yet.</p>
          )}

          <h3>🧠 Quizzes</h3>
          {quizzes.length ? (
            <ul>
              {quizzes.map((q) => (
                <li key={q._id}>{q.title}</li>
              ))}
            </ul>
          ) : (
            <p>No quizzes yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
