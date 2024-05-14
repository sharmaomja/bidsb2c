import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuctionDetails = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [newBid, setNewBid] = useState('');

  const [bids, setBids] = useState([]);
  const { user } = useAuth();
  console.log(user);
  const userId = user.userId;

  useEffect(() => {
    fetchAuctionDetails();
    fetchBids();
  }, [auctionId]);

  const fetchBids = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/auctions/${auctionId}/bids`);
      const data = await response.json();
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const fetchAuctionDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/auctions/${auctionId}`);
      const data = await response.json();
      setAuction(data);
    } catch (error) {
      console.error('Error fetching auction details:', error);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!newBid) {
      alert('Please enter a bid amount');
      return;
    }

    // Assuming you have auctionId and userId available in your component
    const bidData = {
      auctionId: auctionId, // Replace with actual auction ID
      userId: userId, // Replace with actual user ID
      bidAmount: newBid,
    };

    try {
      const response = await fetch('http://localhost:8000/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bidData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bid');
      }

      console.log('Bid submitted:', data);
      // Update UI here or fetch auction details again
      fetchAuctionDetails(); // This function should re-fetch the auction details
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert(error.message);
    }
  };

  if (!auction) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-600 mx-auto my-8 p-8 border border-solid border-gray-300 rounded bg-white shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">{auction.Product?.name}</h2>
      <p className="mb-4">Current Bid: ₹{auction.currentBid}</p>
      <p className="mb-4">End Time: {new Date(auction.endTime).toLocaleString()}</p>
      <h3 className="mb-2">Bids</h3>
      <ul>
        {bids.map((bid) => (
          <li key={bid.bidId} className="mb-2">
            User {bid.userId}: ₹{bid.bidAmount}
          </li>
        ))}
      </ul>
      {/* Implement a form to submit a new bid */}
      <form className="mt-4" onSubmit={handleBidSubmit}>
        <input
          type="number"
          value={newBid}
          onChange={(e) => setNewBid(e.target.value)}
          min={parseFloat(auction.currentBid) + 1} // Ensure bid is higher than the current bid
          className="p-2 mr-2 border border-solid border-gray-300 rounded"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white border-none rounded cursor-pointer transition duration-300 hover:bg-blue-700 focus:outline-none focus:border-blue-300"
        >
          Place Bid
        </button>
      </form>
    </div>
  );
};

export default AuctionDetails;
