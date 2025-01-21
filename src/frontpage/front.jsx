import React from 'react';
import { Link } from 'react-router-dom';
import './SOSPage.css'; 
import Login from '../pages/Login';
import Register from '../pages/Register';

const SOSPage = () => {
  return (
    <div className="sos-page">
      <div className="sos-header">
        <h1>Welcome to SOS Help</h1>
        <p>Your Safety Companion in Emergency Situations</p>
      </div>
      <div className="sos-content">
        <div className="sos-intro">
          <h2>What We Offer</h2>
          <p>
            Our platform is designed to provide assistance in critical situations. With features like 
            quick access to help, real-time alerts for you to help someone,we ensure your safety at all time.
          </p>
        </div>
        <div className="sos-features">
          <div className="feature">
            <h3>Instant SOS Alerts</h3>
            <p>Send real-time emergency alerts to your nearby peoples with just one click.</p>
          </div>
          <div className="feature">
            <h3>Geo-Location Tracking</h3>
            <p>Share your location with your current location peoples's during emergencies for quick assistance.</p>
          </div>
          <div className="feature">
            <h3>24/7 Support</h3>
            <p>Access emergency resources and helplines anytime, anywhere.</p>
          </div>
        </div>
      </div>
      <div className="sos-footer">
        <h2>Get Started</h2>
        <div className="auth-links">
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn register-btn">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
