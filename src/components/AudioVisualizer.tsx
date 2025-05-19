
import React, { useState, useEffect } from 'react';

interface AudioVisualizerProps {
  isListening: boolean;
  isMuted: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isListening, isMuted }) => {
  // Different states for the orb visualization
  const getOrbClasses = () => {
    if (isMuted) return 'orb bg-gray-500 opacity-50'; // Muted state
    if (isListening) return 'orb bg-purple-DEFAULT animate-pulse-strong'; // Active listening
    return 'orb bg-purple-dark animate-pulse-light'; // Idle state
  };

  return (
    <div className="orb-container flex items-center justify-center my-8">
      <div className={getOrbClasses()}>
        {/* Inner pulsating effect */}
        {isListening && !isMuted && (
          <>
            <div className="orb-ripple animate-ripple opacity-60"></div>
            <div className="orb-ripple animate-ripple opacity-30" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioVisualizer;
