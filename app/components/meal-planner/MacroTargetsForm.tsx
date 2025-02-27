// src/components/meal-planner/MacroTargetsForm.tsx
import React from 'react';
import type { MacroTargets, CookingPreferences } from './types';

interface MacroTargetsFormProps {
  cook: string;
  setCook: (cook: string) => void;
  macroTargets: MacroTargets;
  setMacroTargets: (targets: MacroTargets) => void;
  cookingPreferences: CookingPreferences;
  setCookingPreferences: (preferences: CookingPreferences) => void;
  calculatedCalories: number;
}

export function MacroTargetsForm({
  cook,
  setCook,
  macroTargets,
  setMacroTargets,
  cookingPreferences,
  setCookingPreferences,
  calculatedCalories
}: MacroTargetsFormProps) {
  // Handle input changes for macro targets
  const handleMacroChange = (key: keyof MacroTargets, value: number) => {
    setMacroTargets({
      ...macroTargets,
      [key]: value
    });
  };

  // Handle changes for cooking preferences
  const handlePreferenceChange = (key: keyof CookingPreferences, value: string) => {
    setCookingPreferences({
      ...cookingPreferences,
      [key]: value
    });
  };

  return (
    <div className="space-y-10">
      {/* Cook Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Cook Information
        </h3>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
          <label htmlFor="cook-select" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Select Cook
          </label>
          <div className="relative">
            <select 
              id="cook-select"
              value={cook} 
              onChange={(e) => setCook(e.target.value)}
              className="w-full p-3 pr-10 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors appearance-none"
            >
              <option value="Kristian">Kristian (Wednesday)</option>
              <option value="Marthe">Marthe (Sunday)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cooking Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Cooking Preferences
        </h3>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="prep-time" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Preparation Time
              </label>
              <div className="relative">
                <select 
                  id="prep-time"
                  value={cookingPreferences.preparationTime} 
                  onChange={(e) => handlePreferenceChange('preparationTime', e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-colors appearance-none"
                >
                  <option value="quick">Quick (under 15 min)</option>
                  <option value="moderate">Moderate (15-30 min)</option>
                  <option value="any">Any</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="complexity" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Complexity
              </label>
              <div className="relative">
                <select 
                  id="complexity"
                  value={cookingPreferences.complexity} 
                  onChange={(e) => handlePreferenceChange('complexity', e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-colors appearance-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                  <option value="any">Any</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="spice-level" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Spice Level
              </label>
              <div className="relative">
                <select 
                  id="spice-level"
                  value={cookingPreferences.spiceLevel} 
                  onChange={(e) => handlePreferenceChange('spiceLevel', e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-colors appearance-none"
                >
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="spicy">Spicy</option>
                  <option value="any">Any</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Targets Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Macro Targets
        </h3>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="protein-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Daily Protein (g)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">g</span>
                </div>
                <input 
                  id="protein-input"
                  type="number"
                  min="0"
                  max="500"
                  value={macroTargets.dailyProtein}
                  onChange={(e) => handleMacroChange('dailyProtein', parseInt(e.target.value) || 0)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white transition-colors"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">protein</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Recommended: 0.8-1.6g per pound of bodyweight
              </div>
            </div>

            <div>
              <label htmlFor="carbs-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Daily Carbs (g)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">g</span>
                </div>
                <input 
                  id="carbs-input"
                  type="number"
                  min="0"
                  max="500"
                  value={macroTargets.dailyCarbs}
                  onChange={(e) => handleMacroChange('dailyCarbs', parseInt(e.target.value) || 0)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white transition-colors"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">carbs</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Recommended: 2-3g per pound of bodyweight for active individuals
              </div>
            </div>

            <div>
              <label htmlFor="fats-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Daily Fats (g)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">g</span>
                </div>
                <input 
                  id="fats-input"
                  type="number"
                  min="0"
                  max="200"
                  value={macroTargets.dailyFats}
                  onChange={(e) => handleMacroChange('dailyFats', parseInt(e.target.value) || 0)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white transition-colors"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">fats</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Recommended: 0.3-0.5g per pound of bodyweight
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Daily Calories (calculated)
              </label>
              <div className="flex items-center">
                <div className="relative rounded-md shadow-sm w-full">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm dark:text-white font-medium text-center">
                    {calculatedCalories} kcal
                  </div>
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Based on protein (4 cal/g), carbs (4 cal/g), and fats (9 cal/g)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}