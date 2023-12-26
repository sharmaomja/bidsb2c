import React from 'react';
import emptyWishlist from '../../../assets/emptywishlist.jpeg'; // Replace with the path to your empty wishlist image
import { Link } from 'react-router-dom';

const EmptyWishlist = () => {
  return (
    <main className="flex justify-center">
      <div className="bg-white p-10 mt-24 max-w-4xl rounded-md shadow-lg flex flex-col items-center">
        <img
          src={emptyWishlist}
          alt="Empty Wishlist"
          className="mx-auto h-36 sm:h-48 mb-6"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your wishlist is empty. Explore more and shortlist some items.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-yellow-400 px-6 py-3 text-base font-semibold text-gray-900 shadow-md hover:bg-yellow-300 focus:outline-none focus:ring focus:border-blue-300"
            >
              Continue Shopping on BidsB2C
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmptyWishlist;
