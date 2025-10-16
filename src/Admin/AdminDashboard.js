import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, BookOpen, FileText, HelpCircle, BarChart2, Users, PlusCircle, User, Mail, Calendar, Award, Clock, Download, CheckCircle, XCircle, Eye, Filter } from "lucide-react";
import axios from "axios";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,LabelList } from "recharts";
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
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Fees</th>
                  <th>Payment</th>
                  <th>Date</th>
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

  // Helper function to calculate course progress
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
  // ✅ COMBINED StudentDetailView with Real Data + Progress Tracking UI
const StudentDetailView = ({ student }) => {
  if (!student) return (
    <div className="no-student-selected">
      <User size={48} />
      <h3>Select a student to view progress</h3>
      <p>Click on any student from the list to see their progress data</p>
    </div>
  );

  if (loading) return <div className="loading">Loading student progress...</div>;

  const details = studentDetails[student._id];

  // Use real data from student model
  const studentData = student;
  const enrolledCourses = studentData.enrolledCourses || [];
  
  // Get course details for enrolled courses
  const enrolledCoursesWithDetails = enrolledCourses.map(courseId => {
    const course = courses.find(c => c._id === courseId);
    return {
      _id: courseId,
      title: course?.title || "Unknown Course",
      description: course?.description || "No description available",
      fees: course?.fees || 0,
      duration: course?.duration || "Not specified"
    };
  });

  // Calculate basic statistics from real data
  const totalCourses = enrolledCoursesWithDetails.length;
  const enrollmentDate = studentData.enrolledAt ? new Date(studentData.enrolledAt).toLocaleDateString() : "Not specified";
  const lastLogin = studentData.lastLogin ? new Date(studentData.lastLogin).toLocaleString() : "Never";

  // Use progress data from details if available, otherwise use basic data
  const hasProgressData = details && details.totalAssignments !== undefined;
  
  // Prepare chart data (like ProgressTracker)
  const studentChartData = hasProgressData ? [
    {
      name: student.name,
      assignments: details.totalAssignments > 0
        ? Math.round((details.completedAssignments / details.totalAssignments) * 100)
        : 0,
      quizzes: details.totalQuizzes > 0
        ? Math.round((details.completedQuizzes / details.totalQuizzes) * 100)
        : 0
    }
  ] : [
    {
      name: student.name,
      assignments: 0,
      quizzes: 0
    }
  ];

  // Calculate progress percentages
  const assignmentPct = hasProgressData ? 
    (details.totalAssignments > 0 ? Math.round((details.completedAssignments / details.totalAssignments) * 100) : 0) : 0;
  
  const quizPct = hasProgressData ? 
    (details.totalQuizzes > 0 ? Math.round((details.completedQuizzes / details.totalQuizzes) * 100) : 0) : 0;
  
  const overallProgress = Math.round((assignmentPct + quizPct) / 2);

  return (
    <div className="progress-tracker-container">
      <h2 className="page-title">📊 Student Progress Dashboard</h2>

      {/* Student Info Header */}
      <div className="student-info-header card">
        <div className="student-avatar">
          <User size={40} />
        </div>
        <div className="student-details">
          <h3>{student.name}</h3>
          <p>{student.email}</p>
          <p>Student ID: {student._id}</p>
        </div>
      </div>

      {/* --- KPI Summary Grid (Combined Real Data + Progress) --- */}
      <div className="kpi-summary-grid">
        <div className="kpi-box total-enrolled">
          <p>Courses Enrolled</p>
          <div className="kpi-value">{totalCourses}</div>
        </div>
        
        <div className="kpi-box">
          <p>Assignments Tracked</p>
          <div className="kpi-value">{hasProgressData ? details.totalAssignments : 0}</div>
        </div>
        
        <div className="kpi-box">
          <p>Quizzes Tracked</p>
          <div className="kpi-value">{hasProgressData ? details.totalQuizzes : 0}</div>
        </div>

        <div className="kpi-box">
          <p>Overall Progress</p>
          <div className="kpi-value">{overallProgress}%</div>
        </div>
      </div>

      {/* Student Progress Chart (Same as ProgressTracker) */}
      <div className="chart-card card">
        <h3>Student Progress Overview</h3>
        {!hasProgressData ? (
          <p className="no-data">
            No progress tracking data available for this student.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={studentChartData}
              margin={{ top: 40, right: 30, left: 0, bottom: 40 }}
              barGap={-10}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e6ec" />
              <XAxis dataKey="name" stroke="#6c757d" />
              <YAxis unit="%" domain={[0, 100]} stroke="#6c757d" />
              <Tooltip
                cursor={{ fill: 'rgba(0, 123, 255, 0.1)' }}
                contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #ced4da" }}
                labelStyle={{ fontWeight: 'bold', color: '#1a3a5a' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              <Bar dataKey="assignments" fill="#28a745" name="Assignments %" minPointSize={5}>
                <LabelList dataKey="assignments" position="top" formatter={(val) => val + "%"} />
              </Bar>
              
              <Bar dataKey="quizzes" fill="#007bff" name="Quizzes %" minPointSize={5}>
                <LabelList dataKey="quizzes" position="top" formatter={(val) => val + "%"} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detailed Student Progress Table (Same as ProgressTracker) */}
      <div className="student-table card">
        <h3>Detailed Progress Tracking</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Completed</th>
              <th>Total</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Category">Assignments</td>
              <td data-label="Completed">{hasProgressData ? details.completedAssignments : 0}</td>
              <td data-label="Total">{hasProgressData ? details.totalAssignments : 0}</td>
              <td data-label="Progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${assignmentPct}%`, 
                             background: assignmentPct >= 80 
                                ? 'linear-gradient(to right, #28a745, #1e7e34)'
                                : assignmentPct >= 40 
                                ? 'linear-gradient(to right, #ffc107, #d39e00)'
                                : 'linear-gradient(to right, #dc3545, #b82c39)'
                           }}
                  >
                    {assignmentPct}%
                  </div>
                </div>
              </td>
            </tr>
            
            <tr>
              <td data-label="Category">Quizzes</td>
              <td data-label="Completed">{hasProgressData ? details.completedQuizzes : 0}</td>
              <td data-label="Total">{hasProgressData ? details.totalQuizzes : 0}</td>
              <td data-label="Progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${quizPct}%`, 
                             background: quizPct >= 80 
                                ? 'linear-gradient(to right, #28a745, #1e7e34)'
                                : quizPct >= 40 
                                ? 'linear-gradient(to right, #ffc107, #d39e00)'
                                : 'linear-gradient(to right, #dc3545, #b82c39)'
                           }}
                  >
                    {quizPct}%
                  </div>
                </div>
              </td>
            </tr>
            
            <tr>
              <td data-label="Category">Overall Progress</td>
              <td data-label="Completed">-</td>
              <td data-label="Total">-</td>
              <td data-label="Progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${overallProgress}%`, 
                             background: overallProgress >= 80 
                                ? 'linear-gradient(to right, #28a745, #1e7e34)'
                                : overallProgress >= 40 
                                ? 'linear-gradient(to right, #ffc107, #d39e00)'
                                : 'linear-gradient(to right, #dc3545, #b82c39)'
                           }}
                  >
                    {overallProgress}%
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Enrolled Courses Section (Real Data) */}
      {enrolledCoursesWithDetails.length > 0 && (
        <div className="enrolled-courses card">
          <h3>Enrolled Courses ({totalCourses})</h3>
          <div className="courses-grid">
            {enrolledCoursesWithDetails.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <BookOpen size={20} />
                  <h4>{course.title}</h4>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <span className="course-fee">₹{course.fees}</span>
                  <span className="course-duration">{course.duration}</span>
                </div>
                <div className="course-status">
                  <span className="status-badge enrolled">Enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Information Card (Real Data) */}
      <div className="student-info-card card">
        <h3>Student Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Full Name:</label>
            <span>{student.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{student.email}</span>
          </div>
          <div className="info-item">
            <label>Student ID:</label>
            <span>{student._id}</span>
          </div>
          
          <div className="info-item">
            <label>Courses Enrolled:</label>
            <span>{totalCourses}</span>
          </div>
        </div>
      </div>


      {/* Show message if no courses enrolled */}
      {enrolledCoursesWithDetails.length === 0 && (
        <div className="no-courses card">
          <BookOpen size={48} />
          <h3>No Course Enrollment</h3>
          <p>This student is not enrolled in any courses yet.</p>
        </div>
      )}
    </div>
  );
};
  // Enhanced Student Views Component
 // ✅ FIXED: Enhanced Student Views Component - Simplified Registered View
const EnhancedStudentViews = () => {
  // Filter students based on the selected view
  const getFilteredStudents = () => {
    if (studentView === "registered") {
      // Show all registered students - simplified data
      return students.map(student => ({
        ...student,
        courseTitle: student.enrolledCourses && student.enrolledCourses.length > 0 ? "Enrolled" : "Not Enrolled"
      }));
    } else {
      // Show only enrolled students (students with at least one course) - detailed data
      return students
        .filter(student => student.enrolledCourses && student.enrolledCourses.length > 0)
        .map(student => {
          const courseId = student.enrolledCourses[0];
          const course = courses.find(c => c._id === courseId);
          const details = studentDetails[student._id];
          
          return {
            ...student,
            courseTitle: course?.title || "Unknown Course",
            enrollmentDate: student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : new Date().toLocaleDateString(),
            amountPaid: course?.fees || 0,
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
    }
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div className="enhanced-student-views">
      <div className="students-header">
        <h2>👥 Student Management</h2>
        <div className="view-tabs">
          <button 
            className={studentView === "registered" ? "active" : ""}
            onClick={() => setStudentView("registered")}
          >
            All Students ({students.length})
          </button>
          <button 
            className={studentView === "enrolled" ? "active" : ""}
            onClick={() => setStudentView("enrolled")}
          >
            Enrolled Students ({students.filter(s => s.enrolledCourses && s.enrolledCourses.length > 0).length})
          </button>
        </div>
      </div>

      <div className="students-content">
        <div className="students-list">
          <h3>
            {studentView === "registered" 
              ? "All Registered Students" 
              : "Enrolled Students (With Courses)"}
          </h3>
          
          {filteredStudents.length === 0 ? (
            <div className="no-students">
              <Users size={48} />
              <p>
                {studentView === "registered" 
                  ? "No students registered yet." 
                  : "No students enrolled in any courses."}
              </p>
            </div>
          ) : (
            <div className={`students-grid ${studentView === "registered" ? "simple-view" : "detailed-view"}`}>
              {filteredStudents.map(student => (
                <div 
                  key={student._id} 
                  className={`student-card ${selectedStudent?._id === student._id ? 'selected' : ''} ${
                    studentView === "registered" ? "simple-card" : "detailed-card"
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  {/* SIMPLE VIEW - Only for Registered Students */}
                  {studentView === "registered" && (
                    <div className="student-simple-view">
                      <div className="student-avatar-small">
                        {student.name?.charAt(0) || <User size={20} />}
                      </div>
                      <div className="student-basic-info">
                        <h4>{student.name}</h4>
                        <p>{student.email}</p>
                        <span className={`enrollment-status ${
                          student.enrolledCourses && student.enrolledCourses.length > 0 ? 'enrolled' : 'not-enrolled'
                        }`}>
                          {student.enrolledCourses && student.enrolledCourses.length > 0 ? '✅ Enrolled' : '❌ Not Enrolled'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* DETAILED VIEW - Only for Enrolled Students */}
                  {studentView === "enrolled" && (
                    <>
                      <div className="student-card-header">
                        <div className="student-avatar-small">
                          {student.name?.charAt(0) || <User size={20} />}
                        </div>
                        <div className="student-basic-info">
                          <h4>{student.name}</h4>
                          <p>{student.email}</p>
                        </div>
                      </div>

                      {/* Progress Overview for Enrolled Students */}
                      <div className="student-progress-summary">
                        
                       
                      </div>

                      <div className="student-status">
                        <span className={`status ${student.paymentStatus?.toLowerCase() || 'paid'}`}>
                          {student.paymentStatus || 'Paid'}
                        </span>
                        <span className="last-login">
                          <Clock size={12} /> {student.lastLogin || 'Never'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="student-detail-panel">
          <StudentDetailView student={selectedStudent} />
        </div>
      </div>
    </div>
  );
};
  const renderContent = () => {
    switch(activeTab){
      case "Dashboard": return <>
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
