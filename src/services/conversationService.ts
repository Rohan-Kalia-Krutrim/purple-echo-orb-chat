
// Mock service for handling conversation logic
// This would be replaced with actual implementation connecting to your backend

// Audio stream mock handlers
let mockAudioStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let dataArray: Uint8Array | null = null;
let animationFrameId: number | null = null;

// Event callback types
type AudioLevelCallback = (level: number) => void;
type MessageCallback = (message: string) => void;

// Callbacks storage
let onAudioLevelChange: AudioLevelCallback | null = null;
let onMessageReceived: MessageCallback | null = null;

// Mock conversation state
let conversationActive = false;
let micMuted = false;

// Audio process simulation
const startAudioProcessing = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
  
  const processAudio = () => {
    if (!conversationActive || !analyser || !dataArray || micMuted) {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      return;
    }

    // Simulate audio processing
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate audio level (average of frequencies)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const normalizedLevel = avg / 256; // Normalize to 0-1 range

    // Call the callback with the audio level
    if (onAudioLevelChange) {
      onAudioLevelChange(normalizedLevel);
    }

    // Simulate random AI responses
    if (Math.random() < 0.001 && onMessageReceived) { // Low probability to avoid spam
      const responses = [
        "I'm listening to your input...",
        "Processing your request...",
        "I understand what you're saying.",
        "That's an interesting point.",
        "Could you tell me more about that?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      onMessageReceived(randomResponse);
    }

    animationFrameId = requestAnimationFrame(processAudio);
  };

  animationFrameId = requestAnimationFrame(processAudio);
};

// Exposed API
export const conversationService = {
  // Start a new conversation session
  startConversation: async () => {
    try {
      // Request microphone permissions - this will prompt the user
      mockAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      conversationActive = true;
      
      console.log("Conversation started, microphone access granted");
      
      startAudioProcessing();
      
      return true;
    } catch (error) {
      console.error("Error starting conversation:", error);
      return false;
    }
  },
  
  // End the current conversation
  endConversation: () => {
    conversationActive = false;
    
    // Stop all tracks on the stream
    if (mockAudioStream) {
      mockAudioStream.getTracks().forEach(track => track.stop());
      mockAudioStream = null;
    }
    
    // Clean up audio context
    if (audioContext) {
      audioContext.close().catch(console.error);
      audioContext = null;
      analyser = null;
    }
    
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    console.log("Conversation ended");
    return true;
  },
  
  // Toggle microphone mute state
  toggleMute: () => {
    micMuted = !micMuted;
    
    // Mute/unmute all audio tracks
    if (mockAudioStream) {
      mockAudioStream.getAudioTracks().forEach(track => {
        track.enabled = !micMuted;
      });
    }
    
    console.log(`Microphone ${micMuted ? 'muted' : 'unmuted'}`);
    return micMuted;
  },
  
  // Get current conversation state
  getState: () => ({
    active: conversationActive,
    muted: micMuted
  }),
  
  // Register for audio level updates
  onAudioLevel: (callback: AudioLevelCallback) => {
    onAudioLevelChange = callback;
  },
  
  // Register for incoming messages
  onMessage: (callback: MessageCallback) => {
    onMessageReceived = callback;
  },
  
  // Send a message (mock implementation)
  sendMessage: (message: string) => {
    console.log("Sending message:", message);
    
    // Return a promise that resolves after simulating processing time
    return new Promise<void>(resolve => {
      setTimeout(() => {
        // In a real implementation, this would send to your backend
        console.log("Message sent successfully");
        resolve();
      }, 500);
    });
  }
};
