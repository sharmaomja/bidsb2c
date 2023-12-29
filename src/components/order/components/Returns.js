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
    <div className="mx-auto mt-2 p-4 md:p-6 bg-white rounded-md shadow-lg max-w-screen-xl">
      <h1 className="text-2xl p-2 bg-blue-100 md:text-3xl font-semibold md:mb-6 underline text-center">Your Returns</h1>
      {returns.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {returns.map((returnItem) => (
            <li key={returnItem.returnId} className="py-4 md:py-6">
              <div className="flex flex-col md:flex-row md:justify-between items-start">
                <div className="flex flex-col mb-4 md:mb-0">
                  <p className="text-sm md:text-base font-semibold text-gray-800">
                    <strong className='bg-gray-200'>Return ID:</strong> {returnItem.returnId}
                  </p>
                  <p className="text-sm md:text-base text-gray-700">
                    <strong>Status:</strong> {returnItem.status}
                  </p>
                  <p className="text-sm md:text-base text-gray-700">
                    <strong>Reason:</strong> {returnItem.reason}
                  </p>
                </div>
                {returnItem.OrderItem && returnItem.OrderItem.Product && (
                  <div className="flex justify-end items-center">
                    <img
                      src={returnItem.OrderItem.Product.ProductImage[0].imageUrl}
                      alt={returnItem.OrderItem.Product.name}
                      className="h-12 w-12 md:h-16 md:w-16 rounded-md object-cover md:ml-4"
                    />
                    <div className="flex flex-col justify-end ml-2 md:ml-4">
                      <h4 className="text-sm md:text-base font-semibold text-gray-800">{returnItem.OrderItem.Product.name}</h4>
                      <p className="text-xs md:text-sm text-gray-700">{returnItem.OrderItem.Product.productPrice}</p>
                    </div>
                  </div>
                )}
              </div>
              {returnItem.ReturnImage && returnItem.ReturnImage.length > 0 && (
                <div className="flex mt-2 md:mt-4">
                  {returnItem.ReturnImage.map((image, index) => (
                    <img
                      key={index}
                      src={`${apiBaseURL}/${image.imagePath}`}
                      alt={`Return Image ${index}`}
                      className="h-12 w-12 md:h-20 md:w-20 object-cover rounded-md mr-2 md:mr-4"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm md:text-base text-gray-500 text-center">No returns found.</p>
      )}
    </div>
  );
};

export default ReturnsPage;


// <p className="text-sm text-gray-700">{returnItem.OrderItem.Product.description}</p>
