
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { smartSubstitutionService } from '@/services/smartSubstitutionService';
import { getMamaById } from '@/data/mamas';

interface SubstitutionSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: string;
  recipeId: string;
  mamaId: string;
  onApplySubstitution?: (original: string, substitute: string, ratio: string) => void;
}

export const SubstitutionSuggestionModal = ({
  isOpen,
  onClose,
  ingredient,
  recipeId,
  mamaId,
  onApplySubstitution
}: SubstitutionSuggestionModalProps) => {
  const [substitution, setSubstitution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const mama = getMamaById(parseInt(mamaId)) || getMamaById(1);

  useEffect(() => {
    if (isOpen && ingredient) {
      loadSubstitutions();
    }
  }, [isOpen, ingredient]);

  const loadSubstitutions = async () => {
    setLoading(true);
    try {
      const result = await smartSubstitutionService.getSubstitutions({
        ingredient,
        recipeId,
        mamaId: mama.voiceId,
        recipeCuisine: getCuisineByMama(mama.voiceId),
        recipeType: 'main'
      });
      setSubstitution(result);
    } catch (error) {
      console.error('Error loading substitutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCuisineByMama = (mamaVoiceId: string): string => {
    const cuisineMap = {
      'nonna_lucia': 'Italian',
      'abuela_rosa': 'Mexican',
      'yai_malee': 'Thai'
    };
    return cuisineMap[mamaVoiceId] || 'Italian';
  };

  const getFlavorImpactColor = (impact: string) => {
    switch (impact) {
      case 'minimal': return 'text-green-600 bg-green-100';
      case 'noticeable': return 'text-yellow-600 bg-yellow-100';
      case 'significant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFlavorImpactIcon = (impact: string) => {
    switch (impact) {
      case 'minimal': return <CheckCircle size={16} className="text-green-600" />;
      case 'noticeable': return <Info size={16} className="text-yellow-600" />;
      case 'significant': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <Info size={16} />;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'common': return <Badge variant="secondary" className="bg-green-100 text-green-700">Common</Badge>;
      case 'specialty': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Specialty Store</Badge>;
      case 'rare': return <Badge variant="secondary" className="bg-red-100 text-red-700">Hard to Find</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleApplySubstitution = (option: any) => {
    if (onApplySubstitution) {
      onApplySubstitution(ingredient, option.substitute, option.ratio);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto bg-background max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{mama?.emoji}</div>
              <div>
                <h3 className="font-heading font-bold text-foreground">
                  Ingredient Substitution
                </h3>
                <p className="text-sm text-muted-foreground">
                  Missing: {ingredient}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Finding substitutions...</p>
            </div>
          ) : substitution ? (
            <div className="p-4 space-y-4">
              {/* Mama's Advice */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4 border-l-4 border-orange-400">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{mama?.emoji}</div>
                  <div>
                    <h4 className="font-handwritten text-lg text-orange-800 dark:text-orange-200 mb-2">
                      {mama?.name}'s advice:
                    </h4>
                    <p className="font-handwritten text-orange-700 dark:text-orange-300 text-base leading-relaxed">
                      "{substitution.mamaAdvice}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Cultural Context */}
              {substitution.culturalContext && (
                <div className="bg-muted p-3 rounded-lg">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb size={16} className="text-yellow-500" />
                    Cultural Context
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {substitution.culturalContext}
                  </p>
                </div>
              )}

              {/* Substitution Options */}
              <div>
                <h5 className="font-semibold text-foreground mb-3">Available Substitutions:</h5>
                <div className="space-y-3">
                  {substitution.alternatives.map((option: any, index: number) => (
                    <div 
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedOption === index 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                          : 'border-border hover:border-orange-300'
                      }`}
                      onClick={() => setSelectedOption(index)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h6 className="font-medium text-foreground">{option.substitute}</h6>
                          <p className="text-sm text-muted-foreground">Use {option.ratio} ratio</p>
                        </div>
                        {getAvailabilityBadge(option.availability)}
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          {getFlavorImpactIcon(option.flavorImpact)}
                          <Badge className={getFlavorImpactColor(option.flavorImpact)}>
                            {option.flavorImpact} impact
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Authenticity:</span>
                          <div className="flex items-center">
                            {'★'.repeat(Math.round(option.culturalAuthenticity / 2))}
                            <span className="text-xs ml-1 text-muted-foreground">
                              {option.culturalAuthenticity}/10
                            </span>
                          </div>
                        </div>
                      </div>

                      {option.notes && (
                        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          💡 {option.notes}
                        </p>
                      )}

                      {selectedOption === index && (
                        <Button
                          onClick={() => handleApplySubstitution(option)}
                          className="w-full mt-3 bg-orange-500 hover:bg-orange-600"
                        >
                          Use This Substitution
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Keep Original
                </Button>
                <Button 
                  onClick={() => selectedOption !== null && handleApplySubstitution(substitution.alternatives[selectedOption])}
                  disabled={selectedOption === null}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Apply Substitution
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
              <h4 className="font-semibold text-foreground mb-2">No Substitutions Found</h4>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn't find good substitutions for "{ingredient}" right now.
              </p>
              <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                💡 Try checking a specialty food store or asking at your local market for this ingredient.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
