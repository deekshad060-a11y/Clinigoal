import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "./AdminDashboard.css";

export default function StudentViews({ 
  studentView, 
  setStudentView, 
  students, 
  courses, 
  studentDetails,
  COLORS 
}) {

  // ✅ FIXED: Properly derive enrolled students data
  const enrolledStudents = students
    .filter(student => student.enrolledCourses && student.enrolledCourses.length > 0)
    .map(student => {
      const courseId = student.enrolledCourses[0];
      const course = courses.find(c => c._id === courseId);
      const details = studentDetails[student._id];
      
      return {
        ...student,
        courseTitle: course?.title || "Unknown Course",
        enrollmentDate: student.enrolledAt 
          ? new Date(student.enrolledAt).toLocaleDateString() 
          : new Date().toLocaleDateString(),
        amountPaid: course?.fees || 0,
        paymentDate: student.enrolledAt 
          ? new Date(student.enrolledAt).toLocaleDateString() 
          : new Date().toLocaleDateString(),
        paymentStatus: "Paid",
        lastLogin: student.lastLogin 
          ? new Date(student.lastLogin).toLocaleString() 
          : "Never",
        videosCompleted: details?.videosCompleted || 0,
        assignmentsCompleted: details?.completedAssignments || 0,
        totalAssignments: details?.totalAssignments || 0,
        quizzesCompleted: details?.completedQuizzes || 0,
        totalQuizzes: details?.totalQuizzes || 0,
        overallProgress: details?.overallProgress || 0
      };
    });

  // ✅ FIXED: Proper chart data calculation
  const studentCourseData = courses.map(course => {
    const enrolledCount = students.filter(student => 
      student.enrolledCourses && student.enrolledCourses.includes(course._id)
    ).length;
    
    return {
      name: course.title,
      value: enrolledCount,
      students: enrolledCount
    };
  }).filter(item => item.value > 0); // Only show courses with enrolled students

  return (
    <div className="manage-students">
      <div className="section-header">
        <h3>👩‍🎓 Student Management</h3>
        <div className="view-stats">
          <span className="stat-badge">Total: {students.length}</span>
          <span className="stat-badge">Enrolled: {enrolledStudents.length}</span>
        </div>
      </div>

      <div className="student-view-buttons">
        <button 
          className={studentView === "registered" ? "active" : ""} 
          onClick={() => setStudentView("registered")}
        >
          Registered Students ({students.length})
        </button>
        <button 
          className={studentView === "enrolled" ? "active" : ""} 
          onClick={() => setStudentView("enrolled")}
        >
          Enrolled Students ({enrolledStudents.length})
        </button>
        <button 
          className={studentView === "charts" ? "active" : ""} 
          onClick={() => setStudentView("charts")}
        >
          Analytics
        </button>
      </div>

      {/* Registered Students - Simple View */}
      {studentView === "registered" && (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Enrollment Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    No registered students found.
                  </td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student._id}>
                    <td className="student-name">
                      <strong>{student.name || "N/A"}</strong>
                    </td>
                    <td>{student.email || "N/A"}</td>
                    <td>
                      <span className={`status-badge ${
                        student.enrolledCourses && student.enrolledCourses.length > 0 
                          ? 'enrolled' 
                          : 'not-enrolled'
                      }`}>
                        {student.enrolledCourses && student.enrolledCourses.length > 0 
                          ? `Enrolled (${student.enrolledCourses.length})` 
                          : "Not Enrolled"}
                      </span>
                    </td>
                    <td>
                      {student.lastLogin 
                        ? new Date(student.lastLogin).toLocaleDateString() 
                        : "Never"
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Enrolled Students - Detailed View */}
      {studentView === "enrolled" && (
        <div className="table-container">
          <table className="students-table detailed">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enrollment Date</th>
                <th>Amount Paid</th>
                <th>Progress</th>
                <th>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No enrolled students found.
                  </td>
                </tr>
              ) : (
                enrolledStudents.map((student, index) => (
                  <tr key={student._id || index}>
                    <td className="student-info">
                      <div className="student-name">{student.name}</div>
                      <div className="student-email">{student.email}</div>
                    </td>
                    <td>
                      <div className="course-info">
                        <strong>{student.courseTitle}</strong>
                      </div>
                    </td>
                    <td>{student.enrollmentDate}</td>
                    <td className="amount">₹{student.amountPaid}</td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${student.overallProgress}%` }}
                          ></div>
                        </div>
                        <span>{student.overallProgress}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="last-activity">
                        {student.lastLogin}
                        <div className="activity-stats">
                          <small>📝 {student.assignmentsCompleted}/{student.totalAssignments}</small>
                          <small>🧩 {student.quizzesCompleted}/{student.totalQuizzes}</small>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts View */}
      {studentView === "charts" && (
        <div className="charts-section">
          {studentCourseData.length === 0 ? (
            <div className="no-chart-data">
              <p>No enrollment data available for charts.</p>
            </div>
          ) : (
            <>
              <div className="chart-container">
                <h4>Course Enrollment Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={studentCourseData} 
                      cx="50%" 
                      cy="50%" 
                      dataKey="value" 
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                    >
                      {studentCourseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h4>Students per Course</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={studentCourseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="students" 
                      name="Number of Students" 
                      fill="#4f46e5" 
                      radius={[6, 6, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}