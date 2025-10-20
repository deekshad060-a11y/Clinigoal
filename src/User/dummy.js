/* =================== ENHANCED STUDENT VIEWS - UPDATED STYLES =================== */

/* Last Login Status Styles */
.login-status-recent {
  border-left: 4px solid #10b981 !important;
}

.login-status-moderate {
  border-left: 4px solid #f59e0b !important;
}

.login-status-inactive {
  border-left: 4px solid #ef4444 !important;
}

.login-status-never {
  border-left: 4px solid #94a3b8 !important;
}

/* Last Login Badges */
.last-login-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  width: fit-content;
  font-weight: 600;
}

.last-login-badge.login-recent {
  background: #dcfce7;
  color: #166534;
}

.last-login-badge.login-moderate {
  background: #fef3c7;
  color: #92400e;
}

.last-login-badge.login-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.last-login-badge.login-never {
  background: #f1f5f9;
  color: #475569;
}

/* Student Meta Info */
.student-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.enrollment-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
}

.enrollment-status.enrolled {
  background: #dcfce7;
  color: #166534;
}

.enrollment-status.not-enrolled {
  background: #fee2e2;
  color: #dc2626;
}

/* Student Status in Detailed View */
.student-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.status {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.paid {
  background: #dcfce7;
  color: #166534;
}

.last-login {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
}

.last-login.login-recent {
  color: #10b981;
}

.last-login.login-moderate {
  color: #f59e0b;
}

.last-login.login-inactive {
  color: #ef4444;
}

.last-login.login-never {
  color: #94a3b8;
}

/* =================== STUDENT DETAIL VIEW STYLES =================== */

/* Progress Tracker Container */
.progress-tracker-container {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Student Info Header */
.student-info-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.student-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.student-details h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
}

.student-details p {
  margin: 0 0 4px 0;
  opacity: 0.9;
  font-size: 14px;
}

.last-login-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* KPI Summary Grid */
.kpi-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.kpi-box {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-top: 4px solid transparent;
}

.kpi-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.kpi-box p {
  margin: 0 0 12px 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.kpi-box.total-enrolled {
  border-top-color: #4f46e5;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
}

.kpi-box.last-login-status {
  border-top-color: #10b981;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.never-logged {
  color: #ef4444 !important;
  font-size: 20px !important;
}

/* Enrolled Courses Section */
.enrolled-courses {
  margin-bottom: 24px;
}

.enrolled-courses h3 {
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.course-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.course-card:hover {
  border-color: #c7d2fe;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.course-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.course-header h4 {
  margin: 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
}

.course-description {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.course-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.course-fee {
  color: #10b981;
  font-weight: 700;
  font-size: 16px;
}

.course-duration {
  color: #64748b;
  font-size: 14px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
}

.course-status .status-badge.enrolled {
  background: #dcfce7;
  color: #166534;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Student Information Card */
.student-info-card {
  margin-bottom: 24px;
}

.student-info-card h3 {
  color: #1e293b;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
}

.info-item span {
  color: #1e293b;
  font-weight: 600;
  font-size: 14px;
  text-align: right;
}

.info-item span.never-logged {
  color: #ef4444;
  background: #fef2f2;
  padding: 4px 8px;
  border-radius: 6px;
}

.info-item span.recent-login {
  color: #10b981;
  background: #f0fdf4;
  padding: 4px 8px;
  border-radius: 6px;
}

/* No Courses State */
.no-courses {
  text-align: center;
  padding: 60px 40px;
  color: #64748b;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
}

.no-courses h3 {
  margin: 20px 0 12px 0;
  color: #475569;
  font-size: 20px;
  font-weight: 600;
}

.no-courses p {
  margin: 0 0 20px 0;
  font-size: 14px;
}

.last-login-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: #64748b;
  font-size: 14px;
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* No Student Selected State */
.no-student-selected {
  text-align: center;
  padding: 80px 40px;
  color: #64748b;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
}

.no-student-selected h3 {
  margin: 24px 0 12px 0;
  color: #475569;
  font-size: 24px;
  font-weight: 600;
}

.no-student-selected p {
  margin: 0;
  font-size: 16px;
  max-width: 400px;
  line-height: 1.5;
}

/* Loading States */
.loading-state {
  text-align: center;
  padding: 80px 40px;
  color: #64748b;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4f46e5;
  border-right: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
  margin: 0 auto 20px;
}

.loading {
  text-align: center;
  padding: 60px 40px;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

/* Refresh Button */
.students-header-actions {
  margin-top: 16px;
  text-align: center;
}

.btn-refresh {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.btn-refresh:hover {
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
}

/* Debug Info Styling */
.debug-info {
  padding: 12px 16px;
  background: #f0f8ff;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #1e40af;
  border: 1px solid #dbeafe;
}

.debug-info strong {
  color: #1e3a8a;
}

/* Responsive Design for Student Detail View */
@media (max-width: 1024px) {
  .progress-tracker-container {
    padding: 20px;
  }
  
  .student-info-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 20px;
  }
  
  .kpi-summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .progress-tracker-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .student-info-header {
    padding: 16px;
  }
  
  .student-avatar {
    width: 60px;
    height: 60px;
  }
  
  .student-details h3 {
    font-size: 20px;
  }
  
  .kpi-summary-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .kpi-value {
    font-size: 28px;
  }
  
  .course-card {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .progress-tracker-container {
    padding: 12px;
  }
  
  .student-info-header {
    padding: 12px;
  }
  
  .student-details h3 {
    font-size: 18px;
  }
  
  .last-login-info {
    font-size: 12px;
  }
  
  .kpi-box {
    padding: 20px;
  }
}

/* Animation for smooth transitions */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-tracker-container > * {
  animation: fadeInUp 0.6s ease-out;
}

.progress-tracker-container > *:nth-child(1) { animation-delay: 0.1s; }
.progress-tracker-container > *:nth-child(2) { animation-delay: 0.2s; }
.progress-tracker-container > *:nth-child(3) { animation-delay: 0.3s; }
.progress-tracker-container > *:nth-child(4) { animation-delay: 0.4s; }
.progress-tracker-container > *:nth-child(5) { animation-delay: 0.5s; }

/* Card hover effects */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}