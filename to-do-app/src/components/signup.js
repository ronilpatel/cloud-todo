// SignUpPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginClick = () => {
    navigate('/login');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://6y37iig8fi.execute-api.us-east-1.amazonaws.com/dev/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to register. Please try again.');
      }

      // The API response can be processed here if needed
      console.log('Registration successful!');

      navigate('/login');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome Back to the world of To-Do List</h1>
      <div style={formContainerStyle}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={signupButtonStyle}>Sign Up</button>
        </form>
        <button onClick={handleLoginClick} style={loginButtonStyle}>Login</button>
      </div>
    </div>
  );
};
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: '#f7f7f7',
};

const headingStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginTop: '30px',
};

// CSS styles for the form container
const formContainerStyle = {
  width: '350px',
  padding: '30px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const inputStyle = {
  width: '93%', // Make all text fields the same width as the form container
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  marginTop: '10px',
  marginBottom: '10px',
};

const signupButtonStyle = {
  width: '100%', // Make the button the same width as the form container
  padding: '10px', // Optional: Add padding to the button
  background: 'green', // Green background color
  color: '#fff', // White text color
  border: 'none', // Remove button border
  borderRadius: '4px', // Add border-radius for rounded corners
  cursor: 'pointer', // Show pointer cursor on hover
  marginTop: '10px',
};

const loginButtonStyle = {
  ...signupButtonStyle,
  background: '#4285F4', // Blue background color
  marginTop: '20px', // Add some space between the buttons
};


export default SignUpPage;
