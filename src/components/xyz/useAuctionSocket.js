import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://13.201.252.136:8000'); // Adjust the URL to your server

const useAuctionSocket = (auctionId, onNewBid) => {
  useEffect(() => {
    socket.emit('joinAuction', auctionId);

    socket.on('newBid', bid => {
      onNewBid(bid);
    });

    return () => {
      socket.emit('leaveAuction', auctionId);
      socket.off('newBid');
    };
  }, [auctionId, onNewBid]);
};

export default useAuctionSocket;
