import React from 'react';
import Layout from '../layout/Layout';
import '../../assets/css/About.css';

const AboutPage = () => {
  return (
    <Layout>
      <section className="about-content">
        <div className="container">
          <h2>What is LoFo?</h2>
          <p>LoFo is a dedicated lost and found platform designed to help reconnect people with their lost belongings. Our mission is to create a centralized, easy-to-use system where users can search for items they've lost and browse through found items reported by others.</p>
          
          <div className="features">
            <div className="feature">
              <i className="fas fa-search"></i>
              <h3>Easy Search</h3>
              <p>Our powerful search system helps you quickly locate items matching your description across multiple categories.</p>
            </div>
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <h3>Secure Platform</h3>
              <p>We prioritize the security and privacy of our users while facilitating the recovery of lost items.</p>
            </div>
            <div className="feature">
              <i className="fas fa-users"></i>
              <h3>Community-Driven</h3>
              <p>Our platform brings together a community of helpful individuals dedicated to returning lost items to their rightful owners.</p>
            </div>
          </div>

          <div className="mission">
            <h2>Our Mission</h2>
            <p>At LoFo, we understand the distress of losing personal belongings. Our platform aims to streamline the process of recovering lost items by providing a user-friendly interface and efficient search capabilities. We believe in the power of community and technology working together to help people recover their valuable possessions.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
