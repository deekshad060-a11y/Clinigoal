// DashboardOverview.js
import React from "react";
import { Users, BookOpen, TrendingUp, Target, CheckCircle } from "lucide-react";

const DashboardOverview = ({ students, courses, totalEnrollment }) => {
  // Calculate conversion rate metrics
  const calculateConversionMetrics = () => {
    const totalStudents = students.length;
    const enrolledStudents = students.filter(s => s.enrolledCourses && s.enrolledCourses.length > 0).length;
    
    // Calculate conversion rate (registered → enrolled)
    const conversionRate = totalStudents > 0 ? 
      Math.round((enrolledStudents / totalStudents) * 100) : 0;
    
    // Calculate visitor metrics (you can get this from analytics or estimate)
    const totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
    const estimatedVisitors = totalVisitors > 0 ? totalVisitors : enrolledStudents * 3;
    
    const visitorToSignupRate = estimatedVisitors > 0 ? 
      Math.round((totalStudents / estimatedVisitors) * 100) : 0;
    
    return {
      conversionRate,
      visitorToSignupRate,
      totalStudents,
      enrolledStudents,
      totalVisitors: estimatedVisitors
    };
  };

  const conversionMetrics = calculateConversionMetrics();

  return (
    <div className="dashboard-overview">
      <div className="overview-header">
        <h2>📊 Dashboard Overview</h2>
        <p>Welcome to your learning management system dashboard</p>
      </div>

      <div className="stats-grid">
        {/* Total Students Card */}
        <div className="stat-card total-students">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{students.length}</h3>
            <p>Total Students</p>
            <span className="stat-trend">
              {conversionMetrics.totalVisitors} total visitors
            </span>
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="stat-card total-courses">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
            <span className="stat-trend">
              {totalEnrollment} total enrollments
            </span>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="stat-card conversion-rate">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{conversionMetrics.conversionRate}%</h3>
            <p>Conversion Rate</p>
            <span className="stat-trend">
              {conversionMetrics.enrolledStudents}/{conversionMetrics.totalStudents} students enrolled
            </span>
          </div>
        </div>

        {/* Visitor to Signup Rate Card */}
        <div className="stat-card visitor-conversion">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <h3>{conversionMetrics.visitorToSignupRate}%</h3>
            <p>Visitor to Signup</p>
            <span className="stat-trend">
              From {conversionMetrics.totalVisitors} visitors
            </span>
          </div>
        </div>
      </div>

      {/* Conversion Funnel Visualization */}
      <div className="conversion-funnel-section">
        <h3>🔄 Conversion Funnel</h3>
        <div className="conversion-funnel">
          <div className="funnel-stage visitors">
            <div className="funnel-number">{conversionMetrics.totalVisitors}</div>
            <div className="funnel-label">Website Visitors</div>
            <div className="funnel-rate">{conversionMetrics.visitorToSignupRate}% conversion</div>
          </div>
          
          <div className="funnel-arrow">↓</div>
          
          <div className="funnel-stage registered">
            <div className="funnel-number">{conversionMetrics.totalStudents}</div>
            <div className="funnel-label">Registered Students</div>
            <div className="funnel-rate">{conversionMetrics.conversionRate}% conversion</div>
          </div>
          
          <div className="funnel-arrow">↓</div>
          
          <div className="funnel-stage enrolled">
            <div className="funnel-number">{conversionMetrics.enrolledStudents}</div>
            <div className="funnel-label">Enrolled Students</div>
            <div className="funnel-rate">Active learners</div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="insights-section">
        <h3>💡 Quick Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <CheckCircle size={18} />
            <div>
              <h4>Conversion Health</h4>
              <p>
                {conversionMetrics.conversionRate >= 60 
                  ? "Excellent conversion rate! Your platform is effectively converting registered students to enrolled learners."
                  : conversionMetrics.conversionRate >= 30
                  ? "Good conversion rate. Consider optimizing the enrollment process for better results."
                  : "Low conversion rate. Focus on improving student engagement and enrollment incentives."
                }
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <TrendingUp size={18} />
            <div>
              <h4>Growth Opportunity</h4>
              <p>
                You have {conversionMetrics.totalStudents - conversionMetrics.enrolledStudents} registered students 
                who haven't enrolled in any courses yet. Consider targeted campaigns to convert them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;