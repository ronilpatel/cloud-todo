// TaskForm.js
import React, { useState } from 'react';

const TaskForm = () => {
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
      const user = {
        id: '4a302c1d-2e5d-11ee-949d-4551c1e4c1b2',
        name: 'Ronil Patel',
        email: 'ronil.patel@dal.ca',
        password: '123456789',
      };
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

      // The API response can be processed here if needed
      console.log('Task created successfully!');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
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
        <div>
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
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default TaskForm;
