// TaskList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const handleCreateTask = () => {
    navigate('/task/create');
  };

  useEffect(() => {
    // Fetch tasks from the API using the user_id from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user?.id;
    if (user_id) {
      fetchTasks(user_id);
    }
  }, []);

  const fetchTasks = async (user_id) => {
    try {
      const response = await fetch(`https://2krwbmgcvj.execute-api.us-east-1.amazonaws.com/task/${user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks.');
      }
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      // Make API call to delete the task with taskId
      // ... Implement delete API call here ...

      // After successful deletion, update the state to remove the deleted task from the list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error.message);
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      <button onClick={handleCreateTask}>Create Task</button> {/* New "Create Task" button */}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Title</th>
            <th style={tableHeaderStyle}>Description</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Time</th>
            <th style={tableHeaderStyle}>Priority</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td style={tableCellStyle}>{task.title}</td>
              <td style={tableCellStyle}>{task.description}</td>
              <td style={tableCellStyle}>{task.date}</td>
              <td style={tableCellStyle}>{task.time}</td>
              <td style={tableCellStyle}>{task.priority}</td>
              <td style={tableCellStyle}>{task.status}</td>
              <td style={tableCellStyle}>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// CSS styles for table headers
const tableHeaderStyle = {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd',
  };
  
  // CSS styles for table cells
  const tableCellStyle = {
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ddd',
  };

export default TaskList;
