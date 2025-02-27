// src/components/meal-planner/foodDatabase.ts
import { FoodItem } from './types';

// Extended food database with more items and recipe details
export const FOOD_DATABASE = {
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
    },
    {
      id: 'tempeh',
      name: 'Tempeh',
      serving: 100,
      per100g: { 
        protein: 19, 
        fat: 11, 
        carbs: 9, 
        calories: 193,
        fiber: 5.4,
        sugar: 0
      },
      methods: ['Stir-fried', 'Baked', 'Grilled'],
      cookingTime: 15,
      complexity: 'medium',
      spiceLevel: 'medium',
      category: 'protein',
      recipeSteps: [
        'Steam tempeh for 10 minutes to reduce bitterness',
        'Slice into thin pieces',
        'Marinate in soy sauce, garlic, and spices for at least 15 minutes',
        'Pan-fry until golden brown on both sides'
      ],
      allergens: ['soy'],
      tags: ['vegetarian', 'vegan', 'fermented']
    },
    {
      id: 'lean-beef',
      name: 'Lean Ground Beef',
      serving: 150,
      per100g: { 
        protein: 26, 
        fat: 15, 
        carbs: 0, 
        calories: 250,
        fiber: 0,
        sugar: 0
      },
      methods: ['Grilled', 'Pan-fried', 'Baked'],
      cookingTime: 15,
      complexity: 'easy',
      spiceLevel: 'medium',
      category: 'protein',
      recipeSteps: [
        'Heat pan over medium-high heat',
        'Add ground beef and break apart with a spatula',
        'Season with salt, pepper, and desired spices',
        'Cook until no longer pink, about 7-10 minutes'
      ],
      allergens: [],
      tags: ['high-protein', 'iron-rich']
    },
    {
      id: 'pork-chop',
      name: 'Pork Chop',
      serving: 150,
      per100g: { 
        protein: 25, 
        fat: 14, 
        carbs: 0, 
        calories: 231,
        fiber: 0,
        sugar: 0
      },
      methods: ['Grilled', 'Pan-fried', 'Baked'],
      cookingTime: 20,
      complexity: 'medium',
      spiceLevel: 'medium',
      category: 'protein',
      recipeSteps: [
        'Season pork chop with salt, pepper, and herbs',
        'Heat pan over medium-high heat with oil',
        'Cook for 4-5 minutes on each side until internal temperature reaches 145°F',
        'Let rest for 5 minutes before serving'
      ],
      allergens: [],
      tags: ['high-protein']
    },
    {
      id: 'chickpeas',
      name: 'Chickpeas',
      serving: 120,
      per100g: { 
        protein: 9, 
        fat: 3, 
        carbs: 27, 
        calories: 164,
        fiber: 8,
        sugar: 5
      },
      methods: ['Boiled', 'Roasted'],
      cookingTime: 10,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'protein',
      recipeSteps: [
        'Rinse chickpeas thoroughly',
        'For roasting: toss with olive oil, salt and spices',
        'Spread on baking sheet and roast at 400°F for 20-30 minutes until crispy'
      ],
      allergens: [],
      tags: ['vegetarian', 'vegan', 'plant-based', 'high-fiber']
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
    },
    {
      id: 'oats',
      name: 'Rolled Oats',
      serving: 100,
      per100g: { 
        protein: 13.2, 
        fat: 6.9, 
        carbs: 67.7, 
        calories: 389,
        fiber: 10.6,
        sugar: 0.8
      },
      methods: ['Boiled'],
      cookingTime: 10,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Combine 1 part oats with 2 parts water or milk in a pot',
        'Bring to a boil, then reduce heat and simmer for 5 minutes, stirring occasionally',
        'Remove from heat and let stand for 2 minutes before serving'
      ],
      allergens: ['may contain gluten'],
      tags: ['whole-grain', 'high-fiber', 'breakfast']
    },
    {
      id: 'whole-wheat-pasta',
      name: 'Whole Wheat Pasta',
      serving: 125,
      per100g: { 
        protein: 13, 
        fat: 2.5, 
        carbs: 68, 
        calories: 347,
        fiber: 8.5,
        sugar: 2.2
      },
      methods: ['Boiled'],
      cookingTime: 12,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Bring a large pot of salted water to a boil',
        'Add pasta and cook according to package directions (usually 7-9 minutes)',
        'Drain and rinse briefly with cold water to stop cooking',
        'Toss with a small amount of olive oil to prevent sticking'
      ],
      allergens: ['wheat', 'gluten'],
      tags: ['whole-grain', 'high-fiber']
    },
    {
      id: 'basmati-rice',
      name: 'Basmati Rice',
      serving: 125,
      per100g: { 
        protein: 3.5, 
        fat: 0.7, 
        carbs: 25, 
        calories: 120,
        fiber: 0.4,
        sugar: 0.1
      },
      methods: ['Boiled', 'Steamed'],
      cookingTime: 20,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Rinse basmati rice until water runs clear',
        'Optional: soak for 30 minutes to reduce cooking time',
        'Add 1 part rice to 1.5 parts water in a pot',
        'Bring to a boil, then reduce heat and simmer covered for 15 minutes',
        'Remove from heat and let stand for 5 minutes before fluffing'
      ],
      allergens: [],
      tags: ['low-glycemic']
    },
    {
      id: 'barley',
      name: 'Pearl Barley',
      serving: 100,
      per100g: { 
        protein: 9.9, 
        fat: 1.2, 
        carbs: 73, 
        calories: 352,
        fiber: 15.6,
        sugar: 0.8
      },
      methods: ['Boiled'],
      cookingTime: 40,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Rinse barley under cold water',
        'Add 1 part barley to 3 parts water in a pot',
        'Bring to a boil, then reduce heat and simmer for 30-40 minutes until tender',
        'Drain any excess water before serving'
      ],
      allergens: ['gluten'],
      tags: ['whole-grain', 'high-fiber']
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
    },
    {
      id: 'bell-peppers',
      name: 'Bell Peppers',
      serving: 120,
      per100g: { 
        protein: 1.3, 
        fat: 0.3, 
        carbs: 6, 
        calories: 31,
        fiber: 2.1,
        sugar: 4.2
      },
      methods: ['Roasted', 'Stir-fried', 'Raw'],
      cookingTime: 10,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Remove seeds and cut into desired shapes',
        'For roasting: Toss with olive oil, salt and pepper, roast at 425°F for 15-20 minutes',
        'For stir-frying: Cook in hot pan with oil for 5-7 minutes until slightly softened but still crisp'
      ],
      allergens: [],
      tags: ['vitamin-c', 'antioxidants', 'colorful']
    },
    {
      id: 'cauliflower',
      name: 'Cauliflower',
      serving: 150,
      per100g: { 
        protein: 2, 
        fat: 0.3, 
        carbs: 5, 
        calories: 25,
        fiber: 2,
        sugar: 1.9
      },
      methods: ['Steamed', 'Roasted', 'Riced'],
      cookingTime: 10,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Cut cauliflower into florets of similar size',
        'For roasting: Toss with olive oil, salt and spices, roast at 425°F for 20-25 minutes until golden',
        'For cauliflower rice: Pulse florets in food processor until rice-sized, then sauté in oil for 5-8 minutes'
      ],
      allergens: [],
      tags: ['cruciferous', 'low-carb', 'vitamin-c']
    },
    {
      id: 'asparagus',
      name: 'Asparagus',
      serving: 100,
      per100g: { 
        protein: 2.4, 
        fat: 0.2, 
        carbs: 3.9, 
        calories: 20,
        fiber: 2.1,
        sugar: 1.9
      },
      methods: ['Steamed', 'Roasted', 'Grilled'],
      cookingTime: 8,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Trim woody ends of asparagus spears',
        'For roasting: Toss with olive oil, salt and pepper, roast at 425°F for 10-15 minutes until tender',
        'For grilling: Brush with oil, grill for 3-4 minutes, turning occasionally',
        'Season with lemon juice and zest before serving'
      ],
      allergens: [],
      tags: ['folate', 'vitamin-k', 'seasonal']
    },
    {
      id: 'zucchini',
      name: 'Zucchini',
      serving: 150,
      per100g: { 
        protein: 1.2, 
        fat: 0.3, 
        carbs: 3.1, 
        calories: 17,
        fiber: 1,
        sugar: 2.5
      },
      methods: ['Grilled', 'Roasted', 'Sautéed'],
      cookingTime: 8,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Slice zucchini into rounds or lengthwise strips',
        'For grilling: Brush with oil, grill for 2-3 minutes per side',
        'For roasting: Toss with olive oil, salt and herbs, roast at 425°F for 15 minutes',
        'For sautéing: Cook in hot pan with oil for 5-7 minutes until tender'
      ],
      allergens: [],
      tags: ['low-calorie', 'summer-squash', 'versatile']
    },
    {
      id: 'kale',
      name: 'Kale',
      serving: 100,
      per100g: { 
        protein: 4.3, 
        fat: 0.9, 
        carbs: 8.8, 
        calories: 49,
        fiber: 3.6,
        sugar: 2.3
      },
      methods: ['Sautéed', 'Steamed', 'Raw'],
      cookingTime: 6,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Remove tough stems and tear leaves into bite-sized pieces',
        'Wash thoroughly',
        'For sautéing: Heat oil in a pan, add kale and cook for 3-5 minutes until wilted but still bright green',
        'Add a splash of lemon juice or vinegar to balance the bitterness'
      ],
      allergens: [],
      tags: ['leafy-green', 'superfood', 'vitamin-k', 'calcium']
    },
    {
      id: 'brussels-sprouts',
      name: 'Brussels Sprouts',
      serving: 150,
      per100g: { 
        protein: 3.4, 
        fat: 0.3, 
        carbs: 9, 
        calories: 43,
        fiber: 3.8,
        sugar: 2.2
      },
      methods: ['Roasted', 'Steamed', 'Pan-fried'],
      cookingTime: 20,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Trim ends and remove any damaged outer leaves',
        'Cut in half for more even cooking',
        'For roasting: Toss with olive oil, salt and balsamic vinegar, roast at 425°F for 20-25 minutes until crispy outside and tender inside',
        'Optionally finish with a drizzle of honey or maple syrup'
      ],
      allergens: [],
      tags: ['cruciferous', 'vitamin-c', 'holiday']
    }
  ]
};