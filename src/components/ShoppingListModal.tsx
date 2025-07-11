import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  addedCount: number;
  recipeName: string;
}

export default function ShoppingListModal({ 
  isOpen, 
  onClose, 
  addedCount, 
  recipeName 
}: ShoppingListModalProps) {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleViewShoppingList = () => {
    onClose();
    navigate('/shopping-list');
  };

  const handleAnimationComplete = () => {
    setShowSuccess(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <div className="text-center py-6">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Animation Container */}
          <div className="mb-6 relative h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.div
                  key="cart-animation"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                  onAnimationComplete={handleAnimationComplete}
                  className="relative"
                >
                  {/* Shopping Cart */}
                  <div className="bg-primary/10 p-4 rounded-full">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Flying Ingredients */}
                  {Array.from({ length: Math.min(addedCount, 5) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: Math.random() * 200 - 100, 
                        y: Math.random() * 200 - 100,
                        scale: 0,
                        opacity: 0
                      }}
                      animate={{ 
                        x: 0, 
                        y: 0,
                        scale: 0.3,
                        opacity: 1
                      }}
                      transition={{ 
                        delay: i * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      className="absolute bg-primary/20 w-3 h-3 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="success-animation"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                  className="bg-green-100 p-4 rounded-full"
                >
                  <CheckCircle className="h-8 w-8 text-green-600" />
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
            <h3 className="text-xl font-heading font-bold text-warm-brown mb-2">
              Added to Shopping List!
            </h3>
            <p className="text-muted-foreground mb-6">
              {addedCount} ingredient{addedCount !== 1 ? 's' : ''} from{' '}
              <span className="font-medium text-foreground">{recipeName}</span> added to your shopping list
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Continue Cooking
              </Button>
              <Button
                onClick={handleViewShoppingList}
                className="flex-1 gap-2"
              >
                View List
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}