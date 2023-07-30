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

  const handleDelete = async (task) => {
    try {
        console.log(task);
      const response = await fetch(`https://2krwbmgcvj.execute-api.us-east-1.amazonaws.com/task/${task}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to delete task. Please try again.');
      }

      // After successful deletion, update the state to remove the deleted task from the list
    //   setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user?.id;
    if (user_id) {
      fetchTasks(user_id);
    }
    
    navigate('/task/list');

    } catch (error) {
      console.error('Failed to delete task:', error.message);
    }
  };

  const handleEdit = async (task) =>    {
    console.log(task);
    navigate('/task/create', {state : task});
  }

  return (
    <div>
      <h1>Task List</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleCreateTask}
          style={{ fontSize: '1.5rem', padding: '10px 20px', backgroundColor: 'lightgreen'}} // Larger button size
        >
          Create Task
        </button>
      </div>
      {/* <button onClick={handleCreateTask}>Create Task</button> */}
      <br /><br /><br />
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
                <button
                  onClick={() => handleEdit(task)}
                  style={{ fontSize: '1.0rem', padding: '10px 20px', marginRight: '15px', backgroundColor: 'yellow' }} // Larger and yellow edit button with spacing
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{ fontSize: '1.0rem', padding: '10px 20px', backgroundColor: 'red', color: 'white' }} // Larger and red delete button
                >
                  Delete
                </button>
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
