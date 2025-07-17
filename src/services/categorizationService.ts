import { supabase } from "@/integrations/supabase/client";

export interface FoodCategory {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  user_id: string | null;
}

export interface IngredientAlias {
  id: string;
  canonical_name: string;
  alias_name: string;
  category_id: string | null;
}

class CategorizationService {
  private categories: FoodCategory[] = [];
  private aliases: IngredientAlias[] = [];
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Fetch categories
      const { data: categories } = await supabase
        .from('food_categories')
        .select('*')
        .order('sort_order');
      
      // Fetch aliases
      const { data: aliases } = await supabase
        .from('ingredient_aliases')
        .select('*');
      
      this.categories = categories || [];
      this.aliases = aliases || [];
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize categorization service:', error);
    }
  }

  async getCategories(): Promise<FoodCategory[]> {
    await this.initialize();
    return this.categories;
  }

  async categorizeIngredient(ingredientName: string): Promise<FoodCategory | null> {
    await this.initialize();
    
    const normalizedName = this.normalizeIngredientName(ingredientName);
    
    // First, check for exact alias match
    const alias = this.aliases.find(a => 
      a.alias_name.toLowerCase() === normalizedName ||
      a.canonical_name.toLowerCase() === normalizedName
    );
    
    if (alias && alias.category_id) {
      const category = this.categories.find(c => c.id === alias.category_id);
      if (category) return category;
    }
    
    // Fallback to pattern matching
    return this.categorizeByPattern(normalizedName);
  }

  private normalizeIngredientName(name: string): string {
    return name.toLowerCase()
      .replace(/\b(fresh|dried|organic|raw|cooked|chopped|diced|sliced)\b/g, '')
      .replace(/\d+/g, '')
      .replace(/[^\w\s]/g, '')
      .trim();
  }

  private categorizeByPattern(normalizedName: string): FoodCategory | null {
    const patterns = {
      'Produce': [
        'tomato', 'onion', 'garlic', 'carrot', 'celery', 'potato', 'lettuce',
        'spinach', 'bell pepper', 'mushroom', 'cucumber', 'avocado', 'lemon',
        'lime', 'apple', 'banana', 'orange', 'basil', 'parsley', 'cilantro'
      ],
      'Meat & Seafood': [
        'chicken', 'beef', 'pork', 'turkey', 'fish', 'salmon', 'tuna',
        'shrimp', 'lamb', 'bacon', 'ham', 'sausage', 'ground'
      ],
      'Dairy & Eggs': [
        'milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs', 'cottage cheese',
        'sour cream', 'mozzarella', 'cheddar', 'parmesan'
      ],
      'Pantry': [
        'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'pasta',
        'rice', 'beans', 'lentils', 'quinoa', 'breadcrumbs', 'vanilla',
        'cinnamon', 'paprika', 'cumin', 'oregano', 'thyme', 'bay leaves'
      ],
      'Bakery': [
        'bread', 'bagel', 'muffin', 'croissant', 'baguette', 'tortilla', 'pita'
      ],
      'Beverages': [
        'juice', 'soda', 'water', 'tea', 'coffee', 'wine', 'beer', 'broth', 'stock'
      ],
      'Frozen': [
        'frozen', 'ice cream', 'popsicle'
      ]
    };

    for (const [categoryName, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => normalizedName.includes(keyword))) {
        return this.categories.find(c => c.name === categoryName && !c.user_id) || null;
      }
    }

    // Default to "Other" category
    return this.categories.find(c => c.name === 'Other' && !c.user_id) || null;
  }

  async createCustomCategory(name: string, icon?: string): Promise<FoodCategory | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('food_categories')
        .insert({
          name,
          icon,
          user_id: user.user.id,
          sort_order: this.categories.length + 1
        })
        .select()
        .single();

      if (error) throw error;
      
      this.categories.push(data);
      return data;
    } catch (error) {
      console.error('Failed to create custom category:', error);
      return null;
    }
  }

  async getDefaultCategory(): Promise<FoodCategory | null> {
    await this.initialize();
    return this.categories.find(c => c.name === 'Other' && !c.user_id) || null;
  }
}

export const categorizationService = new CategorizationService();