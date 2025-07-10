import React, { useState, useCallback, useRef } from 'react';
import { motion, PanInfo, useAnimationControls } from 'framer-motion';
import { Heart, HeartOff } from 'lucide-react';
import { useHapticFeedback, useAnalytics } from '@/hooks/useProductionFeatures';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  className?: string;
  disabled?: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onFavorite,
  isFavorited = false,
  className = '',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimationControls();
  const cardRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();
  const { track } = useAnalytics();

  const handleDragStart = useCallback(() => {
    if (disabled) return;
    setIsDragging(true);
    triggerHaptic('light');
    track('swipe_start');
  }, [disabled, triggerHaptic, track]);

  const handleDragEnd = useCallback(
    (event: any, info: PanInfo) => {
      if (disabled) return;
      
      setIsDragging(false);
      const threshold = 100;
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
        if (offset > 0 || velocity > 0) {
          // Swipe right - favorite
          controls.start({ 
            x: window.innerWidth,
            rotate: 15,
            opacity: 0
          }).then(() => {
            onSwipeRight?.();
            onFavorite?.();
            controls.set({ x: 0, rotate: 0, opacity: 1 });
          });
          triggerHaptic('medium');
          track('swipe_right', { action: 'favorite' });
        } else {
          // Swipe left - skip
          controls.start({ 
            x: -window.innerWidth,
            rotate: -15,
            opacity: 0
          }).then(() => {
            onSwipeLeft?.();
            controls.set({ x: 0, rotate: 0, opacity: 1 });
          });
          triggerHaptic('light');
          track('swipe_left', { action: 'skip' });
        }
      } else {
        // Snap back
        controls.start({ x: 0, rotate: 0 });
      }
    },
    [disabled, controls, onSwipeLeft, onSwipeRight, onFavorite, triggerHaptic, track]
  );

  const getSwipeIndicator = (offset: number) => {
    if (Math.abs(offset) < 50) return null;
    
    if (offset > 0) {
      return (
        <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Heart className="w-8 h-8 text-green-500 fill-current" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <HeartOff className="w-8 h-8 text-red-500" />
          </div>
        </div>
      );
    }
  };

  if (disabled) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 1.02,
        zIndex: 10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDragging ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDragging && (
          <motion.div
            animate={{ 
              opacity: 1,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              scale: { 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }
            }}
          >
            {getSwipeIndicator(cardRef.current?.getBoundingClientRect().x || 0)}
          </motion.div>
        )}
      </motion.div>
      
      {children}
      
      {/* Favorite indicator */}
      {isFavorited && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 shadow-lg"
        >
          <Heart className="w-4 h-4 fill-current" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwipeableCard;