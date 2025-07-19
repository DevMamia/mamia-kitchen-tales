
import React, { useState, useEffect } from 'react';
import { X, Trophy, Star, Share2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CelebrationEffects } from './CelebrationEffects';

interface AchievementNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: any[];
}

export const AchievementNotificationModal = ({
  isOpen,
  onClose,
  achievements
}: AchievementNotificationModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [isOpen]);

  const currentAchievement = achievements[currentIndex];

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handleShare = async () => {
    const shareText = currentAchievement.rewards.shareableMessage;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Achievement Unlocked: ${currentAchievement.name}`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-blue-600 bg-blue-100';
      case 'rare': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star size={16} />;
      case 'rare': return <Trophy size={16} />;
      case 'legendary': return <Crown size={16} />;
      default: return <Star size={16} />;
    }
  };

  if (!isOpen || !currentAchievement) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-background">
          <CardContent className="p-0">
            {/* Header */}
            <div className="text-center p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white relative overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="absolute top-2 right-2 text-white hover:bg-white/20"
              >
                <X size={20} />
              </Button>
              
              <div className="relative z-10">
                <div className="text-6xl mb-2 animate-bounce">
                  {currentAchievement.icon}
                </div>
                <h2 className="text-xl font-heading font-bold mb-1">
                  Achievement Unlocked!
                </h2>
                <Badge className={`${getRarityColor(currentAchievement.rarity)} font-bold`}>
                  {getRarityIcon(currentAchievement.rarity)}
                  <span className="ml-1 capitalize">{currentAchievement.rarity}</span>
                </Badge>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 text-4xl animate-pulse">✨</div>
                <div className="absolute top-8 right-8 text-3xl animate-pulse delay-300">🌟</div>
                <div className="absolute bottom-4 left-8 text-2xl animate-pulse delay-700">💫</div>
                <div className="absolute bottom-8 right-4 text-3xl animate-pulse delay-500">⭐</div>
              </div>
            </div>

            {/* Achievement Details */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  {currentAchievement.name}
                </h3>
                <p className="text-muted-foreground">
                  {currentAchievement.description}
                </p>
              </div>

              {/* Rewards */}
              {currentAchievement.rewards && (
                <div className="space-y-4 mb-6">
                  {currentAchievement.rewards.title && (
                    <div className="bg-muted p-3 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-1">New Title Earned:</div>
                      <div className="font-bold text-foreground text-lg">
                        {currentAchievement.rewards.title}
                      </div>
                    </div>
                  )}

                  {currentAchievement.rewards.unlockedRecipes?.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="text-sm text-green-700 dark:text-green-300 mb-2 font-medium">
                        🔓 New Recipes Unlocked:
                      </div>
                      <div className="space-y-1">
                        {currentAchievement.rewards.unlockedRecipes.map((recipe: string, index: number) => (
                          <div key={index} className="text-sm text-green-600 dark:text-green-400">
                            • {recipe.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentAchievement.rewards.specialFeatures?.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-sm text-blue-700 dark:text-blue-300 mb-2 font-medium">
                        ✨ Special Features Unlocked:
                      </div>
                      <div className="space-y-1">
                        {currentAchievement.rewards.specialFeatures.map((feature: string, index: number) => (
                          <div key={index} className="text-sm text-blue-600 dark:text-blue-400">
                            • {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress indicator */}
              {achievements.length > 1 && (
                <div className="flex justify-center space-x-2 mb-6">
                  {achievements.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleShare}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Share2 size={16} className="mr-2" />
                  Share Achievement
                </Button>
                
                <Button
                  onClick={handleNext}
                  variant="outline"
                  className="w-full"
                >
                  {currentIndex < achievements.length - 1 ? 'Next Achievement' : 'Continue Cooking'}
                </Button>
              </div>

              {/* Shareable message preview */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-xs text-muted-foreground italic">
                  "{currentAchievement.rewards.shareableMessage}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Celebration Effects */}
      {showCelebration && (
        <CelebrationEffects
          achievements={[currentAchievement]}
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </>
  );
};
