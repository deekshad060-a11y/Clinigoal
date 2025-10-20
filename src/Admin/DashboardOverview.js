import React from "react";
import { motion } from "framer-motion";
import "./AdminDashboard.css";

export default function DashboardOverview({ students, courses, totalEnrollment }) {
  
  // Calculate average progress based on the other three metrics
  const calculateAverageProgress = () => {
    const totalStudents = students.length;
    const totalCourses = courses.length;
    
    // Avoid division by zero
    if (totalStudents === 0 || totalCourses === 0) return 0;
    
    // Calculate progress based on:
    // 1. Enrollment rate (enrollments per student)
    const enrollmentRate = totalEnrollment / totalStudents;
    
    // 2. Course utilization (enrollments per course)
    const courseUtilization = totalEnrollment / totalCourses;
    
    // 3. Platform engagement (combination of both metrics)
    // Normalize the values to create a balanced progress score
    const maxExpectedEnrollmentPerStudent = 3; // Assuming avg 3 courses per student
    const maxExpectedEnrollmentPerCourse = 20; // Assuming avg 20 students per course
    
    const normalizedEnrollmentRate = Math.min(enrollmentRate / maxExpectedEnrollmentPerStudent, 1);
    const normalizedCourseUtilization = Math.min(courseUtilization / maxExpectedEnrollmentPerCourse, 1);
    
    // Calculate weighted average progress
    const progress = (
      (normalizedEnrollmentRate * 0.6) +      // 60% weight to student engagement
      (normalizedCourseUtilization * 0.4)     // 40% weight to course utilization
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
    
    // Get from localStorage or estimate
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

        {/* Visitor to Signup Card */}
        <motion.div 
          className={`cards visitor-card ${visitorLevel}`} 
          whileHover={{ scale: 1.05 }}
        >
          <div className="progress-header">
            👥 <span>Visitor to Signup</span>
            <span className="progress-badge">{visitorLevel}</span>
          </div>
          <h3>{visitorMetrics.visitorToSignupRate}%</h3>
          <div className="progress-container">
            <div 
              className="progress-fill" 
              style={{ width: `${visitorMetrics.visitorToSignupRate}%` }}
            ></div>
          </div>
          <div className="card-subtext">
            From {visitorMetrics.totalVisitors} visitors
          </div>
        </motion.div>
      </div>

      {/* Conversion Funnel Mini View */}
      <motion.div 
        className="conversion-funnel-mini"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4>🔄 Conversion Funnel</h4>
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
          </div>
        </div>
        <div className="funnel-rates">
          <span>Visitor → Signup: {visitorMetrics.visitorToSignupRate}%</span>
          <span>Signup → Enroll: {conversionRate}%</span>
        </div>
      </motion.div>
    </div>
  );
}