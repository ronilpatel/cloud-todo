import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AWS from 'aws-sdk';

console.log(JSON.parse(localStorage.getItem("user")));

const TaskForm = () => {
  const [taskCreateEndpointUrl, setTaskCreateEndpointURL] = useState('');
  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      setFormData(location.state);
    }

    AWS.config.update({
      accessKeyId: 'ASIASWTOHHX6P7GYTTMU',
      secretAccessKey: 'gxkLlFwNTSVDpVWTtmsMTIxLkZSyMfUiLvUWtgVG',
      sessionToken: 'FwoGZXIvYXdzEEQaDFSrGOrSowTpBS/3dyLAAYUVTlGI1o4TUy3R8Rpbl6AdUBukcLo2nkd3yJwQEBj0our58B7jsR/d5csMRB852TfnloAIwNALCYDw5KYiSmipKJG69k9cuFuGZ9OVoQ9B+/aZt6GqhmTnEyRcBCUxt92+SG36XjwON7GWkISQWcwpx/4cWp7pOidq+mB+nBnX0tlnLj55yRNZNQXafQSb6BcuDqALrOUWpjYLFdVgM7lBmM4u7MKi44njcipBpo+dFEZuDhkB2RQcRCvXbMYynyil5KGmBjIt58OGa5CNiwX/Q5wK6mu1gAyRPXXRPJ5u+MMLX1mttz2VQkOpuFQde5oSwS0c',
      region: 'us-east-1',
    });

    const secretsManager = new AWS.SecretsManager();
    
    const secretName = 'prod/todoapp/reactjs';
    const params = {
      SecretId: secretName,
    };

    secretsManager.getSecretValue(params, function (err, data) {
      if (err) {
        console.log('Error retrieving secret:', err);
      } else {
        console.log(data);
        if ('SecretString' in data) {
          const secretString = data.SecretString;
          
          const secretData = JSON.parse(secretString);
          console.log(secretData);
          setTaskCreateEndpointURL(secretData.CreateTaskAPIEndpoint);
        } else {
          console.log('Binary secret not supported.');
        }
      }
    });
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
      const apiURL = `${taskCreateEndpointUrl}/task`;
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
            disabled
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
  marginBottom: '20px', 
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
  marginBottom: '20px',
};

export default TaskForm;
