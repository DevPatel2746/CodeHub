import React, { useEffect, useState } from "react";
import "./Leaderboard.css";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/leaderboard/")
      .then((res) => res.json())
      .then((data) => setLeaders(data))
      .catch((err) => console.error("Error fetching leaderboard:", err));
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Solutions Submitted</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((entry) => (
  <tr key={entry.username}>
    <td>{entry.rank}</td>
    <td>{entry.username}</td>
    <td>{entry.solutions_submitted}</td>
  </tr>
))}


        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
