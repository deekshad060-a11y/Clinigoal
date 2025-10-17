import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
    const API = "https://clinigoal2025-1.onrender.com"; // backend URL
    useEffect(() => {
      axios
        .get(`${API}/courses`)
        .then((res) => setCourses(res.data))
        .catch((err) => console.error("Error fetching courses:", err));
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
    <nav className="navbar">
  <h1 className="log">Clinigoal</h1>
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
        <button className="btn" onClick={() => navigate("/login")}>Register & Login</button>
      </div>
    </nav>
  );
}
