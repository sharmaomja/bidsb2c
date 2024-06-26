import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confirmIcon from '../../../assets/confirm.gif';

const OrderSuccess = () => {
  const location = useLocation();
  const { order } = location.state || {};
  const navigate = useNavigate();
  const [redirectTimer, setRedirectTimer] = useState(5);

  useEffect(() => {
    const timerId = setTimeout(() => {
      navigate('/orders');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, redirectTimer * 1000);
    return () => clearTimeout(timerId);
  }, [redirectTimer, navigate]);
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setRedirectTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <main className="bg-blue-100 h-screen flex justify-center">
      <div className="bg-white p-5 mt-32 rounded shadow-md" style={{ width: '600px', height: '600px' }}>
        <img src={confirmIcon} alt="Order Placed Successfully" className="mx-auto mb-4 w-20 h-20" />

        <h1 className="text-3xl font-bold text-gray-800 text-center mt-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 text-center mt-2">
          Your order #{order?.orderId} has been placed and will be delivered soon 🤗
        </p>
        <div className="border-t border-gray-400 mt-6 pt-6">
          <h2 className="text-lg font-semibold p-1 text-gray-800 mb-2">Order Details:</h2>
          <p className="text-gray-600 p-1">
            Order ID: <span className="font-semibold">{order?.orderId}</span>
          </p>
          <p className="text-gray-600 p-1">
            Total Price: ₹<span className="font-semibold">{Math.ceil(order?.totalPrice)}</span>
          </p>
          <p className="text-gray-600 p-1">
            Payment Method: <span className="font-semibold">{order?.paymentMethod}</span>
          </p>
          {/* Add any other details you wish to display */}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            to="/bidsb2c"
            className="bg-yellow-500 text-white mt-10 py-2 px-4 rounded-full inline-block hover:bg-yellow-400"
            style={{ minWidth: '150px' }}
          >
            Continue Shopping
          </Link>
        </div>
        <p className="text-gray-600 text-center mt-4">
          Redirecting to the orders page in {redirectTimer} seconds...
        </p>
      </div>
    </main>
  );
};

export default OrderSuccess;