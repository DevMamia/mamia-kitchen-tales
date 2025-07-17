import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Copy, Sparkles } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DraggableShoppingItem from '@/components/DraggableShoppingItem';
import { ShoppingListItem } from '@/types/shopping';
import FloatingCartButton from '@/components/FloatingCartButton';

export default function ShoppingList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { shoppingListItems, toggleItemChecked, addManualItem, deleteItem, currentList } = useShoppingList();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Other' });
  const [sortedItems, setSortedItems] = useState(shoppingListItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update sorted items when shopping list changes
  useEffect(() => {
    setSortedItems(shoppingListItems);
  }, [shoppingListItems]);

  // Group items by category using sorted items
  const groupedItems = sortedItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof sortedItems>);

  const categories = Object.keys(groupedItems).sort();
  const totalItems = sortedItems.length;
  const checkedItems = sortedItems.filter(item => item.checked).length;

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    
    await addManualItem(newItem.name, newItem.quantity || undefined, newItem.category);
    setNewItem({ name: '', quantity: '', category: 'Other' });
    setIsAddingItem(false);
  };

  const handleDragStart = (event: any) => {
    setDraggedItem(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedItems.findIndex(item => item.id === active.id);
    const newIndex = sortedItems.findIndex(item => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(sortedItems, oldIndex, newIndex);
      setSortedItems(newItems);
      
      toast({
        title: "Item Reordered",
        description: "Shopping list order updated!",
      });
    }
  };

  const handleShare = async () => {
    const uncheckedItems = sortedItems.filter(item => !item.checked);
    const shareText = `Shopping List - ${currentList?.name || 'My List'}\n\n` + 
      uncheckedItems.map(item => `• ${item.ingredient_name}${item.quantity ? ` (${item.quantity})` : ''}`).join('\n');
    
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "✨ Copied to Clipboard",
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
    <div className="container mx-auto px-4 py-8 max-w-2xl relative">
      {/* Enhanced Header */}
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/kitchen')}
          className="text-warm-brown hover:text-primary hover:scale-105 transition-transform"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Kitchen
        </Button>
      </motion.div>

      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <motion.h1 
            className="text-2xl font-heading font-bold text-warm-brown flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentList?.name || 'Shopping List'}
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                🛒
              </motion.span>
            )}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {totalItems} items • {checkedItems} completed
            {draggedItem && (
              <span className="ml-2 text-primary animate-pulse">• Reordering...</span>
            )}
          </motion.p>
        </div>
        
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="hover:scale-105 transition-transform"
          >
            <Copy className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                className="hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80"
              >
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
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      {totalItems > 0 && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground flex items-center gap-2">
              Progress
              {checkedItems === totalItems && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-600"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
              )}
            </span>
            <motion.span 
              className="text-warm-brown font-medium"
              key={checkedItems}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {Math.round((checkedItems / totalItems) * 100)}%
            </motion.span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(checkedItems / totalItems) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {checkedItems === totalItems && totalItems > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: 3 }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Enhanced Shopping List Items with Drag & Drop */}
      <AnimatePresence>
        {totalItems === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <motion.div 
                  className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </motion.div>
                <h3 className="text-lg font-heading font-semibold text-warm-brown mb-2">
                  Your shopping list is empty
                </h3>
                <p className="text-muted-foreground mb-4">
                  Add ingredients from recipes or create manual items
                </p>
                <Button 
                  onClick={() => setIsAddingItem(true)}
                  className="hover:scale-105 transition-transform"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {categories.map(category => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-warm-brown flex items-center gap-2">
                        {category}
                        <motion.div
                          key={groupedItems[category].length}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <Badge variant="outline" className="text-xs">
                            {groupedItems[category].length}
                          </Badge>
                        </motion.div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SortableContext 
                        items={groupedItems[category].map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          <AnimatePresence>
                            {groupedItems[category].map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                              >
                                <DraggableShoppingItem 
                                  item={item}
                                  isDragging={draggedItem === item.id}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </SortableContext>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </DndContext>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <FloatingCartButton />
    </div>
  );
}