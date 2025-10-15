import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import "./HomePage.css";
import { motion } from "framer-motion";
import TestimonialManger from "../Admin/Testimonialmanger";
export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const API = "http://localhost:5000"; // backend URL
  useEffect(() => {
    axios
      .get(`${API}/courses`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);
  const navigate = useNavigate();
  const statsData = [
    { number: 10000, label: "Active Students", suffix: "+" },
    { number: 120, label: "Expert Instructors", suffix: "+" },
    { number: 200, label: "Courses Available", suffix: "+" }
  ];

  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    statsData.forEach((stat, index) => {
      let start = 0;
      const end = stat.number;
      const duration = 2000; // animation duration in ms
      const increment = end / (duration / 20);

      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(counter);
        }
        setCounts(prev => {
          const updated = [...prev];
          updated[index] = Math.floor(start);
          return updated;
        });
      }, 20);
    });
  }, []);
const [searchQuery, setSearchQuery] = useState("");
const [filteredCourses, setFilteredCourses] = useState([]);

useEffect(() => {
  if (!searchQuery) {
    setFilteredCourses([]);
    return;
  }

  const matches = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  setFilteredCourses(matches);
}, [searchQuery, courses]);


  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
  <h1 className="logo">Clinigoal</h1>
  <div className="nav-search">
  <input
    type="text"
    placeholder="Search courses..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  {filteredCourses.length > 0 && (
    <div className="search-dropdown">
      {filteredCourses.map(course => (
        <p
          key={course._id}
          onClick={() => {
            navigate(`/course/${course._id}`);
            setSearchQuery(""); // clear search
          }}
        >
          {course.title}
        </p>
      ))}
    </div>
  )}
</div>

  <nav className="navbar">
      <div className="nav-buttons">
        <button className="btn" onClick={() => navigate("/home")}>Home</button>
        {/* Courses Dropdown */}
        <div className="dropdowns">
          <button className="btn">Courses</button>
          <div className="dropdown-contents">
            {courses.length === 0 ? (
              <p>Loading...</p>
            ) : (
              courses.map((course) => (
                <p
                  key={course._id}
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  {course.title}
                </p>
              ))
            )}
          </div>
        </div>
        
        <button className="btn" onClick={() => navigate("/about")}>About</button>
        <button className="btn" onClick={() => navigate("/contactus")}>Contact</button>
        <button className="btn" onClick={() => navigate("/login")}>Register & Login</button>
      </div>
    </nav>
</nav>


      <header className="hero">
      {/* Background Animated Circles */}
      <motion.div 
        className="bg-circle circle1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div 
        className="bg-circle circle2"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      {/* Hero Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Empower Your <span className="highlight">Clinical Education</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Join thousands of learners on <strong>Clinigoal</strong> – Upskill with 
          expert lectures, real-world case studies, and interactive assessments.
        </motion.p>

        <motion.div
          className="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            className="btn btn-primary"
            onClick={() => navigate("/courses")}
            whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(37,99,235,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Courses
          </motion.button>

          <motion.button
            className="btn btn-outline"
            onClick={() => navigate("/about")}
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb", color: "#fff" }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Hero Images Section */}
      <motion.div 
        className="hero-images"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {/* Main Image (Floating Animation) */}
        <motion.img 
          src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-5362.jpg"
          alt="Learning Main"
          className="hero-img main-img"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          whileHover={{ scale: 1.05, rotate: 2 }}
        />

        {/* Second Image (Interactive Hover) */}
        <motion.img 
          src="data:image/jpeg;base64,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"
          alt="Learning Support"
          className="hero-img secondary-img"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          whileHover={{ scale: 1.08, rotate: -3 }}
        />
      </motion.div>
    </header>

          <section className="stats">
  {statsData.map((stat, index) => (
    <motion.div
      key={index}
      className="stat-card"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.1, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)" }}
    >
      <div className="icon">{stat.icon}</div>
      <h2 className="stat-number">{counts[index].toLocaleString()}{stat.suffix}</h2>
      <p className="stat-label">{stat.label}</p>
      <motion.div 
        className="stat-bg"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, delay: index * 0.2 }}
      />
    </motion.div>
  ))}
</section>



      <section className="features">
  {[ 
    { title: "📚 Structured Courses", text: "Well-organized learning paths covering clinical research, medical coding, and pharmacovigilance to help you master concepts step by step." },
    { title: "👨‍🏫 Expert Lecturers", text: "Learn from industry professionals and certified instructors with years of practical experience." },
    { title: "📊 Progress Tracking", text: "Track your learning journey, quiz scores, and module completion in an intuitive dashboard." },
    { title: "🎥 Video Tutorials", text: "High-quality video lectures that are easy to follow, with captions and supplementary materials." },
    { title: "💬 Community Forum", text: "Engage with fellow learners, ask questions, share ideas, and get guidance from mentors." },
  ].map((feature, index) => (
    <motion.div
      key={index}
      className="feature-card"
      initial={{ opacity: 0, y: 50, scale: 1.7 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.2, boxShadow: "0px 15px 30px rgba(0,0,0,0.15)" }}
    >
      <div className="feature-icon">{feature.title.split(" ")[0]}</div>
      <h3>{feature.title.replace(/^.\s*/, "")}</h3>
      <p>{feature.text}</p>
    </motion.div>
  ))}
</section>


     <section className="categories-section">
      <h2>Explore Courses</h2>
      <div className="category-grid">
        {courses.length === 0 ? (
          <p>Loading courses...</p>
        ) : (
          courses.map((course, index) => (
            <motion.div
              key={course._id}
              className="category-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.08,
                rotate: 1,
                boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
              }}
              onClick={() => navigate(`/course/${course._id}`)}
            >
              {course.title}
            </motion.div>
          ))
        )}
      </div>
    </section>
      {/* Popular Courses */}
<section className="popular-courses">
  <h2>Popular Courses</h2>

  <div className="c-grid">
    {courses.length > 0 ? (
      courses.map((course) => (
        <div key={course._id} className="c-card">
          <img
                    src={course.image || "https://via.placeholder.com/300x180"}
                    alt={course.title}
                  />
          <h3>{course.title}</h3>
          <p>⭐ {course.rating || "4.5"} | {course.learners || "1,000"} learners</p>
          <button
            className="btn btn-small btn-primary"
            onClick={() => navigate(`/course/${course._id}`)}
          >
            Enroll Now
          </button>
        </div>
      ))
    ) : (
      <p>No popular courses available right now.</p>
    )}
  </div>
</section>


      {/* Instructors */}
      <section className="instructors">
        <h2>Meet Our Expert Instructors</h2>
        <div className="instructor-grid">
          <div className="instructor-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVrNIrc_GMNFCWvfIVx-5-1jI0YMf-3a6yyg&s" alt="Instructor" />
            <h3>Dr. Sarah Thompson</h3>
            <p>Clinical Research Expert</p>
          </div>
          <div className="instructor-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVrNIrc_GMNFCWvfIVx-5-1jI0YMf-3a6yyg&s" alt="Instructor" />
            <h3>Prof. David Lee</h3>
            <p>Medical Coding Specialist</p>
          </div>
          <div className="instructor-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVrNIrc_GMNFCWvfIVx-5-1jI0YMf-3a6yyg&s" alt="Instructor" />
            <h3>Dr. Priya Menon</h3>
            <p>Pharmacovigilance Trainer</p>
          </div>
        </div>
      </section>

     

      <section className="t-section">
        
      <motion.h2
        className="t-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Testimonial 
      </motion.h2>

      <div className="t-grid">
        <motion.div
          className="t-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0,0,0,0.15)" }}
        >
          <TestimonialManger limit={3}/>
        </motion.div>
      </div>
    </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Stay Updated with Clinigoal</h2>
        <p>Subscribe to our newsletter and never miss new courses or webinars.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button className="btn btn-primary" type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-grid">
          <div>
            <h3>Clinigoal</h3>
            <p>Empowering modern clinical education.</p>
          </div>
          <div className="footer-links">
      <h3>Quick Links</h3>
      <ul>
        <li onClick={() => navigate("/home")}>Home</li>
        <li onClick={() => navigate("/courses")}>Courses</li>
        <li onClick={() => navigate("/about")}>About</li>
        <li onClick={() => navigate("/contactus")}>Contact</li>
      </ul>
    </div>
    <div className="map">
      <h3>Courses </h3>
      {courses.length === 0 ? (
              <p>Loading...</p>
            ) : (
              courses.map((course) => (
                <p
                  key={course._id}
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  {course.title}
                </p>
              ))
            )}
    </div>
          
            <div className="footer-social">
      <h3>Follow Us</h3>
      <div className="social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
          Facebook
        </a><br></br>
        <a href="https://www.instagram.com/deeksha_devadiga_20/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <br></br>
        <a href="https://www.linkedin.com/in/deeksha-devadiga-091977322/" target="_blank" rel="noreferrer">
          linkedin
        </a>
        <br></br>
      </div>
    </div>
        </div>
        <div className="footer-social">
      <h3>Contact info</h3>
      <div className="social-icons">
        <a target="_blank" rel="noreferrer">
          📞 +8217052514
        </a><br></br>
        <a target="_blank" rel="noreferrer">
        📩 deekshad060@gmail.com
        </a>
        <br></br>
      </div>
    </div>
        <p className="footer-bottom">© {new Date().getFullYear()} Clinigoal – Clinical Educational. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
