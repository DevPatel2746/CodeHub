import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from "./components/LoginSignup";
import UserDashboard from "./components/UserDashboard";
import CompanyDashboard from "./components/CompanyDashboard";
import Solutions  from "./components/Solutions"; 
import Home from "./components/Home";
import CompanyHome from "./components/CompanyHome";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userType, setUserType] = useState(localStorage.getItem("userType"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserType(localStorage.getItem("userType"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              userType === "company" ? (
                <Navigate to="/companydashboard" />
              ) : (
                <Navigate to="/userdashboard" />
              )
            ) : (
              <LoginSignup setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/userdashboard"
          element={
            isLoggedIn ? (
              <UserDashboard setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/companydashboard"
          element={
            isLoggedIn ? (
              <CompanyDashboard setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/" element={<Home />} />         
        <Route path="/companydashboard" element={<CompanyHome />} />
      </Routes>
    </Router>
  );
}

export default App;
