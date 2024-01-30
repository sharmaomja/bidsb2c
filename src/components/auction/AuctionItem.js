import React from 'react';

const AuctionItem = ({ auction }) => {
  return (
    <div className="auction-item">
      <h2>{auction.Product.name}</h2>
      <p>Current Bid: {auction.currentBid}</p>
      <p>Ends On: {new Date(auction.endTime).toLocaleString()}</p>
      {/* Add more auction details and a link to the auction detail page */}
    </div>
  );
};

export default AuctionItem;
