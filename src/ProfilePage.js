import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Papa from "papaparse";
import csvFile from "./professor_reviews_with_classnames.csv";
import "./App.css"; // Ensure this includes the necessary CSS for styling

const ProfilePage = () => {
  const { professorName } = useParams();
  const [weightedAverage, setWeightedAverage] = useState(null);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    // Parse the CSV file and filter reviews for the given professor
    Papa.parse(csvFile, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;

        // Filter reviews for the current professor
        const filteredData = data.filter(
          (entry) => entry.professor_name === professorName
        );

        if (filteredData.length > 0) {
          // Calculate weighted average for the rating
          const ratings = filteredData.map((entry) => ({
            score: parseFloat(entry.quality_rating),
            date: new Date(entry.date),
          }));

          ratings.sort((a, b) => b.date - a.date);

          const totalWeight = ratings.reduce((sum, _, index) => sum + (index + 1), 0);
          const weightedSum = ratings.reduce(
            (sum, { score }, index) => sum + score * (index + 1),
            0
          );

          const weightedAvg = (weightedSum / totalWeight).toFixed(2);
          setWeightedAverage(weightedAvg);

          // Generate a structured summary
          const comments = filteredData.map((entry) => entry.comments).filter(Boolean);

          const positiveKeywords = ["helpful", "clear", "organized", "engaging"];
          const negativeKeywords = ["boring", "unclear", "disorganized", "strict"];
          const positiveCount = comments.reduce(
            (sum, comment) =>
              sum +
              positiveKeywords.reduce(
                (count, keyword) =>
                  count + (comment.toLowerCase().includes(keyword) ? 1 : 0),
                0
              ),
            0
          );
          const negativeCount = comments.reduce(
            (sum, comment) =>
              sum +
              negativeKeywords.reduce(
                (count, keyword) =>
                  count + (comment.toLowerCase().includes(keyword) ? 1 : 0),
                0
              ),
            0
          );

          const summaryText = `Based on reviews, students often find ${
            professorName
          } to be ${
            positiveCount >= negativeCount
              ? "helpful and clear in explanations"
              : "challenging and less engaging"
          }. The professor is ${
            positiveCount >= negativeCount ? "highly organized" : "sometimes disorganized"
          } and ${
            positiveCount >= negativeCount
              ? "creates a positive learning environment"
              : "may require additional effort from students to follow along."
          }`;

          setSummary(summaryText);
        }
      },
    });
  }, [professorName]);

  return (
    <div
      className="profile-page"
      style={{
        background: "linear-gradient(300deg, deepskyblue, darkviolet, blue)",
        backgroundSize: "180% 180%",
        animation: "gradient-animation 8s ease infinite",
        padding: "40px",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <div
        className="profile-container"
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "20px",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 className="profile-header" style={{ color: "#4A47A3" }}>
          {professorName}
        </h1>
        <p className="profile-description" style={{ color: "#4A47A3" }}>
          Overall, they are rated as{" "}
          <strong>{weightedAverage ? `${weightedAverage}/5` : "Loading..."}</strong> by previous
          students. <br />
          {summary || "Generating summary..."}
        </p>
      </div>

      <div
        className="upload-section"
        style={{
          marginTop: "40px",
          padding: "30px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "2px dashed white",
          borderRadius: "15px",
          textAlign: "center",
          maxWidth: "600px",
          width: "90%",
        }}
      >
        <p className="upload-text" style={{ color: "white", fontSize: "1.2rem" }}>
          Upload or drag your files here
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
