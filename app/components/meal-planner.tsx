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

  const calculateMacros = (item: FoodItem): MealMacros => {
    const multiplier = item.serving / 100;
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
      // Process protein
      items[meal.protein.name] = (items[meal.protein.name] || 0) + meal.protein.serving;
      
      // Process carb
      items[meal.carb.name] = (items[meal.carb.name] || 0) + meal.carb.serving;
      
      // Process vegetables
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

    return available.reduce((best, item) => {
      const macros = calculateMacros(item);
      const score = 
        (macros.protein / remaining.protein) * (category === 'proteins' ? 2 : 1) +
        (macros.carbs / remaining.carbs) * (category === 'carbs' ? 2 : 1) +
        (macros.fats / remaining.fats);
      
      return score > best.score ? { item, score } : best;
    }, { item: available[0], score: -Infinity }).item;
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

      // Select items based on remaining macros
      const protein = findBestMatch('proteins', remaining, usedProteins);
      const carb = findBestMatch('carbs', remaining, usedCarbs);
      const veg1 = findBestMatch('vegetables', remaining, usedVegetables);
      const veg2 = findBestMatch('vegetables', remaining, [...usedVegetables, veg1.name]);

      // Track used items
      usedProteins.push(protein.name);
      usedCarbs.push(carb.name);
      usedVegetables.push(veg1.name, veg2.name);

      // Manage the history of used items
      if (usedProteins.length > 2) usedProteins.shift();
      if (usedCarbs.length > 2) usedCarbs.shift();
      if (usedVegetables.length > 4) usedVegetables.splice(0, 2);

      // Select cooking methods
      const proteinMethod = protein.methods[Math.floor(Math.random() * protein.methods.length)];
      const carbMethod = carb.methods[Math.floor(Math.random() * carb.methods.length)];
      const veg1Method = veg1.methods[Math.floor(Math.random() * veg1.methods.length)];
      const veg2Method = veg2.methods[Math.floor(Math.random() * veg2.methods.length)];

      // Calculate macros
      const proteinMacros = calculateMacros(protein);
      const carbMacros = calculateMacros(carb);
      const veg1Macros = calculateMacros(veg1);
      const veg2Macros = calculateMacros(veg2);

      // Update running totals
      totalProtein += proteinMacros.protein + carbMacros.protein + veg1Macros.protein + veg2Macros.protein;
      totalCarbs += proteinMacros.carbs + carbMacros.carbs + veg1Macros.carbs + veg2Macros.carbs;
      totalFats += proteinMacros.fats + carbMacros.fats + veg1Macros.fats + veg2Macros.fats;

      const mealMacros: MealMacros = {
        protein: proteinMacros.protein + carbMacros.protein + veg1Macros.protein + veg2Macros.protein,
        carbs: proteinMacros.carbs + carbMacros.carbs + veg1Macros.carbs + veg2Macros.carbs,
        fats: proteinMacros.fats + carbMacros.fats + veg1Macros.fats + veg2Macros.fats,
        calories: proteinMacros.calories + carbMacros.calories + veg1Macros.calories + veg2Macros.calories
      };

      meals.push({
        id: i + 1,
        meal: `Day ${Math.floor(i/2) + 1} - ${i % 2 === 0 ? 'Lunch' : 'Dinner'}`,
        protein: { ...protein, method: proteinMethod },
        carb: { ...carb, method: carbMethod },
        vegetables: [
          { ...veg1, method: veg1Method },
          { ...veg2, method: veg2Method }
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md mb-8 p-6">
        <h2 className="text-2xl font-bold mb-6">Meal Planner</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Cook</label>
            <select 
              value={cook} 
              onChange={(e) => setCook(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="partner1">Partner 1 (Wednesday)</option>
              <option value="partner2">Partner 2 (Sunday)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Daily Protein (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyProtein}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyProtein: parseInt(e.target.value) || 0
                }))}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Daily Carbs (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyCarbs}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyCarbs: parseInt(e.target.value) || 0
                }))}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Daily Fats (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyFats}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyFats: parseInt(e.target.value) || 0
                }))}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Daily Calories (calculated)</label>
              <div className="p-3 bg-gray-100 rounded-md border">
                {calculatedCalories} kcal
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={generateMealPlan}
        className="w-full mb-8 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors"
      >
        Generate Meal Plan
      </button>

      {mealPlan.length > 0 && (
        <div>
          <div className="mb-6">
            <div className="border-b mb-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('meals')}
                  className={`py-3 px-6 mr-4 ${activeTab === 'meals' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Meals
                </button>
                <button
                  onClick={() => setActiveTab('macros')}
                  className={`py-3 px-6 mr-4 ${activeTab === 'macros' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Nutrition
                </button>
                <button
                  onClick={() => setActiveTab('shopping')}
                  className={`py-3 px-6 ${activeTab === 'shopping' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Shopping List
                </button>
              </div>
            </div>

            {activeTab === 'meals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealPlan.map((meal) => (
                  <div key={meal.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font
                    <h3 className="text-lg font-semibold mb-6">{meal.meal}</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Protein</h4>
                        <p>{meal.protein.method} {meal.protein.name} ({meal.protein.serving}g)</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Carbs</h4>
                        <p>{meal.carb.method} {meal.carb.name} ({meal.carb.serving}g)</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Vegetables</h4>
                        {meal.vegetables.map((veg, idx) => (
                          <p key={idx} className="mb-2">{veg.method} {veg.name} ({veg.serving}g)</p>
                        ))}
                      </div>

                      <div className="pt-6 border-t">
                        <h4 className="font-medium mb-3">Nutrition</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>Calories:</div>
                          <div className="text-right">{Math.round(meal.macros.calories)} kcal</div>
                          <div>Protein:</div>
                          <div className="text-right">{Math.round(meal.macros.protein)}g</div>
                          <div>Carbs:</div>
                          <div className="text-right">{Math.round(meal.macros.carbs)}g</div>
                          <div>Fats:</div>
                          <div className="text-right">{Math.round(meal.macros.fats)}g</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'macros' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-6">Daily Average Nutrition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Current</h4>
                    <div className="space-y-3">
                      <p>Calories: {Math.round(dailyAverageMacros.calories)} kcal</p>
                      <p>Protein: {Math.round(dailyAverageMacros.protein)}g</p>
                      <p>Carbs: {Math.round(dailyAverageMacros.carbs)}g</p>
                      <p>Fats: {Math.round(dailyAverageMacros.fats)}g</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Target</h4>
                    <div className="space-y-3">
                      <p>Calories: {calculatedCalories} kcal</p>
                      <p>Protein: {macroTargets.dailyProtein}g</p>
                      <p>Carbs: {macroTargets.dailyCarbs}g</p>
                      <p>Fats: {macroTargets.dailyFats}g</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shopping' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-6">Shopping List</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shoppingList.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600">
                        {Math.round(item.total)}{item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}