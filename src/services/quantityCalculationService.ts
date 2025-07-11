interface ParsedQuantity {
  amount: number;
  unit: string;
  originalText: string;
  isRange: boolean;
  minAmount?: number;
  maxAmount?: number;
}

interface UnitConversion {
  factor: number;
  baseUnit: string;
}

const UNIT_CONVERSIONS: Record<string, UnitConversion> = {
  // Volume conversions (to cups)
  'tsp': { factor: 1/48, baseUnit: 'cup' },
  'teaspoon': { factor: 1/48, baseUnit: 'cup' },
  'teaspoons': { factor: 1/48, baseUnit: 'cup' },
  'tbsp': { factor: 1/16, baseUnit: 'cup' },
  'tablespoon': { factor: 1/16, baseUnit: 'cup' },
  'tablespoons': { factor: 1/16, baseUnit: 'cup' },
  'fluid ounce': { factor: 1/8, baseUnit: 'cup' },
  'fl oz': { factor: 1/8, baseUnit: 'cup' },
  'cup': { factor: 1, baseUnit: 'cup' },
  'cups': { factor: 1, baseUnit: 'cup' },
  'pint': { factor: 2, baseUnit: 'cup' },
  'pints': { factor: 2, baseUnit: 'cup' },
  'quart': { factor: 4, baseUnit: 'cup' },
  'quarts': { factor: 4, baseUnit: 'cup' },
  'gallon': { factor: 16, baseUnit: 'cup' },
  'gallons': { factor: 16, baseUnit: 'cup' },
  
  // Weight conversions (to ounces)
  'oz': { factor: 1, baseUnit: 'oz' },
  'ounce': { factor: 1, baseUnit: 'oz' },
  'ounces': { factor: 1, baseUnit: 'oz' },
  'lb': { factor: 16, baseUnit: 'oz' },
  'pound': { factor: 16, baseUnit: 'oz' },
  'pounds': { factor: 16, baseUnit: 'oz' },
  'g': { factor: 0.035274, baseUnit: 'oz' },
  'gram': { factor: 0.035274, baseUnit: 'oz' },
  'grams': { factor: 0.035274, baseUnit: 'oz' },
  'kg': { factor: 35.274, baseUnit: 'oz' },
  'kilogram': { factor: 35.274, baseUnit: 'oz' },
  'kilograms': { factor: 35.274, baseUnit: 'oz' },
};

const FRACTION_MAP: Record<string, number> = {
  '1/8': 0.125,
  '1/4': 0.25,
  '1/3': 0.333,
  '1/2': 0.5,
  '2/3': 0.667,
  '3/4': 0.75,
  '⅛': 0.125,
  '¼': 0.25,
  '⅓': 0.333,
  '½': 0.5,
  '⅔': 0.667,
  '¾': 0.75,
};

export class QuantityCalculationService {
  static parseQuantity(quantityText: string): ParsedQuantity {
    const normalized = quantityText.toLowerCase().trim();
    
    // Handle special cases
    if (normalized.includes('pinch') || normalized.includes('dash')) {
      return {
        amount: 0.25,
        unit: 'tsp',
        originalText: quantityText,
        isRange: false
      };
    }

    if (normalized.includes('handful')) {
      return {
        amount: 0.5,
        unit: 'cup',
        originalText: quantityText,
        isRange: false
      };
    }

    // Parse ranges like "2-3", "1 to 2"
    const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const unit = this.extractUnit(normalized);
      
      return {
        amount: (min + max) / 2,
        unit,
        originalText: quantityText,
        isRange: true,
        minAmount: min,
        maxAmount: max
      };
    }

    // Parse fractions and mixed numbers
    let amount = this.parseFractions(normalized);
    
    // If no fractions found, try to parse regular numbers
    if (amount === 0) {
      const numberMatch = normalized.match(/(\d+(?:\.\d+)?)/);
      amount = numberMatch ? parseFloat(numberMatch[1]) : 1;
    }

    const unit = this.extractUnit(normalized);

    return {
      amount,
      unit,
      originalText: quantityText,
      isRange: false
    };
  }

  private static parseFractions(text: string): number {
    // Handle mixed numbers like "1 1/2"
    const mixedMatch = text.match(/(\d+)\s+(\d+\/\d+|\S)/);
    if (mixedMatch) {
      const wholeNumber = parseInt(mixedMatch[1]);
      const fractionPart = FRACTION_MAP[mixedMatch[2]] || this.evaluateFraction(mixedMatch[2]);
      return wholeNumber + fractionPart;
    }

    // Handle pure fractions
    for (const [fraction, value] of Object.entries(FRACTION_MAP)) {
      if (text.includes(fraction)) {
        return value;
      }
    }

    // Handle slash fractions like "3/4"
    const fractionMatch = text.match(/(\d+)\/(\d+)/);
    if (fractionMatch) {
      return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
    }

    return 0;
  }

  private static evaluateFraction(fraction: string): number {
    const parts = fraction.split('/');
    if (parts.length === 2) {
      return parseInt(parts[0]) / parseInt(parts[1]);
    }
    return 0;
  }

  private static extractUnit(text: string): string {
    // Remove numbers and fractions to isolate the unit
    const cleaned = text.replace(/\d+(?:\.\d+)?/g, '')
                       .replace(/\d+\/\d+/g, '')
                       .replace(/[⅛¼⅓½⅔¾]/g, '')
                       .trim();

    // Common unit patterns
    const unitPatterns = [
      'tablespoons?', 'tbsp', 'teaspoons?', 'tsp', 'cups?', 'cup',
      'ounces?', 'oz', 'pounds?', 'lbs?', 'lb', 'grams?', 'g',
      'kilograms?', 'kg', 'pints?', 'quarts?', 'gallons?',
      'fluid ounces?', 'fl oz', 'milliliters?', 'ml', 'liters?', 'l'
    ];

    for (const pattern of unitPatterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(cleaned)) {
        return cleaned.match(regex)?.[0].toLowerCase() || '';
      }
    }

    return cleaned.replace(/[^\w\s]/g, '').trim() || 'item';
  }

  static scaleQuantity(parsedQuantity: ParsedQuantity, scaleFactor: number): ParsedQuantity {
    const scaledAmount = parsedQuantity.amount * scaleFactor;
    const scaledMin = parsedQuantity.minAmount ? parsedQuantity.minAmount * scaleFactor : undefined;
    const scaledMax = parsedQuantity.maxAmount ? parsedQuantity.maxAmount * scaleFactor : undefined;

    return {
      ...parsedQuantity,
      amount: scaledAmount,
      minAmount: scaledMin,
      maxAmount: scaledMax
    };
  }

  static formatQuantity(parsedQuantity: ParsedQuantity): string {
    const { amount, unit, isRange, minAmount, maxAmount } = parsedQuantity;

    if (isRange && minAmount && maxAmount) {
      return `${this.formatNumber(minAmount)}-${this.formatNumber(maxAmount)} ${unit}`;
    }

    return `${this.formatNumber(amount)} ${unit}`;
  }

  private static formatNumber(num: number): string {
    // Convert decimals back to fractions for common values
    const commonFractions: Record<number, string> = {
      0.125: '⅛',
      0.25: '¼', 
      0.333: '⅓',
      0.5: '½',
      0.667: '⅔',
      0.75: '¾'
    };

    const rounded = Math.round(num * 1000) / 1000;
    
    if (commonFractions[rounded]) {
      return commonFractions[rounded];
    }

    // Handle mixed numbers
    if (rounded > 1) {
      const whole = Math.floor(rounded);
      const decimal = rounded - whole;
      const fraction = commonFractions[Math.round(decimal * 1000) / 1000];
      
      if (fraction) {
        return `${whole} ${fraction}`;
      }
    }

    // Default to decimal with appropriate precision
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2).replace(/\.?0+$/, '');
  }

  static canConvertUnits(unit1: string, unit2: string): boolean {
    const conv1 = UNIT_CONVERSIONS[unit1.toLowerCase()];
    const conv2 = UNIT_CONVERSIONS[unit2.toLowerCase()];
    
    return conv1 && conv2 && conv1.baseUnit === conv2.baseUnit;
  }

  static convertUnits(parsedQuantity: ParsedQuantity, targetUnit: string): ParsedQuantity | null {
    const sourceUnit = parsedQuantity.unit.toLowerCase();
    const target = targetUnit.toLowerCase();

    if (sourceUnit === target) {
      return parsedQuantity;
    }

    const sourceConv = UNIT_CONVERSIONS[sourceUnit];
    const targetConv = UNIT_CONVERSIONS[target];

    if (!sourceConv || !targetConv || sourceConv.baseUnit !== targetConv.baseUnit) {
      return null; // Cannot convert
    }

    // Convert to base unit first, then to target
    const baseAmount = parsedQuantity.amount * sourceConv.factor;
    const convertedAmount = baseAmount / targetConv.factor;

    return {
      ...parsedQuantity,
      amount: convertedAmount,
      unit: targetUnit,
      minAmount: parsedQuantity.minAmount ? (parsedQuantity.minAmount * sourceConv.factor) / targetConv.factor : undefined,
      maxAmount: parsedQuantity.maxAmount ? (parsedQuantity.maxAmount * sourceConv.factor) / targetConv.factor : undefined
    };
  }
}