import React, { useEffect, useState } from "react";
import "./CompanyHome.css";

function CompanyHome({ companyName }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/stats/company/?company=${companyName}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, [companyName]);

  if (!stats) {
    return <div className="company-home">Loading...</div>;
  }

  return (
    <div className="company-home">
      <h2 className="quote">“CodeHub — Where challenges meet coders, and solutions build the future.”</h2>

      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.total_tasks}</h3>
          <p>Total Questions Uploaded</p>
        </div>
        <div className="stat-card">
          <h3>{stats.frontend}</h3>
          <p>Frontend Questions</p>
        </div>
        <div className="stat-card">
          <h3>{stats.backend}</h3>
          <p>Backend Questions</p>
        </div>
        <div className="stat-card">
          <h3>{stats.fullstack}</h3>
          <p>Fullstack Questions</p>
        </div>
      </div>
    </div>
  );
}

export default CompanyHome;
