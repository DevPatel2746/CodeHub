import React, { useState, useEffect } from "react";
import "./UserTask.css";
import axios from "axios";

function UserTask() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedType, setSelectedType] = useState("frontend");
  const [expandedTask, setExpandedTask] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/tasks/")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data.filter((task) => task.task_type === "frontend"));
      });
  }, []);

  const filterTasks = (type) => {
    setSelectedType(type);
    setFilteredTasks(tasks.filter((task) => task.task_type === type));
  };

  const handleExpand = (task) => {
    setExpandedTask(task);
  };

  const handleClose = () => {
    setExpandedTask(null);
    setFile(null); // Reset file input when closing
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getCSRFToken = () => {
    const name = "csrftoken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArr = decodedCookie.split(";");
    for (let c of cookieArr) {
      let cookie = c.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  };

  const handleSubmitSolution = async () => {
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("solution", file);
    formData.append("question", expandedTask.title);  // <-- Add this line


    try {
      const res = await axios.post(
        "http://localhost:8000/api/upload-solution/", // updated to match backend function
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": getCSRFToken()
          },
          withCredentials: true // send cookies for authentication
        }
      );
      if (res.status === 201) {
        alert("Solution submitted successfully!");
        setFile(null);
      } else {
        alert("Error submitting solution.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error submitting solution.");
    }
  };

  return (
    <div className="user-task-container">
      {!expandedTask ? (
        <>
          <div className="task-buttons">
            <button
              className={`task-btn ${selectedType === "frontend" ? "active" : ""}`}
              onClick={() => filterTasks("frontend")}
            >
              Frontend
            </button>
            <button
              className={`task-btn ${selectedType === "backend" ? "active" : ""}`}
              onClick={() => filterTasks("backend")}
            >
              Backend
            </button>
            <button
              className={`task-btn ${selectedType === "fullstack" ? "active" : ""}`}
              onClick={() => filterTasks("fullstack")}
            >
              Fullstack
            </button>
          </div>

          <div className="task-cards">
            {filteredTasks.map((task) => (
              <div
                className="task-card"
                key={task.id}
                onClick={() => handleExpand(task)}
              >
                <h3>{task.title}</h3>
                <span className={`task-type-badge ${task.task_type}`}>
                  {task.task_type}
                </span>
                <p className="task-question">{task.question}</p>
                <div className="task-bottom">
                  <span>{task.date}</span>
                  {/* <span>{task.response} Responses</span> */}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="expanded">
          <button className="close-btn" onClick={handleClose}>
            ✖
          </button>
          <h2>{expandedTask.title}</h2>
          <span className={`task-type-badge ${expandedTask.task_type}`}>
            {expandedTask.task_type}
          </span>
          <p>{expandedTask.question}</p>

          {/* File upload section */}
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSubmitSolution}>Submit Solution</button>
        </div>
      )}
    </div>
  );
}

export default UserTask;
