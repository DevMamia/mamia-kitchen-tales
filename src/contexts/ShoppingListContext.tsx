import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingList, ShoppingListItem, AddToShoppingListRequest } from '@/types/shopping';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { categorizationService } from '@/services/categorizationService';
import { ingredientConsolidationService } from '@/services/ingredientConsolidationService';

interface ShoppingListContextType {
  shoppingLists: ShoppingList[];
  shoppingListItems: ShoppingListItem[];
  currentList: ShoppingList | null;
  loading: boolean;
  addIngredientsToShoppingList: (request: AddToShoppingListRequest) => Promise<void>;
  toggleItemChecked: (itemId: string) => Promise<void>;
  addManualItem: (ingredientName: string, quantity?: string, category?: string) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  refreshShoppingList: () => Promise<void>;
  consolidateIngredients: () => Promise<void>;
  reorderItems: (itemIds: string[]) => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchShoppingLists = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: lists, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setShoppingLists(lists || []);
      if (lists && lists.length > 0 && !currentList) {
        setCurrentList(lists[0]);
      }
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      toast({
        title: "Error",
        description: "Failed to load shopping lists",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchShoppingListItems = async () => {
    if (!currentList) return;
    
    try {
      const { data: items, error } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('shopping_list_id', currentList.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShoppingListItems(items || []);
    } catch (error) {
      console.error('Error fetching shopping list items:', error);
      toast({
        title: "Error",
        description: "Failed to load shopping list items",
        variant: "destructive"
      });
    }
  };

  const refreshShoppingList = async () => {
    await Promise.all([fetchShoppingLists(), fetchShoppingListItems()]);
  };

  const consolidateIngredients = async () => {
    if (!currentList || shoppingListItems.length === 0) return;

    try {
      // Find similar ingredients and consolidate
      const consolidated = ingredientConsolidationService.findSimilarIngredients(
        shoppingListItems.map(item => ({
          ingredient_name: item.ingredient_name,
          quantity: item.quantity,
          recipe_name: item.recipe_name
        }))
      );

      // Remove old items and add consolidated ones
      const { error: deleteError } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('shopping_list_id', currentList.id)
        .eq('checked', false);

      if (deleteError) throw deleteError;

      // Add consolidated items
      const consolidatedItems = await Promise.all(
        consolidated.map(async (item) => {
          const category = await categorizationService.categorizeIngredient(item.canonical_name);
          return {
            shopping_list_id: currentList.id,
            ingredient_name: item.canonical_name,
            quantity: item.total_quantity,
            category: category?.name || 'Other',
            category_id: category?.id,
            checked: false,
          };
        })
      );

      const { error: insertError } = await supabase
        .from('shopping_list_items')
        .insert(consolidatedItems);

      if (insertError) throw insertError;

      await fetchShoppingListItems();
      
      toast({
        title: "Ingredients consolidated",
        description: "Similar ingredients have been combined.",
      });
    } catch (error) {
      console.error('Error consolidating ingredients:', error);
      toast({
        title: "Error",
        description: "Failed to consolidate ingredients.",
        variant: "destructive",
      });
    }
  };

  const reorderItems = async (itemIds: string[]) => {
    // For now, we'll just update the local state
    // In a full implementation, you might want to store order in the database
    const reorderedItems = itemIds.map(id => 
      shoppingListItems.find(item => item.id === id)
    ).filter(Boolean) as ShoppingListItem[];
    
    setShoppingListItems(reorderedItems);
  };

  const addIngredientsToShoppingList = async (request: AddToShoppingListRequest) => {
    if (!currentList) return;

    try {
      const itemsToAdd = await Promise.all(
        request.ingredients.map(async (ingredient) => {
          // Smart categorization
          const category = await categorizationService.categorizeIngredient(ingredient.name);
          
          return {
            shopping_list_id: currentList.id,
            ingredient_name: ingredient.name,
            quantity: ingredient.quantity,
            recipe_id: request.recipeId,
            recipe_name: request.recipeName,
            category: category?.name || 'Other',
            category_id: category?.id,
            checked: false,
          };
        })
      );

      const { error } = await supabase
        .from('shopping_list_items')
        .insert(itemsToAdd);

      if (error) throw error;

      await fetchShoppingListItems();
      
      toast({
        title: "Added to shopping list",
        description: `${request.ingredients.length} ingredients added successfully.`,
      });
    } catch (error) {
      console.error('Error adding ingredients to shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to add ingredients to shopping list.",
        variant: "destructive",
      });
    }
  };

  const toggleItemChecked = async (itemId: string) => {
    const item = shoppingListItems.find(i => i.id === itemId);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ checked: !item.checked })
        .eq('id', itemId);

      if (error) throw error;

      setShoppingListItems(prev => 
        prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i)
      );
    } catch (error) {
      console.error('Error toggling item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
    }
  };

  const addManualItem = async (ingredientName: string, quantity?: string, category?: string) => {
    if (!currentList) return;

    try {
      // Smart categorization if no category provided
      const smartCategory = category || (await categorizationService.categorizeIngredient(ingredientName))?.name || 'Other';
      const categoryData = await categorizationService.categorizeIngredient(ingredientName);

      const { error } = await supabase
        .from('shopping_list_items')
        .insert({
          shopping_list_id: currentList.id,
          ingredient_name: ingredientName,
          quantity,
          category: smartCategory,
          category_id: categoryData?.id,
          checked: false,
        });

      if (error) throw error;

      await fetchShoppingListItems();
      
      toast({
        title: "Item added",
        description: `${ingredientName} added to shopping list.`,
      });
    } catch (error) {
      console.error('Error adding manual item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to shopping list.",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setShoppingListItems(prev => prev.filter(i => i.id !== itemId));
      
      toast({
        title: "Item Deleted",
        description: "Item removed from shopping list",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (session) {
      fetchShoppingLists();
    } else {
      setShoppingLists([]);
      setShoppingListItems([]);
      setCurrentList(null);
    }
  }, [session]);

  useEffect(() => {
    if (currentList) {
      fetchShoppingListItems();
    }
  }, [currentList]);

  const value = {
    shoppingLists,
    shoppingListItems,
    currentList,
    loading,
    addIngredientsToShoppingList,
    toggleItemChecked,
    addManualItem,
    deleteItem,
    refreshShoppingList,
    consolidateIngredients,
    reorderItems
  };

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>;
};