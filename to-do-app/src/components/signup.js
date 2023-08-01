// SignUpPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';

const SignUpPage = () => {
  const [taskCreateEndpointUrl, setTaskCreateEndpointURL] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
   
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
  }, []);


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
        const response = await fetch(`${taskCreateEndpointUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to register. Please try again.');
      }

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

const formContainerStyle = {
  width: '350px',
  padding: '30px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const inputStyle = {
  width: '93%', 
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  marginTop: '10px',
  marginBottom: '10px',
};

const signupButtonStyle = {
  width: '100%', 
  padding: '10px', 
  background: 'green', 
  color: '#fff', 
  border: 'none',
  borderRadius: '4px', 
  cursor: 'pointer',
  marginTop: '10px',
};

const loginButtonStyle = {
  ...signupButtonStyle,
  background: '#4285F4',
  marginTop: '20px',
};


export default SignUpPage;
