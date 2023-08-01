import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';


const LoginPage = () => {
  const [taskCreateEndpointUrl, setTaskCreateEndpointURL] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${taskCreateEndpointUrl}/login`, {
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
  flexDirection: 'column',
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


const formContainerStyle = {
  width: '350px',
  padding: '30px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const loginButtonStyle = {
  width: '100%', 
  padding: '10px', 
  background: 'green',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};

const signupButtonStyle = {
  ...loginButtonStyle,
  background: 'blue',
};

export default LoginPage;
