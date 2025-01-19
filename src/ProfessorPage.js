import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const professors = {
  "CIV100-Mechanics": [
    { name: "Micheal Seica", image: "/MichealSeica.png" },
    { name: "Oya Mercan", image: "/Oya Mercan.png" },
    { name: "Luis Ardila", image: "/Luis Ardila.jpeg" },
    { name: "Shoshanna Saxe", image: "/Shoshanna Saxe.jpg" },
    { name: "Earl Magsipoc", image: "/Earl Magsipoc.webp" },
  ],
  "MIE100-Dynamics": [
    { name: "Anthony Sinclair", image: "/Anthony Sinclair.jpg" },
  ],
  "MAT188-Linear Algebra": [
    { name: "Geoffrey McGregor", image: "/Geoffrey McGregor.jpeg" },
    { name: "Shai cohen", image: "/Shai cohen.jpg" },
    { name: "Camelia Karimian Pour", image: "/Camelia Karimian Pour.jpeg" },
    { name: "Denis Gorodkov", image: "/Denis Gorodkov.png" },
    { name: "Krzysztof Ciosmak", image: "/Krzysztof Ciosmak.jpg" },
    { name: "Dinushi Munasinghe", image: "/Dinushi Munasinghe.png" },
  ],
  "MAT186-Calculus I": [
    { name: "Jason Sieken", image: "/JASON SIEFKEN.jpg" },
    { name: "Geoffrey McGregor", image: "/Geoffrey McGregor.jpeg" },
    { name: "Shai cohen", image: "/Shai cohen.jpg" },
    { name: "Armanpreet Pannu", image: "/Armanpreet Pannu.jpeg" },
  ],
  "ECE110-Electrical Fundamentals": [
    { name: "Belinda Wang", image: "/Belindawang.jpg" },
    { name: "Berj Bardakjian", image: "/BerjBardakjian.jpeg" },
    { name: "Xilin Liu", image: "/XilinLiu.jpg" },
    { name: "Paul Yoo", image: "/PaulYoo.png" },
    { name: "Khoman Phang", image: "/KhomanPhang.jpg" },
  ],
  "APS110-Introduction to Materials and Chemistry": [
    { name: "Tim Bender", image: "/Tim Bender.jpg" },
    { name: "Scott Ramsay", image: "/Scott Ramsay.jpeg" },
  ],
  "APS105-Computer Fundamentals": [
    { name: "Salma Emara", image: "/SALMA EMARA.jpg" },
    { name: "Jon Eyolfson", image: "/Jon Eyolfson.jpg" },
  ],
};

const ProfessorPage = () => {
  const { course } = useParams();
  const navigate = useNavigate();

  const decodedCourse = decodeURIComponent(course);
  const professorList = professors[decodedCourse] || [];

  useEffect(() => {
    console.log(professors);
  }, []);

  const handleProfessorClick = (professorName) => {
    navigate(`/profile/${encodeURIComponent(professorName)}`);
  };

  return (
    <div className="professor-page">
      <h2>Professors for {decodedCourse}</h2>
      <div className="professors-container">
        {professorList.map((professor, index) => (
          <div
            key={index}
            className="professor-card"
            onClick={() => handleProfessorClick(professor.name)}
            style={{ cursor: "pointer" }} // Add a pointer cursor for better UX
          >
            <img src={professor.image} alt={professor.name} className="professor-image" />
            <p>{professor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorPage;
