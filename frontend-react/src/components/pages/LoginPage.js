import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      
      if (response.data.success) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on user role
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
    }
  };

  return (
    <section className="login-section">
      <div className="login-box">
        <h2 className="login-title">Welcome to LoFo</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">
              <i className="fa-solid fa-user"></i> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <i className="fa-solid fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
