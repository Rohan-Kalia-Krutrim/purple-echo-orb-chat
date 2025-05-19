
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, CircleSlash } from 'lucide-react';

interface ControlButtonsProps {
  isMuted: boolean;
  toggleMute: () => void;
  endConversation: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ 
  isMuted, 
  toggleMute, 
  endConversation 
}) => {
  return (
    <div className="flex justify-center gap-6 py-4">
      <Button 
        onClick={toggleMute} 
        variant="outline" 
        className={`rounded-full w-16 h-16 flex items-center justify-center ${
          isMuted ? 'bg-red-900/20 border-red-700' : 'bg-purple-dark/20 border-purple-DEFAULT'
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </Button>
      
      <Button 
        onClick={endConversation} 
        variant="outline" 
        className="rounded-full w-16 h-16 flex items-center justify-center bg-gray-800/50 border-gray-600 hover:bg-red-900/20 hover:border-red-700"
        aria-label="End conversation"
      >
        <CircleSlash size={24} />
      </Button>
    </div>
  );
};

export default ControlButtons;
