-- Create food categories table
CREATE TABLE public.food_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id), -- NULL for system categories
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for food categories
CREATE POLICY "Food categories are viewable by everyone" 
ON public.food_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own categories" 
ON public.food_categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own categories" 
ON public.food_categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.food_categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create ingredient aliases table
CREATE TABLE public.ingredient_aliases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  canonical_name TEXT NOT NULL,
  alias_name TEXT NOT NULL,
  category_id UUID REFERENCES food_categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ingredient_aliases ENABLE ROW LEVEL SECURITY;

-- Create policies for ingredient aliases
CREATE POLICY "Ingredient aliases are viewable by everyone" 
ON public.ingredient_aliases 
FOR SELECT 
USING (true);

-- Create shopping list templates table
CREATE TABLE public.shopping_list_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shopping_list_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for shopping list templates
CREATE POLICY "Users can view their own templates" 
ON public.shopping_list_templates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" 
ON public.shopping_list_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
ON public.shopping_list_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
ON public.shopping_list_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create collaborative shopping lists table
CREATE TABLE public.shopping_list_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  permission_level TEXT NOT NULL DEFAULT 'edit', -- 'view', 'edit', 'admin'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shopping_list_collaborators ENABLE ROW LEVEL SECURITY;

-- Create policies for collaborators
CREATE POLICY "Users can view collaborators of their lists" 
ON public.shopping_list_collaborators 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = (SELECT user_id FROM shopping_lists WHERE id = shopping_list_id)
);

CREATE POLICY "List owners can manage collaborators" 
ON public.shopping_list_collaborators 
FOR ALL 
USING (auth.uid() = (SELECT user_id FROM shopping_lists WHERE id = shopping_list_id));

-- Add category_id to shopping_list_items
ALTER TABLE public.shopping_list_items 
ADD COLUMN category_id UUID REFERENCES food_categories(id);

-- Create triggers for updated_at
CREATE TRIGGER update_food_categories_updated_at
BEFORE UPDATE ON public.food_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_list_templates_updated_at
BEFORE UPDATE ON public.shopping_list_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system categories
INSERT INTO public.food_categories (name, icon, sort_order, user_id) VALUES
('Produce', '🥬', 1, NULL),
('Meat & Seafood', '🥩', 2, NULL),
('Dairy & Eggs', '🥛', 3, NULL),
('Pantry', '🥫', 4, NULL),
('Frozen', '🧊', 5, NULL),
('Bakery', '🍞', 6, NULL),
('Beverages', '🥤', 7, NULL),
('Snacks', '🍿', 8, NULL),
('Health & Beauty', '🧴', 9, NULL),
('Other', '📦', 10, NULL);

-- Insert common ingredient aliases
INSERT INTO public.ingredient_aliases (canonical_name, alias_name, category_id) VALUES
('onions', 'onion', (SELECT id FROM food_categories WHERE name = 'Produce' AND user_id IS NULL)),
('onions', 'yellow onions', (SELECT id FROM food_categories WHERE name = 'Produce' AND user_id IS NULL)),
('onions', 'white onions', (SELECT id FROM food_categories WHERE name = 'Produce' AND user_id IS NULL)),
('tomatoes', 'tomato', (SELECT id FROM food_categories WHERE name = 'Produce' AND user_id IS NULL)),
('garlic', 'garlic cloves', (SELECT id FROM food_categories WHERE name = 'Produce' AND user_id IS NULL)),
('chicken breast', 'chicken breasts', (SELECT id FROM food_categories WHERE name = 'Meat & Seafood' AND user_id IS NULL)),
('ground beef', 'beef mince', (SELECT id FROM food_categories WHERE name = 'Meat & Seafood' AND user_id IS NULL)),
('milk', 'whole milk', (SELECT id FROM food_categories WHERE name = 'Dairy & Eggs' AND user_id IS NULL)),
('eggs', 'large eggs', (SELECT id FROM food_categories WHERE name = 'Dairy & Eggs' AND user_id IS NULL)),
('olive oil', 'extra virgin olive oil', (SELECT id FROM food_categories WHERE name = 'Pantry' AND user_id IS NULL)),
('salt', 'sea salt', (SELECT id FROM food_categories WHERE name = 'Pantry' AND user_id IS NULL)),
('salt', 'kosher salt', (SELECT id FROM food_categories WHERE name = 'Pantry' AND user_id IS NULL)),
('black pepper', 'pepper', (SELECT id FROM food_categories WHERE name = 'Pantry' AND user_id IS NULL)),
('flour', 'all-purpose flour', (SELECT id FROM food_categories WHERE name = 'Pantry' AND user_id IS NULL)),
('sugar', 'granulated sugar', (SELECT id FROM food_categories WHERE name = 'Pantry' AND user_id IS NULL)),
('butter', 'unsalted butter', (SELECT id FROM food_categories WHERE name = 'Dairy & Eggs' AND user_id IS NULL));