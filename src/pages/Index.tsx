
import React from 'react';
import ConversationInterface from '@/components/ConversationInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <header className="border-b border-gray-800 p-4">
        <h1 className="text-xl font-bold text-center text-purple-DEFAULT">AI Voice Assistant</h1>
      </header>
      
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <ConversationInterface />
      </main>
      
      <footer className="border-t border-gray-800 p-2 text-center text-xs text-gray-500">
        <p>Voice AI Assistant - Proof of Concept</p>
      </footer>
    </div>
  );
};

export default Index;
