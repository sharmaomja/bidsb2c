import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuctionComponent = () => {
  const [auctions, setAuctions] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(8);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auctions-with-products');
      const data = await response.json();
      setAuctions(data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  return (
    <div className="p-2 w-86 rounded mt-4">
      <h3 className="justify-start text-gray-800 font-semibold text-2xl mb-2">Live Auctions</h3>
      <div className="mb-2 p-2 w-84">
        {auctions.slice(0, displayLimit).map((auction) => (
          <div
            key={auction.auctionId}
            className="bg-white border border-gray-300 p-2 mb-3 rounded shadow-md transition-transform hover:transform hover:shadow-lg"
          >
            <Link to={`/auctions/${auction.auctionId}`} className="text-black">
              <h4 className="text-blue-500 text-xl mb-2">{auction.Product.name}</h4>
              <p className="text-gray-700">Current Bid: ₹{auction.currentBid}</p>
              <p className="text-gray-700">End Time: {new Date(auction.endTime).toLocaleString()}</p>
            </Link>
          </div>
        ))}
        {auctions.length > displayLimit && (
          <Link to="/auctions" className="bg-blue-600 text-white w-72 px-6 py-2 rounded-full focus:outline-none hover:bg-blue-700">
            Go to Auctions
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuctionComponent;
