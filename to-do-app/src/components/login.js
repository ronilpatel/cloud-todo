import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://6y37iig8fi.execute-api.us-east-1.amazonaws.com/dev/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Login failed. Please check your email and password.');
      }

      const data = await response.json();
      console.log('Login successful!', data.body.data[0]);
      localStorage.setItem("user", JSON.stringify(data.body.data[0]));
      navigate('/task/list');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome to the To-do List World!</h1>
    <div style={formContainerStyle}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle1}
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
        <button type="submit" style={loginButtonStyle}>Login</button>
      </form>
      <button onClick={handleSignup} style={signupButtonStyle}>
          Signup
      </button>
    </div>
    </div>
  );
};


const headingStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginTop: '30px',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column', // Changed from 'row' to 'column'
  alignItems: 'center',
  minHeight: '100vh',
  background: '#f7f7f7',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  marginTop: '10px',
  marginBottom: '10px',
  alignItems: 'center',
  width: '65%',
  marginLeft: '10px',
};

const inputStyle1 = {
  ...inputStyle,
  marginLeft: '40px',
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

const loginButtonStyle = {
  width: '100%', // Make the button broad with the size of the box
  padding: '10px', // Optional: Add padding to the button
  background: 'green', // Green background color
  color: '#fff', // White text color
  border: 'none', // Remove button border
  borderRadius: '4px', // Add border-radius for rounded corners
  cursor: 'pointer', // Show pointer cursor on hover
  marginTop: '10px',
};

const signupButtonStyle = {
  ...loginButtonStyle,
  background: 'blue', // Blue background color for Signup button
};

export default LoginPage;
