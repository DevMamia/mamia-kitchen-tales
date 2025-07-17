-- Create shopping_list_items table
CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity TEXT,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  recipe_name TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  category_id TEXT,
  checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for shopping list items
CREATE POLICY "Users can view their own shopping list items" 
ON public.shopping_list_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_lists 
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
    AND shopping_lists.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own shopping list items" 
ON public.shopping_list_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shopping_lists 
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
    AND shopping_lists.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own shopping list items" 
ON public.shopping_list_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_lists 
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
    AND shopping_lists.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own shopping list items" 
ON public.shopping_list_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_lists 
    WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
    AND shopping_lists.user_id = auth.uid()
  )
);

-- Admins can manage all shopping list items
CREATE POLICY "Admins can manage all shopping list items" 
ON public.shopping_list_items 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shopping_list_items_updated_at
BEFORE UPDATE ON public.shopping_list_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_shopping_list_items_shopping_list_id ON public.shopping_list_items(shopping_list_id);
CREATE INDEX idx_shopping_list_items_category ON public.shopping_list_items(category);