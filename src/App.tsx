import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ShoppingListProvider } from "./contexts/ShoppingListContext";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PWAUpdateNotification from "./components/PWAUpdateNotification";
import OfflineIndicator from "./components/OfflineIndicator";
import PWADebugPanel from "./components/PWADebugPanel";
import Mamas from "./pages/Mamas";
import MamaCookbook from "./pages/MamaCookbook";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Cook from "./pages/Cook";
import EnhancedCook from "./pages/EnhancedCook";
import Kitchen from "./pages/Kitchen";
import Auth from "./pages/Auth";
import ShoppingList from "./pages/ShoppingList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ShoppingListProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <PWAUpdateNotification />
          <OfflineIndicator />
          <PWADebugPanel />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout pageTitle="Choose Your Cooking Guide" pageSubtitle="Learn authentic recipes from traditional cooks"><Mamas /></Layout>} />
              <Route path="/mama/:mamaId" element={<Layout><MamaCookbook /></Layout>} />
              <Route path="/recipes" element={<Layout pageTitle="Discover Recipes" pageSubtitle="Find the perfect dish for any occasion"><Recipes /></Layout>} />
              <Route path="/recipe/:recipeId" element={<Layout><RecipeDetail /></Layout>} />
              <Route path="/cook" element={<Layout pageTitle="Cook" pageSubtitle="Choose a recipe to start cooking"><Cook /></Layout>} />
              <Route path="/cook/:recipeId" element={<Layout><Cook /></Layout>} />
              <Route path="/enhanced-cook/:recipeId" element={<Layout><EnhancedCook /></Layout>} />
              <Route path="/kitchen" element={<Layout pageTitle="My Kitchen" pageSubtitle="Your personal cooking space"><Kitchen /></Layout>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/shopping-list" element={<Layout pageTitle="Shopping List" pageSubtitle="Your ingredients for cooking"><ShoppingList /></Layout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </ShoppingListProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
