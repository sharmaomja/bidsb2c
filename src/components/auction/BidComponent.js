import React, { useState } from 'react';

const BidComponent = ({ onPlaceBid }) => {
  const [bidAmount, setBidAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceBid(bidAmount);
    setBidAmount('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <button type="submit">Place Bid</button>
    </form>
  );
};

export default BidComponent;
