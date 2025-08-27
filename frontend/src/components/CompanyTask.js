import React, { useEffect, useState } from 'react';
import './CompanyTask.css';

const CompanyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    task_type: '',
    date: ''
  });

  const companyName = localStorage.getItem('username');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tasks/${companyName}/`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data);
      } else {
        console.error('❌ Error fetching tasks:', data);
      }
    } catch (err) {
      console.error('❌ Network error while fetching tasks:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTask = async (e) => {
    e.preventDefault();
    const { title, question, task_type, date } = formData;
    if (!title || !question || !task_type || !date) return;

    const payload = {
      company_name: companyName,
      title,
      question,
      task_type,
      date
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/add-task/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ title: '', question: '', task_type: '', date: '' });
        fetchTasks(); // Refresh list
      } else {
        console.error('❌ Failed to add task:', data);
      }
    } catch (err) {
      console.error('❌ Network error while adding task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/delete-task/${taskId}/`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        console.error('❌ Error deleting task');
      }
    } catch (err) {
      console.error('❌ Network error while deleting task:', err);
    }
  };

  const getBadgeClass = (type) => {
    if (type === 'frontend') return 'badge-frontend';
    if (type === 'backend') return 'badge-backend';
    if (type === 'fullstack') return 'badge-fullstack';
    return '';
  };

  return (
    <div className="task-container">
      {/* Left Section - Task Cards */}
      <div className="task-left">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className={`task-badge ${getBadgeClass(task.task_type)}`}>
                {task.task_type}
              </div>
            </div>
            <p className="task-question">{task.question}</p>
            <div className="task-footer">
              <span className="task-date">Date: {task.date || '-'}</span>
              {/* <span className="task-response">Responses: {task.response || '0'}</span> */}
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
          </div>
        ))}
      </div>

      {/* Right Section - Add Task Form */}
      <div className="task-right">
        <form className="form-card" onSubmit={addTask}>
          <h2>Add Task</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="question"
            placeholder="Question"
            rows="5"
            value={formData.question}
            onChange={handleChange}
            required
          />
          <div>
            <label><strong>Task Type:</strong></label>
            <div style={{ display: 'flex', gap: '15px', margin: '10px 0' }}>
              {['frontend', 'backend', 'fullstack'].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="task_type"
                    value={type}
                    checked={formData.task_type === type}
                    onChange={handleChange}
                  /> {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <label><strong>Date:</strong></label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default CompanyTask;
