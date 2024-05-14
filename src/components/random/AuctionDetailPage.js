import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BidHistory from './BidHistory'; // Component to show the bid history

const AuctionDetailPage = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    // Fetch specific auction details
    fetch(`/api/auctions/${auctionId}`)
      .then(response => response.json())
      .then(data => setAuction(data))
      .catch(error => console.error('Error fetching auction:', error));
  }, [auctionId]);

  return (
    <div>
      {auction ? (
        <>
          <h1>{auction.name}</h1>
          <p>{auction.description}</p>
          <BidHistory auctionId={auctionId} />
          {/* Add bid placement interface here */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AuctionDetailPage;
