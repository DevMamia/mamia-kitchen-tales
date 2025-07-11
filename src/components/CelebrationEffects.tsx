import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, Star, Sparkles, ShoppingCart, Zap } from "lucide-react";

interface CelebrationEffectsProps {
  trigger: boolean;
  type?: 'completion' | 'added' | 'consolidated' | 'shared' | 'heart' | 'confetti' | 'cultural';
  cultural?: 'italian' | 'mexican' | 'thai';
  onComplete?: () => void;
}

export const CelebrationEffects = ({ trigger, type = 'completion', cultural, onComplete }: CelebrationEffectsProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      // Generate random particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!trigger) return null;

  const getIcon = () => {
    switch (type) {
      case 'completion': return CheckCircle;
      case 'added': return ShoppingCart;
      case 'consolidated': return Zap;
      case 'shared': return Sparkles;
      case 'heart': return Star;
      case 'confetti': return Sparkles;
      case 'cultural': return Star;
      default: return Star;
    }
  };

  const Icon = getIcon();

  const getColors = () => {
    switch (type) {
      case 'completion': return ['hsl(var(--success))', 'hsl(var(--success-dark))'];
      case 'added': return ['hsl(var(--primary))', 'hsl(var(--primary-dark))'];
      case 'consolidated': return ['hsl(var(--accent))', 'hsl(var(--accent-dark))'];
      case 'shared': return ['hsl(var(--secondary))', 'hsl(var(--secondary-dark))'];
      case 'heart': return ['#ef4444', '#dc2626']; // Red heart colors
      case 'confetti': return ['hsl(var(--primary))', 'hsl(var(--accent))'];
      case 'cultural': return cultural === 'italian' ? ['#8B0000', '#DC143C'] :
                             cultural === 'mexican' ? ['#FF6B35', '#FF8C42'] :
                             cultural === 'thai' ? ['#4A7C59', '#6B8E5A'] :
                             ['hsl(var(--primary))', 'hsl(var(--primary-dark))'];
      default: return ['hsl(var(--primary))', 'hsl(var(--primary-dark))'];
    }
  };

  const [primaryColor, secondaryColor] = getColors();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Main celebration icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], rotate: 0, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, times: [0, 0.6, 0.8, 1] }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <Icon 
          size={64} 
          style={{ color: primaryColor }}
          className="drop-shadow-lg"
        />
      </motion.div>

      {/* Particle burst */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            scale: 0,
            x: "50vw",
            y: "50vh",
            opacity: 1
          }}
          animate={{
            scale: [0, 1, 0],
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: particle.delay,
            ease: "easeOut"
          }}
          className="absolute"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, delay: particle.delay }}
            className="w-3 h-3 rounded-full"
            style={{ 
              background: particle.id % 2 ? primaryColor : secondaryColor,
              boxShadow: `0 0 8px ${primaryColor}`
            }}
          />
        </motion.div>
      ))}

      {/* Ripple effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4"
        style={{ borderColor: primaryColor }}
      />

      {/* Secondary ripple */}
      <motion.div
        initial={{ scale: 0, opacity: 0.4 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2"
        style={{ borderColor: secondaryColor }}
      />
    </div>
  );
};

interface IngredientAnimationProps {
  ingredient: string;
  category: string;
  startPosition: { x: number; y: number };
  onComplete?: () => void;
}

export const IngredientAnimation = ({ ingredient, category, startPosition, onComplete }: IngredientAnimationProps) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'produce':
      case 'fruits':
      case 'vegetables': 
        return '🥕';
      case 'dairy':
        return '🥛';
      case 'meat':
      case 'proteins':
        return '🥩';
      case 'pantry':
      case 'grains':
        return '🌾';
      case 'spices':
        return '🧂';
      default:
        return '🛒';
    }
  };

  return (
    <motion.div
      initial={{ 
        x: startPosition.x,
        y: startPosition.y,
        scale: 1,
        opacity: 1
      }}
      animate={{
        x: window.innerWidth - 80,
        y: window.innerHeight - 80,
        scale: 0.5,
        opacity: 0.8
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        duration: 0.8,
        ease: "easeInOut",
        delay: Math.random() * 0.3
      }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-40 bg-background border rounded-lg px-2 py-1 shadow-lg"
    >
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-base">{getCategoryIcon(category)}</span>
        <span className="font-medium">{ingredient}</span>
      </div>
    </motion.div>
  );
};

interface LoadingCelebrationProps {
  isVisible: boolean;
  steps: string[];
  currentStep: number;
}

export const LoadingCelebration = ({ isVisible, steps, currentStep }: LoadingCelebrationProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-card border rounded-lg p-6 max-w-sm mx-4 text-center shadow-xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto mb-4"
        >
          <Sparkles size={48} className="text-primary" />
        </motion.div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                scale: index === currentStep ? 1.05 : 1
              }}
              className={`text-sm ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {index <= currentStep && index < currentStep && '✓ '}{step}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};