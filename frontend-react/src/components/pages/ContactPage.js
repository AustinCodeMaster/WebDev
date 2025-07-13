import React, { useState } from 'react';
import Layout from '../layout/Layout';
import '../../assets/css/Contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission
    setFormStatus({ submitted: true, error: null });
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // In a real application, you would submit this data to your backend
    // Example:
    // axios.post('http://localhost:3000/api/contact', formData)
    //   .then(response => {
    //     setFormStatus({ submitted: true, error: null });
    //     setFormData({ name: '', email: '', subject: '', message: '' });
    //   })
    //   .catch(error => {
    //     setFormStatus({ submitted: false, error: 'An error occurred. Please try again.' });
    //   });
  };

  return (
    <Layout>
      <section className="contact-section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Have questions about the platform or need assistance with a lost item? Our team is here to help.</p>
              
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Our Location</h3>
                  <p>5th Street, Westlands, Nairobi</p>
                </div>
              </div>
              
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email Us</h3>
                  <p>info@quantum.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <h3>Call Us</h3>
                  <p>+254768384787</p>
                </div>
              </div>
              
              <div className="social-links">
                <a href="https://facebook.com/lofoapp" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com/lofoapp" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a href="https://instagram.com/lofoapp" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://linkedin.com/company/lofoapp" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            
            <div className="contact-form">
              <h2>Send us a message</h2>
              {formStatus.submitted ? (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Send Message <i className="fas fa-paper-plane"></i>
                  </button>
                  
                  {formStatus.error && <div className="error-message">{formStatus.error}</div>}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
