
import React from 'react';

export interface MessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ content, sender, timestamp }) => {
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div 
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          sender === 'user' 
            ? 'bg-purple-DEFAULT text-white' 
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        <p>{content}</p>
        <div className={`text-xs mt-1 ${sender === 'user' ? 'text-purple-100' : 'text-gray-400'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;
