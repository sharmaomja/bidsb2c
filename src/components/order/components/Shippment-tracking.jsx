import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ShipmentTrackingPage = () => {
  const [trackingId, setTrackingId] = useState('');

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    // Perform any tracking-related logic or redirection here
    // You can use the trackingId state to perform actions or redirect to the tracking page
    console.log('Tracking ID:', trackingId);

    // Redirect the user to the tracking page (replace the URL with your actual tracking URL)
    window.location.href = `https://example.com/track/${trackingId}`;
  };

  return (
    <div className="mx-auto bg-white max-w-2xl mt-36 px-6 py-8 rounded-md shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl my-3 font-bold tracking-tight text-gray-900">Track Your Shipment</h1>
        <p className="text-gray-600 mb-6">
          Enter your tracking ID below to track the status of your shipment.
        </p>
      </div>
      <form onSubmit={handleTrackingSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border border-gray-500 rounded-md p-3 w-full mb-4 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring focus:border-blue-300"
        >
          Track Shipment
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have a tracking ID?{' '}
          <Link to="/contact" className="text-blue-500 hover:underline">
            Contact us
          </Link>{' '}
          for assistance.
        </p>
      </div>
    </div>
  );
};

export default ShipmentTrackingPage;
