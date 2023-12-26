import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const ReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const { user } = useAuth();
  const apiBaseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchReturns = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`${apiBaseURL}/api/returns/details/${user.userId}`);
          setReturns(response.data);
          console.log(response)
        } catch (error) {
          console.error('Error fetching returns:', error);
        }
      }
    };

    fetchReturns();
  }, [user]);

  return (
    <div className="mx-auto mt-4 p-6 bg-white rounded-md shadow-lg" style={{ width: '1300px' }}>
      <h1 className="text-3xl items-center justify-center font-semibold mb-6 underline">Your Returns</h1>
      {returns.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {returns.map((returnItem) => (
            <li key={returnItem.returnId} className="py-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <p className="text-base font-semibold text-gray-800">
                    <strong>Return ID:</strong> {returnItem.returnId}
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Status:</strong> {returnItem.status}
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Reason:</strong> {returnItem.reason}
                  </p>
                </div>
                {returnItem.OrderItem && returnItem.OrderItem.Product && (
                  <div className="flex justify-end">
                    <img
                      src={returnItem.OrderItem.Product.ProductImage[0].imageUrl}
                      alt={returnItem.OrderItem.Product.name}
                      className="ml-4 h-16 w-16 rounded-md"
                    />
                    <div className="flex justify-end ml-4">
                      <h4 className="text-base font-semibold text-gray-800">{returnItem.OrderItem.Product.name}</h4>
                      <p className="text-sm text-gray-700">{returnItem.OrderItem.Product.productPrice}</p>

                    </div>
                  </div>
                )}
              </div>
              {returnItem.ReturnImage && returnItem.ReturnImage.length > 0 && (
                <div className="flex mt-4">
                  {returnItem.ReturnImage.map((image, index) => (
                    <img
                      key={index}
                      src={`${apiBaseURL}/${image.imagePath}`}
                      alt={`Return Image ${index}`}
                      className="h-20 w-20 object-cover rounded-md mr-4"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-gray-500">No returns found.</p>
      )}
    </div>
  );
};

export default ReturnsPage;


// <p className="text-sm text-gray-700">{returnItem.OrderItem.Product.description}</p>
