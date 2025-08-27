import React, { useState, useEffect } from "react";
import "./Solutions.css";

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/solutions/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSolutions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching solutions:", error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = async (filePath) => {
    try {
      // Make sure file path starts with /media/
      let normalizedPath = filePath;
      if (!normalizedPath.startsWith("/media/")) {
        normalizedPath = `/media/${normalizedPath.replace(/^\/+/, "")}`;
      }

      const fileUrl = `http://localhost:8000${normalizedPath}`;

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  if (loading) {
    return <div className="solutions-container">Loading...</div>;
  }

  return (
    <div className="solutions-container">
      {solutions.length === 0 ? (
        <p>No solutions found.</p>
      ) : (
        solutions.map((solution, index) => (
          <div
            key={index}
            className="solution-card"
            onClick={() => handleCardClick(solution.solution)}
          >
            <div className="solution-top">
              <h3 className="solution-question">{solution.question}</h3>
              <span className="solution-type">{solution.type}</span>
            </div>
            <div className="solution-bottom">
              <p>Uploaded by: {solution.username}</p>
              <p>Date: {new Date(solution.uploaded_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Solutions;
