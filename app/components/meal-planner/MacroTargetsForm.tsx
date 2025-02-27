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
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cook Information</h3>
        <div>
          <label htmlFor="cook-select" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Select Cook
          </label>
          <select 
            id="cook-select"
            value={cook} 
            onChange={(e) => setCook(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
          >
            <option value="partner1">Partner 1 (Wednesday)</option>
            <option value="partner2">Partner 2 (Sunday)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cooking Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="prep-time" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Preparation Time
            </label>
            <select 
              id="prep-time"
              value={cookingPreferences.preparationTime} 
              onChange={(e) => handlePreferenceChange('preparationTime', e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            >
              <option value="quick">Quick (under 15 min)</option>
              <option value="moderate">Moderate (15-30 min)</option>
              <option value="any">Any</option>
            </select>
          </div>

          <div>
            <label htmlFor="complexity" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Complexity
            </label>
            <select 
              id="complexity"
              value={cookingPreferences.complexity} 
              onChange={(e) => handlePreferenceChange('complexity', e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="complex">Complex</option>
              <option value="any">Any</option>
            </select>
          </div>

          <div>
            <label htmlFor="spice-level" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Spice Level
            </label>
            <select 
              id="spice-level"
              value={cookingPreferences.spiceLevel} 
              onChange={(e) => handlePreferenceChange('spiceLevel', e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            >
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="spicy">Spicy</option>
              <option value="any">Any</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Macro Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="protein-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Daily Protein (g)
            </label>
            <input 
              id="protein-input"
              type="number"
              min="0"
              max="500"
              value={macroTargets.dailyProtein}
              onChange={(e) => handleMacroChange('dailyProtein', parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Recommended: 0.8-1.6g per pound of bodyweight
            </div>
          </div>

          <div>
            <label htmlFor="carbs-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Daily Carbs (g)
            </label>
            <input 
              id="carbs-input"
              type="number"
              min="0"
              max="500"
              value={macroTargets.dailyCarbs}
              onChange={(e) => handleMacroChange('dailyCarbs', parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Recommended: 2-3g per pound of bodyweight for active individuals
            </div>
          </div>

          <div>
            <label htmlFor="fats-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Daily Fats (g)
            </label>
            <input 
              id="fats-input"
              type="number"
              min="0"
              max="200"
              value={macroTargets.dailyFats}
              onChange={(e) => handleMacroChange('dailyFats', parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Recommended: 0.3-0.5g per pound of bodyweight
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Daily Calories (calculated)
            </label>
            <div className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm dark:text-white font-medium">
              {calculatedCalories} kcal
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Based on protein (4 cal/g), carbs (4 cal/g), and fats (9 cal/g)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}