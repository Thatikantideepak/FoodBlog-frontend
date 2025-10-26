import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleClose = () => {
    navigate("/");
  };

  if (!user) {
    return (
      <div className="account-popup">
        <div className="account-popup-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-popup" onClick={handleClose}>
      <div className="account-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>×</button>
        <h2>Account Information</h2>
        <div className="account-info">
          <div className="info-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-item">
            <label>Member Since:</label>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
  {/* Logout option removed from account page per request */}
      </div>
    </div>
  );
}
