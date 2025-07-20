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
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
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
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected App Routes */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout pageTitle="Choose Your Cooking Guide" pageSubtitle="Learn authentic recipes from traditional cooks">
                    <Mamas />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/mama/:mamaId" element={
                <ProtectedRoute>
                  <Layout><MamaCookbook /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/recipes" element={
                <ProtectedRoute>
                  <Layout pageTitle="Discover Recipes" pageSubtitle="Find the perfect dish for any occasion">
                    <Recipes />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/recipe/:recipeId" element={
                <ProtectedRoute>
                  <Layout><RecipeDetail /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/cook" element={
                <ProtectedRoute>
                  <Layout pageTitle="Cook" pageSubtitle="Choose a recipe to start cooking">
                    <Cook />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/cook/:recipeId" element={
                <ProtectedRoute>
                  <Layout><Cook /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/enhanced-cook/:recipeId" element={
                <ProtectedRoute>
                  <Layout><EnhancedCook /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/kitchen" element={
                <ProtectedRoute>
                  <Layout pageTitle="My Kitchen" pageSubtitle="Your personal cooking space">
                    <Kitchen />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/app/shopping-list" element={
                <ProtectedRoute>
                  <Layout pageTitle="Shopping List" pageSubtitle="Your ingredients for cooking">
                    <ShoppingList />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Legacy redirects for backward compatibility */}
              <Route path="/mama/:mamaId" element={<ProtectedRoute><Layout><MamaCookbook /></Layout></ProtectedRoute>} />
              <Route path="/recipes" element={<ProtectedRoute><Layout pageTitle="Discover Recipes" pageSubtitle="Find the perfect dish for any occasion"><Recipes /></Layout></ProtectedRoute>} />
              <Route path="/recipe/:recipeId" element={<ProtectedRoute><Layout><RecipeDetail /></Layout></ProtectedRoute>} />
              <Route path="/cook" element={<ProtectedRoute><Layout pageTitle="Cook" pageSubtitle="Choose a recipe to start cooking"><Cook /></Layout></ProtectedRoute>} />
              <Route path="/cook/:recipeId" element={<ProtectedRoute><Layout><Cook /></Layout></ProtectedRoute>} />
              <Route path="/enhanced-cook/:recipeId" element={<ProtectedRoute><Layout><EnhancedCook /></Layout></ProtectedRoute>} />
              <Route path="/kitchen" element={<ProtectedRoute><Layout pageTitle="My Kitchen" pageSubtitle="Your personal cooking space"><Kitchen /></Layout></ProtectedRoute>} />
              <Route path="/shopping-list" element={<ProtectedRoute><Layout pageTitle="Shopping List" pageSubtitle="Your ingredients for cooking"><ShoppingList /></Layout></ProtectedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<ProtectedRoute><Layout><NotFound /></Layout></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </ShoppingListProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
