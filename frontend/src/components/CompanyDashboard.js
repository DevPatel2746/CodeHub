import React, { useState } from 'react';
import './CompanyDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import CompanyTask from './CompanyTask';
import Solutions from './Solutions'; // 👈 Import your solutions component
import Leaderboard from './Leaderboard';
import CompanyHome from './CompanyHome';

const CompanyDashboard = ({ setIsLoggedIn }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = ['Home', 'Tasks', 'Solutions', 'Leaderboard'];

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  // Check if on Tasks page
  const isTaskPage = activeLink === 'Tasks';

  return (
    <div className="dashboard-wrapper">
      <nav className={`navbar ${isTaskPage ? 'task-navbar' : ''}`}>
        <div className="navbar-left">
          Welcome, {localStorage.getItem('username') || 'CompanyUser'}
        </div>
        <div className="navbar-right">
          {navItems.map((item) => (
            <div
              key={item}
              className={`nav-link ${activeLink === item ? 'active' : ''}`}
              onClick={() => setActiveLink(item)}
            >
              {item}
            </div>
          ))}
          <div className="nav-link logout" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {activeLink === 'Tasks' ? (
          <CompanyTask />
        ): activeLink === 'Solutions' ? (
                  <Solutions />  /* 👈 Show Solutions page directly when Solutions clicked */
                ): activeLink === 'Leaderboard' ? (
                  <Leaderboard />  /* 👈 Show Leaderboard page directly when Solutions clicked */
                ): activeLink === 'Home' ? (
                  <CompanyHome companyName={localStorage.getItem("username")}/>  /* 👈 Show Home page directly when Solutions clicked */
                )
         : (
          <h1 className="page-title">{activeLink} Page</h1>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
