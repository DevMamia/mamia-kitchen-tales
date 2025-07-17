export interface FoodCategory {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
}

class CategorizationService {
  private categories: FoodCategory[] = [
    { id: '1', name: 'Produce', icon: '🥬', sort_order: 1 },
    { id: '2', name: 'Meat & Seafood', icon: '🥩', sort_order: 2 },
    { id: '3', name: 'Dairy & Eggs', icon: '🥛', sort_order: 3 },
    { id: '4', name: 'Pantry', icon: '🏺', sort_order: 4 },
    { id: '5', name: 'Bakery', icon: '🍞', sort_order: 5 },
    { id: '6', name: 'Beverages', icon: '🥤', sort_order: 6 },
    { id: '7', name: 'Frozen', icon: '🧊', sort_order: 7 },
    { id: '8', name: 'Other', icon: '📦', sort_order: 8 }
  ];
  private initialized = true;

  async getCategories(): Promise<FoodCategory[]> {
    return this.categories;
  }

  async categorizeIngredient(ingredientName: string): Promise<FoodCategory | null> {
    const normalizedName = this.normalizeIngredientName(ingredientName);
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
        return this.categories.find(c => c.name === categoryName) || null;
      }
    }

    // Default to "Other" category
    return this.categories.find(c => c.name === 'Other') || null;
  }

  async getDefaultCategory(): Promise<FoodCategory | null> {
    return this.categories.find(c => c.name === 'Other') || null;
  }
}

export const categorizationService = new CategorizationService();