
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import AudioVisualizer from './AudioVisualizer';
import Message, { MessageProps } from './Message';
import ControlButtons from './ControlButtons';
import { conversationService } from '@/services/conversationService';
import { Button } from "@/components/ui/button";

const ConversationInterface: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation service
  useEffect(() => {
    // Register audio level callback
    conversationService.onAudioLevel((level) => {
      setAudioLevel(level);
      setIsListening(level > 0.05); // Set a threshold for "active" listening
    });

    // Register message callback
    conversationService.onMessage((content) => {
      addMessage(content, 'ai');
    });

    // Add welcome message
    addMessage("Hello! I'm your AI assistant. What can I help you with today?", 'ai');

    return () => {
      // Cleanup on unmount
      if (isActive) {
        conversationService.endConversation();
      }
    };
  }, []);

  const addMessage = (content: string, sender: 'user' | 'ai') => {
    const newMessage: MessageProps = {
      content,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const startConversation = async () => {
    const success = await conversationService.startConversation();
    
    if (success) {
      setIsActive(true);
      toast({
        title: "Conversation started",
        description: "Your microphone is now active."
      });
    } else {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const endConversation = () => {
    conversationService.endConversation();
    setIsActive(false);
    setIsListening(false);
    
    toast({
      title: "Conversation ended",
      description: "Your microphone has been disconnected."
    });
    
    // Add end message
    addMessage("The conversation has ended. Click 'Start Conversation' to begin a new session.", 'ai');
  };

  const toggleMute = () => {
    const muted = conversationService.toggleMute();
    setIsMuted(muted);
    
    toast({
      title: muted ? "Microphone muted" : "Microphone unmuted",
      description: muted ? "AI cannot hear you now" : "AI can hear you now"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    addMessage(inputText, 'user');
    
    // Send to service
    await conversationService.sendMessage(inputText);
    
    // Clear input
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto messages-container p-4">
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Visualizer */}
      <div className="flex justify-center py-4">
        <AudioVisualizer 
          isListening={isListening && isActive} 
          isMuted={isMuted || !isActive} 
        />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isActive}
            placeholder={isActive ? "Type your message..." : "Start conversation to enable chat"}
            className="flex-1 bg-gray-800 rounded-md px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-DEFAULT"
          />
          <Button type="submit" disabled={!isActive || !inputText.trim()}>
            Send
          </Button>
        </div>
      </form>
      
      {/* Control buttons */}
      <div className="border-t border-gray-800 p-4">
        {!isActive ? (
          <Button 
            onClick={startConversation}
            className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white"
          >
            Start Conversation
          </Button>
        ) : (
          <ControlButtons 
            isMuted={isMuted}
            toggleMute={toggleMute}
            endConversation={endConversation}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationInterface;
