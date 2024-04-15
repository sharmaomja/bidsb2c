import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import ChatComponent from './ChatComponent';
import BidComponent from './BidComponent';

const LiveStreamPage = ({ auctionId }) => {
  const [streamUrl, setStreamUrl] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentBid, setCurrentBid] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Simulate fetching stream URL (Replace with actual backend call)
    setStreamUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Dummy URL

    // Initialize WebSocket connection
    const newSocket = io('http://13.201.252.136:8000');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [auctionId]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', message => {
        setChatMessages(prevMessages => [...prevMessages, message]);
      });

      socket.on('bidUpdate', bid => {
        setCurrentBid(bid);
      });
    }
  }, [socket]);

  const sendMessage = (message) => {
    socket.emit('sendMessage', message);
  };

  const placeBid = (amount) => {
    // Simulate bid placement (Replace with actual bid logic)
    const newBid = { amount, user: 'User123' }; // Dummy data
    setCurrentBid(newBid);
    socket.emit('placeBid', newBid);
  };

  return (
    <div>
      <h1>Live Auction Stream</h1>
      <ReactPlayer url={streamUrl} playing controls />
      
      <div>
        <h2>Current Bid: {currentBid ? `$${currentBid.amount} by ${currentBid.user}` : 'No bids yet'}</h2>
        <BidComponent onPlaceBid={placeBid} />
      </div>

      <div>
        <ChatComponent onSendMessage={sendMessage} />
        {chatMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default LiveStreamPage;
