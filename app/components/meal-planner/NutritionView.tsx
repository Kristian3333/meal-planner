// src/components/meal-planner/NutritionView.tsx
import React from 'react';
import type { MacroTargets, MealMacros } from './types';

interface NutritionViewProps {
  dailyAverageMacros: MealMacros;
  macroTargets: MacroTargets;
  calculatedCalories: number;
}

export function NutritionView({ 
  dailyAverageMacros, 
  macroTargets, 
  calculatedCalories 
}: NutritionViewProps) {
  // Calculate macro percentages for progress bars
  const calculatePercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const proteinPercentage = calculatePercentage(
    Math.round(dailyAverageMacros.protein),
    macroTargets.dailyProtein
  );
  
  const carbsPercentage = calculatePercentage(
    Math.round(dailyAverageMacros.carbs),
    macroTargets.dailyCarbs
  );
  
  const fatsPercentage = calculatePercentage(
    Math.round(dailyAverageMacros.fats),
    macroTargets.dailyFats
  );
  
  const caloriesPercentage = calculatePercentage(
    Math.round(dailyAverageMacros.calories),
    calculatedCalories
  );

  // Calculate macronutrient distribution (in percentages)
  const totalCalories = dailyAverageMacros.calories;
  const proteinCalories = dailyAverageMacros.protein * 4;
  const carbCalories = dailyAverageMacros.carbs * 4;
  const fatCalories = dailyAverageMacros.fats * 9;
  
  const proteinPct = Math.round((proteinCalories / totalCalories) * 100) || 0;
  const carbsPct = Math.round((carbCalories / totalCalories) * 100) || 0;
  const fatsPct = Math.round((fatCalories / totalCalories) * 100) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Daily Nutrition Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Macro Targets vs Actual */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Target vs Actual
          </h4>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calories</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(dailyAverageMacros.calories)} / {calculatedCalories} kcal
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${caloriesPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Protein</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(dailyAverageMacros.protein)} / {macroTargets.dailyProtein} g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{ width: `${proteinPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carbs</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(dailyAverageMacros.carbs)} / {macroTargets.dailyCarbs} g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full"
                  style={{ width: `${carbsPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fats</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(dailyAverageMacros.fats)} / {macroTargets.dailyFats} g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${fatsPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Macronutrient Distribution */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Macronutrient Distribution
          </h4>

          <div className="flex items-center justify-center h-64">
            <div className="relative w-60 h-60">
              {/* SVG Circle Chart */}
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  className="fill-red-500"
                  d={`M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831`}
                  strokeWidth="0"
                  stroke="none"
                  strokeDasharray={`${proteinPct}, 100`}
                  strokeDashoffset="25"
                />
                <path
                  className="fill-yellow-500"
                  d={`M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831`}
                  strokeWidth="0"
                  stroke="none"
                  strokeDasharray={`${carbsPct}, 100`}
                  strokeDashoffset={`${25 - proteinPct}`}
                />
                <path
                  className="fill-green-500"
                  d={`M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831`}
                  strokeWidth="0"
                  stroke="none"
                  strokeDasharray={`${fatsPct}, 100`}
                  strokeDashoffset={`${25 - proteinPct - carbsPct}`}
                />
                <circle className="fill-white dark:fill-gray-800" cx="18" cy="18" r="12" />
                <text x="18" y="18" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800 dark:fill-white">
                  {Math.round(dailyAverageMacros.calories)}
                </text>
                <text x="18" y="23" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-600 dark:fill-gray-300">
                  kcal
                </text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Protein: {proteinPct}%
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Carbs: {carbsPct}%
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Fats: {fatsPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Nutrition Tips
        </h4>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Protein helps with muscle recovery and growth</li>
            <li>Complex carbs provide sustained energy for workouts</li>
            <li>Healthy fats support hormone production and joint health</li>
            <li>Stay hydrated by drinking at least 8 glasses of water daily</li>
            <li>Distribute protein intake evenly throughout the day for optimal absorption</li>
          </ul>
        </div>
      </div>
    </div>
  );
}