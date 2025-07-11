import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Merge, 
  Sparkles, 
  Check, 
  X, 
  AlertTriangle
} from 'lucide-react';
import { ShoppingListItem } from '@/types/shopping';
import { ingredientConsolidationService } from '@/services/ingredientConsolidationService';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { useToast } from '@/hooks/use-toast';

interface SmartCategorizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingListItem[];
}

interface ConsolidationSuggestion {
  canonical_name: string;
  total_quantity: string;
  aliases: string[];
  recipe_names: string[];
  category?: string;
}

const SmartCategorizationPanel: React.FC<SmartCategorizationPanelProps> = ({
  isOpen,
  onClose,
  items
}) => {
  const [suggestions, setSuggestions] = useState<ConsolidationSuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { consolidateIngredients } = useShoppingList();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && items.length > 0) {
      generateSuggestions();
    }
  }, [isOpen, items]);

  const generateSuggestions = () => {
    setLoading(true);
    
    try {
      const consolidated = ingredientConsolidationService.findSimilarIngredients(
        items.map(item => ({
          ingredient_name: item.ingredient_name,
          quantity: item.quantity,
          recipe_name: item.recipe_name
        }))
      );

      // Only show suggestions where we actually consolidated something
      const meaningfulSuggestions = consolidated.filter(suggestion => 
        suggestion.aliases.length > 1
      );

      setSuggestions(meaningfulSuggestions);
      
      // Pre-select all suggestions
      setSelectedSuggestions(new Set(meaningfulSuggestions.map(s => s.canonical_name)));
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate consolidation suggestions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSuggestion = (canonicalName: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(canonicalName)) {
      newSelected.delete(canonicalName);
    } else {
      newSelected.add(canonicalName);
    }
    setSelectedSuggestions(newSelected);
  };

  const applyConsolidation = async () => {
    if (selectedSuggestions.size === 0) {
      toast({
        title: "No changes",
        description: "Please select at least one suggestion to apply",
        variant: "destructive"
      });
      return;
    }

    try {
      await consolidateIngredients();
      toast({
        title: "Consolidation applied",
        description: `${selectedSuggestions.size} ingredient groups were consolidated`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply consolidation",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles size={20} />
              Smart Consolidation
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing ingredients...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={20} />
            Smart Consolidation
          </DialogTitle>
        </DialogHeader>

        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Check size={48} className="mx-auto mb-4 text-green-500" />
            <h3 className="font-heading font-bold mb-2">No duplicates found!</h3>
            <p className="text-muted-foreground">
              Your shopping list is already optimized. All ingredients are unique.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Merge size={16} />
                <span className="font-heading font-bold text-sm">
                  Found {suggestions.length} consolidation opportunities
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                We found similar ingredients that can be combined to simplify your shopping list.
              </p>
            </div>

            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={suggestion.canonical_name} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-heading font-bold">
                          {suggestion.canonical_name}
                        </h4>
                        {suggestion.total_quantity && (
                          <Badge variant="secondary">
                            {suggestion.total_quantity}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Combines:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {suggestion.aliases.map((alias, aliasIndex) => (
                              <Badge key={aliasIndex} variant="outline" className="text-xs">
                                {alias}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {suggestion.recipe_names.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              From recipes:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {suggestion.recipe_names.map((recipe, recipeIndex) => (
                                <Badge key={recipeIndex} variant="secondary" className="text-xs">
                                  {recipe}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant={selectedSuggestions.has(suggestion.canonical_name) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleSuggestion(suggestion.canonical_name)}
                      className="ml-4"
                    >
                      {selectedSuggestions.has(suggestion.canonical_name) ? (
                        <Check size={16} />
                      ) : (
                        <X size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              <Button 
                onClick={applyConsolidation}
                disabled={selectedSuggestions.size === 0}
                className="flex items-center gap-2"
              >
                <Merge size={16} />
                Apply Consolidation ({selectedSuggestions.size})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmartCategorizationPanel;