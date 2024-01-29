import React, { useState } from 'react';
import axios from 'axios';

const Help = () => {
  const [email, setEmail] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleEmailContact = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('to', 'omjasharma15@gmail.com');
      formData.append('subject', 'User Query');
      formData.append('body', `User Email: ${email}\n\nIssue Details: ${issueDetails}`);

      attachments.forEach((file, index) => {
        formData.append(`attachment_${index + 1}`, file);
      });

      const response = await axios.post('/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleWhatsappContact = () => {
    window.location.href = 'https://wa.me/919890728768';
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAttachments(selectedFiles);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Help & Customer Service</h1>

      {/* Email Contact */}
      <div className="mb-8 bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Contact Us via Email</h2>
        <form onSubmit={handleEmailContact}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border rounded-md"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="issueDetails" className="block text-sm font-medium text-gray-700">
              Issue Details
            </label>
            <textarea
              id="issueDetails"
              name="issueDetails"
              className="w-full p-2 border rounded-md resize-none"
              rows="4"
              placeholder="Tell us more about your issue..."
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
              Attach Images (optional)
            </label>
            <input
              type="file"
              id="fileInput"
              name="attachments"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              className="mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600"
          >
            Email Us
          </button>
        </form>
      </div>

      {/* WhatsApp Contact */}
      <div className="mt-4 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Contact Us on WhatsApp</h2>
        <button
          onClick={handleWhatsappContact}
          className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Chat on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Help;
