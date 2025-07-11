import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
}

interface UseOptimisticUpdatesOptions<T> {
  mutationFn: (data: T) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error, originalData: T) => void;
  rollbackDelay?: number;
}

export function useOptimisticUpdates<T>(
  initialData: T[],
  options: UseOptimisticUpdatesOptions<T>
) {
  const [optimisticData, setOptimisticData] = useState<T[]>(initialData);
  const [pendingUpdates, setPendingUpdates] = useState<OptimisticUpdate<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const rollbackTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addOptimisticUpdate = useCallback(
    async (newData: T, tempId?: string) => {
      const updateId = tempId || `temp-${Date.now()}-${Math.random()}`;
      const update: OptimisticUpdate<T> = {
        id: updateId,
        data: newData,
        timestamp: Date.now()
      };

      // Add optimistic update immediately
      setOptimisticData(prev => [...prev, newData]);
      setPendingUpdates(prev => [...prev, update]);
      setIsLoading(true);

      try {
        // Perform actual mutation
        const result = await options.mutationFn(newData);
        
        // Remove from pending updates on success
        setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
        
        // Replace optimistic data with real data
        setOptimisticData(prev => 
          prev.map(item => 
            JSON.stringify(item) === JSON.stringify(newData) ? result : item
          )
        );

        options.onSuccess?.(result);
      } catch (error) {
        // Rollback optimistic update on error
        setOptimisticData(prev => 
          prev.filter(item => JSON.stringify(item) !== JSON.stringify(newData))
        );
        setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
        
        options.onError?.(error as Error, newData);
        
        toast({
          title: "Action failed",
          description: "Your changes couldn't be saved. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }

      return updateId;
    },
    [options, toast]
  );

  const updateOptimisticData = useCallback(
    async (predicate: (item: T) => boolean, updater: (item: T) => T) => {
      const updateId = `update-${Date.now()}-${Math.random()}`;
      let originalItems: T[] = [];
      
      // Apply optimistic update
      setOptimisticData(prev => {
        const updated = prev.map(item => {
          if (predicate(item)) {
            originalItems.push(item);
            return updater(item);
          }
          return item;
        });
        return updated;
      });

      setIsLoading(true);

      try {
        // Perform actual mutations for each updated item
        const promises = originalItems.map(async (originalItem) => {
          const updatedItem = updater(originalItem);
          return options.mutationFn(updatedItem);
        });

        const results = await Promise.all(promises);
        
        // Replace with real data
        setOptimisticData(prev => {
          let resultIndex = 0;
          return prev.map(item => {
            const shouldUpdate = originalItems.some(orig => 
              JSON.stringify(orig) === JSON.stringify(updater(item))
            );
            if (shouldUpdate) {
              return results[resultIndex++];
            }
            return item;
          });
        });

        results.forEach(result => options.onSuccess?.(result));
      } catch (error) {
        // Rollback all changes
        setOptimisticData(prev => 
          prev.map(item => {
            const original = originalItems.find(orig => 
              JSON.stringify(updater(orig)) === JSON.stringify(item)
            );
            return original || item;
          })
        );

        originalItems.forEach(originalItem => {
          options.onError?.(error as Error, originalItem);
        });

        toast({
          title: "Update failed",
          description: "Your changes couldn't be saved. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }

      return updateId;
    },
    [options, toast]
  );

  const removeOptimisticData = useCallback(
    async (predicate: (item: T) => boolean) => {
      const itemsToRemove = optimisticData.filter(predicate);
      const updateId = `remove-${Date.now()}-${Math.random()}`;

      // Optimistically remove items
      setOptimisticData(prev => prev.filter(item => !predicate(item)));
      setIsLoading(true);

      // Set up rollback timeout
      const rollbackTimeout = setTimeout(() => {
        setOptimisticData(prev => [...prev, ...itemsToRemove]);
        toast({
          title: "Delete timeout",
          description: "The delete operation took too long and was cancelled.",
          variant: "destructive"
        });
      }, options.rollbackDelay || 10000);

      rollbackTimeouts.current.set(updateId, rollbackTimeout);

      try {
        // Perform actual deletions
        const promises = itemsToRemove.map(item => options.mutationFn(item));
        const results = await Promise.all(promises);
        
        // Clear rollback timeout
        const timeout = rollbackTimeouts.current.get(updateId);
        if (timeout) {
          clearTimeout(timeout);
          rollbackTimeouts.current.delete(updateId);
        }

        results.forEach(result => options.onSuccess?.(result));
      } catch (error) {
        // Rollback removals
        setOptimisticData(prev => [...prev, ...itemsToRemove]);
        
        // Clear rollback timeout
        const timeout = rollbackTimeouts.current.get(updateId);
        if (timeout) {
          clearTimeout(timeout);
          rollbackTimeouts.current.delete(updateId);
        }

        itemsToRemove.forEach(item => {
          options.onError?.(error as Error, item);
        });

        toast({
          title: "Delete failed",
          description: "Items couldn't be removed. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }

      return updateId;
    },
    [optimisticData, options, toast]
  );

  const clearPendingUpdates = useCallback(() => {
    setPendingUpdates([]);
    // Clear all rollback timeouts
    rollbackTimeouts.current.forEach(timeout => clearTimeout(timeout));
    rollbackTimeouts.current.clear();
  }, []);

  const retryFailedUpdates = useCallback(async () => {
    const currentPending = [...pendingUpdates];
    if (currentPending.length === 0) return;

    setIsLoading(true);
    
    try {
      const promises = currentPending.map(update => 
        options.mutationFn(update.data)
      );
      
      const results = await Promise.all(promises);
      
      // Update data with successful results
      setOptimisticData(prev => {
        let resultIndex = 0;
        return prev.map(item => {
          const pendingUpdate = currentPending.find(update => 
            JSON.stringify(update.data) === JSON.stringify(item)
          );
          if (pendingUpdate) {
            return results[resultIndex++];
          }
          return item;
        });
      });

      setPendingUpdates([]);
      results.forEach(result => options.onSuccess?.(result));
      
      toast({
        title: "Sync successful",
        description: "All pending changes have been saved.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Some changes couldn't be saved. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [pendingUpdates, options, toast]);

  return {
    data: optimisticData,
    isLoading,
    pendingUpdates,
    hasPendingUpdates: pendingUpdates.length > 0,
    addOptimisticUpdate,
    updateOptimisticData,
    removeOptimisticData,
    clearPendingUpdates,
    retryFailedUpdates,
    setData: setOptimisticData
  };
}