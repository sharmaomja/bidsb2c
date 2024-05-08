import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AuthForm = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const apiBaseURL = 'http://localhost:8000'; // Replace with your actual API URL

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseURL}/users/forget-password`, { email: formData.email });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      {/* ... (your existing JSX for form) */}
      <div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <input
          type="email"
          value={formData.email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          // Add other necessary attributes
        />
        <button onClick={handleForgotPassword}>Reset Password</button>
      </div>
      {/* ... (your existing JSX) */}
    </div>
  );
};

export default AuthForm;








