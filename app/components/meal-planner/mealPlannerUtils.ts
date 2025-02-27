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
      (item.category === 'vegetable' && item.per100g.fiber) ? 1.5 :
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
  
  // For PDF/Print format, create a printable window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to export your meal plan");
    return;
  }
  
  // Generate better-styled HTML
  printWindow.document.write(`
    <html>
      <head>
        <title>Nutrition Meal Plan</title>
        <style>
          :root {
            --primary: #3b82f6;
            --primary-dark: #2563eb;
            --secondary: #10b981;
            --secondary-dark: #059669;
            --dark: #1f2937;
            --light: #f9fafb;
            --gray: #6b7280;
            --light-gray: #e5e7eb;
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: var(--dark);
            line-height: 1.5;
          }
          
          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
          }
          
          header {
            padding: 2rem;
            background: linear-gradient(to right, var(--primary), var(--primary-dark));
            color: white;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          
          h1, h2, h3, h4 {
            margin-top: 0;
            font-weight: 600;
          }
          
          h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
          
          header p {
            margin: 0;
            opacity: 0.9;
          }
          
          .card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid var(--light-gray);
          }
          
          .meal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 0.75rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid var(--light-gray);
          }
          
          .meal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary);
            margin: 0;
          }
          
          .meal-time {
            color: var(--gray);
            font-size: 0.875rem;
          }
          
          .meal-component {
            margin-bottom: 1.25rem;
          }
          
          .component-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
          }
          
          .component-title::before {
            content: '';
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .protein .component-title::before {
            background-color: #ef4444;
          }
          
          .carbs .component-title::before {
            background-color: #f59e0b;
          }
          
          .vegetables .component-title::before {
            background-color: #10b981;
          }
          
          .recipe {
            background: var(--light);
            padding: 1rem;
            margin-top: 0.75rem;
            border-radius: 6px;
            font-size: 0.875rem;
          }
          
          .recipe h4 {
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
          }
          
          .recipe ol {
            margin: 0;
            padding-left: 1.5rem;
          }
          
          .recipe li {
            margin-bottom: 0.25rem;
          }
          
          .macros {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1.25rem;
            padding-top: 1rem;
            border-top: 1px solid var(--light-gray);
          }
          
          .macro-item {
            flex: 1;
            min-width: 80px;
            text-align: center;
            padding: 0.5rem;
            border-radius: 6px;
          }
          
          .calories {
            background-color: #dbeafe;
          }
          
          .protein-macro {
            background-color: #fee2e2;
          }
          
          .carbs-macro {
            background-color: #fef3c7;
          }
          
          .fats-macro {
            background-color: #d1fae5;
          }
          
          .macro-title {
            font-size: 0.75rem;
            margin-bottom: 0.25rem;
            color: var(--gray);
          }
          
          .macro-value {
            font-weight: 600;
            font-size: 1.125rem;
          }
          
          .shopping-list {
            margin-top: 3rem;
          }
          
          .shopping-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }
          
          .shopping-item {
            background: white;
            padding: 0.75rem;
            border-radius: 6px;
            border: 1px solid var(--light-gray);
            display: flex;
            justify-content: space-between;
          }
          
          .shopping-name {
            font-weight: 500;
          }
          
          .shopping-quantity {
            color: var(--gray);
          }
          
          .summary {
            margin-top: 3rem;
            background: linear-gradient(to right, var(--secondary), var(--secondary-dark));
            color: white;
            border-radius: 10px;
            padding: 1.5rem;
          }
          
          .summary h2 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
          }
          
          .summary-item {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.75rem;
            border-radius: 6px;
          }
          
          .summary-title {
            font-size: 0.75rem;
            opacity: 0.9;
            margin-bottom: 0.25rem;
          }
          
          .summary-value {
            font-weight: 600;
            font-size: 1.125rem;
          }
          
          footer {
            margin-top: 3rem;
            text-align: center;
            color: var(--gray);
            font-size: 0.875rem;
            padding: 1rem 0;
            border-top: 1px solid var(--light-gray);
          }
          
          @media print {
            body {
              font-size: 11pt;
            }
            
            .container {
              width: 100%;
              max-width: none;
              padding: 0;
            }
            
            .card {
              break-inside: avoid;
              border: none;
              box-shadow: none;
              padding: 1rem 0;
              margin-bottom: 1rem;
            }
            
            header, .summary {
              color: black;
              background: none !important;
              break-after: avoid;
              padding: 0;
              margin-bottom: 1.5rem;
            }
            
            .recipe {
              background: none;
              padding: 0 0 0 1rem;
              border-left: 2px solid #ddd;
            }
            
            .macro-item, .summary-item {
              border: 1px solid #ddd;
              background: none;
            }
            
            .shopping-item {
              background: none;
              border: 1px solid #ddd;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Your Personalized Meal Plan</h1>
            <p>Daily targets: ${macroTargets.dailyProtein}g protein, ${macroTargets.dailyCarbs}g carbs, ${macroTargets.dailyFats}g fats</p>
          </header>
          
          <section class="meals">
            <h2>Meal Plan (${meals.length} meals)</h2>
            
            ${meals.map(meal => `
              <div class="card">
                <div class="meal-header">
                  <h3 class="meal-title">${meal.meal}</h3>
                  <span class="meal-time">${meal.totalCookingTime} minutes</span>
                </div>
                
                <div class="meal-component protein">
                  <div class="component-title">Protein</div>
                  <p>${meal.protein.method} ${meal.protein.name} (${meal.protein.serving}g)</p>
                  ${meal.protein.recipeSteps.length > 0 ? `
                    <div class="recipe">
                      <h4>Recipe Steps:</h4>
                      <ol>
                        ${meal.protein.recipeSteps.map(step => `<li>${step}</li>`).join('')}
                      </ol>
                    </div>
                  ` : ''}
                </div>
                
                <div class="meal-component carbs">
                  <div class="component-title">Carbs</div>
                  <p>${meal.carb.method} ${meal.carb.name} (${meal.carb.serving}g)</p>
                  ${meal.carb.recipeSteps.length > 0 ? `
                    <div class="recipe">
                      <h4>Recipe Steps:</h4>
                      <ol>
                        ${meal.carb.recipeSteps.map(step => `<li>${step}</li>`).join('')}
                      </ol>
                    </div>
                  ` : ''}
                </div>
                
                <div class="meal-component vegetables">
                  <div class="component-title">Vegetables</div>
                  ${meal.vegetables.map(veg => `
                    <p>${veg.method} ${veg.name} (${veg.serving}g)</p>
                    ${veg.recipeSteps.length > 0 ? `
                      <div class="recipe">
                        <h4>Recipe Steps:</h4>
                        <ol>
                          ${veg.recipeSteps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                      </div>
                    ` : ''}
                  `).join('')}
                </div>
                
                <div class="macros">
                  <div class="macro-item calories">
                    <div class="macro-title">Calories</div>
                    <div class="macro-value">${Math.round(meal.macros.calories)} kcal</div>
                  </div>
                  <div class="macro-item protein-macro">
                    <div class="macro-title">Protein</div>
                    <div class="macro-value">${Math.round(meal.macros.protein)}g</div>
                  </div>
                  <div class="macro-item carbs-macro">
                    <div class="macro-title">Carbs</div>
                    <div class="macro-value">${Math.round(meal.macros.carbs)}g</div>
                  </div>
                  <div class="macro-item fats-macro">
                    <div class="macro-title">Fats</div>
                    <div class="macro-value">${Math.round(meal.macros.fats)}g</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </section>
          
          <section class="shopping-list">
            <h2>Shopping List</h2>
            <div class="shopping-grid">
              ${shoppingList.map(item => `
                <div class="shopping-item">
                  <span class="shopping-name">${item.name}</span>
                  <span class="shopping-quantity">${Math.round(item.total)}${item.unit}</span>
                </div>
              `).join('')}
            </div>
          </section>
          
          <section class="summary">
            <h2>Nutrition Summary</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-title">Daily Protein</div>
                <div class="summary-value">${macroTargets.dailyProtein}g</div>
              </div>
              <div class="summary-item">
                <div class="summary-title">Daily Carbs</div>
                <div class="summary-value">${macroTargets.dailyCarbs}g</div>
              </div>
              <div class="summary-item">
                <div class="summary-title">Daily Fats</div>
                <div class="summary-value">${macroTargets.dailyFats}g</div>
              </div>
              <div class="summary-item">
                <div class="summary-title">Daily Calories</div>
                <div class="summary-value">${calculateCalories(macroTargets.dailyProtein, macroTargets.dailyCarbs, macroTargets.dailyFats)} kcal</div>
              </div>
            </div>
          </section>
          
          <footer>
            Generated on ${new Date().toLocaleDateString()} | Nutrition Meal Planner
          </footer>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Either print directly or allow the user to save as PDF
  setTimeout(() => {
    if (format === 'print') {
      printWindow.print();
    }
    // For PDF format, the user can use the browser's "Save as PDF" option in the print dialog
  }, 500);
};