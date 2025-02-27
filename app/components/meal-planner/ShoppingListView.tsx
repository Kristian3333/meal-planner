// src/components/meal-planner/ShoppingListView.tsx
import React, { useState } from 'react';
import type { ShoppingListItem } from './types';

interface ShoppingListViewProps {
  shoppingList: ShoppingListItem[];
}

export function ShoppingListView({ shoppingList }: ShoppingListViewProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle checking/unchecking of shopping list items
  const toggleItemCheck = (itemId: string) => {
    setCheckedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Filter shopping list items based on search query
  const filteredItems = shoppingList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group items by category for better organization
  const categorizedItems = {
    proteins: filteredItems.filter(item => item.name.includes('Chicken') || 
      item.name.includes('Beef') || item.name.includes('Tofu') || 
      item.name.includes('Salmon') || item.name.includes('Pork') || 
      item.name.includes('Tempeh') || item.name.includes('Chickpeas')),
    carbs: filteredItems.filter(item => item.name.includes('Rice') || 
      item.name.includes('Quinoa') || item.name.includes('Pasta') || 
      item.name.includes('Potato') || item.name.includes('Oats') || 
      item.name.includes('Barley')),
    vegetables: filteredItems.filter(item => !item.name.includes('Chicken') && 
      !item.name.includes('Beef') && !item.name.includes('Tofu') && 
      !item.name.includes('Salmon') && !item.name.includes('Pork') && 
      !item.name.includes('Tempeh') && !item.name.includes('Chickpeas') && 
      !item.name.includes('Rice') && !item.name.includes('Quinoa') && 
      !item.name.includes('Pasta') && !item.name.includes('Potato') && 
      !item.name.includes('Oats') && !item.name.includes('Barley'))
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Shopping List
        </h3>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search shopping list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {checkedItems.length} of {filteredItems.length} items checked
          </div>
          {checkedItems.length > 0 && (
            <button
              onClick={() => setCheckedItems([])}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Shopping List Categories */}
        <div className="space-y-6">
          {/* Proteins Section */}
          {categorizedItems.proteins.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                Proteins
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categorizedItems.proteins.map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      checkedItems.includes(item.id)
                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item.id)}
                      onChange={() => toggleItemCheck(item.id)}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label 
                      className={`ml-2 flex-1 text-sm font-medium ${
                        checkedItems.includes(item.id)
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {item.name}
                    </label>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {Math.round(item.total)}{item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carbs Section */}
          {categorizedItems.carbs.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
                Carbs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categorizedItems.carbs.map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      checkedItems.includes(item.id)
                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item.id)}
                      onChange={() => toggleItemCheck(item.id)}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label 
                      className={`ml-2 flex-1 text-sm font-medium ${
                        checkedItems.includes(item.id)
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {item.name}
                    </label>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {Math.round(item.total)}{item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vegetables Section */}
          {categorizedItems.vegetables.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                Vegetables
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categorizedItems.vegetables.map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      checkedItems.includes(item.id)
                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item.id)}
                      onChange={() => toggleItemCheck(item.id)}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label 
                      className={`ml-2 flex-1 text-sm font-medium ${
                        checkedItems.includes(item.id)
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {item.name}
                    </label>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {Math.round(item.total)}{item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results found */}
          {filteredItems.length === 0 && (
            <div className="py-10 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No items found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
