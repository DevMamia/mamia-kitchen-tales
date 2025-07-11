import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ShoppingCart, CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  addedCount: number;
  recipeName: string;
  ingredientPositions?: Array<{ x: number; y: number }>;
  onFloatingCartCreate?: (count: number) => void;
}

export default function ShoppingListModal({ 
  isOpen, 
  onClose, 
  addedCount, 
  recipeName,
  ingredientPositions = [],
  onFloatingCartCreate
}: ShoppingListModalProps) {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [autoDismissProgress, setAutoDismissProgress] = useState(0);
  const [showAutoDismiss, setShowAutoDismiss] = useState(false);

  const handleViewShoppingList = () => {
    onClose();
    navigate('/shopping-list');
  };

  const handleAnimationComplete = () => {
    setShowSuccess(true);
    // Start auto-dismiss countdown after success animation
    setTimeout(() => {
      setShowAutoDismiss(true);
    }, 1000);
  };

  const handleDismiss = () => {
    onClose();
    // Create floating cart button with count
    onFloatingCartCreate?.(addedCount);
  };

  // Auto-dismiss logic
  useEffect(() => {
    if (!showAutoDismiss) return;

    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      setAutoDismissProgress(progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        handleDismiss();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [showAutoDismiss, addedCount, onFloatingCartCreate]);

  return (
    <Dialog open={isOpen} onOpenChange={handleDismiss}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl overflow-hidden">
        <div className="text-center py-6 relative">
          {/* Auto-dismiss progress bar */}
          {showAutoDismiss && (
            <div className="absolute top-0 left-0 right-0">
              <Progress value={autoDismissProgress} className="h-1 rounded-none" />
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Enhanced Animation Container */}
          <div className="mb-6 relative h-32 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.div
                  key="cart-animation"
                  className="relative"
                >
                  {/* Shopping Cart with Enhanced Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180, y: 50 }}
                    animate={{ scale: 1, rotate: 0, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      duration: 0.8 
                    }}
                    className="bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-full relative"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <ShoppingCart className="h-10 w-10 text-primary" />
                    </motion.div>
                    
                    {/* Cart Emoji for Fun */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-2 -right-2 text-2xl"
                    >
                      🛒
                    </motion.div>
                  </motion.div>
                  
                  {/* Enhanced Flying Ingredients */}
                  {Array.from({ length: Math.min(addedCount, 8) }).map((_, i) => {
                    const ingredients = ['🥕', '🍅', '🧄', '🧅', '🥬', '🌶️', '🥒', '🍋'];
                    const startPosition = ingredientPositions[i] || {
                      x: Math.random() * 300 - 150,
                      y: Math.random() * 300 - 150
                    };
                    
                    return (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: startPosition.x, 
                          y: startPosition.y,
                          scale: 0,
                          opacity: 0,
                          rotate: Math.random() * 360
                        }}
                        animate={{ 
                          x: 0, 
                          y: 0,
                          scale: 1,
                          opacity: 1,
                          rotate: 0
                        }}
                        transition={{ 
                          delay: i * 0.15,
                          duration: 0.8,
                          ease: "easeOut",
                          type: "spring",
                          stiffness: 200
                        }}
                        onAnimationComplete={i === Math.min(addedCount, 8) - 1 ? handleAnimationComplete : undefined}
                        className="absolute text-lg pointer-events-none"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {ingredients[i % ingredients.length]}
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="success-animation"
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    duration: 0.6 
                  }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-5 rounded-full">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  
                  {/* Success confetti */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * -80 - 20]
                      }}
                      transition={{ 
                        delay: i * 0.1,
                        duration: 1,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full"
                    />
                  ))}
                  
                  {/* Floating package icon */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: -10, opacity: 0.7 }}
                    transition={{ 
                      delay: 0.3,
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                  >
                    <Package className="w-6 h-6 text-green-600" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.h3 
              className="text-xl font-heading font-bold text-warm-brown mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🎉 Added to Shopping List!
            </motion.h3>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-bold text-primary">{addedCount}</span> ingredient{addedCount !== 1 ? 's' : ''} from{' '}
              <span className="font-medium text-foreground">{recipeName}</span> added to your shopping list
            </motion.p>

            {/* Auto-dismiss notice */}
            {showAutoDismiss && (
              <motion.p 
                className="text-xs text-muted-foreground mb-4 flex items-center justify-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="animate-pulse">⏱️</span>
                Auto-closing in {Math.ceil((100 - autoDismissProgress) / 33)} seconds...
              </motion.p>
            )}

            {/* Enhanced Action Buttons */}
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="flex-1 hover:scale-105 transition-transform"
              >
                Continue Cooking
              </Button>
              <Button
                onClick={handleViewShoppingList}
                className="flex-1 gap-2 hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80"
              >
                View List
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}