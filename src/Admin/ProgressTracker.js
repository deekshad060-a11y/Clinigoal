import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";
import "./ProgressTracker.css"; // Ensure this file is linked

const API = "http://localhost:5000";

export default function ProgressTracker() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [progress, setProgress] = useState({ title: "", totalEnrolled: 0, students: [] }); // Added totalEnrolled to initial state

  // NOTE: This ID should typically come from authentication context, not hardcoded.
  const lecturerId = "L123"; 

  // Fetch lecturer courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API}/courses/lecturer/${lecturerId}`);
        setCourses(res.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch progress per course
  useEffect(() => {
    if (!courseId) {
      setProgress({ title: "", totalEnrolled: 0, students: [] }); // Clear progress when no course is selected
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${API}/progress/${courseId}`);
        setProgress(res.data);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setProgress({ title: "Error Loading Data", totalEnrolled: 0, students: [] });
      }
    };
    fetchProgress();
  }, [courseId]);

  // Prepare chart data per student (Percentage of completion)
  const studentChartData =
    progress.students?.map((s) => ({
      name: s.name,
      // Calculate Assignment Completion Percentage
      assignments:
        s.totalAssignments > 0
          ? Math.round((s.assignmentsCompleted / s.totalAssignments) * 100)
          : 0,
      // Calculate Quiz Completion Percentage
      quizzes:
        s.totalQuizzes > 0
          ? Math.round((s.quizzesCompleted / s.totalQuizzes) * 100)
          : 0
    })) || [];

  return (
    <div className="progress-tracker-container">
      <h2 className="">📊 Progress Tracker Dashboard</h2>

      {/* Course Selector */}
      <div className="course-selector card">
        <label htmlFor="course-select">Select Course</label>
        <select 
          id="course-select" 
          value={courseId} 
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* --- KPI Summary Grid (Enhanced Section) --- */}
      {progress.title && (
        <>
          <h3 className="course-dashboard-title">{progress.title} Dashboard</h3>
          <div className="kpi-summary-grid">
            <div className="kpi-box total-enrolled">
              <p>Total Enrolled Students</p>
              <div className="kpi-value">{progress.totalEnrolled}</div>
            </div>
            {/* Additional KPIs can be added here (e.g., avg scores, completion rates) */}
            <div className="kpi-box">
              <p>Total Assignments Tracked</p>
              <div className="kpi-value">{progress.students.length > 0 ? progress.students[0].totalAssignments : 0}</div>
            </div>
            <div className="kpi-box">
              <p>Total Quizzes Tracked</p>
              <div className="kpi-value">{progress.students.length > 0 ? progress.students[0].totalQuizzes : 0}</div>
            </div>
          </div>
        </>
      )}

      {/* Student Progress Chart */}
      <div className="chart-card card">
        <h3>Student Progress Overview</h3>
        {studentChartData.length === 0 ? (
          <p className="no-data">
            {courseId ? "No student progress data available for this course." : "Please select a course to view student progress."}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={studentChartData}
              margin={{ top: 40, right: 30, left: 0, bottom: 40 }}
              barGap={-10} // Slightly overlap the bars
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e6ec" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} stroke="#6c757d" />
              <YAxis unit="%" domain={[0, 100]} stroke="#6c757d" />
              <Tooltip
                cursor={{ fill: 'rgba(0, 123, 255, 0.1)' }} // Light blue hover effect
                contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #ced4da" }}
                labelStyle={{ fontWeight: 'bold', color: '#1a3a5a' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              {/* Bar 1: Assignments (Green - Success) */}
              <Bar dataKey="assignments" fill="#28a745" name="Assignments %" minPointSize={5}>
                <LabelList dataKey="assignments" position="top" formatter={(val) => val + "%"} />
              </Bar>
              
              {/* Bar 2: Quizzes (Blue - Primary) */}
              <Bar dataKey="quizzes" fill="#007bff" name="Quizzes %" minPointSize={5}>
                <LabelList dataKey="quizzes" position="top" formatter={(val) => val + "%"} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Detailed Student Progress Table */}
      {studentChartData.length > 0 && (
        <div className="student-table card">
          <h3>Detailed Student Progress</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Assignments Completed</th>
                <th>Quizzes Completed</th>
                <th>Overall Progress</th>
              </tr>
            </thead>
            <tbody>
              {progress.students.map((s) => {
                const assignmentPct =
                  s.totalAssignments > 0
                    ? Math.round((s.assignmentsCompleted / s.totalAssignments) * 100)
                    : 0;
                const quizPct =
                  s.totalQuizzes > 0
                    ? Math.round((s.quizzesCompleted / s.totalQuizzes) * 100)
                    : 0;
                const overall = Math.round((assignmentPct + quizPct) / 2);

                return (
                  <tr key={s._id}>
                    <td data-label="Name">{s.name}</td>
                    <td data-label="Assignments Completed">{`${s.assignmentsCompleted}/${s.totalAssignments}`}</td>
                    <td data-label="Quizzes Completed">{`${s.quizzesCompleted}/${s.totalQuizzes}`}</td>
                    <td data-label="Overall Progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${overall}%`, 
                                   // Conditional background for high/low overall completion
                                   background: overall >= 80 
                                      ? 'linear-gradient(to right, #28a745, #1e7e34)' // Green for high
                                      : overall >= 40 
                                      ? 'linear-gradient(to right, #ffc107, #d39e00)' // Yellow for medium
                                      : 'linear-gradient(to right, #dc3545, #b82c39)' // Red for low
                                 }}
                        >
                          {overall}%
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}