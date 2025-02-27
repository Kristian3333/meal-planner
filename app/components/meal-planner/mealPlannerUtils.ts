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
    // Filter foods based on cooking preferences
    const filteredProteins = foodDatabase.proteins.filter(item => {
      // Apply cooking preference filters
      if (cookingPreferences.preparationTime === 'quick' && item.cookingTime > 15) {
        return false;
      }
      if (cookingPreferences.preparationTime === 'moderate' && item.cookingTime > 30) {
        return false;
      }
      if (cookingPreferences.complexity !== 'any' && item.complexity !== cookingPreferences.complexity) {
        return false;
      }
      if (cookingPreferences.spiceLevel !== 'any' && item.spiceLevel !== cookingPreferences.spiceLevel) {
        return false;
      }
      return true;
    });
    
    const filteredCarbs = foodDatabase.carbs.filter(item => {
      if (cookingPreferences.preparationTime === 'quick' && item.cookingTime > 15) {
        return false;
      }
      if (cookingPreferences.preparationTime === 'moderate' && item.cookingTime > 30) {
        return false;
      }
      return true;
    });
    
    // Fall back to original arrays if no items match preferences
    const availableProteins = filteredProteins.length > 0 ? filteredProteins : foodDatabase.proteins;
    const availableCarbs = filteredCarbs.length > 0 ? filteredCarbs : foodDatabase.carbs;
    
    // Get sample items from each category
    const proteinIndex = i % availableProteins.length;
    const protein = availableProteins[proteinIndex];
    
    const carbIndex = i % availableCarbs.length;
    const carb = availableCarbs[carbIndex];
    
    const veg1Index = i % foodDatabase.vegetables.length;
    const veg1 = foodDatabase.vegetables[veg1Index];
    
    const veg2Index = (i + 1) % foodDatabase.vegetables.length;
    const veg2 = foodDatabase.vegetables[veg2Index];
    
    // Select random cooking methods
    const proteinMethod = protein.methods[Math.floor(Math.random() * protein.methods.length)];
    const carbMethod = carb.methods[Math.floor(Math.random() * carb.methods.length)];
    const veg1Method = veg1.methods[Math.floor(Math.random() * veg1.methods.length)];
    const veg2Method = veg2.methods[Math.floor(Math.random() * veg2.methods.length)];
    
    // Calculate serving adjustments based on macro targets
    // Adjust protein serving based on protein target
    const proteinRatio = macroTargets.dailyProtein / 3 / (protein.per100g.protein * protein.serving / 100);
    const adjustedProteinServing = Math.max(
      Math.min(protein.serving * proteinRatio, protein.serving * 1.5), // Cap at 150% of normal serving
      protein.serving * 0.7 // Minimum 70% of normal serving
    );
    
    // Adjust carb serving based on carb target
    const carbRatio = macroTargets.dailyCarbs / 3 / (carb.per100g.carbs * carb.serving / 100);
    const adjustedCarbServing = Math.max(
      Math.min(carb.serving * carbRatio, carb.serving * 1.5),
      carb.serving * 0.7
    );
    
    // Create meal components with adjusted servings
    const proteinComponent: MealComponent = {
      id: protein.id,
      name: protein.name,
      serving: Math.round(adjustedProteinServing),
      method: proteinMethod,
      recipeSteps: protein.recipeSteps || [],
      cookingTime: protein.cookingTime,
      complexity: protein.complexity,
      per100g: protein.per100g
    };
    
    const carbComponent: MealComponent = {
      id: carb.id,
      name: carb.name,
      serving: Math.round(adjustedCarbServing),
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
    const proteinMacros = calculateMacros(protein, proteinComponent.serving);
    const carbMacros = calculateMacros(carb, carbComponent.serving);
    const veg1Macros = calculateMacros(veg1, veg1Component.serving);
    const veg2Macros = calculateMacros(veg2, veg2Component.serving);
    
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