import '../../../App.css'

import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './components/config';
import ActionProvider from './components/ActionProvider';
import MessageParser from './components/MessageParser';

const ChatbotPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-end pr-20 bg-gray-800 bg-opacity-90 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-8 rounded-lg shadow-lg relative border border-gray-700">
        <button className="absolute top-0 bg-red-500 p-1 py-1 px-2 right-0 rounded-full  text-white font-bold" onClick={handleClose}>
          x
        </button>
        <div className='border border-gray-700'>
          {isOpen && (
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
