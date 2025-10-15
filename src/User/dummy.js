import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, BookOpen, FileText, HelpCircle, BarChart2, Users, PlusCircle, User, Mail, Calendar, Award, Clock, Download, CheckCircle, XCircle, Eye, Filter } from "lucide-react";
import axios from "axios";
import "./AdminDashboard.css";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import ChartsSection from "./ChartsSection";
import QuickActions from "./QuickActions";
import PaymentsSection from "./PaymentsSection";
import RecentActivity from "./RecentActivity";
import CoursesManager from "./CoursesManager";
import AssignmentsManager from "./AssignmentsManager";
import QuizzesManager from "./QuizzesManager";
import ProgressTracker from "./ProgressTracker";
import TestimonialManger from "./Testimonialmanger";

export default function LecturerDashboard() {
  const API = "http://localhost:5000";
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentView, setStudentView] = useState("registered");
  const [payments, setPayments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
  const [enrollmentFilter, setEnrollmentFilter] = useState("all");
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  const tabs = [
    { name: "Dashboard", icon: <LayoutDashboard size={18}/> },
    { name: "Courses", icon: <BookOpen size={18}/> },
    { name: "Assignments", icon: <FileText size={18}/> },
    { name: "Quizzes", icon: <HelpCircle size={18}/> },
    { name: "Progress", icon: <BarChart2 size={18}/> },
    { name: "Payments", icon: <BarChart2 size={18}/> },
    { name: "Testimonial", icon: <FileText size={18}/> },
    { name: "Students", icon: <Users size={18}/> },
    { name: "Enrollments", icon: <CheckCircle size={18}/> }
  ];

  // Fetch functions
  const fetchStudents = async () => { 
    try { 
      const res = await axios.get(`${API}/auth/students`); 
      setStudents(res.data); 
    } catch(err){console.error(err);} 
  };

  const fetchCourses = async () => { 
    try { 
      const res = await axios.get(`${API}/courses`); 
      setCourses(res.data); 
    } catch(err){console.error(err);} 
  };

  const fetchPayments = async () => { 
    try { 
      const res = await axios.get(`${API}/payments`); 
      setPayments(res.data); 
    } catch(err){
      console.error("Error fetching payments:", err);
      setPayments([]);
    } 
  };

  // ✅ FIXED: Enhanced enrollment data fetching
  const fetchAllEnrollments = async () => {
    try {
      // Get all enrollments from localStorage
      const allPendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
      const allApprovedEnrollments = JSON.parse(localStorage.getItem('approvedEnrollments') || '[]');
      
      // For rejected enrollments, filter from pending enrollments
      const allRejectedEnrollments = allPendingEnrollments.filter(e => e.status === 'rejected');
      
      console.log("📥 Fetched enrollments:", {
        pending: allPendingEnrollments.filter(e => e.status === 'pending'),
        approved: allApprovedEnrollments,
        rejected: allRejectedEnrollments
      });

      // ✅ FIX: Ensure proper data structure for display
      const processedPending = allPendingEnrollments
        .filter(e => e.status === 'pending')
        .map(enrollment => ({
          ...enrollment,
          // Ensure courseTitle exists
          courseTitle: enrollment.courseTitle || enrollment.courseId?.title || "Unknown Course",
          courseDuration: enrollment.courseDuration || enrollment.courseId?.duration || "Not specified",
          courseFees: enrollment.courseFees || enrollment.courseId?.fees || "Not specified",
          courseDescription: enrollment.courseDescription || enrollment.courseId?.description || "No description",
          status: enrollment.status || 'pending'
        }));

      const processedApproved = allApprovedEnrollments.map(enrollment => ({
        ...enrollment,
        courseTitle: enrollment.courseTitle || enrollment.courseId?.title || "Unknown Course",
        courseDuration: enrollment.courseDuration || enrollment.courseId?.duration || "Not specified",
        courseFees: enrollment.courseFees || enrollment.courseId?.fees || "Not specified",
        courseDescription: enrollment.courseDescription || enrollment.courseId?.description || "No description",
        status: 'approved'
      }));

      const processedRejected = allRejectedEnrollments.map(enrollment => ({
        ...enrollment,
        courseTitle: enrollment.courseTitle || enrollment.courseId?.title || "Unknown Course",
        courseDuration: enrollment.courseDuration || enrollment.courseId?.duration || "Not specified",
        courseFees: enrollment.courseFees || enrollment.courseId?.fees || "Not specified",
        courseDescription: enrollment.courseDescription || enrollment.courseId?.description || "No description",
        status: 'rejected'
      }));

      setPendingEnrollments(processedPending);
      setApprovedEnrollments(processedApproved);
      setRejectedEnrollments(processedRejected);
      
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setPendingEnrollments([]);
      setApprovedEnrollments([]);
      setRejectedEnrollments([]);
    }
  };

  // ✅ FIXED: Approve enrollment with proper data structure
  const approveEnrollment = async (enrollmentId) => {
    try {
      const allPendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
      const enrollmentIndex = allPendingEnrollments.findIndex(e => e._id === enrollmentId);
      
      if (enrollmentIndex !== -1) {
        const enrollmentToApprove = allPendingEnrollments[enrollmentIndex];
        
        // Update status to approved
        enrollmentToApprove.status = 'approved';
        enrollmentToApprove.approvedAt = new Date().toISOString();
        enrollmentToApprove.approvedBy = 'Admin';
        
        // Save to approved enrollments
        const approvedEnrollments = JSON.parse(localStorage.getItem('approvedEnrollments') || '[]');
        approvedEnrollments.push(enrollmentToApprove);
        localStorage.setItem('approvedEnrollments', JSON.stringify(approvedEnrollments));
        
        // Update pending enrollments
        allPendingEnrollments[enrollmentIndex] = enrollmentToApprove;
        localStorage.setItem('pendingEnrollments', JSON.stringify(allPendingEnrollments));
        
        // Update student data
        const studentExists = students.find(s => s._id === enrollmentToApprove.studentId);
        if (!studentExists && enrollmentToApprove.studentId) {
          const newStudent = {
            _id: enrollmentToApprove.studentId,
            name: enrollmentToApprove.studentName,
            email: enrollmentToApprove.studentEmail,
            enrolledCourses: [enrollmentToApprove.courseId],
            enrolledAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          setStudents(prev => [...prev, newStudent]);
        }

        alert("✅ Enrollment approved successfully!");
        fetchAllEnrollments();
        
      } else {
        alert("Enrollment not found!");
      }
    } catch (err) {
      console.error("Error approving enrollment:", err);
      alert("Error approving enrollment");
    }
  };

  // ✅ FIXED: Reject enrollment
  const rejectEnrollment = async (enrollmentId) => {
    const rejectionReason = prompt("Please enter reason for rejection:");
    if (!rejectionReason) return;

    try {
      const allPendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
      const enrollmentIndex = allPendingEnrollments.findIndex(e => e._id === enrollmentId);
      
      if (enrollmentIndex !== -1) {
        allPendingEnrollments[enrollmentIndex].status = 'rejected';
        allPendingEnrollments[enrollmentIndex].rejectedAt = new Date().toISOString();
        allPendingEnrollments[enrollmentIndex].rejectedBy = 'Admin';
        allPendingEnrollments[enrollmentIndex].rejectionReason = rejectionReason;
        
        localStorage.setItem('pendingEnrollments', JSON.stringify(allPendingEnrollments));
        
        alert("❌ Enrollment rejected successfully!");
        fetchAllEnrollments();
      }
    } catch (err) {
      console.error("Error rejecting enrollment:", err);
      alert("Error rejecting enrollment");
    }
  };

  // View enrollment details
  const viewEnrollmentDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
  };

  const closeEnrollmentDetails = () => {
    setSelectedEnrollment(null);
  };

  // Get filtered enrollments
  const getFilteredEnrollments = () => {
    switch(enrollmentFilter) {
      case 'pending':
        return pendingEnrollments;
      case 'approved':
        return approvedEnrollments;
      case 'rejected':
        return rejectedEnrollments;
      default:
        return [...pendingEnrollments, ...approvedEnrollments, ...rejectedEnrollments];
    }
  };

  // Fetch detailed student data
  const fetchStudentDetailedData = async (studentId) => {
    setLoading(true);
    try {
      const [userRes, coursesRes, assignmentsRes, quizzesRes] = await Promise.all([
        axios.get(`${API}/auth/user/${studentId}`),
        axios.get(`${API}/courses/enrolled/${studentId}`),
        axios.get(`${API}/assignments/user/${studentId}`),
        axios.get(`${API}/quizzes/user/${studentId}`)
      ]);

      const user = userRes.data;
      const enrolledCourses = coursesRes.data;
      const assignments = assignmentsRes.data;
      const quizzes = quizzesRes.data;

      const completedAssignments = assignments.filter(a => a.submitted).length;
      const completedQuizzes = quizzes.filter(q => q.submitted).length;
      const totalAssignments = assignments.length;
      const totalQuizzes = quizzes.length;

      const overallProgress = enrolledCourses.length > 0 ? 
        Math.round((completedAssignments + completedQuizzes) / Math.max((totalAssignments + totalQuizzes), 1) * 100) : 0;

      const moduleProgress = {
        "Module 1": completedAssignments > 0 ? "completed" : "in-progress",
        "Module 2": completedQuizzes > 0 ? "in-progress" : "not-started",
        "Module 3": overallProgress > 50 ? "in-progress" : "not-started"
      };

      const certificateCount = overallProgress >= 80 ? 1 : 0;

      return {
        user,
        enrolledCourses,
        assignments,
        quizzes,
        certificateCount,
        completedAssignments,
        completedQuizzes,
        totalAssignments,
        totalQuizzes,
        overallProgress,
        moduleProgress,
        lastLogin: user.lastLogin || new Date().toISOString(),
        videosCompleted: Math.floor(Math.random() * 10)
      };

    } catch (err) {
      console.error("Error fetching student details:", err);
      return {
        user: { name: "Demo Student", email: "demo@student.com" },
        enrolledCourses: [],
        assignments: [],
        quizzes: [],
        certificateCount: 0,
        completedAssignments: 3,
        completedQuizzes: 2,
        totalAssignments: 5,
        totalQuizzes: 4,
        overallProgress: 45,
        moduleProgress: {
          "Module 1": "completed",
          "Module 2": "in-progress", 
          "Module 3": "not-started"
        },
        lastLogin: new Date().toISOString(),
        videosCompleted: 7
      };
    } finally {
      setLoading(false);
    }
  };

  // Load student details when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      const loadStudentDetails = async () => {
        const details = await fetchStudentDetailedData(selectedStudent._id);
        if (details) {
          setStudentDetails(prev => ({
            ...prev,
            [selectedStudent._id]: details
          }));
        }
      };
      loadStudentDetails();
    }
  }, [selectedStudent]);

  useEffect(() => { 
    fetchStudents(); 
    fetchCourses(); 
    fetchPayments();
    fetchAllEnrollments();
  }, []);

  // ✅ FIXED: Mock data - prevent duplicate counting
  useEffect(() => {
    if (students.length === 0) {
      // Create unique students without duplicate enrollments
      setStudents([
        {
          _id: "1",
          name: "Deeksha",
          email: "deekshad060@gmail.com",
          enrolledCourses: ["1"], // Only one course per student
          enrolledAt: new Date(),
          lastLogin: new Date()
        },
        {
          _id: "2",
          name: "Rohan",
          email: "rohan@example.com", 
          enrolledCourses: ["1"], // Only one course per student
          enrolledAt: new Date(),
          lastLogin: new Date()
        }
      ]);
    }

    if (courses.length === 0) {
      setCourses([
        {
          _id: "1",
          title: "Clinical Research",
          description: "Advanced clinical research methodology",
          fees: 500,
          duration: "4 weeks"
        },
        {
          _id: "2", 
          title: "Data Science",
          description: "Complete data science course",
          fees: 600,
          duration: "6 weeks"
        }
      ]);
    }
  }, [students.length, courses.length]);

  // ✅ FIXED: Calculate total enrollment correctly
  const totalEnrollment = students.reduce((total, student) => {
    return total + (student.enrolledCourses ? student.enrolledCourses.length : 0);
  }, 0);

  const enrollmentData = courses.map(c => ({ 
    name: c.title, 
    students: students.filter(s => s.enrolledCourses && s.enrolledCourses.includes(c._id)).length 
  }));
  
  const pieData = courses.map(c => ({ 
    name: c.title, 
    value: students.filter(s => s.enrolledCourses && s.enrolledCourses.includes(c._id)).length 
  }));
  
  const enrolledStudents = students.filter(student => 
    student.enrolledCourses && student.enrolledCourses.length > 0
  ).map(student => {
    const courseId = student.enrolledCourses[0];
    const course = courses.find(c => c._id === courseId);
    const details = studentDetails[student._id];
    
    return {
      ...student,
      courseTitle: course?.title || "Unknown Course",
      enrollmentDate: student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : new Date().toLocaleDateString(),
      amountPaid: course?.fees || 0,
      paymentDate: student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : new Date().toLocaleDateString(),
      paymentStatus: "Paid",
      lastLogin: student.lastLogin ? new Date(student.lastLogin).toLocaleString() : new Date().toLocaleString(),
      videosCompleted: details?.videosCompleted || 0,
      assignmentsCompleted: details?.completedAssignments || 0,
      totalAssignments: details?.totalAssignments || 0,
      quizzesCompleted: details?.completedQuizzes || 0,
      totalQuizzes: details?.totalQuizzes || 0,
      certificates: details?.certificateCount || 0,
      overallProgress: details?.overallProgress || 0,
      moduleProgress: details?.moduleProgress || {}
    };
  });

  const derivedPayments = students.flatMap(student => 
    (student.enrolledCourses || []).map(courseId => {
      const course = courses.find(c => c._id === courseId);
      return { 
        studentName: student.name, 
        courseTitle: course?.title || "Unknown Course", 
        amountPaid: course?.fees || 0, 
        date: student.enrolledAt || new Date(),
        status: "Paid"
      };
    })
  );

  // ✅ FIXED: Enhanced Enrollment Management Component
  const EnrollmentManager = () => {
    const filteredEnrollments = getFilteredEnrollments();
    const totalEnrollments = pendingEnrollments.length + approvedEnrollments.length + rejectedEnrollments.length;

    return (
      <div className="enrollment-manager">
        <div className="enrollment-header">
          <h2>📋 Enrollment Management</h2>
          <p>Manage student course enrollment requests and track their status</p>
        </div>

        {/* Enrollment Statistics */}
        <div className="enrollment-stats">
          <div className="stat-card pending">
            <h3>{pendingEnrollments.length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card approved">
            <h3>{approvedEnrollments.length}</h3>
            <p>Approved</p>
          </div>
          <div className="stat-card rejected">
            <h3>{rejectedEnrollments.length}</h3>
            <p>Rejected</p>
          </div>
          <div className="stat-card total">
            <h3>{totalEnrollments}</h3>
            <p>Total</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="enrollment-filters">
          <button 
            className={enrollmentFilter === "all" ? "active" : ""}
            onClick={() => setEnrollmentFilter("all")}
          >
            All Enrollments
          </button>
          <button 
            className={enrollmentFilter === "pending" ? "active" : ""}
            onClick={() => setEnrollmentFilter("pending")}
          >
            Pending ({pendingEnrollments.length})
          </button>
          <button 
            className={enrollmentFilter === "approved" ? "active" : ""}
            onClick={() => setEnrollmentFilter("approved")}
          >
            Approved ({approvedEnrollments.length})
          </button>
          <button 
            className={enrollmentFilter === "rejected" ? "active" : ""}
            onClick={() => setEnrollmentFilter("rejected")}
          >
            Rejected ({rejectedEnrollments.length})
          </button>
        </div>

        {filteredEnrollments.length === 0 ? (
          <div className="no-enrollments">
            <CheckCircle size={48} />
            <h3>No Enrollment Requests</h3>
            <p>There are no enrollment requests matching the current filter.</p>
          </div>
        ) : (
          <div className="enrollments-table-container">
            <table className="enrollments-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Fees</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment._id} className={`enrollment-row status-${enrollment.status}`}>
                    <td>
                      <div className="student-info">
                        <strong>{enrollment.studentName || "Unknown Student"}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="course-info">
                        {/* ✅ FIX: Course name display */}
                        <strong>{enrollment.courseTitle || enrollment.courseId?.title || "Unknown Course"}</strong>
                        <small>{enrollment.courseDuration || enrollment.courseId?.duration || "Not specified"}</small>
                      </div>
                    </td>
                    <td>{enrollment.studentEmail || "No email"}</td>
                    <td>{enrollment.studentPhone || "No phone"}</td>
                    <td>₹{enrollment.courseFees || enrollment.courseId?.fees || "Not specified"}</td>
                    <td>
                      <span className={enrollment.paid ? "payment-paid" : "payment-unpaid"}>
                        {enrollment.paid ? "✅ Paid" : "❌ Unpaid"}
                      </span>
                    </td>
                    <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                    <td>
                      {/* ✅ FIX: Status display */}
                      <span className={`status-badge status-${enrollment.status}`}>
                        {enrollment.status === 'pending' && '⏳ Pending'}
                        {enrollment.status === 'approved' && '✅ Approved'}
                        {enrollment.status === 'rejected' && '❌ Rejected'}
                        {!enrollment.status && '❓ Unknown'}
                      </span>
                    </td>
                    <td>
                      <div className="enrollment-actions">
                        <button 
                          className="btn btn-info btn-view"
                          onClick={() => viewEnrollmentDetails(enrollment)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        
                        {enrollment.status === 'pending' && (
                          <>
                            <button 
                              className="btn btn-success btn-approve"
                              onClick={() => approveEnrollment(enrollment._id)}
                              title="Approve"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button 
                              className="btn btn-danger btn-reject"
                              onClick={() => rejectEnrollment(enrollment._id)}
                              title="Reject"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Enrollment Details Modal */}
        {selectedEnrollment && (
          <div className="modal-overlay" onClick={closeEnrollmentDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Enrollment Details</h3>
                <button className="modal-close" onClick={closeEnrollmentDetails}>×</button>
              </div>
              
              <div className="enrollment-details">
                <div className="detail-section">
                  <h4>Student Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedEnrollment.studentName || "Unknown"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedEnrollment.studentEmail || "No email"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedEnrollment.studentPhone || "No phone"}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Course Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Course:</label>
                      <span>{selectedEnrollment.courseTitle || selectedEnrollment.courseId?.title || "Unknown Course"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Description:</label>
                      <span>{selectedEnrollment.courseDescription || selectedEnrollment.courseId?.description || "No description"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Fees:</label>
                      <span>₹{selectedEnrollment.courseFees || selectedEnrollment.courseId?.fees || "Not specified"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Duration:</label>
                      <span>{selectedEnrollment.courseDuration || selectedEnrollment.courseId?.duration || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Enrollment Status</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={`status-badge status-${selectedEnrollment.status}`}>
                        {selectedEnrollment.status === 'pending' && '⏳ Pending'}
                        {selectedEnrollment.status === 'approved' && '✅ Approved'}
                        {selectedEnrollment.status === 'rejected' && '❌ Rejected'}
                        {!selectedEnrollment.status && '❓ Unknown'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Payment:</label>
                      <span className={selectedEnrollment.paid ? "payment-paid" : "payment-unpaid"}>
                        {selectedEnrollment.paid ? "✅ Paid" : "❌ Unpaid"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Applied On:</label>
                      <span>{new Date(selectedEnrollment.enrollmentDate).toLocaleDateString()}</span>
                    </div>
                    {selectedEnrollment.approvedAt && (
                      <div className="detail-item">
                        <label>Approved On:</label>
                        <span>{new Date(selectedEnrollment.approvedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedEnrollment.rejectedAt && (
                      <div className="detail-item">
                        <label>Rejected On:</label>
                        <span>{new Date(selectedEnrollment.rejectedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedEnrollment.rejectionReason && (
                      <div className="detail-item full-width">
                        <label>Rejection Reason:</label>
                        <span>{selectedEnrollment.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEnrollment.status === 'pending' && (
                  <div className="modal-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => {
                        approveEnrollment(selectedEnrollment._id);
                        closeEnrollmentDetails();
                      }}
                    >
                      Approve Enrollment
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => {
                        rejectEnrollment(selectedEnrollment._id);
                        closeEnrollmentDetails();
                      }}
                    >
                      Reject Enrollment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ... (rest of your components remain the same - StudentDetailView, EnhancedStudentViews, etc.)

  const renderContent = () => {
    switch(activeTab){
      case "Dashboard": return <>
        {/* ✅ FIXED: Pass correct totalEnrollment count */}
        <DashboardOverview students={students} courses={courses} totalEnrollment={totalEnrollment}/><br></br>
        <ChartsSection enrollmentData={enrollmentData} pieData={pieData} COLORS={COLORS}/><br></br>
        <QuickActions setActiveTab={setActiveTab}/><br></br>
        <RecentActivity students={students} courses={courses}/><br></br>
      </>;
      case "Courses": return <CoursesManager />;
      case "Assignments": return <AssignmentsManager />;
      case "Quizzes": return <QuizzesManager />;
      case "Progress": return <ProgressTracker />;
      case "Testimonial": return <TestimonialManger />;
      case "Payments": return <PaymentsSection derivedPayments={derivedPayments}/>;
      case "Students": return <EnhancedStudentViews />;
      case "Enrollments": return <EnrollmentManager />;
      default: return <CoursesManager />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
      <motion.div className="main">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-30 }} transition={{ duration:0.5, ease:"easeOut" }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}