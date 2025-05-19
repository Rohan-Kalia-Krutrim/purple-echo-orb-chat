
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import AudioVisualizer from './AudioVisualizer';
import { conversationService } from '@/services/conversationService';
import ControlButtons from './ControlButtons';

const ConversationInterface: React.FC = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  // Initialize conversation service
  useEffect(() => {
    // Register audio level callback
    conversationService.onAudioLevel((level) => {
      setAudioLevel(level);
      setIsListening(level > 0.05); // Set a threshold for "active" listening
    });

    // Register message callback
    conversationService.onMessage((content) => {
      setCurrentMessage(content);
      
      // Clear the message after a few seconds
      setTimeout(() => {
        setCurrentMessage(null);
      }, 5000);
    });

    return () => {
      // Cleanup on unmount
      if (isActive) {
        conversationService.endConversation();
      }
    };
  }, []);

  const startConversation = async () => {
    const success = await conversationService.startConversation();
    
    if (success) {
      setIsActive(true);
      toast({
        title: "Conversation started",
        description: "Your microphone is now active."
      });
      
      // Set welcome message
      setCurrentMessage("Hello! I'm your AI assistant. What can I help you with today?");
      
      // Clear the message after a few seconds
      setTimeout(() => {
        setCurrentMessage(null);
      }, 5000);
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
    
    // Set end message
    setCurrentMessage("The conversation has ended. Click 'Start Conversation' to begin a new session.");
    
    // Clear the message after a few seconds
    setTimeout(() => {
      setCurrentMessage(null);
    }, 5000);
  };

  const toggleMute = () => {
    const muted = conversationService.toggleMute();
    setIsMuted(muted);
    
    toast({
      title: muted ? "Microphone muted" : "Microphone unmuted",
      description: muted ? "AI cannot hear you now" : "AI can hear you now"
    });
  };

  return (
    <div className="flex flex-col items-center justify-between h-full">
      {/* Current message display */}
      <div className="flex-1 flex items-center justify-center w-full max-w-xl mx-auto px-4">
        {currentMessage && (
          <div className="bg-gray-800/80 rounded-lg p-4 animate-fade-in text-center">
            <p className="text-lg">{currentMessage}</p>
          </div>
        )}
      </div>
      
      {/* Audio visualizer */}
      <div className="flex-1 flex items-center justify-center">
        <AudioVisualizer 
          isListening={isListening && isActive} 
          isMuted={isMuted || !isActive} 
        />
      </div>
      
      {/* Control buttons */}
      <div className="w-full max-w-md mx-auto p-4">
        {!isActive ? (
          <button 
            onClick={startConversation}
            className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white py-3 px-4 rounded-lg transition-colors"
          >
            Start Conversation
          </button>
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
