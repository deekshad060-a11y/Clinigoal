import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignmentFile, setAssignmentFile] = useState(null);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000";

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const resAssignments = await axios.get(`${API}/assignments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const resQuizzes = await axios.get(`${API}/quizzes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const resCourse = await axios.get(`${API}/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });

        setCourse({
          ...resCourse.data,
          assignments: resAssignments.data,
          quizzes: resQuizzes.data,
          materials: resCourse.data.materials || []
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse();
  }, [id]);

  const downloadFile = (base64Data, filename) => {
    if (!base64Data) return;
    const arr = base64Data.split(",");
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    const blob = new Blob([u8arr]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-details-container">
      <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      <h2>{course.title}</h2>

      <div className="tabs">
        <button onClick={() => setActiveTab("assignments")}>Assignments</button>
        <button onClick={() => setActiveTab("quizzes")}>Quizzes</button>
        <button onClick={() => setActiveTab("materials")}>Materials</button>
      </div>

      {activeTab === "assignments" && (
        <div className="assignments-tab">
          {course.assignments.map(a => (
            <div key={a._id}>
              <h4>{a.title}</h4>
              <p>{a.description}</p>
              {a.files?.map((f,i)=>(
                <button key={i} onClick={()=>downloadFile(f.data, f.name)}>📂 {f.name}</button>
              ))}
              <input type="file" onChange={e=>setAssignmentFile(e.target.files[0])}/>
              <button>Submit Assignment</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "quizzes" && (
        <div className="quizzes-tab">
          {course.quizzes.map(q=>(
            <div key={q._id}>
              <h4>{q.title}</h4>
              <p>{q.questions.length} Questions</p>
              {!q.submitted && <button>Take Quiz</button>}
            </div>
          ))}
        </div>
      )}

      {activeTab === "materials" && (
        <div className="materials-tab">
          {course.materials.map((m,i)=>(
            <button key={i} onClick={()=>downloadFile(m.data,m.filename)}>📄 {m.filename}</button>
          ))}
        </div>
      )}
    </div>
  );
}
