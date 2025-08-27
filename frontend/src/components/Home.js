import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

/** Simple semicircle gauge with a rotating needle (no npm deps) */
function Gauge({ value, max }) {
  const safeMax = Math.max(1, max || 1);
  const pct = Math.max(0, Math.min(100, Math.round((value / safeMax) * 100)));
  const angle = -90 + (pct / 100) * 180; // -90° to +90°

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 120" className="gauge-svg" aria-label="progress gauge">
        <path d="M10 110 A 100 100 0 0 1 190 110" fill="none" stroke="#333" strokeWidth="14" />
        {[0, 25, 50, 75, 100].map((t) => {
          const a = (-90 + (t / 100) * 180) * (Math.PI / 180);
          const x1 = 100 + Math.cos(a) * 80;
          const y1 = 110 + Math.sin(a) * 80;
          const x2 = 100 + Math.cos(a) * 92;
          const y2 = 110 + Math.sin(a) * 92;
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#555" strokeWidth="2" />;
        })}
        <g transform={`rotate(${angle} 100 110)`}>
          <line x1="100" y1="110" x2="180" y2="110" stroke="#9b59b6" strokeWidth="4" />
          <circle cx="100" cy="110" r="6" fill="#9b59b6" />
        </g>
      </svg>
      <div className="gauge-caption">
        {value} / {max} Questions Solved
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_tasks: 0,
    solved_total: 0,
    solved_by_type: { frontend: 0, backend: 0, fullstack: 0 },
  });

  // Get username (adjust if you have a different auth flow)
  const currentUser = localStorage.getItem("username") || "guest";

  useEffect(() => {
    const url = `http://localhost:8000/api/stats/overview/?username=${encodeURIComponent(currentUser)}`;



    axios
      .get(url)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading stats:", err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const { total_tasks, solved_total, solved_by_type } = stats;

  const pct = (n) => {
    const denom = Math.max(1, total_tasks || 1);
    return `${Math.min(100, Math.round((n / denom) * 100))}%`;
  };

  if (loading) return <div className="home-container">Loading...</div>;

  return (
    <div className="home-container">
      <h2 className="home-quote" style={{color:"black"}}>“CodeHub — Where challenges meet coders, and solutions build the future.”</h2>

      <div className="home-grid">
        <div className="home-left">
          <Gauge value={solved_total} max={total_tasks} />
        </div>

        <div className="home-right">
          <div className="bar-row">
            <div className="bar-label">
              Frontend <span>({solved_by_type.frontend})</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill fe" style={{ width: pct(solved_by_type.frontend) }} />
            </div>
          </div>

          <div className="bar-row">
            <div className="bar-label">
              Backend <span>({solved_by_type.backend})</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill be" style={{ width: pct(solved_by_type.backend) }} />
            </div>
          </div>

          <div className="bar-row">
            <div className="bar-label">
              Fullstack <span>({solved_by_type.fullstack})</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill fs" style={{ width: pct(solved_by_type.fullstack) }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
