import React from 'react';
import { Volume2 } from 'lucide-react';

interface VoiceStatusIndicatorProps {
  status: 'speaking' | 'listening' | 'processing' | 'idle';
  mamaAvatar?: string;
  mamaName?: string;
}

export const VoiceStatusIndicator = ({ status, mamaAvatar, mamaName }: VoiceStatusIndicatorProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'speaking':
        return {
          text: `${mamaName || 'Nonna'} speaking`,
          color: 'text-green-600',
          waveColor: 'bg-green-500',
          showAvatar: true
        };
      case 'listening':
        return {
          text: 'Listening...',
          color: 'text-blue-600',
          waveColor: 'bg-blue-500',
          showAvatar: false
        };
      case 'processing':
        return {
          text: 'Processing...',
          color: 'text-orange-600',
          waveColor: 'bg-orange-500',
          showAvatar: false
        };
      default:
        return {
          text: 'Tap to speak',
          color: 'text-muted-foreground',
          waveColor: 'bg-muted',
          showAvatar: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Waveform Background */}
      <div className="relative w-32 h-16 bg-muted/30 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-1 ${config.waveColor} rounded-full transition-all duration-300 ${
                status !== 'idle' ? 'animate-pulse' : 'h-2'
              }`}
              style={{
                height: status !== 'idle' ? `${Math.random() * 20 + 8}px` : '8px',
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
        
        {/* Mama Avatar Overlay */}
        {config.showAvatar && mamaAvatar && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white">
              <div className="text-2xl flex items-center justify-center h-full">
                {mamaAvatar}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Text */}
      <p className={`text-lg font-medium ${config.color} flex items-center gap-2`}>
        {status === 'speaking' && <Volume2 size={20} />}
        {config.text}
      </p>
    </div>
  );
};