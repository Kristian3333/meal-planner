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

  const selectRandomItem = (
    items: readonly FoodItem[],
    used: string[] = [],
    count: number = 1
  ): FoodItem | FoodItem[] => {
    const available = items.filter(item => !used.includes(item.name));
    
    if (count === 1) {
      return available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : items[Math.floor(Math.random() * items.length)];
    }
    
    const selected: FoodItem[] = [];
    for (let i = 0; i < count; i++) {
      const item = selectRandomItem(
        items,
        [...used, ...selected.map(s => s.name)],
        1
      ) as FoodItem;
      selected.push(item);
    }
    return selected;
  };

  const generateMealPlan = () => {
    const meals: Meal[] = [];
    const usedProteins: string[] = [];
    const usedCarbs: string[] = [];
    const usedVegetables: string[] = [];

    for (let i = 0; i < 6; i++) {
      const protein = selectRandomItem(FOODS.proteins, usedProteins, 1) as FoodItem;
      const carb = selectRandomItem(FOODS.carbs, usedCarbs, 1) as FoodItem;
      const vegetables = selectRandomItem(FOODS.vegetables, usedVegetables, 2) as FoodItem[];
      
      usedProteins.push(protein.name);
      usedCarbs.push(carb.name);
      vegetables.forEach(v => usedVegetables.push(v.name));

      if (usedProteins.length > 2) usedProteins.shift();
      if (usedCarbs.length > 2) usedCarbs.shift();
      if (usedVegetables.length > 4) usedVegetables.splice(0, 2);

      const proteinMethod = protein.methods[Math.floor(Math.random() * protein.methods.length)];
      const carbMethod = carb.methods[Math.floor(Math.random() * carb.methods.length)];
      const vegMethods = vegetables.map(v => v.methods[Math.floor(Math.random() * v.methods.length)]);

      const proteinMacros = calculateMacros(protein);
      const carbMacros = calculateMacros(carb);
      const vegMacros = vegetables.map(v => calculateMacros(v));

      const mealMacros: MealMacros = {
        protein: proteinMacros.protein + carbMacros.protein + vegMacros.reduce((sum, m) => sum + m.protein, 0),
        carbs: proteinMacros.carbs + carbMacros.carbs + vegMacros.reduce((sum, m) => sum + m.carbs, 0),
        fats: proteinMacros.fats + carbMacros.fats + vegMacros.reduce((sum, m) => sum + m.fats, 0),
        calories: proteinMacros.calories + carbMacros.calories + vegMacros.reduce((sum, m) => sum + m.calories, 0)
      };

      meals.push({
        id: i + 1,
        meal: `Day ${Math.floor(i/2) + 1} - ${i % 2 === 0 ? 'Lunch' : 'Dinner'}`,
        protein: { ...protein, method: proteinMethod },
        carb: { ...carb, method: carbMethod },
        vegetables: vegetables.map((v, idx) => ({ ...v, method: vegMethods[idx] })),
        macros: mealMacros
      });
    }

    setMealPlan(meals);
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
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md mb-6 p-6">
        <h2 className="text-2xl font-bold mb-4">Meal Planner</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Select Cook</label>
            <select 
              value={cook} 
              onChange={(e) => setCook(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="partner1">Partner 1 (Wednesday)</option>
              <option value="partner2">Partner 2 (Sunday)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Daily Protein (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyProtein}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyProtein: parseInt(e.target.value) || 0
                }))}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Daily Carbs (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyCarbs}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyCarbs: parseInt(e.target.value) || 0
                }))}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Daily Fats (g)</label>
              <input 
                type="number"
                value={macroTargets.dailyFats}
                onChange={(e) => setMacroTargets(prev => ({
                  ...prev,
                  dailyFats: parseInt(e.target.value) || 0
                }))}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Daily Calories (calculated)</label>
              <div className="p-2 bg-gray-100 rounded-md border">
                {calculatedCalories} kcal
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={generateMealPlan}
        className="w-full mb-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Generate Meal Plan
      </button>

      {mealPlan.length > 0 && (
        <div>
          <div className="mb-4">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('meals')}
                  className={`py-2 px-4 ${activeTab === 'meals' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Meals
                </button>
                <button
                  onClick={() => setActiveTab('macros')}
                  className={`py-2 px-4 ${activeTab === 'macros' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Nutrition
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'meals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mealPlan.map((meal) => (
                <div key={meal.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4">{meal.meal}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Protein</h4>
                      <p>{meal.protein.method} {meal.protein.name} ({meal.protein.serving}g)</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Carbs</h4>
                      <p>{meal.carb.method} {meal.carb.name} ({meal.carb.serving}g)</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Vegetables</h4>
                      {meal.vegetables.map((veg, idx) => (
                        <p key={idx}>{veg.method} {veg.name} ({veg.serving}g)</p>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Nutrition</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
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
              <h3 className="text-xl font-semibold mb-4">Daily Average Nutrition</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Current</h4>
                  <div className="space-y-1">
                    <p>Calories: {Math.round(dailyAverageMacros.calories)} kcal</p>
                    <p>Protein: {Math.round(dailyAverageMacros.protein)}g</p>
                    <p>Carbs: {Math.round(dailyAverageMacros.carbs)}g</p>
                    <p>Fats: {Math.round(dailyAverageMacros.fats)}g</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Target</h4>
                  <div className="space-y-1">
                    <p>Calories: {calculatedCalories} kcal</p>
                    <p>Protein: {macroTargets.dailyProtein}g</p>
                    <p>Carbs: {macroTargets.dailyCarbs}g</p>
                    <p>Fats: {macroTargets.dailyFats}g</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}