import { FoodItem } from './types';

interface FoodDatabase {
  proteins: FoodItem[];
  carbs: FoodItem[];
  vegetables: FoodItem[];
}

export const FOOD_DATABASE: FoodDatabase = {
  proteins: [
    {
      id: 'chicken-breast',
      name: 'Chicken Breast',
      serving: 180,
      per100g: { 
        protein: 31, 
        fat: 3.6, 
        carbs: 0, 
        calories: 165,
        fiber: 0,
        sugar: 0
      },
      methods: ['Grilled', 'Pan-fried', 'Baked', 'Poached'],
      cookingTime: 20,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'protein',
      recipeSteps: [
        'Season chicken breast with salt and pepper',
        'Heat pan over medium-high heat with a small amount of oil',
        'Cook chicken for 6-7 minutes on each side until golden brown and internal temperature reaches 165°F',
        'Let rest for 5 minutes before serving'
      ],
      allergens: [],
      tags: ['high-protein', 'low-carb']
    },
    {
      id: 'salmon-fillet',
      name: 'Salmon Fillet',
      serving: 180,
      per100g: { 
        protein: 20, 
        fat: 13, 
        carbs: 0, 
        calories: 208,
        fiber: 0,
        sugar: 0
      },
      methods: ['Baked', 'Pan-seared', 'Grilled'],
      cookingTime: 15,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'protein',
      recipeSteps: [
        'Season salmon with salt, pepper and lemon juice',
        'Heat oven to 400°F or preheat grill',
        'Bake for 12-15 minutes or grill for 4-5 minutes per side',
        'Salmon is done when it flakes easily with a fork'
      ],
      allergens: ['fish'],
      tags: ['omega-3', 'healthy-fats']
    },
    {
      id: 'tofu-firm',
      name: 'Firm Tofu',
      serving: 150,
      per100g: { 
        protein: 14, 
        fat: 4, 
        carbs: 2, 
        calories: 144,
        fiber: 1.2,
        sugar: 0.5
      },
      methods: ['Stir-fried', 'Baked', 'Grilled'],
      cookingTime: 15,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'protein',
      recipeSteps: [
        'Press tofu between paper towels to remove excess moisture',
        'Cut into 1-inch cubes',
        'Toss with cornstarch, salt, and your choice of spices',
        'Bake at 400°F for 25 minutes or stir-fry until golden'
      ],
      allergens: ['soy'],
      tags: ['vegetarian', 'vegan', 'plant-based']
    }
  ],
  carbs: [
    {
      id: 'brown-rice',
      name: 'Brown Rice',
      serving: 125,
      per100g: { 
        protein: 2.6, 
        fat: 0.9, 
        carbs: 23, 
        calories: 110,
        fiber: 1.8,
        sugar: 0.4
      },
      methods: ['Boiled', 'Steamed'],
      cookingTime: 30,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Rinse brown rice under cold water',
        'Add 1 part rice to 2 parts water in a pot',
        'Bring to a boil, then reduce heat and simmer covered for 30 minutes',
        'Remove from heat and let stand for 10 minutes before fluffing with a fork'
      ],
      allergens: [],
      tags: ['whole-grain', 'high-fiber']
    },
    {
      id: 'quinoa',
      name: 'Quinoa',
      serving: 125,
      per100g: { 
        protein: 4.4, 
        fat: 1.9, 
        carbs: 21, 
        calories: 120,
        fiber: 2.8,
        sugar: 0.9
      },
      methods: ['Boiled'],
      cookingTime: 20,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Rinse quinoa thoroughly to remove bitter coating',
        'Combine 1 part quinoa with 2 parts water in a pot',
        'Bring to a boil, then reduce heat and simmer covered for 15 minutes',
        'Remove from heat and let stand for 5 minutes before fluffing with a fork'
      ],
      allergens: [],
      tags: ['gluten-free', 'complete-protein', 'high-fiber']
    },
    {
      id: 'sweet-potato',
      name: 'Sweet Potato',
      serving: 150,
      per100g: { 
        protein: 1.6, 
        fat: 0.1, 
        carbs: 20, 
        calories: 86,
        fiber: 3,
        sugar: 4.2
      },
      methods: ['Baked', 'Roasted', 'Boiled'],
      cookingTime: 40,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Preheat oven to 400°F',
        'Wash and scrub sweet potatoes, poke several times with a fork',
        'Place directly on oven rack or on a baking sheet',
        'Bake for 45-60 minutes until soft and caramelized'
      ],
      allergens: [],
      tags: ['complex-carbs', 'vitamin-a', 'high-fiber']
    }
  ],
  vegetables: [
    {
      id: 'broccoli',
      name: 'Broccoli',
      serving: 150,
      per100g: { 
        protein: 2.8, 
        fat: 0.4, 
        carbs: 7, 
        calories: 34,
        fiber: 2.6,
        sugar: 1.7
      },
      methods: ['Steamed', 'Roasted', 'Stir-fried'],
      cookingTime: 8,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Cut broccoli into florets of similar size',
        'For steaming: Place in a steamer over boiling water for 5-6 minutes until bright green and tender-crisp',
        'For roasting: Toss with olive oil, salt and pepper, roast at 425°F for 15-20 minutes'
      ],
      allergens: [],
      tags: ['cruciferous', 'high-fiber', 'vitamin-c']
    },
    {
      id: 'green-beans',
      name: 'Green Beans',
      serving: 150,
      per100g: { 
        protein: 1.8, 
        fat: 0.2, 
        carbs: 7, 
        calories: 31,
        fiber: 2.7,
        sugar: 3.3
      },
      methods: ['Steamed', 'Boiled', 'Stir-fried'],
      cookingTime: 6,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Wash and trim ends of green beans',
        'For steaming: Place in steamer over boiling water for 4-5 minutes until bright green and tender-crisp',
        'For stir-frying: Heat oil in a pan, add beans and stir-fry for 5-7 minutes',
        'Season with salt and pepper to taste'
      ],
      allergens: [],
      tags: ['low-calorie', 'vitamin-k']
    },
    {
      id: 'spinach',
      name: 'Fresh Spinach',
      serving: 100,
      per100g: { 
        protein: 2.9, 
        fat: 0.4, 
        carbs: 3.6, 
        calories: 23,
        fiber: 2.2,
        sugar: 0.4
      },
      methods: ['Steamed', 'Sautéed', 'Raw'],
      cookingTime: 3,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Wash spinach thoroughly',
        'For sautéing: Heat a small amount of oil in a pan, add spinach and cook for 2-3 minutes until wilted',
        'Season with salt, pepper, and a squeeze of lemon juice'
      ],
      allergens: [],
      tags: ['leafy-green', 'iron-rich', 'vitamin-k']
    }
  ]
};