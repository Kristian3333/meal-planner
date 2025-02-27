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
   * Find the best matching food item for nutritional requirements
   */
  const findBestMatch = (
    foods: FoodItem[],
    remaining: { protein: number; carbs: number; fats: number },
    usedIds: string[],
    preferences: CookingPreferences
  ): FoodItem | null => {
    // Filter out already used items
    const available = foods.filter(item => !usedIds.includes(item.id));
    
    if (available.length === 0) return null;
  
    // Apply cooking preferences filter
    let filtered = available;
    
    if (preferences.preparationTime === 'quick') {
      filtered = filtered.filter(item => item.cookingTime <= 15);
    } else if (preferences.preparationTime === 'moderate') {
      filtered = filtered.filter(item => item.cookingTime <= 30);
    }
    
    if (preferences.complexity !== 'any') {
      filtered = filtered.filter(item => item.complexity === preferences.complexity);
    }
    
    if (preferences.spiceLevel !== 'any') {
      filtered = filtered.filter(item => item.spiceLevel === preferences.spiceLevel);
    }
    
    // If no items match the preferences, fall back to all available
    if (filtered.length === 0) filtered = available;
  
    // Calculate target ratios for nutritional matching
    const totalTarget = remaining.protein + remaining.carbs + remaining.fats;
    const targetRatios = {
      protein: totalTarget ? remaining.protein / totalTarget : 0.33,
      carbs: totalTarget ? remaining.carbs / totalTarget : 0.33,
      fats: totalTarget ? remaining.fats / totalTarget : 0.33
    };
  
    // Find best matching item
    return filtered.reduce((best, item) => {
      const macros = calculateMacros(item);
      const totalMacros = macros.protein + macros.carbs + macros.fats;
      
      if (totalMacros === 0) return best;
      
      const itemRatios = {
        protein: macros.protein / totalMacros,
        carbs: macros.carbs / totalMacros,
        fats: macros.fats / totalMacros
      };
  
      // Calculate score based on how well the item matches the target ratios
      const score = (
        Math.abs(itemRatios.protein - targetRatios.protein) + 
        Math.abs(itemRatios.carbs - targetRatios.carbs) + 
        Math.abs(itemRatios.fats - targetRatios.fats)
      );
  
      // Apply category multiplier to favor appropriate macros for each category
      const categoryMultiplier = 
        (item.category === 'protein' && macros.protein > 0) ? 2 :
        (item.category === 'carb' && macros.carbs > 0) ? 2 :
        (item.category === 'vegetable' && macros.fiber) ? 1.5 :
        1;
  
      const finalScore = -score * categoryMultiplier; // Negative because lower difference is better
      
      return finalScore > best.score ? { item, score: finalScore } : best;
    }, { item: filtered[0], score: -Infinity }).item;
  };
  
  /**
   * Adjust serving size to meet target macros
   */
  const adjustServingSize = (
    item: FoodItem,
    targetMacro: number,
    actualMacro: number,
    baseServing: number
  ): number => {
    if (actualMacro === 0) return baseServing;
    // Limit adjustment to reasonable range (50%-150% of base serving)
    const ratio = targetMacro / actualMacro;
    return Math.round(baseServing * Math.min(Math.max(ratio, 0.5), 1.5));
  };
  
  /**
   * Generate a meal plan based on target macros and preferences
   */
  export const generateMealPlan = (
    foodDatabase: {
      proteins: FoodItem[];
      carbs: FoodItem[];
      vegetables: FoodItem[];
    },
    macroTargets: MacroTargets,
    preferences: CookingPreferences
  ): Meal[] => {
    const meals: Meal[] = [];
    const usedProteinIds: string[] = [];
    const usedCarbIds: string[] = [];
    const usedVegetableIds: string[] = [];
    
    // Calculate weekly targets (6 meals = 3 days x 2 meals)
    const weeklyTargets = {
      protein: macroTargets.dailyProtein * 3,
      carbs: macroTargets.dailyCarbs * 3,
      fats: macroTargets.dailyFats * 3
    };
  
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
  
    // Performance optimization: memoize calculated macros
    const macrosCache = new Map<string, MealMacros>();
  
    for (let i = 0; i < 6; i++) {
      const remaining = {
        protein: Math.max(0, weeklyTargets.protein - totalProtein),
        carbs: Math.max(0, weeklyTargets.carbs - totalCarbs),
        fats: Math.max(0, weeklyTargets.fats - totalFats)
      };
  
      const mealsRemaining = 6 - i;
      const targetPerMeal = {
        protein: remaining.protein / mealsRemaining,
        carbs: remaining.carbs / mealsRemaining,
        fats: remaining.fats / mealsRemaining
      };
  
      // Select items based on remaining macros
      const protein = findBestMatch(foodDatabase.proteins, remaining, usedProteinIds, preferences);
      const carb = findBestMatch(foodDatabase.carbs, remaining, usedCarbIds, preferences);
      const veg1 = findBestMatch(foodDatabase.vegetables, remaining, usedVegetableIds, preferences);
      
      // Make sure we have all components
      if (!protein || !carb || !veg1) {
        console.error("Not enough food items available to create meal plan");
        return [];
      }
      
      const veg2 = findBestMatch(
        foodDatabase.vegetables, 
        remaining, 
        [...usedVegetableIds, veg1.id], 
        preferences
      ) || veg1; // Fall back to veg1 if we can't find another
  
      // Get cached macros or calculate
      const getMacros = (item: FoodItem) => {
        if (!macrosCache.has(item.id)) {
          macrosCache.set(item.id, calculateMacros(item));
        }
        return macrosCache.get(item.id)!;
      };
  
      // Calculate base macros
      const proteinMacros = getMacros(protein);
      const carbMacros = getMacros(carb);
      const veg1Macros = getMacros(veg1);
      const veg2Macros = getMacros(veg2);
  
      // Adjust serving sizes based on targets
      const adjustedProteinServing = adjustServingSize(
        protein,
        targetPerMeal.protein,
        proteinMacros.protein,
        protein.serving
      );
  
      const adjustedCarbServing = adjustServingSize(
        carb,
        targetPerMeal.carbs,
        carbMacros.carbs,
        carb.serving
      );
  
      const adjustedVeg1Serving = adjustServingSize(
        veg1,
        targetPerMeal.carbs / 2,
        veg1Macros.carbs,
        veg1.serving
      );
  
      const adjustedVeg2Serving = adjustServingSize(
        veg2,
        targetPerMeal.carbs / 2,
        veg2Macros.carbs,
        veg2.serving
      );
  
      // Select cooking methods
      const proteinMethod = protein.methods[Math.floor(Math.random() * protein.methods.length)];
      const carbMethod = carb.methods[Math.floor(Math.random() * carb.methods.length)];
      const veg1Method = veg1.methods[Math.floor(Math.random() * veg1.methods.length)];
      const veg2Method = veg2.methods[Math.floor(Math.random() * veg2.methods.length)];
  
      // Calculate final macros with adjusted servings
      const calculateCustomMacros = (item: FoodItem, serving: number) => {
        const multiplier = serving / 100;
        return {
          protein: item.per100g.protein * multiplier,
          carbs: item.per100g.carbs * multiplier,
          fats: item.per100g.fat * multiplier,
          calories: item.per100g.calories * multiplier
        };
      };
  
      const finalProteinMacros = calculateCustomMacros(protein, adjustedProteinServing);
      const finalCarbMacros = calculateCustomMacros(carb, adjustedCarbServing);
      const finalVeg1Macros = calculateCustomMacros(veg1, adjustedVeg1Serving);
      const finalVeg2Macros = calculateCustomMacros(veg2, adjustedVeg2Serving);
  
      // Update running totals
      totalProtein += finalProteinMacros.protein + finalCarbMacros.protein + 
                     finalVeg1Macros.protein + finalVeg2Macros.protein;
      totalCarbs += finalProteinMacros.carbs + finalCarbMacros.carbs + 
                   finalVeg1Macros.carbs + finalVeg2Macros.carbs;
      totalFats += finalProteinMacros.fats + finalCarbMacros.fats + 
                  finalVeg1Macros.fats + finalVeg2Macros.fats;
  
      // Track used items
      usedProteinIds.push(protein.id);
      usedCarbIds.push(carb.id);
      usedVegetableIds.push(veg1.id);
      if (veg1.id !== veg2.id) {
        usedVegetableIds.push(veg2.id);
      }
  
      // Manage the history of used items to allow reuse after a few meals
      if (usedProteinIds.length > 2) usedProteinIds.shift();
      if (usedCarbIds.length > 2) usedCarbIds.shift();
      if (usedVegetableIds.length > 4) usedVegetableIds.splice(0, 2);
  
      // Create meal components with recipe steps
      const createMealComponent = (
        item: FoodItem, 
        serving: number, 
        method: string
      ): MealComponent => ({
        id: item.id,
        name: item.name,
        serving,
        method,
        recipeSteps: item.recipeSteps || [],
        cookingTime: item.cookingTime,
        complexity: item.complexity,
        per100g: item.per100g
      });
  
      const proteinComponent = createMealComponent(protein, adjustedProteinServing, proteinMethod);
      const carbComponent = createMealComponent(carb, adjustedCarbServing, carbMethod);
      const veg1Component = createMealComponent(veg1, adjustedVeg1Serving, veg1Method);
      const veg2Component = createMealComponent(veg2, adjustedVeg2Serving, veg2Method);
  
      const mealMacros: MealMacros = {
        protein: finalProteinMacros.protein + finalCarbMacros.protein + 
                finalVeg1Macros.protein + finalVeg2Macros.protein,
        carbs: finalProteinMacros.carbs + finalCarbMacros.carbs + 
               finalVeg1Macros.carbs + finalVeg2Macros.carbs,
        fats: finalProteinMacros.fats + finalCarbMacros.fats + 
              finalVeg1Macros.fats + finalVeg2Macros.fats,
        calories: finalProteinMacros.calories + finalCarbMacros.calories + 
                 finalVeg1Macros.calories + finalVeg2Macros.calories
      };
  
      // Calculate total cooking time
      const totalCookingTime = Math.max(
        protein.cookingTime,
        carb.cookingTime,
        veg1.cookingTime,
        veg2.cookingTime
      ) + 5; // Adding 5 minutes for preparation
  
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
   * Export meal plan to PDF
   */
  export const exportToPDF = (
    meals: Meal[], 
    shoppingList: ShoppingListItem[], 
    macroTargets: MacroTargets
  ) => {
    // In a real app, you'd implement PDF generation using a library like jsPDF
    // For this example, we'll just create a printable version using window.print()
    
    // Create a print-friendly version of the plan
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to export your meal plan");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Meal Plan</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2, h3 { color: #333; }
            .meal { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .item { margin-bottom: 10px; }
            .macros { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 15px; }
            .shopping-list { display: grid; grid-template-columns: repeat(2, 1fr); }
            .recipe { background: #f9f9f9; padding: 10px; margin-top: 10px; border-left: 3px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Your Custom Meal Plan</h1>
          <p>Macro Targets: ${macroTargets.dailyProtein}g protein, ${macroTargets.dailyCarbs}g carbs, ${macroTargets.dailyFats}g fats</p>
          
          <h2>Meals</h2>
          ${meals.map(meal => `
            <div class="meal">
              <h3>${meal.meal}</h3>
              
              <div class="item">
                <strong>Protein:</strong> ${meal.protein.method} ${meal.protein.name} (${meal.protein.serving}g)
                ${meal.protein.recipeSteps.length > 0 ? `
                  <div class="recipe">
                    <strong>Recipe:</strong>
                    <ol>
                      ${meal.protein.recipeSteps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                  </div>
                ` : ''}
              </div>
              
              <div class="item">
                <strong>Carbs:</strong> ${meal.carb.method} ${meal.carb.name} (${meal.carb.serving}g)
                ${meal.carb.recipeSteps.length > 0 ? `
                  <div class="recipe">
                    <strong>Recipe:</strong>
                    <ol>
                      ${meal.carb.recipeSteps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                  </div>
                ` : ''}
              </div>
              
              <div class="item">
                <strong>Vegetables:</strong>
                <ul>
                  ${meal.vegetables.map(veg => `
                    <li>
                      ${veg.method} ${veg.name} (${veg.serving}g)
                      ${veg.recipeSteps.length > 0 ? `
                        <div class="recipe">
                          <strong>Recipe:</strong>
                          <ol>
                            ${veg.recipeSteps.map(step => `<li>${step}</li>`).join('')}
                          </ol>
                        </div>
                      ` : ''}
                    </li>
                  `).join('')}
                </ul>
              </div>
              
              <div class="macros">
                <div><strong>Calories:</strong> ${Math.round(meal.macros.calories)} kcal</div>
                <div><strong>Protein:</strong> ${Math.round(meal.macros.protein)}g</div>
                <div><strong>Carbs:</strong> ${Math.round(meal.macros.carbs)}g</div>
                <div><strong>Fats:</strong> ${Math.round(meal.macros.fats)}g</div>
              </div>
              
              <div><strong>Total Cooking Time:</strong> ${meal.totalCookingTime} minutes</div>
            </div>
          `).join('')}
          
          <h2>Shopping List</h2>
          <div class="shopping-list">
            ${shoppingList.map(item => `
              <div>
                <strong>${item.name}:</strong> ${Math.round(item.total)}${item.unit}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };