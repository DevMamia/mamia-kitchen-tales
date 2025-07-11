import { ShoppingCart, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { useNavigate } from 'react-router-dom';

export default function ShoppingListCard() {
  const navigate = useNavigate();
  const { shoppingListItems, currentList } = useShoppingList();

  const totalItems = shoppingListItems.length;
  const checkedItems = shoppingListItems.filter(item => item.checked).length;
  const uncheckedItems = totalItems - checkedItems;

  const handleViewShoppingList = () => {
    navigate('/shopping-list');
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white via-white to-primary/5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full"></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-heading text-warm-brown">
              {currentList?.name || 'Shopping List'}
            </CardTitle>
            <CardDescription className="text-sm">
              Your ingredients for cooking
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-cream/50 rounded-lg">
            <div className="text-lg font-bold text-warm-brown">{totalItems}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-2 bg-primary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">{uncheckedItems}</div>
            <div className="text-xs text-muted-foreground">To Buy</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{checkedItems}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
        </div>

        {/* Progress */}
        {totalItems > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-warm-brown font-medium">
                {Math.round((checkedItems / totalItems) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(checkedItems / totalItems) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Recent Items Preview */}
        {shoppingListItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-warm-brown">Recent Items</h4>
            <div className="space-y-1">
              {shoppingListItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  {item.checked ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <div className="w-3 h-3 border border-muted-foreground/30 rounded"></div>
                  )}
                  <span className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item.ingredient_name}
                  </span>
                  {item.recipe_name && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {item.recipe_name}
                    </Badge>
                  )}
                </div>
              ))}
              {shoppingListItems.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{shoppingListItems.length - 3} more items
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="text-center py-4">
            <div className="bg-muted/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No items yet. Add ingredients from recipes!
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleViewShoppingList}
          className="w-full"
          variant={totalItems > 0 ? "default" : "outline"}
        >
          {totalItems > 0 ? "View Shopping List" : "Start Shopping List"}
        </Button>
      </CardContent>
    </Card>
  );
}