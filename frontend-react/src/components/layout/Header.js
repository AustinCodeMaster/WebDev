import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  // Load user on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Navigate to login page
    navigate('/login');
  };

  // Check if user is admin (this depends on your user roles implementation)
  const isAdmin = user && user.role === 'admin';

  // Determine which header content to show based on current path
  const renderHeaderContent = () => {
    const path = location.pathname;
    
    if (path.includes('/about')) {
      return (
        <div className="text-box">
          <h1>About LoFo</h1>
          <p>Your trusted Lost and Found Platform</p>
        </div>
      );
    } else if (path.includes('/contact')) {
      return (
        <div className="text-box">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you!</p>
        </div>
      );
    } else if (path.includes('/home')) {
      return (
        <div className="text-box">
          <h2 className="welcome-message">Welcome {user?.username}</h2>
          <div className="search-container">
            {/* Search container elements will be handled in HomePage component */}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="header">
      <nav>
        <div className="logo">
          <h2>LoFo</h2>
        </div>
        <div className="nav-links">
          <ul>
            <li><Link to="/home">HOME</Link></li>
            <li><Link to="/about">ABOUT US</Link></li>
            <li><Link to="/contact">CONTACT US</Link></li>
            {isAdmin && <li><Link to="/admin">ADMIN</Link></li>}
            <li><button className="logout-btn" onClick={handleLogout}>LOG OUT</button></li>
          </ul>
        </div>
      </nav>
      {renderHeaderContent()}
    </header>
  );
};

export default Header;