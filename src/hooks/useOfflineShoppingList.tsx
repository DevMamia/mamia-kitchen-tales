import { useState, useEffect } from 'react';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { usePWA } from '@/hooks/usePWA';
import { offlineStorage } from '@/services/offlineStorageService';
import { useToast } from '@/hooks/use-toast';

export const useOfflineShoppingList = () => {
  const { shoppingListItems, refreshShoppingList } = useShoppingList();
  const { isOffline } = usePWA();
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  // Save to offline storage whenever shopping list changes
  useEffect(() => {
    if (shoppingListItems && shoppingListItems.length > 0) {
      offlineStorage.saveShoppingList({
        id: 'current',
        items: shoppingListItems,
        timestamp: new Date().toISOString()
      }).catch(console.error);
    }
  }, [shoppingListItems]);

  // Load from offline storage when going offline
  useEffect(() => {
    if (isOffline) {
      loadOfflineShoppingList();
    } else {
      syncPendingChanges();
    }
  }, [isOffline]);

  const loadOfflineShoppingList = async () => {
    try {
      const offlineList = await offlineStorage.getShoppingList();
      if (offlineList && offlineList.items) {
        // Note: We can only read from offline storage when offline
        // The actual state updates should be handled by the ShoppingListContext
        toast({
          title: "Working Offline",
          description: "Shopping list cached for offline use",
        });
      }
    } catch (error) {
      console.error('Failed to load offline shopping list:', error);
    }
  };

  const syncPendingChanges = async () => {
    if (syncing) return;
    
    setSyncing(true);
    try {
      const pendingChanges = await offlineStorage.getPendingSyncs();
      const shoppingListChanges = pendingChanges.filter(change => 
        change.type === 'shoppingList'
      );

      if (shoppingListChanges.length > 0) {
        // Sync each pending change
        for (const change of shoppingListChanges) {
          try {
            // Refresh the shopping list from the server
            await refreshShoppingList();
            await offlineStorage.removePendingSync(change.id);
          } catch (error) {
            console.error('Failed to sync shopping list change:', error);
          }
        }

        toast({
          title: "Synced Successfully",
          description: `${shoppingListChanges.length} shopping list changes synced`,
        });
      }
    } catch (error) {
      console.error('Failed to sync pending changes:', error);
    } finally {
      setSyncing(false);
    }
  };

  const updateOfflineShoppingList = async (newItems: any[]) => {
    // Save to offline storage
    await offlineStorage.saveShoppingList({
      id: 'current',
      items: newItems,
      timestamp: new Date().toISOString()
    });

    // If offline, add to pending sync
    if (isOffline) {
      await offlineStorage.addPendingSync('shoppingList', {
        items: newItems,
        action: 'update',
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    isOffline,
    syncing,
    updateOfflineShoppingList,
    syncPendingChanges,
  };
};