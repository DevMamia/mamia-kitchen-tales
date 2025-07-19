
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { TipAnalyzerService, TipAnalysis, TipPlacement } from '@/services/tipAnalyzerService';
import { Recipe } from '@/data/recipes';

interface TipValidationPanelProps {
  recipe: Recipe;
  onOptimizationApply?: (optimizedTips: Record<number, TipPlacement>) => void;
}

export const TipValidationPanel: React.FC<TipValidationPanelProps> = ({ 
  recipe, 
  onOptimizationApply 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analyses, setAnalyses] = useState<TipAnalysis[]>([]);
  const [optimizedTips, setOptimizedTips] = useState<Record<number, TipPlacement>>({});

  useEffect(() => {
    if (recipe.stepVoiceTips) {
      const tipAnalyses: TipAnalysis[] = [];
      
      Object.entries(recipe.stepVoiceTips).forEach(([stepStr, tip]) => {
        const stepNum = parseInt(stepStr);
        const analysis = TipAnalyzerService.analyzeTipPlacement(
          tip, 
          stepNum, 
          recipe.instructions
        );
        tipAnalyses.push(analysis);
      });
      
      setAnalyses(tipAnalyses);
      
      const optimized = TipAnalyzerService.optimizeTipPlacements(
        recipe.stepVoiceTips,
        recipe.instructions
      );
      setOptimizedTips(optimized);
    }
  }, [recipe]);

  const needsOptimization = analyses.filter(a => a.confidence > 0.7 && a.originalStep !== a.suggestedStep);
  const lowConfidence = analyses.filter(a => a.confidence < 0.6);

  if (!recipe.stepVoiceTips || Object.keys(recipe.stepVoiceTips).length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Recipe Tip Analysis</h3>
          {needsOptimization.length > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {needsOptimization.length} optimization{needsOptimization.length !== 1 ? 's' : ''} suggested
            </Badge>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {needsOptimization.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Found {needsOptimization.length} tip(s) that could be moved to more contextually appropriate steps.
              </AlertDescription>
            </Alert>
          )}

          {/* Optimization Suggestions */}
          {needsOptimization.map((analysis, index) => (
            <Card key={index} className="p-3 bg-orange-50 border-orange-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    Step {analysis.originalStep} → Step {analysis.suggestedStep}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(analysis.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.reason}</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {/* Low Confidence Tips */}
          {lowConfidence.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Tips needing manual review:</h4>
              {lowConfidence.map((analysis, index) => (
                <Card key={index} className="p-3 bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Step {analysis.originalStep}</span>
                    <Badge variant="outline" className="text-xs bg-gray-100">
                      Low confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{analysis.reason}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Apply Optimizations Button */}
          {needsOptimization.length > 0 && onOptimizationApply && (
            <div className="flex justify-end pt-2">
              <Button 
                onClick={() => onOptimizationApply(optimizedTips)}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
              >
                Apply Optimizations
              </Button>
            </div>
          )}

          {/* Success State */}
          {needsOptimization.length === 0 && lowConfidence.length === 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">All tips are contextually aligned!</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
