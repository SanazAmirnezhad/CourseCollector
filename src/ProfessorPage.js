import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const professors = {
  "CIV100-Mechanics": [
    { name: "Micheal Seica", image: "/images/MichealSeica.png"},
    { name: "Oya Mercan", image: "/images/Oya Mercan.png"},
    { name: "Luis Ardila", image: "/images/Luis Ardila.jpeg"},
    { name: "Shoshanna Saxe", image: "/images/Shoshanna Saxe.jpg"},
    { name: "Earl Magsipoc", image: "/images/Earl Magsipoc.webp"},
  ],
  "MIE100-Dynamics": [
    { name: "Anthony Sinclair", image: "/images/Anthony Sinclair.jpg"},
  ],
  "MAT188-Linear Algebra": [
    { name: "Geoffrey McGregor", image: "/images/Geoffrey McGregor.jpeg"},
    { name: "Shai cohen", image: "/images/Shai cohen.jpg"},
    { name: "Camelia Karimian Pour", image: "/images/Camelia Karimian Pour.jpeg"},
    { name: "Denis Gorodkov", image: "/images/Denis Gorodkov.png"},
    { name: "Krzysztof Ciosmak", image: "/images/Krzysztof Ciosmak.jpg"},
    { name: "Dinushi Munasinghe", image: "/images/Dinushi Munasinghe.png"},
  ],
  "MAT186-Calculus I": [
    { name: "Jason Sieken", image: "/images/JASON SIEFKEN.jpg"},
    { name: "Geoffrey McGregor", image: "/images/Geoffrey McGregor.jpeg"},
    { name: "Shai cohen", image: "/images/Shai cohen.jpg"},
    { name: "Armanpreet Pannu", image: "/images/Armanpreet Pannu.jpeg"},
    ],
  "ECE110-Electrical Fundamentals": [
    { name: "Belinda Wang", image: "/images/Belindawang.jpg"},
    { name: "Berj Bardakjian", image: "/images/BerjBardakjian.jpeg"},
    { name: "Xilin Liu", image: "/images/XilinLiu.jpg"},
    { name: "Paul Yoo", image: "/images/PaulYoo.png"},
    { name: "Khoman Phang", image: "/images/KhomanPhang.jpg"},
  ],
  "APS110-Introduction to Materials and Chemistry": [
    { name: "Tim Bender", image: "/images/Tim Bender.jpg"},
    { name: "Scott Ramsay", image: "/images/Scott Ramsay.jpeg"},
    ],
  "APS105-Computer Fundamentals": [
    { name: "Salma Emara", image: "/images/SALMA EMARA.jpg"},
    { name: "Jon Eyolfson", image: "/images/Jon Eyolfson.jpg"},
    ],
};

const ProfessorPage = () => {
  const { course } = useParams();
  const decodedCourse = decodeURIComponent(course);
  console.log("Decoded Course:", decodedCourse); // Log the decoded course
  const professorList = professors[decodedCourse] || [];

  useEffect(() => {
    console.log(professors);
  }, [])
  return (
    <div className="professor-page">
      <h2>Professors for {decodedCourse}</h2>
      <div className="professors-container">
        {professorList.map((professor, index) => (
          <div key={index} className="professor-card">
            <img src={professor.image} alt={professor.name} className="professor-image" />
            <p>{professor.name}</p>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default ProfessorPage;


