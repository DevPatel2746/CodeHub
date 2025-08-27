import React, { useState } from 'react';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import UserTask from './UserTask'; // adjust path if needed
import Solutions from './Solutions'; // 👈 Import your solutions component
import Leaderboard from './Leaderboard';
import Home from './Home';

const UserDashboard = ({ setIsLoggedIn }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const navigate = useNavigate();

  const navItems = ['Home', 'Explore Tasks', 'Solutions', 'Leaderboard'];

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="dashboard-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          Welcome, {localStorage.getItem('username') || 'User'}
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
        {activeLink === 'Explore Tasks' ? (
          <UserTask />
        ): activeLink === 'Solutions' ? (
          <Solutions />  /* 👈 Show Solutions page directly when Solutions clicked */
        ): activeLink === 'Leaderboard' ? (
          <Leaderboard />  /* 👈 Show Leaderboard page directly when Solutions clicked */
        ): activeLink === 'Home' ? (
          <Home />  /* 👈 Show Home page directly when Solutions clicked */
        ) 
        : (
          <h1 className="page-title">{activeLink} Page</h1>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
