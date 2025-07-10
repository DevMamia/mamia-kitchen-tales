import { useState, useEffect } from 'react';

interface UseOfflineOptions {
  onOnline?: () => void;
  onOffline?: () => void;
}

export const useOffline = (options: UseOfflineOptions = {}) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      options.onOnline?.();
    };

    const handleOffline = () => {
      setIsOffline(true);
      options.onOffline?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [options]);

  return { isOffline };
};

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key \"${key}\":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key \"${key}\":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

export const useHapticFeedback = () => {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  return { triggerHaptic };
};

export const useAnalytics = () => {
  const track = (event: string, properties?: Record<string, any>) => {
    // Store analytics locally for now - can be sent to analytics service later
    const analyticsData = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    try {
      const existing = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      existing.push(analyticsData);
      
      // Keep only last 100 events
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(existing));
      
      // In production, you would send this to your analytics service
      console.log('Analytics Event:', analyticsData);
    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  };

  const getAnalytics = () => {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
      return [];
    }
  };

  return { track, getAnalytics };
};
