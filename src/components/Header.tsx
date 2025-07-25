
import React, { useState } from 'react';
import { Menu, User, CreditCard, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileModal } from './ProfileModal';
import { SettingsModal } from './SettingsModal';
import { SubscriptionModal } from './SubscriptionModal';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleMenuItemClick = (action: string) => {
    switch (action) {
      case 'profile':
        setProfileOpen(true);
        break;
      case 'subscription':
        setSubscriptionOpen(true);
        break;
      case 'settings':
        setSettingsOpen(true);
        break;
      case 'signout':
        handleSignOut();
        break;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-50" 
              style={{ 
                background: 'hsl(var(--logo-cream))',
                borderBottom: '3px solid hsl(var(--logo-brown))',
                boxShadow: '0 6px 16px -4px hsl(var(--logo-brown) / 0.4), 0 2px 8px -2px hsl(var(--logo-brown) / 0.2)'
              }}>
        <div className="flex items-center justify-between h-20 px-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/LogoPrem.PNG" 
              alt="MAMIA Logo" 
              className="w-12 h-12 object-contain"
            />
            <h1 className="font-cinzel font-bold text-3xl tracking-widest" 
                style={{ color: 'hsl(var(--logo-brown))' }}>
              MAMIA
            </h1>
          </div>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-3 rounded-full bg-white/20 border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200"
                style={{ color: 'hsl(var(--logo-brown))' }}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              sideOffset={8} 
              className="w-44 bg-card border-border shadow-paper z-[9999] mr-4"
              avoidCollisions={true}
              collisionPadding={16}
            >
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleMenuItemClick('profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleMenuItemClick('subscription')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Subscription
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleMenuItemClick('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent text-destructive focus:text-destructive"
                onClick={() => handleMenuItemClick('signout')}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modals */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SubscriptionModal isOpen={subscriptionOpen} onClose={() => setSubscriptionOpen(false)} />
    </>
  );
};
