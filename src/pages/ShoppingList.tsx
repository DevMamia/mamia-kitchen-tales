import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function ShoppingList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { shoppingListItems, toggleItemChecked, addManualItem, deleteItem, currentList } = useShoppingList();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Other' });

  // Group items by category
  const groupedItems = shoppingListItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof shoppingListItems>);

  const categories = Object.keys(groupedItems).sort();
  const totalItems = shoppingListItems.length;
  const checkedItems = shoppingListItems.filter(item => item.checked).length;

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    
    await addManualItem(newItem.name, newItem.quantity || undefined, newItem.category);
    setNewItem({ name: '', quantity: '', category: 'Other' });
    setIsAddingItem(false);
  };

  const handleShare = async () => {
    const uncheckedItems = shoppingListItems.filter(item => !item.checked);
    const shareText = `Shopping List - ${currentList?.name || 'My List'}\n\n` + 
      uncheckedItems.map(item => `• ${item.ingredient_name}${item.quantity ? ` (${item.quantity})` : ''}`).join('\n');
    
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Shopping list copied! You can now share it with friends and family.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy shopping list",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/kitchen')}
          className="text-warm-brown hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Kitchen
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-warm-brown">
            {currentList?.name || 'Shopping List'}
          </h1>
          <p className="text-muted-foreground">
            {totalItems} items • {checkedItems} completed
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Copy className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g., Tomatoes"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="item-quantity">Quantity (optional)</Label>
                  <Input
                    id="item-quantity"
                    placeholder="e.g., 2 lbs, 1 cup"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="item-category">Category</Label>
                  <Input
                    id="item-category"
                    placeholder="e.g., Produce, Dairy"
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddItem} className="flex-1">Add Item</Button>
                  <Button variant="outline" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Bar */}
      {totalItems > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-warm-brown font-medium">
              {Math.round((checkedItems / totalItems) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(checkedItems / totalItems) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Shopping List Items */}
      {totalItems === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-warm-brown mb-2">
              Your shopping list is empty
            </h3>
            <p className="text-muted-foreground mb-4">
              Add ingredients from recipes or create manual items
            </p>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map(category => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-warm-brown flex items-center gap-2">
                  {category}
                  <Badge variant="outline" className="text-xs">
                    {groupedItems[category].length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupedItems[category].map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <button
                        onClick={() => toggleItemChecked(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          item.checked
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30 hover:border-primary'
                        }`}
                      >
                        {item.checked && (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <span className={`block font-medium transition-all duration-200 ${
                          item.checked 
                            ? 'text-muted-foreground line-through' 
                            : 'text-foreground'
                        }`}>
                          {item.ingredient_name}
                        </span>
                        {item.quantity && (
                          <span className="text-sm text-muted-foreground">
                            {item.quantity}
                          </span>
                        )}
                        {item.recipe_name && (
                          <Badge variant="outline" className="text-xs mt-1">
                            From {item.recipe_name}
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}