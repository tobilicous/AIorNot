import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setName(e.target.value);

  const BACKEND_URL = '/api'; // Do not forget to change DATA_PATH
  // const BACKEND_URL = 'http://localhost:5000/api'; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const responseData = await response.json();
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(errorData.message || 'Login failed.');
      }
      
      localStorage.setItem('name', responseData.name);
      
      alert(`Login successful! Welcome ${responseData.name}!`);
      navigate('/quiz');

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Log In</h2>
      <p>Please enter your username to log in or sign up automatically if you're a new user.</p>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Log In</button>
      </form>
    </div>
  );
};

export default Login;
