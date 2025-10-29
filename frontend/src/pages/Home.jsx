import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ user }) {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">TaskMate</span>
            </h1>
            <p className="hero-subtitle">
              Stay organized, boost productivity, and never miss a deadline with your smart to-do list companion.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">20k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Tasks Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">More Productive</span>
              </div>
            </div>
            {!user ? (
              <div className="hero-buttons">
                <Link to="/signup" className="cta-button primary">
                  <span className="button-icon">✅</span>
                  Get Started
                </Link>
                <Link to="/login" className="cta-button secondary">
                  <span className="button-icon">👋</span>
                  Welcome Back
                </Link>
              </div>
            ) : (
              <div className="hero-buttons">
                <Link to="/tasks" className="cta-button primary">
                  <span className="button-icon">📝</span>
                  View My Tasks
                </Link>
                <Link to="/add-task" className="cta-button secondary">
                  <span className="button-icon">➕</span>
                  Add New Task
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </section>

     
    </div>
  );
}

export default Home;
