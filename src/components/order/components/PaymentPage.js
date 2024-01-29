import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OrderContext } from '../../../contexts/OrderContext';

const PaymentPage = () => {
  const { orderDetails } = useContext(OrderContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseURL = process.env.REACT_APP_API_URL;

  const handlePayment = async () => {
    setIsLoading(true);
    const paymentStatus = 'paid';

    try {
      await axios.post(`${apiBaseURL}/api/order/update-payment`, {
        orderId: orderDetails.orderId,
        paymentStatus,
      });
      navigate('/order-success', { state: { order: orderDetails } });
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 border border-solid border-gray-300 rounded bg-white shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8">Payment Details</h1>
      <div className="space-y-4">
        <div className="mb-4">
          <p className="font-semibold">Payment Method:</p>
          <p>{orderDetails.paymentMethod}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Order ID:</p>
          <p>{orderDetails.orderId}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Total Price:</p>
          <p>₹{Math.ceil(orderDetails.totalPrice)}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">Shipping Address:</p>
          <p>{orderDetails.shippingAddress}</p>
        </div>
        <h2 className="text-xl font-bold mb-4">Order Items:</h2>
        <div>
          {orderDetails.items &&
            orderDetails.items.map((item, index) => (
              <div key={index} className="bg-gray-100 p-2 border border-solid border-gray-200 rounded mb-2">
                <p className="font-semibold">{item.productName} - ₹{item.priceAtTime} x {item.quantity}</p>
              </div>
            ))}
        </div>
      </div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="block w-full p-4 text-white bg-yellow-500 border-none rounded cursor-pointer transition duration-300 hover:bg-yellow-700 focus:outline-none focus:border-yellow-300"
      >
        {isLoading ? 'Processing...' : 'Complete Purchase'}
      </button>
    </div>
  );
};

export default PaymentPage;
