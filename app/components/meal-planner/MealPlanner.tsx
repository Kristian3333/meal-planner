// src/components/meal-planner/MealPlanner.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  generateMealPlan, 
  generateShoppingList,
  exportToPDF,
  calculateMacros,
  calculateCalories 
} from './mealPlannerUtils';
import { FOOD_DATABASE } from './foodDatabase';
import { MacroTargetsForm } from './MacroTargetsForm';
import { MealPlanView } from './MealPlanView';
import { NutritionView } from './NutritionView';
import { ShoppingListView } from './ShoppingListView';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { TabNavigation } from '../ui/TabNavigation';

import type { 
  FoodItem, 
  MacroTargets, 
  Meal, 
  ShoppingListItem, 
  CookingPreferences
} from './types';

export function MealPlanner() {
  // State management
  const [cook, setCook] = useState<string>('partner1');
  const [cookingPreferences, setCookingPreferences] = useState<CookingPreferences>({
    preparationTime: 'any',
    complexity: 'any',
    spiceLevel: 'medium'
  });
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFats: 60
  });
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [activeTab, setActiveTab] = useState('meals');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Calculate calories based on macro targets
  const calculatedCalories = useMemo(() => 
    calculateCalories(macroTargets.dailyProtein, macroTargets.dailyCarbs, macroTargets.dailyFats),
    [macroTargets]
  );

  // Calculate total and daily average macros from meal plan
  const { totalMacros, dailyAverageMacros } = useMemo(() => {
    const initialState = { protein: 0, carbs: 0, fats: 0, calories: 0 };
    
    const total = mealPlan.reduce((acc, meal) => ({
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fats: acc.fats + meal.macros.fats,
      calories: acc.calories + meal.macros.calories
    }), {...initialState});

    return {
      totalMacros: total,
      dailyAverageMacros: {
        protein: total.protein / 3,
        carbs: total.carbs / 3,
        fats: total.fats / 3,
        calories: total.calories / 3
      }
    };
  }, [mealPlan]);

  // Handle meal plan generation
  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    
    // Using setTimeout to allow the UI to update and show loading state
    setTimeout(() => {
      try {
        const meals = generateMealPlan(FOOD_DATABASE, macroTargets, cookingPreferences);
        setMealPlan(meals);
        const list = generateShoppingList(meals);
        setShoppingList(list);
        setActiveTab('meals');
      } catch (error) {
        console.error('Error generating meal plan:', error);
        // In a real app, you'd want to show an error message to the user
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  // Handle exporting the meal plan
  const handleExport = () => {
    exportToPDF(mealPlan, shoppingList, macroTargets);
  };

  // Handle dark mode toggle
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleColorSchemeChange);
      
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Meal Planner</h2>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
            
            {/* Macro Targets Form Component */}
            <MacroTargetsForm 
              cook={cook}
              setCook={setCook}
              macroTargets={macroTargets}
              setMacroTargets={setMacroTargets}
              cookingPreferences={cookingPreferences}
              setCookingPreferences={setCookingPreferences}
              calculatedCalories={calculatedCalories}
            />
          </div>

          <button 
            onClick={handleGenerateMealPlan}
            disabled={isGenerating}
            className="w-full py-4 px-8 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Generating Meal Plan...</span>
              </>
            ) : 'Generate Meal Plan'}
          </button>

          {mealPlan.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <TabNavigation 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  tabs={[
                    { id: 'meals', label: 'Meals' },
                    { id: 'nutrition', label: 'Nutrition' },
                    { id: 'shopping', label: 'Shopping List' }
                  ]} 
                />
                
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Plan
                </button>
              </div>

              {activeTab === 'meals' && <MealPlanView mealPlan={mealPlan} />}
              {activeTab === 'nutrition' && <NutritionView dailyAverageMacros={dailyAverageMacros} macroTargets={macroTargets} calculatedCalories={calculatedCalories} />}
              {activeTab === 'shopping' && <ShoppingListView shoppingList={shoppingList} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}