// src/components/meal-planner/MealPlanner.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  generateMealPlan, 
  generateShoppingList,
  exportToPDF,
  calculateCalories 
} from './mealPlannerUtils';
import { FOOD_DATABASE } from './foodDatabase';
import { MacroTargetsForm } from './MacroTargetsForm';
import { MealPlanView } from './MealPlanView';
import { NutritionView } from './NutritionView';
import { ShoppingListView } from './ShoppingListView';
import { TabNavigation } from '../ui/TabNavigation';

import type { 
  MacroTargets, 
  Meal, 
  ShoppingListItem, 
  CookingPreferences,
  DailyMealPlan
} from './types';

export function MealPlanner() {
  // State management
  const [cook, setCook] = useState<string>('Kristian');
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
  const [dailyMealPlans, setDailyMealPlans] = useState<DailyMealPlan[]>([]);
  const [activeTab, setActiveTab] = useState('meals');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Calculate calories based on macro targets
  const calculatedCalories = useMemo(() => 
    calculateCalories(macroTargets.dailyProtein, macroTargets.dailyCarbs, macroTargets.dailyFats),
    [macroTargets]
  );

  // Get all meals for compatibility with existing components
  const allMeals = useMemo(() => {
    return dailyMealPlans.flatMap(day => day.meals);
  }, [dailyMealPlans]);

  // Handle meal plan generation
  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    
    try {
      // Call the async generateMealPlan function
      const mealPlans = await generateMealPlan(FOOD_DATABASE, macroTargets, cookingPreferences);
      setDailyMealPlans(mealPlans);
      
      // Generate shopping list from the meals
      const list = generateShoppingList(mealPlans);
      setShoppingList(list);
      
      // Set active tab to 'meals' to show the results
      setActiveTab('meals');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // In a real app, you'd want to show an error message to the user
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle exporting the meal plan
  const handleExport = () => {
    exportToPDF(dailyMealPlans, shoppingList, macroTargets, exportFormat as any);
    setExportModalOpen(false);
  };

  // Modal for export options
  const ExportModal = () => {
    if (!exportModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Export Options</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                    exportFormat === 'pdf' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </span>
                  PDF
                </button>
                <button
                  onClick={() => setExportFormat('print')}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                    exportFormat === 'print' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                  </span>
                  Print
                </button>
                <button
                  onClick={() => setExportFormat('json')}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                    exportFormat === 'json' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </span>
                  JSON
                </button>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
              >
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle dark mode toggle
  useEffect(() => {
    // Check if dark mode is preferred
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    
    // Apply dark mode class to document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Handle system preference changes
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleColorSchemeChange);
      
    return () => {
      mediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);
  
  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200 min-h-screen p-4 md:p-8">
        {/* Export Modal */}
        <ExportModal />
        
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Meal Planner</h2>
                <button 
                  onClick={() => {
                    const newDarkMode = !darkMode;
                    setDarkMode(newDarkMode);
                    if (newDarkMode) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }}
                  aria-label="Toggle dark mode"
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    {darkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                      </svg>
                    )}
                </button>
              </div>
              <p className="text-blue-100 mt-1">Customize your nutrition plan based on your fitness goals</p>
            </div>
            
            <div className="p-6 md:p-8">
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
          </div>

          {/* Generate Button */}
          <button 
            onClick={handleGenerateMealPlan}
            disabled={isGenerating}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] duration-200"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Meal Plan...</span>
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Generate Meal Plan
              </>
            )}
          </button>

          {dailyMealPlans.length > 0 && (
            <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tab Navigation */}
                <TabNavigation 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  tabs={[
                    { id: 'meals', label: 'Meals' },
                    { id: 'nutrition', label: 'Nutrition' },
                    { id: 'shopping', label: 'Shopping List' }
                  ]} 
                />
                
                {/* Export Button */}
                <button
                  onClick={() => setExportModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm self-start md:self-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Plan
                </button>
              </div>

              <div className="mt-6">
                {activeTab === 'meals' && <MealPlanView mealPlan={allMeals} />}
                {activeTab === 'nutrition' && <NutritionView 
                  dailyMealPlans={dailyMealPlans}
                  macroTargets={macroTargets} 
                  calculatedCalories={calculatedCalories} 
                />}
                {activeTab === 'shopping' && <ShoppingListView shoppingList={shoppingList} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}