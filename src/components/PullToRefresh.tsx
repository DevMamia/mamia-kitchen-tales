import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useAnalytics } from '@/hooks/useProductionFeatures';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  disabled = false
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const { track } = useAnalytics();

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || window.scrollY > 0) return;
    setStartY(e.touches[0].clientY);
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || window.scrollY > 0 || !startY) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  }, [disabled, startY, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled) return;
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      track('pull_to_refresh_triggered');
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
        track('pull_to_refresh_failed', { error: String(error) });
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  }, [disabled, pullDistance, threshold, isRefreshing, onRefresh, track]);

  useEffect(() => {
    const container = document.body;
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const getRefreshProgress = () => Math.min(pullDistance / threshold, 1);
  const shouldTriggerRefresh = pullDistance >= threshold;

  return (
    <div className="relative">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: isPulling || isRefreshing ? 0 : -60,
          opacity: isPulling || isRefreshing ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-white rounded-full p-3 shadow-lg border border-border">
          <motion.div
            animate={{
              rotate: isRefreshing ? 360 : shouldTriggerRefresh ? 180 : getRefreshProgress() * 180
            }}
            transition={{
              rotate: isRefreshing 
                ? { repeat: Infinity, duration: 1, ease: "linear" }
                : { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            <RefreshCw 
              className={`w-6 h-6 transition-colors ${
                shouldTriggerRefresh ? 'text-primary' : 'text-muted-foreground'
              }`} 
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content with pull transform */}
      <motion.div
        animate={{
          y: (isPulling || isRefreshing) ? Math.min(pullDistance * 0.5, 40) : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>

      {/* Refresh message */}
      {isPulling && (
        <motion.div
          className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <span className="text-sm font-medium text-foreground">
              {shouldTriggerRefresh ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PullToRefresh;