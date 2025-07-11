import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { useNavigate } from 'react-router-dom';

interface FloatingCartButtonProps {
  recentlyAdded?: number;
  onDismiss?: () => void;
}

export default function FloatingCartButton({ recentlyAdded = 0, onDismiss }: FloatingCartButtonProps) {
  const { shoppingListItems } = useShoppingList();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  const totalItems = shoppingListItems.filter(item => !item.checked).length;

  useEffect(() => {
    if (recentlyAdded > 0) {
      setIsVisible(true);
      setShouldPulse(true);
      
      // Stop pulsing after 3 seconds
      const timer = setTimeout(() => {
        setShouldPulse(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [recentlyAdded]);

  useEffect(() => {
    // Show button if there are items in the cart
    if (totalItems > 0 && !isVisible) {
      setIsVisible(true);
    }
  }, [totalItems, isVisible]);

  const handleNavigateToCart = () => {
    navigate('/shopping-list');
    onDismiss?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 right-4 z-50"
      >
        <motion.div
          animate={shouldPulse ? {
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0]
          } : {}}
          transition={shouldPulse ? {
            scale: { duration: 0.5, repeat: Infinity, repeatDelay: 1 },
            rotate: { duration: 0.3, repeat: Infinity, repeatDelay: 1.2 }
          } : {}}
          className="relative"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted/80 hover:bg-muted p-0 z-10"
          >
            <X className="w-3 h-3" />
          </Button>

          {/* Cart Button */}
          <Button
            onClick={handleNavigateToCart}
            className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-elegant p-0"
          >
            <motion.div
              animate={shouldPulse ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.6, repeat: shouldPulse ? Infinity : 0, repeatDelay: 0.5 }}
            >
              <ShoppingCart className="w-6 h-6" />
            </motion.div>
            
            {/* Item Count Badge */}
            <Badge 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-primary-foreground text-primary font-bold text-xs shadow-sm"
            >
              {totalItems}
            </Badge>
          </Button>

          {/* Recently Added Indicator */}
          {recentlyAdded > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            >
              +{recentlyAdded} added!
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}