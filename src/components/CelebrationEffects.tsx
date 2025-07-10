import React, { useEffect, useState } from 'react';

interface CelebrationEffectsProps {
  type: 'heart' | 'confetti' | 'cultural';
  cultural?: 'italian' | 'mexican' | 'thai';
  trigger: boolean;
  duration?: number;
  onComplete?: () => void;
}

const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({
  type,
  cultural,
  trigger,
  duration = 3000,
  onComplete
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; x: number; y: number; emoji: string }>>([]);
  const [showGrandma, setShowGrandma] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    // Create particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1000,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: getParticleEmoji()
    }));

    setParticles(newParticles);
    setShowGrandma(true);

    // Cleanup after duration
    const timer = setTimeout(() => {
      setParticles([]);
      setShowGrandma(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration, onComplete]);

  const getParticleEmoji = () => {
    if (type === 'heart') return '❤️';
    
    if (type === 'cultural' && cultural) {
      const culturalEmojis = {
        italian: ['🍃', '🍷', '🧄', '🫒', '🍝'],
        mexican: ['🌶️', '🎉', '🌮', '🌺', '🥑'],
        thai: ['🪷', '🌿', '🥥', '🌸', '🍛']
      };
      const emojis = culturalEmojis[cultural];
      return emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Default confetti
    const confettiEmojis = ['🎉', '✨', '🎊', '⭐', '💫'];
    return confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
  };

  const getGrandmaEmoji = () => {
    if (!cultural) return '👵';
    
    const grandmaEmojis = {
      italian: '👵🏻',
      mexican: '👵🏽',
      thai: '👵🏻'
    };
    
    return grandmaEmojis[cultural];
  };

  const getCelebrationMessage = () => {
    if (!cultural) return 'Wonderful!';
    
    const messages = {
      italian: 'Bravissimo!',
      mexican: '¡Fantástico!',
      thai: 'Wonderful!'
    };
    
    return messages[cultural];
  };

  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Grandmother celebration */}
      {showGrandma && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-center animate-bounce" style={{ animationDuration: '0.5s' }}>
            <div className="text-6xl mb-2">{getGrandmaEmoji()}</div>
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="font-heading font-bold text-primary">
                {getCelebrationMessage()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute text-2xl ${
            type === 'heart' 
              ? 'heart-float' 
              : 'confetti-fall'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: type === 'heart' ? '2s' : '3s'
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Heart burst effect for favorites */}
      {type === 'heart' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute text-3xl text-red-500 heart-float"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-40px)`,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                💕
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CelebrationEffects;