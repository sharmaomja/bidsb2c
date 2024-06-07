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
    try {
      const response = await axios.post(`${apiBaseURL}/payment`, {
        orderId: orderDetails.orderId,
        amount: orderDetails.totalPrice,
        redirectUrl: `${window.location.origin}/order-success`,
        userId: orderDetails.userId,
        mobileNumber: '9876543210', 
      });

      console.log('Payment initiation response:', response.data);

      const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address) => {
    const addressLines = address.split("\\n");
    return addressLines.join(', ');
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 border border-solid border-gray-300 rounded bg-white shadow-md">
      <h1 className="text-3xl font-semi bold text-center mb-8 underline">Payment Details</h1>
      <table className="w-full mb-8">
        <tbody>
          <tr>
            <td className="font-semibold text-gray-700 border-b border-gray-300">Payment Method:</td>
            <td className="pl-4 text-lg text-gray-900 border-b border-gray-300">{orderDetails.paymentMethod}</td>
          </tr>
          <tr>
            <td className="font-semibold text-gray-700 border-b border-gray-300">Order ID:</td>
            <td className="pl-4 text-lg text-gray-900 border-b border-gray-300">{orderDetails.orderId}</td>
          </tr>
          <tr>
            <td className="font-semibold text-gray-700 border-b border-gray-300">Total Price:</td>
            <td className="pl-4 text-lg text-gray-900 border-b border-gray-300">₹{Math.ceil(orderDetails.totalPrice)}</td>
          </tr>
          <tr>
            <td className="font-semibold text-gray-700 border-b border-gray-300">Shipping Address:</td>
            <td className="pl-4 text-lg text-gray-900 border-b border-gray-300">{formatAddress(orderDetails.shippingAddress)}</td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="block w-full font-bold text-xl p-3 shadow-xl text-white bg-yellow-500 border-none rounded cursor-pointer transition duration-300 hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 mt-8"
      >
        {isLoading ? 'Processing...' : 'Make Payment'}
      </button>
    </div>
  );
};

export default PaymentPage;