import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import ProfessorPage from "./ProfessorPage";

const courses = [
  "CIV100-Mechanics",
  "MIE100-Dynamics",
  "MAT188-Linear Algebra",
  "MAT186-Calculus I",
  "ECE110-Electrical-Fundamentals",
  "APS110-Introduction to Materials and Chemistry",
  "APS105-Computer Fundamentals",
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      const results = courses.filter((course) =>
        course.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredCourses(results);
    } else {
      setFilteredCourses([]);
    }
  };

  const handleCourseClick = (course) => {
    console.log(course);
    console.log("Encoded Course:", encodeURIComponent(course)); // Log the encoded course
    navigate(`/course/${encodeURIComponent(course)}`);
  };
  

  return (
    <div className="gradient-container">
      <h1>Know your courses inside out.</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a course..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button type="submit" className="search-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
          >
            <g id="Icon">
              <path
                id="Vector"
                d="M16.0418 16.0416L12.9168 12.9166M3.9585 9.16659C3.9585 6.2901 6.29035 3.95825 9.16683 3.95825C12.0433 3.95825 14.3752 6.2901 14.3752 9.16659C14.3752 12.0431 12.0433 14.3749 9.16683 14.3749C6.29035 14.3749 3.9585 12.0431 3.9585 9.16659Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </button>
      </div>
      {filteredCourses.length > 0 && (
        <ul className="dropdown">
          {filteredCourses.map((course, index) => (
            <li key={index} onClick={() => handleCourseClick(course)}>
              {course}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:course" element={<ProfessorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
