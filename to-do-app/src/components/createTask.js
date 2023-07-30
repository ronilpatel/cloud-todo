import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

console.log(JSON.parse(localStorage.getItem("user")));

const TaskForm = () => {

  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      setFormData(location.state);
    }
  }, [])

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'urgent',
    status: 'incomplete',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiURL = 'https://i0zuxml940.execute-api.us-east-1.amazonaws.com/dev/task';
      const user = JSON.parse(localStorage.getItem("user"));;
      const dataToSend = {
        ...formData,
        user,
      };

      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to create task. Please try again.');
      }
      console.log('Task created successfully!');
      
      navigate('/task/list');

    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Create Task</h1>
      </div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label>Priority:</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
            <option value="least">Least</option>
          </select>
        </div>
        <div style={formGroupStyle}>
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <button type="submit" style={buttonStyle}>Create</button>
      </form>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const formStyle = {
  width: '400px',
  padding: '20px',
  border: '2px solid #ccc',
  borderRadius: '8px',
  background: '#f7f7f7',
};

const formGroupStyle = {
  marginBottom: '20px', // Add spacing between form fields
};

const buttonStyle = {
  display: 'block',
  width: '100%',
  marginTop: '16px',
  padding: '12px',
  fontSize: '1.2rem',
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px', // Add spacing between header and form
};

export default TaskForm;
