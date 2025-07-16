import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const PWAUpdateNotification: React.FC = () => {
  const { updateAvailable, updateApp } = usePWA();

  const handleUpdate = () => {
    updateApp();
    toast({
      title: "Update Starting",
      description: "MAMIA is updating with the latest features...",
    });
  };

  if (!updateAvailable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-8 md:w-80"
      >
        <Card className="p-4 bg-primary text-primary-foreground shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-sm mb-1">
                New Update Available
              </h3>
              <p className="text-xs opacity-90 mb-3 leading-relaxed">
                A new version of MAMIA is ready with improved features and bug fixes.
              </p>
              
              <Button
                onClick={handleUpdate}
                variant="secondary"
                size="sm"
                className="text-xs h-8"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Update Now
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAUpdateNotification;