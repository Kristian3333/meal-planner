// src/components/meal-planner/types.ts

export interface NutritionInfo {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  serving: number; // in grams
  per100g: NutritionInfo;
  methods: readonly string[];
  cookingTime: number; // in minutes
  complexity: 'easy' | 'medium' | 'complex';
  spiceLevel: 'mild' | 'medium' | 'spicy';
  category: 'protein' | 'carb' | 'vegetable';
  recipeSteps: string[];
  allergens?: string[];
  tags?: string[];
}

// Additional interface changes...
export interface MacroTargets {
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
}

export interface CookingPreferences {
  preparationTime: 'quick' | 'moderate' | 'any';
  complexity: 'easy' | 'medium' | 'complex' | 'any';
  spiceLevel: 'mild' | 'medium' | 'spicy' | 'any';
}
  
  export interface MealMacros {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  }
  
  export interface MealComponent {
    id: string;
    name: string;
    serving: number;
    method: string;
    recipeSteps: string[];
    cookingTime: number;
    complexity: string;
    per100g: NutritionInfo;
  }
  
  export interface Meal {
    id: number;
    meal: string; // e.g., "Day 1 - Lunch"
    protein: MealComponent;
    carb: MealComponent;
    vegetables: MealComponent[];
    macros: MealMacros;
    totalCookingTime: number;
  }
  
  export interface ShoppingListItem {
    id: string;
    name: string;
    total: number;
    unit: string;
  }
  
  export interface TabItem {
    id: string;
    label: string;
  }