import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserPage.css";
import { jsPDF}  from "jspdf";
import { FaUser,FaHome, FaBook, FaGraduationCap, FaBullhorn, FaCog,FaCreditCard,FaChartLine ,FaCommentDots,FaBookOpen,FaTachometerAlt} from "react-icons/fa";
import ProfileSettings from './ProfileSettings'
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F"];
export default function UserDashboard() {
  const navigate = useNavigate();
  const [unlockedVideoIndex, setUnlockedVideoIndex] = useState(0);
// Add "payment" as a new possible tab

  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizModal, setQuizModal] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollFormCourse, setEnrollFormCourse] = useState(null);
  const [enrollFormData, setEnrollFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  agree: false,
  paid: false,
});
const [userFeedback, setUserFeedback] = useState([]);

const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
const [certificateCount, setCertificateCount] = useState(0);
const [profilePic, setProfilePic] = useState(null);
const handleProfileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file!");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    setProfilePic(reader.result); // Save base64 URL in state
  };
  reader.readAsDataURL(file);
};

useEffect(() => {
  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${API}/api/dashboard/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificateCount(res.data.certificateCount);
    } catch (err) {
      console.error("Error fetching certificates:", err);
    }
  };

  fetchCertificates();
}, []);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000";

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId"); // or however you store it
      const userRes = await axios.get(`${API}/auth/user/${userId}`);
      setUser(userRes.data);

      const coursesRes = await axios.get(`${API}/courses/enrolled/${userId}`);
      setEnrolledCourses(coursesRes.data);

      const assignmentRes = await axios.get(`${API}/assignments/user/${userId}`);
      setAssignments(assignmentRes.data);

      const quizRes = await axios.get(`${API}/quizzes/user/${userId}`);
      setQuizzes(quizRes.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  fetchUserData();
}, []);


//Assignment and  Quiz count
const [progress, setProgress] = useState({ assignmentsCompleted: 0, quizzesCompleted: 0 });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/progress", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token") // your auth token
          }
        });
        setProgress(res.data);
      } catch (err) {
        console.error("Error fetching dashboard progress:", err);
      }
    };

    fetchProgress();
  }, []);


  // ------------------------
  // Fetch user & courses
  // ------------------------
  useEffect(() => {
    if (!token) return;
    setLoading(true);

    Promise.all([
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/courses`),
    ])
      .then(([userRes, courseRes]) => {
        setUser(userRes.data);
        setEnrolledCourses(userRes.data.enrolledCourses || []);
        setCourses(courseRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // ------------------------
  // Helpers
  // ------------------------
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

// ✅ Calculate course progress dynamically
const calculateCourseProgress = (course) => {
  if (!course) return 0;

  const totalAssignments = course.assignments?.length || 0;
  const totalQuizzes = course.quizzes?.length || 0;
  const total = totalAssignments + totalQuizzes;

  if (total === 0) return 0;

  const completedAssignments = course.assignments?.filter(a => a.submitted).length || 0;
  const completedQuizzes = course.quizzes?.filter(q => q.submitted).length || 0;
  const completed = completedAssignments + completedQuizzes;

  return Math.round((completed / total) * 100);
};

  const openEnrollForm = (course) => {
    setEnrollFormCourse(course);
    setEnrollFormData({
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      agree: false,
    });
    setShowEnrollModal(true);
  };

  const closeEnrollModal = () => setShowEnrollModal(false);

  const handleEnrollChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ NEW: Enrollment states for admin approval system
const [pendingEnrollments, setPendingEnrollments] = useState([]);
const [approvedCourses, setApprovedCourses] = useState([]);

// ✅ NEW: Initialize enrollment system
useEffect(() => {
  initializeEnrollmentSystem();
}, [user]);

const initializeEnrollmentSystem = () => {
  if (!user) return;
  
  // Load pending enrollments from localStorage
  const allPendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
  const userPendingEnrollments = allPendingEnrollments.filter(
    enrollment => enrollment.studentId === user._id && enrollment.status === 'pending'
  );
  setPendingEnrollments(userPendingEnrollments);

  // Load approved enrollments from localStorage
  const allApprovedEnrollments = JSON.parse(localStorage.getItem('approvedEnrollments') || '[]');
  const userApprovedCourses = allApprovedEnrollments
    .filter(enrollment => enrollment.studentId === user._id && enrollment.status === 'approved')
    .map(enrollment => enrollment.courseId);
  setApprovedCourses(userApprovedCourses);
  setEnrolledCourses(userApprovedCourses); // Only approved courses show in My Courses
};

// ✅ UPDATED: Enrollment function that sends request to admin
const handleEnrollSubmit = async (e) => {
  e.preventDefault();
  if (!enrollFormData.agree) return alert("Please agree to the terms.");
  if (!user) return alert("User not found.");

  try {
    // Create enrollment request
    const enrollmentRequest = {
      _id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      studentId: user._id,
      studentName: enrollFormData.fullName,
      studentEmail: enrollFormData.email,
      studentPhone: enrollFormData.phone,
      courseId: enrollFormCourse._id,
      courseTitle: enrollFormCourse.title,
      courseDescription: enrollFormCourse.description,
      courseFees: enrollFormCourse.fees,
      courseDuration: enrollFormCourse.duration,
      courseImage: enrollFormCourse.image,
      paid: enrollFormData.paid,
      enrollmentDate: new Date().toISOString(),
      status: "pending", // This will appear in admin dashboard
      adminViewed: false
    };
    // Save to localStorage (simulating database)
    const allPendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
    allPendingEnrollments.push(enrollmentRequest);
    localStorage.setItem('pendingEnrollments', JSON.stringify(allPendingEnrollments));
    const response = await axios.post(
        `${API}/courses/enroll/${enrollFormCourse._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    // Update state
    setPendingEnrollments(prev => [...prev, enrollmentRequest]);
    
    alert("🎉 Enrollment request submitted successfully!\n\nYour request has been sent to admin for approval. You'll see the course in 'My Courses' once approved.");
    
    closeEnrollModal();
    
    // Show admin access instructions
    console.log("📋 Admin can view pending enrollments in Lecturer Dashboard under 'Enrollments' tab");

  } catch (err) {
    console.error("Enrollment error:", err);
    alert("Enrollment failed. Please try again.");
  }
};





  const handleSelectCourse = async (courseId) => {
  try {
    const [resAssignments, resQuizzes] = await Promise.all([
      axios.get(`${API}/assignments/${courseId}`),
      axios.get(`${API}/quizzes/${courseId}`),
    ]);

    const course = courses.find(c => c._id === courseId);

    const updatedCourse = {
      ...course,
      assignments: resAssignments.data.map(a => ({
        ...a,
        submitted: a.submissions?.some(s => s.studentId === user?._id)
      })),
      quizzes: resQuizzes.data.map(q => ({
        ...q,
        submitted: q.submissions?.some(s => s.studentId === user?._id)
      })),
      materials: (course.materials || []).map((m, i) => ({ filename: `material-${i + 1}`, data: m }))
    };

    updatedCourse.completed = isCourseCompleted(updatedCourse);

    setSelectedCourse(updatedCourse);
    setUnlockedVideoIndex(0);
  } catch (err) {
    console.error("Error fetching course details:", err);
  }
};

const handleCourseCompletion = async (courseId) => {
  try {
    const res = await axios.post(
      `${API}/courses/${courseId}/complete`,
      { studentId: user._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedProgress = res.data.courseProgress || 0;
    setCertificateCount(res.data.certificates?.length || 0);
    setShowFeedback(true);
    setUser({ ...user, courseProgress: updatedProgress });
  } catch (err) {
    console.error("Error updating course completion:", err);
  }
};

const handleSubmitFeedback = async () => {
  if (!selectedCourse) return alert("No course selected");
  if (!rating || rating < 1 || rating > 5) return alert("Please provide a valid rating");
  
  try {
    // Use user._id from state
    const response = await axios.post("http://localhost:5000/api/feedback/submit", {
      userId: user?._id,       // <- use logged-in user
      courseId: selectedCourse._id,
      rating,
      comment,
    });

    alert(response.data.message || "Thank you for your feedback!");
    
    // Reset feedback form
    setShowFeedback(false);
    setRating(0);
    setComment("");
  } catch (err) {
    console.error("Error submitting feedback:", err);
    alert(err.response?.data?.message || "Error submitting feedback");
  }
};

useEffect(() => {
  if (!user?._id) return;

  const fetchUserFeedback = async () => {
    try {
      const res = await axios.get(`${API}/api/feedback/user/${user._id}`);
      setUserFeedback(res.data);
    } catch (err) {
      console.error("Error fetching user feedback:", err);
    }
  };

  fetchUserFeedback();
}, [user]);


  const handleSubmitAssignment = async (assignmentId) => {
  if (!assignmentFile) return alert("Select a file first!");

  const formData = new FormData();
  formData.append("file", assignmentFile);

  setLoading(true);
  try {
    const res = await axios.post(`${API}/assignments/submit/${assignmentId}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    alert(res.data.message || "Assignment submitted successfully!");
    setAssignmentFile(null);

    // Refresh course data
    await handleSelectCourse(selectedCourse._id);

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Submission failed.");
  } finally {
    setLoading(false);
  }
};


  // ------------------------
  // Quiz handling
  // ------------------------
  const openQuiz = (quiz) => {
    setQuizModal(quiz);
    const initialAnswers = {};
    quiz.questions.forEach((q, i) => { initialAnswers[i] = ""; });
    setUserAnswers(initialAnswers);
  };

  const handleQuizAnswer = (index, answer) => {
    setUserAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const submitQuiz = async () => {
  if (!quizModal) return;

  try {
    const response = await axios.post(`${API}/quizzes/submit/${quizModal._id}`, {
      studentId: user?._id,
      answers: Object.values(userAnswers),
    }, { headers: { Authorization: `Bearer ${token}` } });

    alert(`You scored ${response.data.score}/${response.data.total}`);

    // Update selectedCourse state
    setSelectedCourse(prev => {
      const updatedQuizzes = prev.quizzes.map(q =>
        q._id === quizModal._id ? { ...q, submitted: true } : q
      );
      const updatedCourse = { ...prev, quizzes: updatedQuizzes };
      updatedCourse.completed = isCourseCompleted(updatedCourse);
      return updatedCourse;
    });

    setQuizModal(null);

  } catch (err) {
    console.error(err);
    alert("Error submitting quiz.");
  }
};
useEffect(() => {
  if (selectedCourse?.completed) {
    handleCourseCompletion(selectedCourse._id);
  }
}, [selectedCourse]);

useEffect(() => {
  const fetchCertificateCount = async () => {
    try {
      const res = await axios.get(`${API}/api/dashboard/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificateCount(res.data.certificateCount);
    } catch (err) {
      console.error("Error fetching certificate count:", err);
    }
  };

  fetchCertificateCount();
}, []);



  // ✅ Add this here
  const [viewedMaterials, setViewedMaterials] = useState({});

  const handleViewMaterial = (index) => {
    setViewedMaterials((prev) => ({ ...prev, [index]: true }));
  };
  // ------------------------
  // Render helpers
  // ------------------------
 const renderAssignmentsAndQuizzes = () => {
  if (!selectedCourse) return null;
  const { assignments, quizzes, materials } = selectedCourse;

  return (
    <div className="assignments-quizzes-container">
      {/* ---------------- Assignments Section ---------------- */}
      <section className="section-card shadow-card enhanced-section">
        <h3 className="section-title">📘 Assignments</h3>
        {assignments?.length === 0 ? (
          <p className="no-content">No assignments available yet.</p>
        ) : (
          assignments.map((a) => (
            <div key={a._id} className="assignment-card professional-card enhanced-card">
              <div className="assignment-header">
                <h4 className="assignment-title">{a.title}</h4>
                <span className={`assignment-status ${a.submitted ? "status-completed" : "status-pending"}`}>
                  {a.submitted ? "✅ Submitted" : "🕒 Pending"}
                </span>
              </div>
              <p className="assignment-desc">{a.description}</p>

              {a.files?.length > 0 && (
                <div className="assignment-files">
                  {a.files.map((f, i) => (
                    <button
                      key={i}
                      className="btn btn-small btn-secondary btn-file"
                      onClick={() => downloadFile(f.data, f.name)}
                    >
                      📂 {f.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="assignment-upload">
                <input
                  type="file"
                  key={a._id}
                  className="upload-input"
                  onChange={(e) => setAssignmentFile(e.target.files[0])}
                />
                <button
                  className="btn btn-primary btn-upload enhanced-btn"
                  onClick={() => handleSubmitAssignment(a._id)}
                >
                  Upload Submission
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* ---------------- Materials Section ---------------- */}
      {materials?.length > 0 && (
        <section className="section-card shadow-card enhanced-section">
          <h3 className="section-title">📂 Course Materials</h3>
          <div className="materials-grid enhanced-grid">
            {materials.map((m, i) => {
              if (!m.data) return null;

              const arr = m.data.split(",");
              const mime = arr[0].match(/:(.*?);/)[1];
              const blob = new Blob(
                [Uint8Array.from(atob(arr[1]), (c) => c.charCodeAt(0))],
                { type: mime }
              );
              const url = URL.createObjectURL(blob);

              const isPDF = mime === "application/pdf";
              const isImage = mime.startsWith("image/");
              const isText = mime.startsWith("text/");
              const viewed = viewedMaterials[i];

              return (
                <div key={i} className="material-viewer shadow-card enhanced-card">
                  <div className="material-header">
                    <h4 className="material-title">📘 {m.filename}</h4>
                    <span className={`material-status ${viewed ? "status-completed" : "status-pending"}`}>
                      {viewed ? "✅ Completed" : "🕒 Not Viewed"}
                    </span>
                  </div>

                  {!viewed ? (
                    <button
                      className="btn btn-primary btn-view enhanced-btn"
                      onClick={() => handleViewMaterial(i)}
                    >
                      👁️ View Material
                    </button>
                  ) : (
                    <>
                      {isPDF && (
                        <iframe
                          src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
                          width="100%"
                          height="500px"
                          title={m.filename}
                          className="material-frame"
                        />
                      )}
                      {isImage && <img src={url} alt={m.filename} className="material-image" />}
                      {isText && (
                        <iframe src={url} width="100%" height="300px" title={m.filename} className="material-frame" />
                      )}
                      {!isPDF && !isImage && !isText && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary enhanced-btn">
                          Open {m.filename}
                        </a>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- Quizzes Section ---------------- */}
      <section className="section-card shadow-card enhanced-section">
        <h3 className="section-title">🧩 Quizzes</h3>
        {quizzes?.length === 0 ? (
          <p className="no-content">No quizzes available yet.</p>
        ) : (
          quizzes.map((q) => (
            <div key={q._id} className="quiz-card-professional-card-enhanced-card">
              <div className="quiz-header">
                <h4 className="quiz-title">{q.title}</h4>
                <span className={`quiz-status ${q.submitted ? "status-completed" : "status-pending"}`}>
                  {q.submitted ? "✅ Completed" : "🕒 Pending"}
                </span>
              </div>
              <p>{q.questions.length} Questions</p>
              {!q.submitted && (
                <button
                  className="btn btn-success btn-quiz enhanced-btn"
                  onClick={() => openQuiz(q)}
                >
                  Take Quiz
                </button>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};


// ------------------------
// Certificate generation function
// ------------------------
const generateCertificate = (course) => {
  if (!course) return;

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = 842;
  const pageHeight = 595;

  // Background
  doc.setFillColor(240, 248, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Border
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(2);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

  // Title
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 60, 90);
  doc.text("Certificate of Completion", pageWidth / 2, 100, { align: "center" });

  // Subtitle
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text("This certificate is proudly presented to", pageWidth / 2, 150, { align: "center" });

  // User Name
  doc.setFontSize(32);
  doc.setFont("times", "bolditalic");
  doc.setTextColor(10, 80, 130);
  doc.text(`${user?.name}`, pageWidth / 2, 200, { align: "center" });

  // Course completion line
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("has successfully completed the course", pageWidth / 2, 240, { align: "center" });

  // Course title
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 100, 200);
  doc.text(`"${course.title}"`, pageWidth / 2, 280, { align: "center" });

  // Date
  const today = new Date();
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${today.toLocaleDateString()}`, pageWidth / 2, 320, { align: "center" });

  // Signature
  doc.setFontSize(18);
  doc.setTextColor(50, 50, 50);
  doc.text("____________________", pageWidth / 4, 450);
  doc.text("Authorized Signature", pageWidth / 4, 470);

  const pdfBase64 = doc.output("datauristring");

  // Save certificate for current user
  const savedCerts = JSON.parse(localStorage.getItem("certificates") || "[]");
  savedCerts.push({
    studentId: user?._id,
    courseTitle: course.title,
    certificateData: pdfBase64
  });
  localStorage.setItem("certificates", JSON.stringify(savedCerts));

  // Save PDF
  doc.save(`${course.title}-Certificate.pdf`);
};

// ------------------------
// State for videos and unlocks
// ------------------------
const [completedVideosMap, setCompletedVideosMap] = useState({});
const [unlockedVideosMap, setUnlockedVideosMap] = useState({});

// ------------------------
// Load progress from localStorage for this user
// ------------------------
useEffect(() => {
  if (!user) return;

  const completedVideosKey = `completedVideosMap_${user._id}`;
  const unlockedVideosKey = `unlockedVideosMap_${user._id}`;

  const savedCompleted = localStorage.getItem(completedVideosKey);
  const savedUnlocked = localStorage.getItem(unlockedVideosKey);

  setCompletedVideosMap(savedCompleted ? JSON.parse(savedCompleted) : {});
  setUnlockedVideosMap(savedUnlocked ? JSON.parse(savedUnlocked) : {});
}, [user]);

// ------------------------
// Persist progress to localStorage
// ------------------------
useEffect(() => {
  if (!user) return;
  localStorage.setItem(`completedVideosMap_${user._id}`, JSON.stringify(completedVideosMap));
}, [completedVideosMap, user]);

useEffect(() => {
  if (!user) return;
  localStorage.setItem(`unlockedVideosMap_${user._id}`, JSON.stringify(unlockedVideosMap));
}, [unlockedVideosMap, user]);

// ------------------------
// Unlock first video for new courses
// ------------------------
useEffect(() => {
  enrolledCourses.forEach(courseId => {
    if (!(courseId in unlockedVideosMap)) {
      setUnlockedVideosMap(prev => ({ ...prev, [courseId]: 0 }));
    }
  });
}, [enrolledCourses]);

// ------------------------
// Helper: check if all videos are watched for this user
// ------------------------
const allVideosWatched = (course) => {
  if (!course?.videos || course.videos.length === 0) return true;
  const totalVideos = course.videos.length;
  const completedVideos = Object.keys(completedVideosMap[course._id] || {}).length;
  return completedVideos >= totalVideos;
};

const isCourseCompleted = (course) => {
  if (!course) return false;
  const allAssignmentsSubmitted = course.assignments?.every(a => a.submitted);
  const allQuizzesCompleted = course.quizzes?.every(q => q.submitted);
  return allAssignmentsSubmitted && allQuizzesCompleted;
};
// ------------------------
// Render courses
// ------------------------
// ✅ UPDATED: My Courses - only show approved courses
const renderMyCourses = () => (
  <div className="my-course">
    <h2 className="page-heading">🎓 My Enrolled Courses</h2>

    {approvedCourses.length === 0 ? (
      <div className="no-courses-message">
        <p>You haven't been approved for any courses yet.</p>
        {pendingEnrollments.length > 0 && (
          <p className="pending-notice">
            📋 You have {pendingEnrollments.length} course(s) waiting for admin approval.
            Check "Available Courses" for status.
          </p>
        )}
      </div>
    ) : (
      <div className="courses-grids">
        {approvedCourses.map((courseId) => {
          const course = courses.find((c) => c._id === courseId);
          if (!course) return null;

          const isUnlocked = selectedCourse?._id === courseId;
          const courseUnlockedIndex = unlockedVideosMap[course._id] || 0;
          const totalVideos = course.videos?.length || 0;
          const completedVideosCount = Object.keys(completedVideosMap[course._id] || {}).length;
          const progress = totalVideos ? Math.round((completedVideosCount / totalVideos) * 100) : 0;

          const status = progress === 0
            ? "Pending"
            : progress === 100
            ? "Completed"
            : "In Progress";

          return (
            <div key={courseId} className="course-card glossy-card">
              <div className="course-card-horizontal">
                <div className="course-image-container">
                  <img
                    src={course.image || "https://via.placeholder.com/300x180"}
                    alt={course.title}
                    className="course-image"
                  />
                  <span className={`status-badge ${status.replace(" ", "").toLowerCase()}`}>
                    {status}
                  </span>
                </div>

                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                  </div>

                  <button
                    className="btn btn-small btn-primary glossy-btn"
                    onClick={() => handleSelectCourse(courseId)}
                  >
                    {isUnlocked ? "🔒 Hide Details" : "🔓 View Course"}
                  </button>
                </div>
              </div>

              {isUnlocked && (
                <div className="course-details-expanded">
                  {/* Your existing expanded course details */}
                  <section className="section-card shadow-card course-videos-section">
                    <h3>🎥 Course Videos</h3>
                    <div className="course-videos-row">
                      {course.videos && course.videos.map((video, i) => {
                        const isCompleted = completedVideosMap[course._id]?.[i];
                        if (i > courseUnlockedIndex) return null;

                        return (
                          <div key={i} className="video-wrapper glossy-video">
                            <video
                              src={video}
                              controls
                              className="course-video-item"
                              onEnded={() => {
                                if (!user) return;
                                setCompletedVideosMap(prev => {
                                  const updated = {
                                    ...prev,
                                    [course._id]: {
                                      ...prev[course._id],
                                      [i]: true
                                    }
                                  };
                                  const completedCount = Object.keys(updated[course._id]).length;
                                  const total = course.videos.length;
                                  if (completedCount >= total) {
                                    const allCompleted = {};
                                    for (let j = 0; j < total; j++) allCompleted[j] = true;
                                    updated[course._id] = allCompleted;
                                  }
                                  return updated;
                                });
                                if (i === courseUnlockedIndex && i < course.videos.length - 1) {
                                  setUnlockedVideosMap(prev => ({
                                    ...prev,
                                    [course._id]: i + 1
                                  }));
                                }
                              }}
                            />
                            <div className={`video-status ${isCompleted ? "completed" : "pending"}`}>
                              {isCompleted ? "✅ Completed" : "⏳ Pending"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                  
                  {allVideosWatched(course) && renderAssignmentsAndQuizzes()}
                  
                 
{selectedCourse?.completed && allVideosWatched(course) && (
  <div className="course-completion glossy-complete">
    <h3>🎉 Course Completed!</h3>
    <p>Congratulations! You've completed {course.title}</p>
    <button
      className="btn btn-success glossy-btn"
      onClick={() => generateCertificate(course)}
    >
      📄 Download Certificate
    </button>

    {/* ADD BACK THE FEEDBACK FORM */}
    {!showFeedback ? (
      <div className="feedback-prompt">
        <p>📝 Would you like to provide feedback for this course?</p>
        <button
          className="btn btn-primary glossy-btn"
          onClick={() => setShowFeedback(true)}
        >
          💬 Provide Feedback
        </button>
      </div>
    ) : (
      <div className="feedback-modal">
        <h4>🌟 Course Feedback</h4>
        <p>How would you rate "{course.title}"?</p>
        
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: rating >= star ? "gold" : "gray",
                fontSize: "32px",
                margin: "0 5px"
              }}
            >
              ★
            </span>
          ))}
        </div>
        
        <textarea
          placeholder="Share your experience with this course..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="feedback-textarea"
          rows="4"
        />
        
        <div className="feedback-actions">
          <button 
            className="btn btn-success"
            onClick={handleSubmitFeedback}
            disabled={!rating}
          >
            Submit Feedback
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setShowFeedback(false);
              setRating(0);
              setComment("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

  // ✅ UPDATED: Available Courses with enrollment status
const renderAvailableCourses = () => (
  <div className="user-courses-container">
    <h2>Available Courses</h2>
    <div className="courses-grid">
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        courses.map((course) => {
          const isPending = pendingEnrollments.some(e => e.courseId === course._id);
          const isApproved = approvedCourses.includes(course._id);
          
          let buttonText = "Enroll Now";
          let buttonDisabled = false;
          let statusMessage = "";
          
          if (isApproved) {
            buttonText = "Already Enrolled";
            buttonDisabled = true;
            statusMessage = "✅ Approved";
            
          } else if (isPending) {
            buttonText = "⏳ Pending Approval";
            buttonDisabled = true;
            statusMessage = "Waiting for admin approval";
          }

          return (
            <div key={course._id} className="course-card-shadow-card">
              <img
                src={course.image || "https://via.placeholder.com/300x180"}
                alt={course.title}
              />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Fees:</strong> ₹{course.fees || "Not specified"}</p>
              
              {statusMessage && (
                <div className={`enrollment-status ${isPending ? "pending" : "approved"}`}>
                  {statusMessage}
                </div>
              )}
              
              <button 
                className={`btn btn-small ${buttonDisabled ? "btn-disabled" : "btn-primary"}`} 
                onClick={() => openEnrollForm(course)} 
                disabled={buttonDisabled}
              >
                {buttonText}
              </button>
            </div>
          );
        })
      )}
    </div>
  </div>
);


 const renderFeedback = () => (
  <div className="feedback-section shadow-card">
    <h3 className="feedback-title">💬 My Feedback</h3>

    {userFeedback.length === 0 ? (
      <p className="no-feedback">You haven't submitted any feedback yet.</p>
    ) : (
      <div className="feedback-grid">
        {userFeedback.map((f) => (
          <div key={f._id} className="feedback-card">
            <div className="feedback-header">
              <div className="course-avatar">
                {f.courseId?.title?.charAt(0) || "C"}
              </div>
              <h4 className="course-name">{f.courseId?.title || "Unknown Course"}</h4>
            </div>

            <div className="feedback-rating">
              {"⭐".repeat(f.rating || 0) + "☆".repeat(5 - (f.rating || 0))}
            </div>

            <p className="feedback-comment">{f.comment || "No comment provided."}</p>

            <small className="feedback-date">
              {new Date(f.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    )}
  </div>
);


const totalCourses = enrolledCourses.length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.submitted || a.status === "completed").length;
  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzes.filter(q => q.submitted || q.status === "completed").length;

  const totalCompletedCourses = enrolledCourses.filter(courseId => {
    const course = courses.find(c => c._id === courseId);
    return course && isCourseCompleted(course);
  }).length;

  const cprogress = totalCourses === 0 ? 0 : (certificateCount / totalCourses) * 100;


  <div className="my-courses-container">
  {renderMyCourses()}

  {/* Certificate Section */}
  {selectedCourse?.completed && (
    <div className="global-certificate-section">
      <h2>🎉 Certificate Available!</h2>
      <p>You can download your certificate for: {selectedCourse.title}</p>
      <button className="btn btn-success" onClick={generateCertificate}>
        📄 Download Certificate
      </button>
    </div>
  )}
</div>


const [certificates, setCertificates] = useState([]);

  useEffect(() => {
  const allCerts = JSON.parse(localStorage.getItem("certificates") || "[]");

  // Only show certificates for this user
  const userCerts = allCerts.filter(cert => cert.studentId === user?._id);
  setCertificates(userCerts);
}, [user]);

  const renderProfile = () => (
  <div className="user-profile-card">
    
    {/* Profile Settings Section */}
    <section className="user-account-settings">
      <h3>⚙️ Account Settings</h3>
      <ProfileSettings user={user} setUser={setUser} />
    </section>
   <div className="certificate-page">
      <h1 className="certificate-title"> My Certificates Gallery</h1>

      {certificates.length === 0 ? (
        <p className="no-certificates">You haven’t earned any certificates yet.</p>
      ) : (
        <div className="certificate-gallery">
          {certificates.map((cert, index) => (
            <div key={index} className="certificate-card">
              <iframe
                src={cert.certificateData}
                title={cert.courseTitle}
                className="certificate-iframe"
              ></iframe>
              <h3 className="certificate-course-title">{cert.courseTitle}</h3>
            </div>
          ))}
        </div>
      )}
    </div>


    
        {/* Feedback */}
        <section className="feedback-section">
          <div className="feedback-section shadow-card">
    <h3 className="feedback-title">💬 My Feedback</h3>

    {userFeedback.length === 0 ? (
      <p className="no-feedback">You haven't submitted any feedback yet.</p>
    ) : (
      <div className="feedback-grid">
        {userFeedback.map((f) => (
          <div key={f._id} className="feedback-card">
            <div className="feedback-header">
              <div className="course-avatar">
                {f.courseId?.title?.charAt(0) || "C"}
              </div>
              <h4 className="course-name">{f.courseId?.title || "Unknown Course"}</h4>
            </div>

            <div className="feedback-rating">
              {"⭐".repeat(f.rating || 0) + "☆".repeat(5 - (f.rating || 0))}
            </div>

            <p className="feedback-comment">{f.comment || "No comment provided."}</p>

            <small className="feedback-date">
              {new Date(f.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    )}
  </div>
        </section>

      </div>
  
);




 const renderDashboard = () => {
  const totalCourses = enrolledCourses.length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.submitted || a.status === "completed").length;
  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzes.filter(q => q.submitted || q.status === "completed").length;

  const totalCompletedCourses = enrolledCourses.filter(courseId => {
    const course = courses.find(c => c._id === courseId);
    return course && isCourseCompleted(course);
  }).length;

  const cprogress = totalCourses === 0 ? 0 : (certificateCount / totalCourses) * 100;

  const overallProgress =
    totalCourses === 0
      ? 0
      : Math.round(
          (enrolledCourses.reduce((sum, id) => {
            const course = courses.find(c => c._id === id);
            return sum + calculateCourseProgress(course);
          }, 0) / totalCourses)
        );

  // Chart data for quick visual overview
  const progressChartData = [
    { name: "Assignments Completed", value: progress.assignmentsCompleted },
    { name: "Quizzes Completed", value: progress.quizzesCompleted },
  ];

  return (
    <div className="dashboard-containers">
      <h2 className="dashboard-title">Welcome back, {user?.name}! 👋</h2>

      {/* 📊 Stats Overview */}
      <div className="stats-grids">
        <div className="stat-card shadow-card">
          <FaGraduationCap className="stat-icon" />
          <div>
            
            <h3>{totalCourses}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>

        <div className="stat-card shadow-card">
          <FaBook className="stat-icon" />
          <div>
             <h3>{progress.assignmentsCompleted}</h3>
             <p>Assignments Completed</p>
            
          </div>
        </div>

        <div className="stat-card shadow-card">
  <FaCog className="stat-icon" />
  <div>
    <h3>{progress.quizzesCompleted}</h3>
    <p>Quizzes Completed</p>
  </div>
</div>

        <div className="stat-card shadow-card">
  <FaCog className="stat-icon" />
  <div>
    <h3>{certificateCount}</h3>
    <p>Certificates Earned</p>
  </div>
</div>
      </div>

      {/* 📈 Overall Progress */}
      <div className="progress-section shadow-card">
        <h3>📈 Overall Learning Progress</h3>
        <div className="o-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${cprogress}%` }}
            ></div>
          </div>
          <p>{cprogress}% Overall Course Progress</p>
        </div>
      </div>

      

      {/* 🥇 Achievements */}
      <div className="achievement-section shadow-card">
        <h3>🏅 Achievements</h3>
        <div className="achievement-grid">
          {cprogress > 75 && <div className="achievement-badge">🎯 Consistent Performer</div>}
          {certificateCount > 0 && <div className="achievement-badge">🏆 Course Finisher</div>}
          {progress.assignmentsCompleted >= 5 && <div className="achievement-badge">📘 Assignment Master</div>}
          {progress.quizzesCompleted > 3 && <div className="achievement-badge">🧠 Quiz Champion</div>}
        </div>
      </div>

      {/* 🕒 Recent Activity */}
      <div className="recent-activity shadow-card">
        <h3>🕒 Recent Activity</h3>
        <ul>
          {progress.assignmentsCompleted > 0 && <li>✅ Completed {progress.assignmentsCompleted} assignment(s)</li>}
          {progress.quizzesCompleted > 0 && <li>🧩 Completed {progress.quizzesCompleted} quiz(zes)</li>}
          {certificateCount > 0 && <li>🏅 Earned {certificateCount} certificate(s)</li>}
          <li>📚 Enrolled in {totalCourses} courses</li>
        </ul>
      </div>

      {/* Optional Analytics Chart */}
      <div className="chart-section shadow-card">
        <h3>📊 Progress Distribution</h3>
        <div className="chart-section shadow-card">
  <h3>📊 Progress Overview (Bar Chart)</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={progressChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#4f46e5" />
    </BarChart>
  </ResponsiveContainer>
</div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={progressChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              nameKey="name"
            >
              {progressChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        

      </div>
      
    </div>
  );
};
const [selectedPaymentCourse, setSelectedPaymentCourse] = useState(null); // ✅ add this


  // ------------------------
  // Render JSX
  // ------------------------
  return (
    <div className="user-dashboard-containers">
      {/* Sidebar */}
<div className="sidebars">
  <div className="sidebar-user">
  <div className="course-avatar">
    {user?.profilePic ? (
      <img src={user.profilePic} alt="avatar" className="w-10 h-10 rounded-full" />
    ) : (
      user?.name?.charAt(0) || "C"
    )}
  </div>
  <span className="user-name-sidebar">{user?.name || "Guest"}</span>
</div>


  {/* All menu items except profile */}
  <ul className="sidebar-menu top-menu">
    <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
      <FaHome className="menu-icon" /> Dashboard
    </li>
    <li className={activeTab === "available" ? "active" : ""} onClick={() => setActiveTab("available")}>
      <FaBookOpen className="menu-icon" /> Available Courses
    </li>
    <li className={activeTab === "myCourses" ? "active" : ""} onClick={() => setActiveTab("myCourses")}>
      <FaGraduationCap className="menu-icon" /> My Courses
    </li>
    <li className={activeTab === "feedback" ? "active" : ""} onClick={() => setActiveTab("feedback")}>
      <FaCommentDots className="menu-icon" /> Your Feedback
    </li>
    <li className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>
      <FaBullhorn className="menu-icon" /> Recent activities
    </li>
    <li className={activeTab === "progress" ? "active" : ""} onClick={() => setActiveTab("progress")}>
      <FaChartLine className="menu-icon" /> Your Progress
    </li>
    <li className={activeTab === "payment" ? "active" : ""} onClick={() => setActiveTab("payment")}>
      <FaCreditCard className="menu-icon" /> Payment History
    </li>
  </ul>

  {/* Profile menu item at bottom */}
  <ul className="sidebar-menu bottom-menu">
    <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
      <FaCog className="menu-icon" /> Profile
    </li>
  </ul>
</div>



      {/* Main Content */}
      <div className="main-contents">
        {loading ? <p>Loading...</p> :
          activeTab === "dashboard" ? renderDashboard() :
          activeTab === "available" ? renderAvailableCourses() :
          activeTab === "myCourses" ? renderMyCourses() :
          activeTab === "profile" ? renderProfile() :
          activeTab==="feedback" ?renderFeedback():
          
         activeTab === "payment" ? (
  <div className="payment-container shadow-card">
    <h2 className="payment-header">💳 Payment History</h2>
    <p className="payment-subtitle">
      Here you can view your payment history or pay for your enrolled courses.
    </p>

    {/* Enrolled Courses */}
    <div className="payment-courses-grid">
      {courses.map((course) => {
        const isEnrolled = enrolledCourses.includes(course._id);
        return isEnrolled ? (
          <div key={course._id} className="payment-course-card shadow-card">
            <div className="course-card-header">
              <h3 className="course-title">{course.title}</h3>
              <span className={`course-status ${isEnrolled ? "paid" : "not-paid"}`}>
                {isEnrolled ? "✅ Paid" : "❌ Not Paid"}
              </span>
            </div>

            <div className="course-card-body">
              <p className="course-fees"><strong>Fees:</strong> ₹{course.fees || "Not specified"}</p>

              <button
                className="btn btn-small btn-payment"
                onClick={() => setSelectedPaymentCourse(course)}
              >
                View Details / {isEnrolled ? "Receipt" : "Pay"}
              </button>
            </div>
          </div>
        ) : null;
      })}
    </div>

    {/* Payment Details Modal */}
    {selectedPaymentCourse && (
      <div className="payment-modal-overlay">
        <div className="payment-modal shadow-card">
          <h3>{selectedPaymentCourse.title} 💳 Payment Details</h3>
          <p><strong>Course Fees:</strong> ₹{selectedPaymentCourse.fees || "Not specified"}</p>
          <p><strong>Status:</strong> {enrolledCourses.includes(selectedPaymentCourse._id) ? "✅ Paid" : "❌ Not Paid"}</p>

          {/* Action buttons */}
          <div className="modal-actions" style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            {enrolledCourses.includes(selectedPaymentCourse._id) ? (
              <button
                className="btn btn-success"
                onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text("Payment Receipt", 20, 20);
                  doc.setFontSize(12);
                  doc.text(`Course: ${selectedPaymentCourse.title}`, 20, 40);
                  doc.text(`Fees Paid: ₹${selectedPaymentCourse.fees}`, 20, 50);
                  doc.text(`Status: Paid`, 20, 60);
                  doc.text(`Student: ${user.name}`, 20, 80);
                  doc.save(`${selectedPaymentCourse.title}_receipt.pdf`);
                }}
              >
                📄 Download Receipt
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => window.alert("Redirect to payment flow")}
              >
                💳 Pay Now
              </button>
            )}

            <button
              className="btn btn-cancel"
              onClick={() => setSelectedPaymentCourse(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
):
activeTab === "progress" ? (
  <div className="progress-tracker-container">
    <h2>📊 Course Progress Tracker</h2>
    
    <div className="progress-cards-grid">
      {enrolledCourses.map(courseId => {
        const course = courses.find(c => c._id === courseId);
        if (!course) return null;
        
        const progress = calculateCourseProgress(course);
        const completedVideos = Object.keys(completedVideosMap[courseId] || {}).length;
        const totalVideos = course.videos?.length || 0;
        const pendingAssignments = course.assignments?.filter(a => !a.submitted).length || 0;
        const pendingQuizzes = course.quizzes?.filter(q => !q.submitted).length || 0;

        return (
          <div key={courseId} className="progress-tracker-card shadow-card">
            <div className="progress-header">
              <h3>{course.title}</h3>
              
            </div>
            
            <div className="progress-metrics">
              <div className="metric">
                <span>🎥 Videos:</span>
                <span>{completedVideos}/{totalVideos}</span>
              </div>
              <div className="metric">
                <span>📝 Assignments:</span>
                <span>{pendingAssignments} pending</span>
              </div>
              <div className="metric">
                <span>🧩 Quizzes:</span>
                <span>{pendingQuizzes} pending</span>
              </div>
            </div>

            {progress < 100 && (
              <button 
                className="btn btn-small btn-primary"
                onClick={() => {
                  setActiveTab("myCourses");
                  setTimeout(() => handleSelectCourse(courseId), 100);
                }}
              >
                Continue Learning
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
) :


        activeTab === "activity" ? (
  <div className="activity-feed-container">
    <h2>🕒 Recent Activity</h2>
    
    <div className="activity-timeline">
      {/* Combine all user activities */}
      {[
        // Certificate achievements
        ...certificates.map(cert => ({
          type: 'certificate',
          title: `Earned certificate for ${cert.courseTitle}`,
          timestamp: new Date(),
          icon: '🏆'
        })),

        // Assignment submissions
        ...assignments.filter(a => a.submitted).map(assignment => ({
          type: 'assignment',
          title: `Submitted assignment: ${assignment.title}`,
          timestamp: assignment.submittedAt || new Date(),
          icon: '📝'
        })),

        // Quiz completions
        ...quizzes.filter(q => q.submitted).map(quiz => ({
          type: 'quiz',
          title: `Completed quiz: ${quiz.title}`,
          score: quiz.score,
          timestamp: quiz.submittedAt || new Date(),
          icon: '🧩'
        })),

        // Course enrollments
        ...approvedCourses.map(courseId => {
          const course = courses.find(c => c._id === courseId);
          return course ? {
            type: 'enrollment',
            title: `Enrolled in: ${course.title}`,
            timestamp: new Date(), // You might want to store actual enrollment date
            icon: '🎓'
          } : null;
        }).filter(Boolean)

      ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map((activity, index) => (
        <div key={index} className="activity-item">
          <div className="activity-icon">{activity.icon}</div>
          <div className="activity-content">
            <p className="activity-title">{activity.title}</p>
            {activity.score && (
              <span className="activity-score">Score: {activity.score}</span>
            )}
            <span className="activity-time">
              {new Date(activity.timestamp).toLocaleDateString()} • {new Date(activity.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
) :null
        }
      </div>

      {/* Quiz Modal */}
      {quizModal && (
        <div className="custom-quiz-modal-overlay" onClick={() => setQuizModal(null)}>
          <div className="custom-quiz-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{quizModal.title}</h2>
            {quizModal.questions.map((q, i) => (
              <div key={i} className="quiz-question">
                <p>{q.question}</p>
                {q.options.map((opt, j) => (
                  <label key={j}>
                    <input type="radio" name={`q-${i}`} value={opt} onChange={() => handleQuizAnswer(i, opt)} /> {opt}
                  </label>
                ))}
              </div>
            ))}
            <button className="btn-quiz-submit" onClick={submitQuiz}>Submit Quiz</button>
          </div>
        </div>
      )}

      {showEnrollModal && enrollFormCourse && (
  <div className="custom-enroll-modal-overlay" onClick={closeEnrollModal}>
    <div className="custom-enroll-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={closeEnrollModal}>×</button>
      <h2>Enroll in {enrollFormCourse.title}</h2>

      <form onSubmit={handleEnrollSubmit}>
        <p><strong>Description:</strong> {enrollFormCourse.description}</p>
        <p><strong>Duration:</strong> {enrollFormCourse.duration}</p>
        <p><strong>Fees:</strong> ₹{enrollFormCourse.fees || "Not specified"}</p>

        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={enrollFormData.fullName}
            onChange={handleEnrollChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={enrollFormData.email}
            onChange={handleEnrollChange}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={enrollFormData.phone}
            onChange={handleEnrollChange}
            required
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="agree"
            checked={enrollFormData.agree}
            onChange={handleEnrollChange}
          />
          I agree to the terms
        </label>

        {/* Payment Section */}
        <div style={{ marginTop: "10px" }}>
          <p><strong>Payment Status:</strong> {enrollFormData.paid ? "✅ Paid" : "❌ Not Paid"}</p>

          {!enrollFormData.paid && (
            <button
              type="button"
              className="btn-pay-now"
              onClick={() => {
                window.open("https://razorpay.me/@deeksha6039", "_blank");
                setEnrollFormData((prev) => ({ ...prev, paid: true }));
              }}
            >
              💳 Pay Now
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn-enroll-submit"
          disabled={!enrollFormData.paid}
        >
          Submit Enrollment
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
