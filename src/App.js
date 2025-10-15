import logo from './logo.svg';
import './App.css';
import WelcomePage from './Welcome/WelcomePage';
import LoginForm from './User/Login';
import SignupForm from './User/Signup';
import ForgotPasswordForm from './User/ForgotPassword';
import ResetPasswordForm from './User/ResetPassword';
import HomePage from './Home/HomePAge';
import LecturerDashboard from './Admin/AdminDashboard';
import AboutPage from './AboutPage';
import ContactUs from './ContactUS';
import UserCourses from './User/UserPage';
import EnrollmentPage from './EnrollmentPage';
import CourseDetails from './Home/CourseDeials';
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import CoursesPage from './Home/CoursesPage';
import MyCourseDetails from './User/MyCourseDetails';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/"  element={<WelcomePage />}/>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path='/home' element={<HomePage />}/>
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/admin-dashboard" element={<LecturerDashboard />}/>
        <Route path='/about' element={<AboutPage />}/>
        <Route path='/contactus' element={<ContactUs />}/>
        <Route path='/student-dashboard' element={<UserCourses />}/>
       <Route path="/enroll/:courseId" element={<EnrollmentPage />} />
       <Route path="/course/:id" element={<CourseDetails />} />
       <Route path="/mycourse/:courseId" element={<MyCourseDetails />} />
       <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </div>
  );
}

export default App;
