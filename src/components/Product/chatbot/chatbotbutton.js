import React, { useState } from 'react';
import ChatbotPage from './chatbotpage';
import botGif from '../../../assets/botGif.gif'; 

const ChatbotButton = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div>
      {/* Chatbot button */}
      <button
        className="fixed right-10 bottom-10 p-3 bg-blue-400 text-black font-semibold border-none rounded-full cursor-pointer z-50 flex items-center justify-center hover:bg-blue-600"
        onClick={toggleChatbot}
      >
        <img
          src={botGif}
          alt="Bot"
          className="w-8 h-8 mr-2 animate-bounce" 
        />
        Chat with us
      </button>
      {showChatbot && <ChatbotPage />}
    </div>
  );
};

export default ChatbotButton;
