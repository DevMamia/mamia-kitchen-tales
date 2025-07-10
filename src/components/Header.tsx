
import React from 'react';
import { Menu, User, CreditCard, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-background/95 backdrop-blur-sm border-b border-border z-50 shadow-paper">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-warm">
            <img 
              src="/lovable-uploads/8a6cad47-4228-4cfb-bc36-6580877d3bb8.png" 
              alt="MAMIA Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground tracking-wide">
              MAMIA
            </h1>
            <p className="text-xs text-muted-foreground font-handwritten">
              recipes from the heart
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 rounded-full bg-card/50 border border-border shadow-warm hover:bg-card hover:shadow-paper transition-all duration-200"
            >
              <Menu className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-48 bg-card border-border shadow-paper z-50">
            <DropdownMenuItem className="cursor-pointer hover:bg-accent">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent">
              <CreditCard className="mr-2 h-4 w-4" />
              Subscription
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-accent">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-accent text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
