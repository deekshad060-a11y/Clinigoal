import React from "react";
import { motion } from "framer-motion";
import "./AdminDashboard.css";

export default function DashboardOverview({ students, courses, totalEnrollment }) {
  
  // Calculate certificate statistics for each student
  const calculateCertificateStats = () => {
    // Get all certificates from localStorage
    const allCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
    
    // Count certificates per student
    const certificatesByStudent = {};
    allCertificates.forEach(cert => {
      if (!certificatesByStudent[cert.studentId]) {
        certificatesByStudent[cert.studentId] = 0;
      }
      certificatesByStudent[cert.studentId]++;
    });

    // Calculate total certificates
    const totalCertificates = allCertificates.length;
    
    // Students with certificates
    const studentsWithCertificates = students.filter(student => 
      certificatesByStudent[student._id] > 0
    ).length;

    return {
      totalCertificates,
      studentsWithCertificates,
      certificatesByStudent
    };
  };

  // Calculate average progress based on the other three metrics
  const calculateAverageProgress = () => {
    const totalStudents = students.length;
    const totalCourses = courses.length;
    
    if (totalStudents === 0 || totalCourses === 0) return 0;
    
    const enrollmentRate = totalEnrollment / totalStudents;
    const courseUtilization = totalEnrollment / totalCourses;
    
    const maxExpectedEnrollmentPerStudent = 3;
    const maxExpectedEnrollmentPerCourse = 20;
    
    const normalizedEnrollmentRate = Math.min(enrollmentRate / maxExpectedEnrollmentPerStudent, 1);
    const normalizedCourseUtilization = Math.min(courseUtilization / maxExpectedEnrollmentPerCourse, 1);
    
    const progress = (
      (normalizedEnrollmentRate * 0.6) +
      (normalizedCourseUtilization * 0.4)
    ) * 100;
    
    return Math.round(progress);
  };

  // Calculate conversion rate
  const calculateConversionRate = () => {
    const totalStudents = students.length;
    const enrolledStudents = students.filter(s => s.enrolledCourses && s.enrolledCourses.length > 0).length;
    
    if (totalStudents === 0) return 0;
    
    return Math.round((enrolledStudents / totalStudents) * 100);
  };

  // Calculate visitor metrics (estimated)
  const calculateVisitorMetrics = () => {
    const enrolledStudents = students.filter(s => s.enrolledCourses && s.enrolledCourses.length > 0).length;
    const totalStudents = students.length;
    
    const totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
    const estimatedVisitors = totalVisitors > 0 ? totalVisitors : enrolledStudents * 3;
    
    const visitorToSignupRate = estimatedVisitors > 0 ? 
      Math.round((totalStudents / estimatedVisitors) * 100) : 0;
    
    return {
      totalVisitors: estimatedVisitors,
      visitorToSignupRate
    };
  };

  const averageProgress = calculateAverageProgress();
  const conversionRate = calculateConversionRate();
  const visitorMetrics = calculateVisitorMetrics();
  const certificateStats = calculateCertificateStats();

  // Get progress level for styling
  const getProgressLevel = (value, type = "progress") => {
    if (type === "conversion") {
      if (value >= 80) return "excellent";
      if (value >= 60) return "good";
      if (value >= 40) return "average";
      return "low";
    } else {
      if (value >= 80) return "excellent";
      if (value >= 60) return "good";
      if (value >= 40) return "average";
      return "low";
    }
  };

  const progressLevel = getProgressLevel(averageProgress);
  const conversionLevel = getProgressLevel(conversionRate, "conversion");
  const visitorLevel = getProgressLevel(visitorMetrics.visitorToSignupRate, "conversion");

  return (
    <div className="dashboard-overview">
      <div className="stats-cards">
        {/* Total Students Card */}
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          👩‍🎓 <span>Total Students</span>
          <h3>{students.length}</h3>
          <div className="card-subtext">
            {visitorMetrics.totalVisitors} total visitors
          </div>
        </motion.div>

        {/* Total Courses Card */}
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          📘 <span>Total Courses</span>
          <h3>{courses.length}</h3>
          <div className="card-subtext">
            {totalEnrollment} total enrollments
          </div>
        </motion.div>

        {/* Total Enrollment Card */}
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          📝 <span>Total Enrollment</span>
          <h3>{totalEnrollment}</h3>
          <div className="card-subtext">
            {students.filter(s => s.enrolledCourses && s.enrolledCourses.length > 0).length} enrolled students
          </div>
        </motion.div>

        {/* Course Completions Card */}
        <motion.div className="cards completion-card" whileHover={{ scale: 1.05 }}>
          🏆 <span>Courses Completed</span>
          <h3>{certificateStats.totalCertificates}</h3>
          <div className="card-subtext">
            {certificateStats.studentsWithCertificates} students certified
          </div>
        </motion.div>

        {/* Platform Progress Card */}
        <motion.div 
          className={`cards progress-card ${progressLevel}`} 
          whileHover={{ scale: 1.05 }}
        >
          <div className="progress-header">
            📊 <span>Platform Progress</span>
            <span className="progress-badge">{progressLevel}</span>
          </div>
          <h3>{averageProgress}%</h3>
          <div className="progress-container">
            <div 
              className="progress-fill" 
              style={{ width: `${averageProgress}%` }}
            ></div>
          </div>
          <div className="card-subtext">
            Based on enrollment & course utilization
          </div>
        </motion.div>

        {/* Conversion Rate Card */}
        <motion.div 
          className={`cards conversion-card ${conversionLevel}`} 
          whileHover={{ scale: 1.05 }}
        >
          <div className="progress-header">
            📈 <span>Conversion Rate</span>
            <span className="progress-badge">{conversionLevel}</span>
          </div>
          <h3>{conversionRate}%</h3>
          <div className="progress-container">
            <div 
              className="progress-fill" 
              style={{ width: `${conversionRate}%` }}
            ></div>
          </div>
          <div className="card-subtext">
            {students.filter(s => s.enrolledCourses && s.enrolledCourses.length > 0).length}/
            {students.length} students enrolled
          </div>
        </motion.div>
      </div>

      {/* Student Course Completion Table */}
      <motion.div 
        className="student-completion-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3>🎓 Student Course Completion</h3>
        <p className="section-subtitle">
          Showing certificate count for each student (from UserDashboard)
        </p>
        
        <div className="completion-table">
          <div className="table-header">
            <span>Student Name</span>
            <span>Email</span>
            <span>Enrolled Courses</span>
            <span>Courses Completed</span>
            <span>Completion Rate</span>
          </div>
          
          {students.map(student => {
            const certificateCount = certificateStats.certificatesByStudent[student._id] || 0;
            const enrolledCount = student.enrolledCourses?.length || 0;
            const completionRate = enrolledCount > 0 ? Math.round((certificateCount / enrolledCount) * 100) : 0;
            
            return (
              <div key={student._id} className="student-completion-row">
                <div className="student-info">
                  <div className="student-avatar">
                    {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="student-details">
                    <span className="student-name">{student.name || 'Unknown User'}</span>
                    <span className="student-id">ID: {student._id?.substring(0, 8)}...</span>
                  </div>
                </div>
                
                <div className="student-email">
                  {student.email || 'No email'}
                </div>
                
                <div className="enrolled-courses">
                  <span className="course-count">{enrolledCount}</span>
                  <span className="course-label">courses</span>
                </div>
                
                <div className="courses-completed">
                  <div className="certificate-badge">
                    {certificateCount} 🏆
                  </div>
                </div>
                
                <div className="completion-progress">
                  <div className="progress-container">
                    <div 
                      className="progress-fill"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{completionRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Top Completers */}
      {certificateStats.totalCertificates > 0 && (
        <motion.div 
          className="top-completers-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>⭐ Top Course Completers</h3>
          <div className="top-completers-grid">
            {students
              .filter(student => certificateStats.certificatesByStudent[student._id] > 0)
              .sort((a, b) => certificateStats.certificatesByStudent[b._id] - certificateStats.certificatesByStudent[a._id])
              .slice(0, 4)
              .map((student, index) => (
                <div key={student._id} className="top-completer-card">
                  <div className="completer-rank">#{index + 1}</div>
                  <div className="completer-avatar">
                    {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="completer-info">
                    <h4>{student.name}</h4>
                    <p>{student.email}</p>
                  </div>
                  <div className="completion-count">
                    <span className="count">{certificateStats.certificatesByStudent[student._id]}</span>
                    <span className="label">Courses Completed</span>
                  </div>
                </div>
              ))
            }
          </div>
        </motion.div>
      )}

      {/* Conversion Funnel Mini View */}
      <motion.div 
        className="conversion-funnel-mini"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4>🔄 Student Journey</h4>
        <div className="funnel-steps">
          <div className="funnel-step">
            <div className="funnel-number">{visitorMetrics.totalVisitors}</div>
            <div className="funnel-label">Visitors</div>
            <div className="funnel-arrow">↓</div>
          </div>
          <div className="funnel-step">
            <div className="funnel-number">{students.length}</div>
            <div className="funnel-label">Registered</div>
            <div className="funnel-arrow">↓</div>
          </div>
          <div className="funnel-step">
            <div className="funnel-number">
              {students.filter(s => s.enrolledCourses && s.enrolledCourses.length > 0).length}
            </div>
            <div className="funnel-label">Enrolled</div>
            <div className="funnel-arrow">↓</div>
          </div>
          <div className="funnel-step">
            <div className="funnel-number">{certificateStats.totalCertificates}</div>
            <div className="funnel-label">Completed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}