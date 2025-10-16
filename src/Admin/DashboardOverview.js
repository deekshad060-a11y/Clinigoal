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

  const averageProgress = calculateAverageProgress();

  // Get progress level for styling
  const getProgressLevel = () => {
    if (averageProgress >= 80) return "excellent";
    if (averageProgress >= 60) return "good";
    if (averageProgress >= 40) return "average";
    return "low";
  };

  const progressLevel = getProgressLevel();

  return (
    <div className="dashboard-overview">
      <div className="stats-cards">
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          👩‍🎓 <span>Total Students</span>
          <h3>{students.length}</h3>
        </motion.div>
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          📘 <span>Total Courses</span>
          <h3>{courses.length}</h3>
        </motion.div>
        <motion.div className="cards" whileHover={{ scale: 1.05 }}>
          📝 <span>Total Enrollment</span>
          <h3>{totalEnrollment}</h3>
        </motion.div>
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
          
        </motion.div>
      </div>
    </div>
  );
}