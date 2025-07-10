
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Mamas from "./pages/Mamas";
import MamaCookbook from "./pages/MamaCookbook";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Cook from "./pages/Cook";
import Kitchen from "./pages/Kitchen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout pageTitle="Choose Your Cooking Guide" pageSubtitle="Learn authentic recipes from traditional cooks"><Mamas /></Layout>} />
          <Route path="/mama/:mamaId" element={<Layout><MamaCookbook /></Layout>} />
          <Route path="/recipes" element={<Layout pageTitle="Discover Recipes" pageSubtitle="Find the perfect dish for any occasion"><Recipes /></Layout>} />
          <Route path="/recipe/:recipeId" element={<Layout><RecipeDetail /></Layout>} />
          <Route path="/cook" element={<Layout><Cook /></Layout>} />
          <Route path="/kitchen" element={<Layout pageTitle="My Kitchen" pageSubtitle="Your personal cooking space"><Kitchen /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
