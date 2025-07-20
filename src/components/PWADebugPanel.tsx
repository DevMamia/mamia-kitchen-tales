
import React, { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { useOfflineShoppingList } from '@/hooks/useOfflineShoppingList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  WifiOff, 
  Download, 
  RefreshCw, 
  Database,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

const PWADebugPanel: React.FC = () => {
  const { 
    isInstallable, 
    isInstalled, 
    isOffline, 
    promptInstall, 
    updateAvailable, 
    updateApp 
  } = usePWA();
  
  const { syncing, syncPendingChanges } = useOfflineShoppingList();
  const [showPanel, setShowPanel] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <>
      <Button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0"
        variant="outline"
        title="PWA Debug Panel"
      >
        <Smartphone className="w-5 h-5" />
      </Button>

      {showPanel && (
        <Card className="fixed bottom-20 right-4 z-50 p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="font-heading font-semibold mb-3 text-sm">PWA Debug Panel</h3>
          
          <div className="space-y-3">
            {/* PWA Status */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">PWA Status</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant={isInstalled ? "default" : "secondary"}>
                  {isInstalled ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                  {isInstalled ? 'Installed' : 'Not Installed'}
                </Badge>
                <Badge variant={isInstallable ? "default" : "secondary"}>
                  {isInstallable ? 'Installable' : 'Not Installable'}
                </Badge>
                <Badge variant={isOffline ? "destructive" : "default"}>
                  {isOffline ? <WifiOff className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                  {isOffline ? 'Offline' : 'Online'}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Actions</h4>
              <div className="flex flex-col gap-2">
                {isInstallable && (
                  <Button onClick={promptInstall} size="sm" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Install App
                  </Button>
                )}
                
                {updateAvailable && (
                  <Button onClick={updateApp} size="sm" variant="outline" className="text-xs">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Update App
                  </Button>
                )}
                
                <Button 
                  onClick={syncPendingChanges} 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
                  disabled={syncing}
                >
                  <Database className="w-3 h-3 mr-1" />
                  {syncing ? 'Syncing...' : 'Force Sync'}
                </Button>
              </div>
            </div>

            {/* Service Worker Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Service Worker</h4>
              <div className="text-xs text-muted-foreground">
                <div>Registration: {('serviceWorker' in navigator) ? '✓ Supported' : '✗ Not Supported'}</div>
                <div>Cache API: {('caches' in window) ? '✓ Available' : '✗ Not Available'}</div>
                <div>IndexedDB: {('indexedDB' in window) ? '✓ Available' : '✗ Not Available'}</div>
              </div>
            </div>

            {/* Features Status */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">PWA Features</h4>
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span>Offline Caching</span>
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Background Sync</span>
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Install Prompt</span>
                  <Badge variant={isInstallable ? "default" : "secondary"} className="text-xs">
                    {isInstallable ? 'Ready' : 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default PWADebugPanel;
