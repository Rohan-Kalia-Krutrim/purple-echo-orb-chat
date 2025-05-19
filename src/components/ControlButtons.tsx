
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Circle, CircleSlash } from 'lucide-react';

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
    <div className="flex justify-center gap-4 py-4">
      <Button 
        onClick={toggleMute} 
        variant="outline" 
        className={`rounded-full w-12 h-12 flex items-center justify-center ${
          isMuted ? 'bg-red-900/20 border-red-700' : 'bg-purple-dark/20 border-purple-DEFAULT'
        }`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>
      
      <Button 
        onClick={endConversation} 
        variant="outline" 
        className="rounded-full w-12 h-12 flex items-center justify-center bg-gray-800/50 border-gray-600 hover:bg-red-900/20 hover:border-red-700"
        aria-label="End conversation"
      >
        <CircleSlash size={20} />
      </Button>
    </div>
  );
};

export default ControlButtons;
