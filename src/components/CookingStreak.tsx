import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Trophy, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CookingStreakProps {
  currentStreak: number;
  totalCookedMeals: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  cultural?: 'italian' | 'mexican' | 'thai';
}

const CookingStreak: React.FC<CookingStreakProps> = ({
  currentStreak,
  totalCookedMeals,
  achievements
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentStreak]);

  const getStreakColor = () => {
    if (currentStreak >= 30) return 'text-purple-500';
    if (currentStreak >= 14) return 'text-orange-500';
    if (currentStreak >= 7) return 'text-yellow-500';
    return 'text-primary';
  };

  const getStreakBadge = () => {
    if (currentStreak >= 30) return '🔥 Cooking Master';
    if (currentStreak >= 14) return '👨‍🍳 Chef Level';
    if (currentStreak >= 7) return '🌟 Week Warrior';
    return '🔥 Getting Started';
  };

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotateZ: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Flame className={`w-8 h-8 ${getStreakColor()}`} />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold">{currentStreak} Day Streak</h3>
                <p className="text-muted-foreground">{getStreakBadge()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {totalCookedMeals} meals cooked
              </div>
            </div>
          </div>

          {/* Streak Visualization */}
          <div className="flex gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-8 rounded-full ${
                  i < (currentStreak % 7) ? 'bg-primary' : 'bg-muted'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            className={`
              p-4 rounded-lg border text-center space-y-2
              ${achievement.unlocked 
                ? 'bg-gradient-to-b from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                : 'bg-muted/50 border-muted'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-3xl">{achievement.icon}</div>
            <h4 className={`font-medium text-sm ${
              achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {achievement.title}
            </h4>
            {achievement.unlocked && (
              <Badge variant="secondary" className="text-xs">
                Unlocked!
              </Badge>
            )}
          </motion.div>
        ))}
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-6xl"
            animate={{
              scale: [0, 1.5, 1],
              rotateZ: [0, 360, 720],
            }}
            transition={{ duration: 2 }}
          >
            🎉
          </motion.div>
          
          {/* Confetti */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 100],
                x: [0, Math.random() * 200 - 100],
                rotate: [0, 360],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CookingStreak;