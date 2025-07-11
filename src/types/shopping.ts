export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  ingredient_name: string;
  quantity?: string;
  recipe_id?: string;
  recipe_name?: string;
  category: string;
  category_id?: string;
  checked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  name: string;
  quantity?: string;
}

export interface AddToShoppingListRequest {
  ingredients: Ingredient[];
  recipeId: string;
  recipeName: string;
}