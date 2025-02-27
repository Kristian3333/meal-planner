// src/components/meal-planner/MealPlanView.tsx
import React, { useState } from 'react';
import type { Meal, MealComponent } from './types';

interface MealPlanViewProps {
  mealPlan: Meal[];
}

export function MealPlanView({ mealPlan }: MealPlanViewProps) {
  const [expandedMeals, setExpandedMeals] = useState<number[]>([]);

  // Toggle meal expansion for recipe viewing
  const toggleMealExpansion = (mealId: number) => {
    setExpandedMeals(prev => 
      prev.includes(mealId)
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  // Renders a meal component (protein, carb, or vegetable) with recipe details
  const renderMealComponent = (component: MealComponent, type: string) => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-800 dark:text-white text-base">
        {type}
      </h4>
      <div className="flex items-center">
        <div className="w-8 h-8 flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-700 dark:text-blue-300 text-lg">
            {type.charAt(0)}
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          {component.method} {component.name} ({component.serving}g)
        </p>
      </div>
      
      {component.recipeSteps.length > 0 && (
        <div className="ml-11 mt-2">
          <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-700 p-4 rounded">
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Recipe Steps</h5>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
              {component.recipeSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mealPlan.map((meal) => (
        <div 
          key={meal.id} 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {meal.meal}
              </h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                  {meal.totalCookingTime} min
                </span>
                <button
                  onClick={() => toggleMealExpansion(meal.id)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={expandedMeals.includes(meal.id) ? "Hide recipe details" : "Show recipe details"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                      expandedMeals.includes(meal.id) ? 'transform rotate-180' : ''
                    }`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {/* Meal Components */}
            <div className="space-y-6">
              {renderMealComponent(meal.protein, 'Protein')}
              {renderMealComponent(meal.carb, 'Carbs')}
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 dark:text-white text-base">
                  Vegetables
                </h4>
                {meal.vegetables.map((veg, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-700 dark:text-green-300 text-lg">
                          V{idx + 1}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {veg.method} {veg.name} ({veg.serving}g)
                      </p>
                    </div>
                    
                    {expandedMeals.includes(meal.id) && veg.recipeSteps.length > 0 && (
                      <div className="ml-11 mt-2">
                        <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-green-500 dark:border-green-700 p-4 rounded">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{veg.name} Recipe</h5>
                          <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                            {veg.recipeSteps.map((step, stepIdx) => (
                              <li key={stepIdx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nutritional Information */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Nutrition</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
                  <div className="text-blue-700 dark:text-blue-300 font-semibold">Calories</div>
                  <div className="font-medium text-gray-800 dark:text-white mt-1">
                    {Math.round(meal.macros.calories)} kcal
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center">
                  <div className="text-red-700 dark:text-red-300 font-semibold">Protein</div>
                  <div className="font-medium text-gray-800 dark:text-white mt-1">
                    {Math.round(meal.macros.protein)}g
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg text-center">
                  <div className="text-yellow-700 dark:text-yellow-300 font-semibold">Carbs</div>
                  <div className="font-medium text-gray-800 dark:text-white mt-1">
                    {Math.round(meal.macros.carbs)}g
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                  <div className="text-green-700 dark:text-green-300 font-semibold">Fats</div>
                  <div className="font-medium text-gray-800 dark:text-white mt-1">
                    {Math.round(meal.macros.fats)}g
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}