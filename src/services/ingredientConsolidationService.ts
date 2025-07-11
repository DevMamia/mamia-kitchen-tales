interface ParsedQuantity {
  amount: number;
  unit: string;
  originalText: string;
}

interface ConsolidatedIngredient {
  canonical_name: string;
  total_quantity: string;
  category_id: string | null;
  aliases: string[];
  recipe_names: string[];
}

export class IngredientConsolidationService {
  private unitConversions: { [key: string]: { [key: string]: number } } = {
    // Volume conversions (to cups)
    volume: {
      'cup': 1,
      'cups': 1,
      'c': 1,
      'tablespoon': 1/16,
      'tablespoons': 1/16,
      'tbsp': 1/16,
      'teaspoon': 1/48,
      'teaspoons': 1/48,
      'tsp': 1/48,
      'fluid ounce': 1/8,
      'fluid ounces': 1/8,
      'fl oz': 1/8,
      'pint': 2,
      'pints': 2,
      'pt': 2,
      'quart': 4,
      'quarts': 4,
      'qt': 4,
      'gallon': 16,
      'gallons': 16,
      'gal': 16,
      'liter': 4.227,
      'liters': 4.227,
      'l': 4.227,
      'milliliter': 0.004227,
      'milliliters': 0.004227,
      'ml': 0.004227
    },
    // Weight conversions (to pounds)
    weight: {
      'pound': 1,
      'pounds': 1,
      'lb': 1,
      'lbs': 1,
      'ounce': 1/16,
      'ounces': 1/16,
      'oz': 1/16,
      'gram': 0.00220462,
      'grams': 0.00220462,
      'g': 0.00220462,
      'kilogram': 2.20462,
      'kilograms': 2.20462,
      'kg': 2.20462
    }
  };

  parseQuantity(quantityText: string): ParsedQuantity | null {
    if (!quantityText) return null;

    // Common patterns for quantities
    const patterns = [
      // "2 cups", "1.5 tablespoons"
      /^(\d+(?:\.\d+)?)\s+([a-zA-Z\s]+)$/,
      // "2-3 cups", "1-2 tablespoons"
      /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)\s+([a-zA-Z\s]+)$/,
      // "1/2 cup", "3/4 teaspoon"
      /^(\d+)\/(\d+)\s+([a-zA-Z\s]+)$/,
      // "2 1/2 cups"
      /^(\d+)\s+(\d+)\/(\d+)\s+([a-zA-Z\s]+)$/,
      // Just numbers: "2", "1.5"
      /^(\d+(?:\.\d+)?)$/
    ];

    for (const pattern of patterns) {
      const match = quantityText.trim().match(pattern);
      if (match) {
        let amount: number;
        let unit = '';

        if (pattern === patterns[0]) {
          // "2 cups"
          amount = parseFloat(match[1]);
          unit = match[2].trim().toLowerCase();
        } else if (pattern === patterns[1]) {
          // "2-3 cups" - take average
          amount = (parseFloat(match[1]) + parseFloat(match[2])) / 2;
          unit = match[3].trim().toLowerCase();
        } else if (pattern === patterns[2]) {
          // "1/2 cup"
          amount = parseFloat(match[1]) / parseFloat(match[2]);
          unit = match[3].trim().toLowerCase();
        } else if (pattern === patterns[3]) {
          // "2 1/2 cups"
          amount = parseFloat(match[1]) + (parseFloat(match[2]) / parseFloat(match[3]));
          unit = match[4].trim().toLowerCase();
        } else if (pattern === patterns[4]) {
          // Just number
          amount = parseFloat(match[1]);
          unit = 'unit';
        }

        return {
          amount,
          unit,
          originalText: quantityText
        };
      }
    }

    return null;
  }

  normalizeIngredientName(name: string): string {
    return name.toLowerCase()
      .replace(/\b(fresh|dried|organic|raw|cooked|chopped|diced|sliced|minced|grated)\b/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  findSimilarIngredients(ingredients: Array<{ ingredient_name: string; quantity?: string }>): ConsolidatedIngredient[] {
    const groups: { [key: string]: Array<{ ingredient_name: string; quantity?: string; recipe_name?: string }> } = {};
    
    // Group similar ingredients
    ingredients.forEach(item => {
      const normalized = this.normalizeIngredientName(item.ingredient_name);
      
      // Find existing group or create new one
      let groupKey = normalized;
      for (const existingKey of Object.keys(groups)) {
        if (this.areIngredientsSimilar(existingKey, normalized)) {
          groupKey = existingKey;
          break;
        }
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(item);
    });

    // Consolidate quantities for each group
    return Object.entries(groups).map(([canonicalName, items]) => {
      const consolidatedQuantity = this.consolidateQuantities(items.map(item => item.quantity || ''));
      
      return {
        canonical_name: canonicalName,
        total_quantity: consolidatedQuantity,
        category_id: null, // Will be set by categorization service
        aliases: [...new Set(items.map(item => item.ingredient_name))],
        recipe_names: [...new Set(items.map(item => item.recipe_name).filter(Boolean))] as string[]
      };
    });
  }

  private areIngredientsSimilar(name1: string, name2: string): boolean {
    // Simple similarity check - can be enhanced with more sophisticated algorithms
    const words1 = name1.split(' ');
    const words2 = name2.split(' ');
    
    // Check if they share significant words
    const sharedWords = words1.filter(word => 
      words2.includes(word) && word.length > 2
    );
    
    return sharedWords.length > 0 && 
           (sharedWords.length / Math.max(words1.length, words2.length)) >= 0.5;
  }

  private consolidateQuantities(quantities: string[]): string {
    const validQuantities = quantities.filter(q => q && q.trim());
    
    if (validQuantities.length === 0) return '';
    if (validQuantities.length === 1) return validQuantities[0];

    // Try to parse and sum quantities
    const parsed = validQuantities.map(q => this.parseQuantity(q)).filter(Boolean) as ParsedQuantity[];
    
    if (parsed.length === 0) {
      return validQuantities.join(', ');
    }

    // Group by unit type
    const volumeUnits = parsed.filter(p => this.unitConversions.volume[p.unit]);
    const weightUnits = parsed.filter(p => this.unitConversions.weight[p.unit]);
    const countUnits = parsed.filter(p => p.unit === 'unit' || !this.unitConversions.volume[p.unit] && !this.unitConversions.weight[p.unit]);

    const results: string[] = [];

    // Consolidate volume units
    if (volumeUnits.length > 0) {
      const totalCups = volumeUnits.reduce((sum, p) => 
        sum + (p.amount * this.unitConversions.volume[p.unit]), 0
      );
      results.push(this.formatQuantity(totalCups, 'cup'));
    }

    // Consolidate weight units
    if (weightUnits.length > 0) {
      const totalPounds = weightUnits.reduce((sum, p) => 
        sum + (p.amount * this.unitConversions.weight[p.unit]), 0
      );
      results.push(this.formatQuantity(totalPounds, 'lb'));
    }

    // Consolidate count units
    if (countUnits.length > 0) {
      const totalCount = countUnits.reduce((sum, p) => sum + p.amount, 0);
      results.push(totalCount === 1 ? '1' : `${totalCount}`);
    }

    // If we couldn't consolidate, return original quantities
    if (results.length === 0) {
      return validQuantities.join(', ');
    }

    return results.join(', ');
  }

  private formatQuantity(amount: number, unit: string): string {
    if (amount < 0.125) {
      return `${Math.round(amount * 48)} tsp`;
    } else if (amount < 1) {
      return `${Math.round(amount * 16)} tbsp`;
    } else if (amount % 1 === 0) {
      return `${amount} ${unit}${amount > 1 ? 's' : ''}`;
    } else {
      return `${amount.toFixed(2).replace(/\.?0+$/, '')} ${unit}${amount > 1 ? 's' : ''}`;
    }
  }
}

export const ingredientConsolidationService = new IngredientConsolidationService();