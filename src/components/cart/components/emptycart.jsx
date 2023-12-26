import React from 'react';
import emptycart from '../../../assets/emptycart.png';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <main className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-md shadow-lg max-w-md mb-36" style={{height:'500px'}}>
        <div className="text-center">
          <img
            src={emptycart}
            alt="Empty Cart"
            className="mx-auto h-32 mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            It seems like you haven't added any items to your cart yet.
          </p>
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className="rounded-md bg-yellow-500 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-yellow-400 focus:outline-none focus:ring focus:border-blue-300"
            >
              Continue Shopping on BidsB2C
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmptyCart;
