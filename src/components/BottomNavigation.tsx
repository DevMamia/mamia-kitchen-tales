
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, ChefHat, Home } from 'lucide-react';

const navItems = [
  { id: 'mamas', label: 'Mamas', icon: Heart, path: '/' },
  { id: 'recipes', label: 'Recipes', icon: BookOpen, path: '/recipes' },
  { id: 'cook', label: 'Cook', icon: ChefHat, path: '/cook' },
  { id: 'kitchen', label: 'My Kitchen', icon: Home, path: '/kitchen' },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-card/95 backdrop-blur-sm border-t border-border z-50 shadow-paper">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          // Special handling for Cook tab to include both /cook and /cook/:recipeId
          const isActive = item.id === 'cook' 
            ? location.pathname === item.path || location.pathname.startsWith('/cook/')
            : location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'cook') {
                  // Check for stored recipe first
                  const lastRecipeId = localStorage.getItem('lastCookingRecipe');
                  if (lastRecipeId) {
                    navigate(`/cook/${lastRecipeId}`);
                  } else {
                    // First time user - redirect to recipes
                    navigate('/recipes');
                  }
                } else {
                  navigate(item.path);
                }
              }}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-warm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium font-heading">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
