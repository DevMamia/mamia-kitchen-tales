
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Recipe } from '@/data/recipes';

interface TipValidationPanelProps {
  recipe: Recipe;
  onOptimizationApply?: (optimizedTips: any) => void;
}

export const TipValidationPanel: React.FC<TipValidationPanelProps> = ({ 
  recipe, 
  onOptimizationApply 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if recipe has steps with tips (new structure)
  const hasStepsWithTips = recipe.steps && recipe.steps.some(step => step.tips && step.tips.length > 0);
  
  if (!hasStepsWithTips) {
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
          <h3 className="font-medium">Recipe Tips Analysis</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            MamiaV1 Mode - Tips Integrated
          </Badge>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Tips are now seamlessly integrated into voice instructions using the MamiaV1 approach. 
              Each step's tips are automatically included when speaking instructions.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Steps with tips:</h4>
            {recipe.steps?.map((step, index) => {
              if (step.tips && step.tips.length > 0) {
                return (
                  <Card key={index} className="p-3 bg-green-50 border-green-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Step {index + 1}</span>
                        <Badge variant="outline" className="text-xs bg-green-100">
                          {step.tips.length} tip{step.tips.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {step.tips.map((tip, tipIndex) => (
                          <Badge key={tipIndex} variant="secondary" className="text-xs">
                            Tip {tipIndex + 1}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
