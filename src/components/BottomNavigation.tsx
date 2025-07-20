
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, ChefHat, Home } from 'lucide-react';

const navItems = [
  { id: 'mamas', label: 'Mamas', icon: Heart, path: '/app' },
  { id: 'recipes', label: 'Recipes', icon: BookOpen, path: '/app/recipes' },
  { id: 'cook', label: 'Cook', icon: ChefHat, path: '/app/cook' },
  { id: 'kitchen', label: 'My Kitchen', icon: Home, path: '/app/kitchen' },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-50"
         style={{ 
           background: 'hsl(var(--logo-cream))',
           borderTop: '3px solid hsl(var(--logo-brown))',
           boxShadow: '0 -6px 16px -4px hsl(var(--logo-brown) / 0.4), 0 -2px 8px -2px hsl(var(--logo-brown) / 0.2)'
         }}>
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          // Special handling for Cook tab and legacy routes
          const isActive = item.id === 'cook' 
            ? location.pathname === item.path || location.pathname.startsWith('/cook/') || location.pathname.startsWith('/app/cook/')
            : location.pathname === item.path || 
              (item.id === 'mamas' && (location.pathname === '/' || location.pathname === '/app')) ||
              (item.id === 'recipes' && location.pathname === '/recipes') ||
              (item.id === 'kitchen' && location.pathname === '/kitchen');
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'cook') {
                  // Check for stored recipe first
                  const lastRecipeId = localStorage.getItem('lastCookingRecipe');
                  if (lastRecipeId) {
                    navigate(`/app/cook/${lastRecipeId}`);
                  } else {
                    // First time user - redirect to recipes
                    navigate('/app/recipes');
                  }
                } else {
                  navigate(item.path);
                }
              }}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white/30 shadow-lg border border-white/40' 
                  : 'hover:bg-white/20 hover:shadow-md'
              }`}
              style={{ 
                color: isActive 
                  ? 'hsl(var(--logo-brown))' 
                  : 'hsl(var(--logo-brown) / 0.7)'
              }}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-sm font-bold font-heading">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
