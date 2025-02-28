// src/components/meal-planner/NutritionView.tsx
import React, { useState } from 'react';
import type { MacroTargets, MealMacros, DailyMealPlan } from './types';

interface NutritionViewProps {
  dailyMealPlans: DailyMealPlan[];
  macroTargets: MacroTargets;
  calculatedCalories: number;
}

export function NutritionView({ 
  dailyMealPlans, 
  macroTargets, 
  calculatedCalories 
}: NutritionViewProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  
  // Find the selected day
  const currentDay = dailyMealPlans.find(d => d.day === selectedDay) || dailyMealPlans[0];
  
  // If no days are available, show a message
  if (!currentDay) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No meal plan data available.</p>
      </div>
    );
  }
  
  // Calculate macro percentages for progress bars
  const calculatePercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const proteinPercentage = calculatePercentage(
    Math.round(currentDay.totalMacros.protein),
    macroTargets.dailyProtein
  );
  
  const carbsPercentage = calculatePercentage(
    Math.round(currentDay.totalMacros.carbs),
    macroTargets.dailyCarbs
  );
  
  const fatsPercentage = calculatePercentage(
    Math.round(currentDay.totalMacros.fats),
    macroTargets.dailyFats
  );
  
  const caloriesPercentage = calculatePercentage(
    Math.round(currentDay.totalMacros.calories),
    calculatedCalories
  );

  // Calculate macronutrient distribution (in percentages)
  const totalCalories = currentDay.totalMacros.calories;
  const proteinCalories = currentDay.totalMacros.protein * 4;
  const carbCalories = currentDay.totalMacros.carbs * 4;
  const fatCalories = currentDay.totalMacros.fats * 9;
  
  const proteinPct = Math.round((proteinCalories / totalCalories) * 100) || 0;
  const carbsPct = Math.round((carbCalories / totalCalories) * 100) || 0;
  const fatsPct = Math.round((fatCalories / totalCalories) * 100) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Nutrition Analysis
        </h3>
        
        {/* Day selector */}
        <div className="flex space-x-2">
          {dailyMealPlans.map(day => (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === day.day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Day {day.day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Macro Targets vs Actual */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Target vs Actual for Day {selectedDay}
          </h4>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calories</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(currentDay.totalMacros.calories)} / {calculatedCalories} kcal
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
                  {Math.round(currentDay.totalMacros.protein)} / {macroTargets.dailyProtein} g
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
                  {Math.round(currentDay.totalMacros.carbs)} / {macroTargets.dailyCarbs} g
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
                  {Math.round(currentDay.totalMacros.fats)} / {macroTargets.dailyFats} g
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
          
          {/* Meal breakdown for the day */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Meal Breakdown
            </h4>
            
            <div className="space-y-4">
              {currentDay.meals.map(meal => (
                <div 
                  key={meal.id} 
                  className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">{meal.meal.split(' - ')[1]}</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(meal.macros.calories)} kcal</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-red-600 dark:text-red-400 font-medium">Protein:</span> {Math.round(meal.macros.protein)}g
                    </div>
                    <div>
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Carbs:</span> {Math.round(meal.macros.carbs)}g
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-medium">Fats:</span> {Math.round(meal.macros.fats)}g
                    </div>
                  </div>
                </div>
              ))}
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
                {/* Protein segment */}
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
                {/* Carbs segment */}
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
                {/* Fats segment */}
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
                {/* Center circle with calories */}
                <circle className="fill-white dark:fill-gray-800" cx="18" cy="18" r="12" />
                <text x="18" y="17" textAnchor="middle" dominantBaseline="middle" 
                      className="text-2xl font-bold fill-gray-800 dark:fill-white">
                  {Math.round(currentDay.totalMacros.calories)}
                </text>
                <text x="18" y="22" textAnchor="middle" dominantBaseline="middle" 
                      className="text-xs fill-gray-600 dark:fill-gray-300">
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
      </div>
    </div>
  );
}