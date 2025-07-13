import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <h1 style={{ fontSize: '30px', color: 'lavender' }}>LoFo</h1>
        <div className="row">
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">about us</Link></li>
              <li><Link to="/contact">Our Services</Link></li>
              <li><Link to="#">Privacy policy</Link></li>
              <li><Link to="#">FAQS</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Our Services</Link></li>
              <li><Link to="#">Portfolio</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact info</h4>
            <ul>
              <li><Link to="#"><p><i className="fa-solid fa-phone"></i>+254768384787</p></Link></li>
              <li><Link to="#"><p><i className="fa-solid fa-envelope"></i>info@quantum.com</p></Link></li>
              <li><Link to="#"><p><i className="fa fa-map-marker"></i>5th Street, Westlands,Nairobi</p></Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <Link to="#"><i className="fab fa-facebook"></i></Link>
              <Link to="#"><i className="fab fa-twitter"></i></Link>
              <Link to="#"><i className="fab fa-instagram"></i></Link>
              <Link to="#"><i className="fab fa-youtube"></i></Link>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <p className="copyright">Copyright 2025 LOFO.All right Reserved</p>
    </footer>
  );
};

export default Footer;
