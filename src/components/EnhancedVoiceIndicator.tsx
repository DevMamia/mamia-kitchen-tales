import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedVoiceIndicatorProps {
  status: 'idle' | 'speaking' | 'listening' | 'processing';
  mamaAvatar?: string;
  mamaName?: string;
  cultural?: 'italian' | 'mexican' | 'thai';
}

const EnhancedVoiceIndicator: React.FC<EnhancedVoiceIndicatorProps> = ({
  status,
  mamaAvatar,
  mamaName,
  cultural
}) => {
  const getStatusText = () => {
    switch (status) {
      case 'speaking':
        return `${mamaName || 'Nonna'} speaking...`;
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      default:
        return 'Ready to help';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'speaking':
        return 'hsl(140 70% 60%)'; // Green
      case 'listening':
        return 'hsl(220 90% 60%)'; // Blue
      case 'processing':
        return 'hsl(18 90% 55%)'; // Orange
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  const getCulturalAccent = () => {
    switch (cultural) {
      case 'italian':
        return 'hsl(var(--italian-accent))';
      case 'mexican':
        return 'hsl(var(--mexican-accent))';
      case 'thai':
        return 'hsl(var(--thai-accent))';
      default:
        return 'hsl(var(--primary))';
    }
  };

  const waveAnimation = {
    speaking: {
      height: [4, 20, 4],
      backgroundColor: 'hsl(140 70% 60%)',
    },
    listening: {
      height: [8, 16, 8],
      backgroundColor: 'hsl(220 90% 60%)',
    },
    processing: {
      scale: [1, 1.2, 1],
      backgroundColor: 'hsl(18 90% 55%)',
    },
    idle: {
      height: 4,
      backgroundColor: 'hsl(var(--muted-foreground))',
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Mama Avatar (when speaking) */}
      {status === 'speaking' && mamaAvatar && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative"
        >
          <motion.div
            className="w-16 h-16 rounded-full overflow-hidden border-4"
            style={{ borderColor: getCulturalAccent() }}
            animate={{
              boxShadow: [
                `0 0 0 0 ${getCulturalAccent()}40`,
                `0 0 0 10px ${getCulturalAccent()}20`,
                `0 0 0 20px ${getCulturalAccent()}00`,
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img
              src={mamaAvatar}
              alt={mamaName}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Speech bubble indicator */}
          <motion.div
            className="absolute -top-8 -right-2 bg-white rounded-full p-2 shadow-lg"
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-xs">💬</div>
          </motion.div>
        </motion.div>
      )}

      {/* Waveform Visualization */}
      <div className="flex items-center justify-center space-x-1 h-8">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full"
            style={{ backgroundColor: getStatusColor() }}
            variants={waveAnimation}
            animate={status}
            transition={{
              duration: status === 'processing' ? 1 : 0.5,
              repeat: status !== 'idle' ? Infinity : 0,
              delay: i * 0.1,
              ease: status === 'processing' ? 'easeInOut' : 'linear',
            }}
            initial={{ height: 4 }}
          />
        ))}
      </div>

      {/* Status Text */}
      <motion.p
        className="text-sm font-medium text-center"
        style={{ color: getStatusColor() }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {getStatusText()}
      </motion.p>

      {/* Cultural Background Pattern */}
      {cultural && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {cultural === 'italian' && (
            <div className="w-full h-full bg-gradient-to-br from-red-500 via-white to-green-500" />
          )}
          {cultural === 'mexican' && (
            <div className="w-full h-full bg-gradient-to-br from-red-500 via-white to-green-600" />
          )}
          {cultural === 'thai' && (
            <div className="w-full h-full bg-gradient-to-br from-red-600 via-white to-blue-600" />
          )}
        </div>
      )}

      {/* Interactive Tap Area */}
      {status === 'idle' && (
        <motion.div
          className="mt-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <p className="text-xs text-primary">Tap to speak</p>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedVoiceIndicator;