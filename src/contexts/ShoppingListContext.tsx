import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingList, ShoppingListItem, AddToShoppingListRequest } from '@/types/shopping';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

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

  const addIngredientsToShoppingList = async (request: AddToShoppingListRequest) => {
    if (!currentList) return;

    try {
      const itemsToAdd = request.ingredients.map(ingredient => ({
        shopping_list_id: currentList.id,
        ingredient_name: ingredient,
        recipe_id: request.recipe_id,
        recipe_name: request.recipe_name,
        category: request.recipe_name || 'Other'
      }));

      const { error } = await supabase
        .from('shopping_list_items')
        .insert(itemsToAdd);

      if (error) throw error;

      await fetchShoppingListItems();
      
      toast({
        title: "Added to Shopping List",
        description: `${request.ingredients.length} ingredients added from ${request.recipe_name}`,
      });
    } catch (error) {
      console.error('Error adding ingredients to shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to add ingredients to shopping list",
        variant: "destructive"
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

  const addManualItem = async (ingredientName: string, quantity?: string, category = 'Other') => {
    if (!currentList) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .insert({
          shopping_list_id: currentList.id,
          ingredient_name: ingredientName,
          quantity,
          category
        });

      if (error) throw error;

      await fetchShoppingListItems();
      
      toast({
        title: "Item Added",
        description: `${ingredientName} added to shopping list`,
      });
    } catch (error) {
      console.error('Error adding manual item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
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
    refreshShoppingList
  };

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>;
};