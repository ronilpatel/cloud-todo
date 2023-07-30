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

  const sortedTasks = tasks.sort((a, b) => {
    if (a.status === 'incomplete' && b.status === 'complete') return -1;
    if (a.status === 'complete' && b.status === 'incomplete') return 1;
    return 0;
  });

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

  const handleComplete = async (task) => {
    console.log(task)
    try {
      const body = {
        task_id: task.id,
        status: 'complete',
      };

      const response = await fetch('https://i0zuxml940.execute-api.us-east-1.amazonaws.com/dev/task/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to mark task as complete. Please try again.');
      }

      const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user?.id;
    if (user_id) {
      fetchTasks(user_id);
    }

    navigate('/task/list');
    } catch (error) {
      console.error('Failed to mark task as complete:', error.message);
    }
  };

  const navigateToLogin = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleEdit = async (task) =>    {
    console.log(task);
    navigate('/task/create', {state : task});
  }

  return (
    <div style={containerStyle}>
        <div style={headerContainerStyle}>
            <h1 style={headerStyle}>Task List</h1>
            <button
            onClick={navigateToLogin}
            style={{ fontSize: '1rem', padding: '8px 16px', marginRight: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
            Logout
            </button>
        </div>
        
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleCreateTask}
          style={{ fontSize: '1.5rem', padding: '10px 20px', marginTop: '10px', backgroundColor: 'lightgreen'}} // Larger button size
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
          {sortedTasks.map((task) => (
            <tr key={task.id}>
              <td style={tableCellStyle}>{task.title}</td>
              <td style={tableCellStyle}>{task.description}</td>
              <td style={tableCellStyle}>{task.date}</td>
              <td style={tableCellStyle}>{task.time}</td>
              <td style={tableCellStyle}>{task.priority}</td>
              <td style={{ ...tableCellStyle, color: task.status === 'complete' ? 'green' : 'red' }}>{task.status}</td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => handleEdit(task)}
                  disabled={task.status === 'complete'}
                  style={{ fontSize: '1.0rem', padding: '10px 20px', marginRight: '15px', backgroundColor: 'yellow', cursor: task.status === 'complete' ? 'not-allowed' : 'pointer',}} // Larger and yellow edit button with spacing
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{ fontSize: '1.0rem', padding: '10px 20px', marginRight: '15px', backgroundColor: 'red', color: 'white' }} // Larger and red delete button
                >
                  Delete
                </button>
                <button
                  onClick={() => handleComplete(task)}
                  style={{ fontSize: '1.0rem', padding: '10px 20px', backgroundColor: 'lightgreen', color: 'black' }} // Larger and red delete button
                >
                  Complete
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

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f7f7f7',
  };

  const headerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '5px',
    background: '#007bff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    fontSize: '2.5rem',
    padding: '5px',
    color: 'white',
  };

export default TaskList;
