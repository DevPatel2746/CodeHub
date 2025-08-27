import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const LoginSignup = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          // ✅ Save session data
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', formData.username);
          localStorage.setItem('userType', data.userType);
          setIsLoggedIn(true);

          // ✅ Redirect based on userType
          setTimeout(() => {
            if (data.userType === 'user') {
              navigate('/userdashboard');
            } else if (data.userType === 'company') {
              navigate('/companydashboard');
            } else {
              navigate('/dashboard');
            }
          }, 100);
        } else {
          alert('✅ Registration successful. Please login.');
          setIsLogin(true);
        }
      } else {
        alert(data.error || '❌ Something went wrong.');
      }
    } catch (err) {
      console.error('❌ Network error', err);
      alert('❌ Network error. Check backend.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to CodeHub</h2>

        <div className="toggle-buttons">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Signup</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Name"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="user">User</option>
              <option value="company">Company</option>
            </select>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
