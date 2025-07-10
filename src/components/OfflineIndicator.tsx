import React, { useState, useEffect } from 'react';
import { useOffline } from '@/hooks/useProductionFeatures';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineIndicator: React.FC = () => {
  const { isOffline } = useOffline();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setShowIndicator(true);
    } else {
      // Show "back online" briefly then hide
      const timer = setTimeout(() => setShowIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  if (!showIndicator) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg border ${
          isOffline 
            ? 'bg-destructive text-destructive-foreground border-destructive' 
            : 'bg-green-500 text-white border-green-500'
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {isOffline ? (
            <>
              <WifiOff size={16} />
              <span>You're offline</span>
            </>
          ) : (
            <>
              <Wifi size={16} />
              <span>Back online!</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineIndicator;