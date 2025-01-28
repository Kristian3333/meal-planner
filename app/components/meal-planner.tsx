'use client';

import React, { useState, useEffect } from 'react';

interface FoodItem {
  name: string;
  serving: number;
  per100g: {
    protein: number;
    fat: number;
    carbs: number;
    calories: number;
  };
  methods: readonly string[];
}

interface MacroTargets {
  dailyProtein: number;
  dailyCarbs: number;
  dailyFats: number;
}

interface MealMacros {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

interface Meal {
  id: number;
  meal: string;
  protein: FoodItem & { method: string };
  carb: FoodItem & { method: string };
  vegetables: (FoodItem & { method: string })[];
  macros: MealMacros;
}

interface ShoppingListItem {
  name: string;
  total: number;
  unit: string;
}

const FOODS = {
  proteins: [
    { name: 'Chicken Breast', serving: 180, per100g: { protein: 31, fat: 3.6, carbs: 0, calories: 165 }, methods: ['Grilled', 'Pan-fried'] },
    { name: 'Salmon', serving: 180, per100g: { protein: 20, fat: 13, carbs: 0, calories: 208 }, methods: ['Baked', 'Pan-seared'] }
  ],
  carbs: [
    { name: 'Brown Rice', serving: 125, per100g: { protein: 2.6, fat: 0.9, carbs: 23, calories: 110 }, methods: ['Boiled'] },
    { name: 'Quinoa', serving: 125, per100g: { protein: 4.4, fat: 1.9, carbs: 21, calories: 120 }, methods: ['Boiled'] }
  ],
  vegetables: [
    { name: 'Broccoli', serving: 150, per100g: { protein: 2.8, fat: 0.4, carbs: 7, calories: 34 }, methods: ['Steamed', 'Roasted'] },
    { name: 'Green Beans', serving: 150, per100g: { protein: 1.8, fat: 0.2, carbs: 7, calories: 31 }, methods: ['Steamed'] }
  ]
} as const;

export function MealPlanner() {
  const [cook, setCook] = useState('partner1');
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFats: 60
  });
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [activeTab, setActiveTab] = useState('meals');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  const calculateCalories = (protein: number, carbs: number, fats: number): number => {
    return (protein * 4) + (carbs * 4) + (fats * 9);
  };

  const [calculatedCalories, setCalculatedCalories] = useState<number>(
    calculateCalories(macroTargets.dailyProtein, macroTargets.dailyCarbs, macroTargets.dailyFats)
  );

  useEffect(() => {
    setCalculatedCalories(
      calculateCalories(macroTargets.dailyProtein, macroTargets.dailyCarbs, macroTargets.dailyFats)
    );
  }, [macroTargets]);

  const calculateMacros = (item: FoodItem, customServing?: number): MealMacros => {
    const multiplier = (customServing ?? item.serving) / 100;
    return {
      protein: item.per100g.protein * multiplier,
      carbs: item.per100g.carbs * multiplier,
      fats: item.per100g.fat * multiplier,
      calories: item.per100g.calories * multiplier
    };
  };

  const generateShoppingList = (meals: Meal[]) => {
    const items: Record<string, number> = {};

    meals.forEach(meal => {
      items[meal.protein.name] = (items[meal.protein.name] || 0) + meal.protein.serving;
      items[meal.carb.name] = (items[meal.carb.name] || 0) + meal.carb.serving;
      meal.vegetables.forEach(veg => {
        items[veg.name] = (items[veg.name] || 0) + veg.serving;
      });
    });

    const list = Object.entries(items).map(([name, total]) => ({
      name,
      total,
      unit: 'g'
    }));

    setShoppingList(list);
  };

  const findBestMatch = (
    category: 'proteins' | 'carbs' | 'vegetables',
    remaining: { protein: number; carbs: number; fats: number },
    used: string[]
  ): FoodItem => {
    const available = FOODS[category].filter(item => !used.includes(item.name));
    if (available.length === 0) return FOODS[category][0];

    const totalTarget = remaining.protein + remaining.carbs + remaining.fats;
    const targetRatios = {
      protein: remaining.protein / totalTarget,
      carbs: remaining.carbs / totalTarget,
      fats: remaining.fats / totalTarget
    };

    return available.reduce((best, item) => {
      const macros = calculateMacros(item);
      const totalMacros = macros.protein + macros.carbs + macros.fats;
      
      const itemRatios = {
        protein: macros.protein / totalMacros,
        carbs: macros.carbs / totalMacros,
        fats: macros.fats / totalMacros
      };

      const score = (
        Math.abs(itemRatios.protein - targetRatios.protein) + 
        Math.abs(itemRatios.carbs - targetRatios.carbs) + 
        Math.abs(itemRatios.fats - targetRatios.fats)
      );

      const categoryMultiplier = 
        (category === 'proteins' && macros.protein > 0) ? 2 :
        (category === 'carbs' && macros.carbs > 0) ? 2 :
        1;

      const finalScore = -score * categoryMultiplier; // Negative because lower difference is better
      
      return finalScore > best.score ? { item, score: finalScore } : best;
    }, { item: available[0], score: -Infinity }).item;
  };

  const adjustServingSize = (
    item: FoodItem,
    targetMacro: number,
    actualMacro: number,
    baseServing: number
  ): number => {
    if (actualMacro === 0) return baseServing;
    const ratio = targetMacro / actualMacro;
    return Math.round(baseServing * Math.min(Math.max(ratio, 0.5), 1.5));
  };
  const generateMealPlan = () => {
    const meals: Meal[] = [];
    const usedProteins: string[] = [];
    const usedCarbs: string[] = [];
    const usedVegetables: string[] = [];
    
    // Calculate weekly targets (6 meals = 3 days x 2 meals)
    const weeklyTargets = {
      protein: macroTargets.dailyProtein * 3,
      carbs: macroTargets.dailyCarbs * 3,
      fats: macroTargets.dailyFats * 3
    };

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

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
      const protein = findBestMatch('proteins', remaining, usedProteins);
      const carb = findBestMatch('carbs', remaining, usedCarbs);
      const veg1 = findBestMatch('vegetables', remaining, usedVegetables);
      const veg2 = findBestMatch('vegetables', remaining, [...usedVegetables, veg1.name]);

      // Calculate base macros
      const proteinMacros = calculateMacros(protein);
      const carbMacros = calculateMacros(carb);
      const veg1Macros = calculateMacros(veg1);
      const veg2Macros = calculateMacros(veg2);

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
      const finalProteinMacros = calculateMacros(protein, adjustedProteinServing);
      const finalCarbMacros = calculateMacros(carb, adjustedCarbServing);
      const finalVeg1Macros = calculateMacros(veg1, adjustedVeg1Serving);
      const finalVeg2Macros = calculateMacros(veg2, adjustedVeg2Serving);

      // Update running totals
      totalProtein += finalProteinMacros.protein + finalCarbMacros.protein + 
                     finalVeg1Macros.protein + finalVeg2Macros.protein;
      totalCarbs += finalProteinMacros.carbs + finalCarbMacros.carbs + 
                   finalVeg1Macros.carbs + finalVeg2Macros.carbs;
      totalFats += finalProteinMacros.fats + finalCarbMacros.fats + 
                  finalVeg1Macros.fats + finalVeg2Macros.fats;

      // Track used items
      usedProteins.push(protein.name);
      usedCarbs.push(carb.name);
      usedVegetables.push(veg1.name, veg2.name);

      // Manage the history of used items
      if (usedProteins.length > 2) usedProteins.shift();
      if (usedCarbs.length > 2) usedCarbs.shift();
      if (usedVegetables.length > 4) usedVegetables.splice(0, 2);

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

      meals.push({
        id: i + 1,
        meal: `Day ${Math.floor(i/2) + 1} - ${i % 2 === 0 ? 'Lunch' : 'Dinner'}`,
        protein: { 
          ...protein, 
          serving: adjustedProteinServing,
          method: proteinMethod 
        },
        carb: { 
          ...carb, 
          serving: adjustedCarbServing,
          method: carbMethod 
        },
        vegetables: [
          { ...veg1, serving: adjustedVeg1Serving, method: veg1Method },
          { ...veg2, serving: adjustedVeg2Serving, method: veg2Method }
        ],
        macros: mealMacros
      });
    }

    setMealPlan(meals);
    generateShoppingList(meals);
  };
  const totalMacros = mealPlan.reduce((acc, meal) => ({
    protein: acc.protein + meal.macros.protein,
    carbs: acc.carbs + meal.macros.carbs,
    fats: acc.fats + meal.macros.fats,
    calories: acc.calories + meal.macros.calories
  }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

  const dailyAverageMacros = {
    protein: totalMacros.protein / 3,
    carbs: totalMacros.carbs / 3,
    fats: totalMacros.fats / 3,
    calories: totalMacros.calories / 3
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-8">Meal Planner</h2>
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-3">Select Cook</label>
            <select 
              value={cook} 
              onChange={(e) => setCook(e.target.value)}
              className="w-full p-4 border rounded-md bg-white shadow-sm"
            >
              <option value="partner1">Partner 1 (Wednesday)</option>
              <option value="partner2">Partner 2 (Sunday)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-3">Daily Protein (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyProtein}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyProtein: parseInt(e.target.value) || 0
                }))}
                className="w-full p-4 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Daily Carbs (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyCarbs}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyCarbs: parseInt(e.target.value) || 0
                }))}
                className="w-full p-4 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Daily Fats (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyFats}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyFats: parseInt(e.target.value) || 0
                }))}
                className="w-full p-4 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Daily Calories (calculated)</label>
              <div className="w-full p-4 bg-gray-50 rounded-md border shadow-sm">
                {calculatedCalories} kcal
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={generateMealPlan}
        className="w-full py-4 px-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
      >
        Generate Meal Plan
      </button>

      {mealPlan.length > 0 && (
        <div className="space-y-8">
          <div className="border-b mb-8">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('meals')}
                className={`py-4 px-8 font-medium ${
                  activeTab === 'meals' 
                    ? 'border-b-2 border-blue-500 text-blue-500' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Meals
              </button>
              <button
                onClick={() => setActiveTab('macros')}
                className={`py-4 px-8 font-medium ${
                  activeTab === 'macros' 
                    ? 'border-b-2 border-blue-500 text-blue-500' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nutrition
              </button>
              <button
                onClick={() => setActiveTab('shopping')}
                className={`py-4 px-8 font-medium ${
                  activeTab === 'shopping' 
                    ? 'border-b-2 border-blue-500 text-blue-500' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shopping List
              </button>
            </div>
          </div>
          {activeTab === 'meals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mealPlan.map((meal) => (
                <div key={meal.id} className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-semibold mb-6">{meal.meal}</h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Protein</h4>
                      <p className="text-gray-700">
                        {meal.protein.method} {meal.protein.name} ({meal.protein.serving}g)
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Carbs</h4>
                      <p className="text-gray-700">
                        {meal.carb.method} {meal.carb.name} ({meal.carb.serving}g)
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Vegetables</h4>
                      {meal.vegetables.map((veg, idx) => (
                        <p key={idx} className="text-gray-700 mb-2">
                          {veg.method} {veg.name} ({veg.serving}g)
                        </p>
                      ))}
                    </div>

                    <div className="pt-6 border-t">
                      <h4 className="font-medium text-gray-900 mb-4">Nutrition</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-gray-600">Calories:</div>
                        <div className="text-right font-medium">
                          {Math.round(meal.macros.calories)} kcal
                        </div>
                        <div className="text-gray-600">Protein:</div>
                        <div className="text-right font-medium">
                          {Math.round(meal.macros.protein)}g
                        </div>
                        <div className="text-gray-600">Carbs:</div>
                        <div className="text-right font-medium">
                          {Math.round(meal.macros.carbs)}g
                        </div>
                        <div className="text-gray-600">Fats:</div>
                        <div className="text-right font-medium">
                          {Math.round(meal.macros.fats)}g
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'macros' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-8">Daily Average Nutrition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Current</h4>
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Calories:</span>
                      <span className="font-medium">{Math.round(dailyAverageMacros.calories)} kcal</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Protein:</span>
                      <span className="font-medium">{Math.round(dailyAverageMacros.protein)}g</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Carbs:</span>
                      <span className="font-medium">{Math.round(dailyAverageMacros.carbs)}g</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Fats:</span>
                      <span className="font-medium">{Math.round(dailyAverageMacros.fats)}g</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Target</h4>
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Calories:</span>
                      <span className="font-medium">{calculatedCalories} kcal</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Protein:</span>
                      <span className="font-medium">{macroTargets.dailyProtein}g</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Carbs:</span>
                      <span className="font-medium">{macroTargets.dailyCarbs}g</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Fats:</span>
                      <span className="font-medium">{macroTargets.dailyFats}g</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shopping' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-8">Shopping List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shoppingList.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-gray-600">
                      {Math.round(item.total)}{item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
