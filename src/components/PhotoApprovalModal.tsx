
import React, { useState } from 'react';
import { X, Share2, Heart, Star, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CelebrationEffects } from './CelebrationEffects';
import { achievementTrackingService } from '@/services/achievementTrackingService';

interface PhotoApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: any;
  mama: any;
  photo: string | null;
}

export const PhotoApprovalModal = ({ 
  isOpen, 
  onClose, 
  analysisResult, 
  mama, 
  photo 
}: PhotoApprovalModalProps) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState([]);

  React.useEffect(() => {
    if (isOpen && analysisResult) {
      // Track photo approval achievement
      achievementTrackingService.trackPhotoApproval(
        analysisResult.overallScore,
        mama.voiceId
      ).then(newAchievements => {
        if (newAchievements.length > 0) {
          setAchievementsUnlocked(newAchievements);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      });
    }
  }, [isOpen, analysisResult, mama.voiceId]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🌟';
    if (score >= 8) return '😍';
    if (score >= 7) return '😊';
    if (score >= 6) return '🙂';
    return '💪';
  };

  const handleShare = async () => {
    const shareText = analysisResult.shareableQuote;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${mama.name}'s Cooking Approval`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      // Could show a toast here
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg mx-auto bg-background max-h-[90vh] overflow-y-auto">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{mama?.emoji}</div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-lg">
                      {mama?.name}'s Approval
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your cooking assessment
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X size={20} />
                </Button>
              </div>
              
              {/* Achievement notification */}
              {achievementsUnlocked.length > 0 && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-bounce">
                    <Sparkles size={12} className="mr-1" />
                    Achievement Unlocked!
                  </Badge>
                </div>
              )}
            </div>

            {/* Photo */}
            {photo && (
              <div className="relative">
                <img 
                  src={photo} 
                  alt="Your cooking progress"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={`${getScoreColor(analysisResult.overallScore)} font-bold`}>
                    {getScoreEmoji(analysisResult.overallScore)} {analysisResult.overallScore}/10
                  </Badge>
                </div>
              </div>
            )}

            {/* Mama's Feedback */}
            <div className="p-4">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4 mb-4 border-l-4 border-orange-400">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{mama?.emoji}</div>
                  <div>
                    <h4 className="font-handwritten text-lg text-orange-800 dark:text-orange-200 mb-2">
                      {mama?.name} says:
                    </h4>
                    <p className="font-handwritten text-orange-700 dark:text-orange-300 text-lg leading-relaxed">
                      "{analysisResult.mamaPersonalizedFeedback}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {analysisResult.visualAppeal}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Visual Appeal</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {analysisResult.culturalAuthenticity}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Authenticity</div>
                </div>
              </div>

              {/* Technique Assessment */}
              {analysisResult.techniqueAssessment && (
                <div className="mb-4">
                  <h5 className="font-semibold text-foreground mb-2">Technique Notes:</h5>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {analysisResult.techniqueAssessment}
                  </p>
                </div>
              )}

              {/* Improvement Suggestions */}
              {analysisResult.improvementSuggestions?.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold text-foreground mb-2">
                    <Heart size={16} className="inline mr-1 text-red-500" />
                    Tips for Next Time:
                  </h5>
                  <ul className="space-y-1">
                    {analysisResult.improvementSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator className="my-4" />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleShare}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Share2 size={16} className="mr-2" />
                  Share {mama?.name}'s Approval
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex-1">
                    <Download size={16} className="mr-2" />
                    Save Photo
                  </Button>
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Continue Cooking
                  </Button>
                </div>
              </div>

              {/* Shareable Quote Preview */}
              <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg text-center">
                <p className="text-sm text-muted-foreground italic">
                  "{analysisResult.shareableQuote}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Celebration Effects */}
      {showCelebration && (
        <CelebrationEffects
          trigger={showCelebration}
          type="completion"
          cultural="italian"
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </>
  );
};
