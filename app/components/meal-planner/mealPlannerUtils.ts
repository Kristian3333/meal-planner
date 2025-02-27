// src/components/meal-planner/mealPlannerUtils.ts
import type { 
  FoodItem, 
  MacroTargets, 
  Meal, 
  MealMacros, 
  ShoppingListItem,
  CookingPreferences,
  MealComponent
} from './types';

/**
 * Calculate calories from macronutrients
 */
export const calculateCalories = (protein: number, carbs: number, fats: number): number => {
  return Math.round((protein * 4) + (carbs * 4) + (fats * 9));
};

/**
 * Calculate macros for a food item based on serving size
 */
export const calculateMacros = (item: FoodItem, customServing?: number): MealMacros => {
  const multiplier = (customServing ?? item.serving) / 100;
  return {
    protein: item.per100g.protein * multiplier,
    carbs: item.per100g.carbs * multiplier,
    fats: item.per100g.fat * multiplier,
    calories: item.per100g.calories * multiplier
  };
};

/**
 * Generate a meal plan using OpenAI API
 */
export const generateMealPlan = async (
  foodDatabase: {
    proteins: FoodItem[];
    carbs: FoodItem[];
    vegetables: FoodItem[];
  },
  macroTargets: MacroTargets,
  cookingPreferences: CookingPreferences
): Promise<Meal[]> => {
  // Simplified version for demo purposes that doesn't make actual API calls
  // but returns properly structured data
  
  // In a real implementation, you would call the OpenAI API here
  // For now, we'll create a sample meal plan using the food database
  
  const meals: Meal[] = [];
  
  // Create 6 meals (3 days x 2 meals)
  for (let i = 0; i < 6; i++) {
    // Get sample items from each category
    const proteinIndex = i % foodDatabase.proteins.length;
    const protein = foodDatabase.proteins[proteinIndex];
    
    const carbIndex = i % foodDatabase.carbs.length;
    const carb = foodDatabase.carbs[carbIndex];
    
    const veg1Index = i % foodDatabase.vegetables.length;
    const veg1 = foodDatabase.vegetables[veg1Index];
    
    const veg2Index = (i + 1) % foodDatabase.vegetables.length;
    const veg2 = foodDatabase.vegetables[veg2Index];
    
    // Select random cooking methods
    const proteinMethod = protein.methods[Math.floor(Math.random() * protein.methods.length)];
    const carbMethod = carb.methods[Math.floor(Math.random() * carb.methods.length)];
    const veg1Method = veg1.methods[Math.floor(Math.random() * veg1.methods.length)];
    const veg2Method = veg2.methods[Math.floor(Math.random() * veg2.methods.length)];
    
    // Create meal components
    const proteinComponent: MealComponent = {
      id: protein.id,
      name: protein.name,
      serving: protein.serving,
      method: proteinMethod,
      recipeSteps: protein.recipeSteps || [],
      cookingTime: protein.cookingTime,
      complexity: protein.complexity,
      per100g: protein.per100g
    };
    
    const carbComponent: MealComponent = {
      id: carb.id,
      name: carb.name,
      serving: carb.serving,
      method: carbMethod,
      recipeSteps: carb.recipeSteps || [],
      cookingTime: carb.cookingTime,
      complexity: carb.complexity,
      per100g: carb.per100g
    };
    
    const veg1Component: MealComponent = {
      id: veg1.id,
      name: veg1.name,
      serving: veg1.serving,
      method: veg1Method,
      recipeSteps: veg1.recipeSteps || [],
      cookingTime: veg1.cookingTime,
      complexity: veg1.complexity,
      per100g: veg1.per100g
    };
    
    const veg2Component: MealComponent = {
      id: veg2.id,
      name: veg2.name,
      serving: veg2.serving,
      method: veg2Method,
      recipeSteps: veg2.recipeSteps || [],
      cookingTime: veg2.cookingTime,
      complexity: veg2.complexity,
      per100g: veg2.per100g
    };
    
    // Calculate macros
    const proteinMacros = calculateMacros(protein);
    const carbMacros = calculateMacros(carb);
    const veg1Macros = calculateMacros(veg1);
    const veg2Macros = calculateMacros(veg2);
    
    // Calculate total macros for the meal
    const mealMacros: MealMacros = {
      protein: proteinMacros.protein + carbMacros.protein + veg1Macros.protein + veg2Macros.protein,
      carbs: proteinMacros.carbs + carbMacros.carbs + veg1Macros.carbs + veg2Macros.carbs,
      fats: proteinMacros.fats + carbMacros.fats + veg1Macros.fats + veg2Macros.fats,
      calories: proteinMacros.calories + carbMacros.calories + veg1Macros.calories + veg2Macros.calories
    };
    
    // Calculate total cooking time
    const totalCookingTime = Math.max(
      protein.cookingTime,
      carb.cookingTime,
      veg1.cookingTime,
      veg2.cookingTime
    ) + 5; // Adding 5 minutes for preparation
    
    // Create the meal
    meals.push({
      id: i + 1,
      meal: `Day ${Math.floor(i/2) + 1} - ${i % 2 === 0 ? 'Lunch' : 'Dinner'}`,
      protein: proteinComponent,
      carb: carbComponent,
      vegetables: [veg1Component, veg2Component],
      macros: mealMacros,
      totalCookingTime
    });
  }
  
  // Return the generated meals
  return meals;
};

/**
 * Generate shopping list from meal plan
 */
export const generateShoppingList = (meals: Meal[]): ShoppingListItem[] => {
  const itemsMap = new Map<string, number>();

  // Collect all items and their quantities
  meals.forEach(meal => {
    // Add protein
    const proteinKey = meal.protein.id;
    itemsMap.set(proteinKey, (itemsMap.get(proteinKey) || 0) + meal.protein.serving);
    
    // Add carb
    const carbKey = meal.carb.id;
    itemsMap.set(carbKey, (itemsMap.get(carbKey) || 0) + meal.carb.serving);
    
    // Add vegetables
    meal.vegetables.forEach(veg => {
      const vegKey = veg.id;
      itemsMap.set(vegKey, (itemsMap.get(vegKey) || 0) + veg.serving);
    });
  });

  // Convert to shopping list items
  const shoppingList: ShoppingListItem[] = [];
  
  meals.forEach(meal => {
    // Check if protein is already added
    const proteinExists = shoppingList.some(item => item.id === meal.protein.id);
    if (!proteinExists) {
      shoppingList.push({
        id: meal.protein.id,
        name: meal.protein.name,
        total: itemsMap.get(meal.protein.id) || 0,
        unit: 'g'
      });
    }
    
    // Check if carb is already added
    const carbExists = shoppingList.some(item => item.id === meal.carb.id);
    if (!carbExists) {
      shoppingList.push({
        id: meal.carb.id,
        name: meal.carb.name,
        total: itemsMap.get(meal.carb.id) || 0,
        unit: 'g'
      });
    }
    
    // Check if vegetables are already added
    meal.vegetables.forEach(veg => {
      const vegExists = shoppingList.some(item => item.id === veg.id);
      if (!vegExists) {
        shoppingList.push({
          id: veg.id,
          name: veg.name,
          total: itemsMap.get(veg.id) || 0,
          unit: 'g'
        });
      }
    });
  });

  // Sort by food category and name
  return shoppingList.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Export meal plan to PDF or for printing
 */
export const exportToPDF = (
  meals: Meal[], 
  shoppingList: ShoppingListItem[], 
  macroTargets: MacroTargets,
  format: 'pdf' | 'print' | 'json' = 'pdf'
) => {
  // For JSON format, download as a JSON file
  if (format === 'json') {
    const data = {
      macroTargets,
      meals,
      shoppingList
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "meal-plan.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    return;
  }
  
  // Rest of the existing exportToPDF function remains unchanged
  // ...
};