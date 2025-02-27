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
      methods: ['Grilled', 'Pan-fried', 'Baked', 'Poached', 'Air-fried'],
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
      methods: ['Baked', 'Pan-seared', 'Grilled', 'Poached'],
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
      methods: ['Stir-fried', 'Baked', 'Grilled', 'Crispy'],
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
      id: 'grass-fed-beef',
      name: 'Grass-Fed Beef Steak',
      serving: 170,
      per100g: {
        protein: 26,
        fat: 15,
        carbs: 0,
        calories: 250,
        fiber: 0,
        sugar: 0
      },
      methods: ['Grilled', 'Pan-seared', 'Broiled', 'Sous-vide'],
      cookingTime: 15,
      complexity: 'medium',
      spiceLevel: 'medium',
      category: 'protein',
      recipeSteps: [
        'Season steak generously with salt and pepper, let sit at room temperature for 30 minutes',
        'Heat cast-iron skillet until smoking hot',
        'Sear steak 3-4 minutes per side for medium-rare',
        'Let rest for 5-10 minutes before slicing against the grain'
      ],
      allergens: [],
      tags: ['high-protein', 'keto', 'paleo']
    },
    {
      id: 'black-beans',
      name: 'Black Beans',
      serving: 130,
      per100g: {
        protein: 8.9,
        fat: 0.5,
        carbs: 24,
        calories: 132,
        fiber: 8.7,
        sugar: 0.3
      },
      methods: ['Slow-cooked', 'Pressure-cooked', 'Simmered', 'Refried'],
      cookingTime: 25,
      complexity: 'easy',
      spiceLevel: 'medium',
      category: 'protein',
      recipeSteps: [
        'Rinse beans thoroughly',
        'Cook with bay leaf, onion, and garlic until tender',
        'Season with cumin, oregano, and salt',
        'Finish with fresh cilantro and lime juice'
      ],
      allergens: [],
      tags: ['vegetarian', 'vegan', 'high-fiber', 'plant-based']
    },
    {
      id: 'tempeh',
      name: 'Tempeh',
      serving: 140,
      per100g: {
        protein: 19,
        fat: 11,
        carbs: 9,
        calories: 192,
        fiber: 4.5,
        sugar: 0
      },
      methods: ['Marinated', 'Grilled', 'Baked', 'Steamed', 'Crumbled'],
      cookingTime: 15,
      complexity: 'medium',
      spiceLevel: 'medium',
      category: 'protein',
      recipeSteps: [
        'Steam tempeh for 10 minutes to reduce bitterness',
        'Marinate in soy sauce, maple syrup, garlic, and ginger for 30 minutes',
        'Pan-fry until golden brown on both sides',
        'Brush with additional marinade before serving'
      ],
      allergens: ['soy'],
      tags: ['vegetarian', 'vegan', 'fermented', 'plant-based']
    },
    {
      id: 'lentils',
      name: 'French Lentils',
      serving: 150,
      per100g: {
        protein: 9,
        fat: 0.4,
        carbs: 20,
        calories: 116,
        fiber: 7.9,
        sugar: 0.8
      },
      methods: ['Boiled', 'Pressure-cooked', 'Stewed', 'Sprouted'],
      cookingTime: 25,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'protein',
      recipeSteps: [
        'Rinse lentils and pick through to remove any debris',
        'Combine with water or broth at a 3:1 ratio',
        'Add aromatics like bay leaf, thyme, and garlic',
        'Simmer for 20-25 minutes until tender but not mushy',
        'Season with salt, olive oil, and lemon juice'
      ],
      allergens: [],
      tags: ['vegetarian', 'vegan', 'high-fiber', 'budget-friendly']
    },
    {
      id: 'turkey-breast',
      name: 'Turkey Breast',
      serving: 170,
      per100g: {
        protein: 29,
        fat: 1,
        carbs: 0,
        calories: 135,
        fiber: 0,
        sugar: 0
      },
      methods: ['Roasted', 'Grilled', 'Slow-cooked', 'Air-fried'],
      cookingTime: 30,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'protein',
      recipeSteps: [
        'Season turkey breast with herbs, salt, and pepper',
        'Sear on all sides in a hot skillet',
        'Roast in oven at 350°F until internal temperature reaches 165°F',
        'Let rest for 10 minutes before slicing'
      ],
      allergens: [],
      tags: ['high-protein', 'low-fat', 'lean-meat']
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
      methods: ['Boiled', 'Steamed', 'Instant Pot', 'Rice Cooker'],
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
      methods: ['Boiled', 'Toasted', 'Pilaf-style', 'Instant Pot'],
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
      methods: ['Baked', 'Roasted', 'Boiled', 'Mashed', 'Air-fried'],
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
      id: 'jasmine-rice',
      name: 'Jasmine Rice',
      serving: 125,
      per100g: {
        protein: 2.7,
        fat: 0.3,
        carbs: 28,
        calories: 130,
        fiber: 0.4,
        sugar: 0.1
      },
      methods: ['Steamed', 'Boiled', 'Rice Cooker', 'Coconut Infused'],
      cookingTime: 20,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Rinse jasmine rice until water runs clear',
        'Add 1 part rice to 1.5 parts water',
        'Bring to boil, then reduce to lowest heat setting and cover',
        'Cook for 15 minutes, then remove from heat and let sit covered for 5 minutes',
        'Fluff with a fork before serving'
      ],
      allergens: [],
      tags: ['fragrant', 'quick-cooking']
    },
    {
      id: 'whole-wheat-pasta',
      name: 'Whole Wheat Pasta',
      serving: 140,
      per100g: {
        protein: 5.3,
        fat: 1.1,
        carbs: 30,
        calories: 145,
        fiber: 3.2,
        sugar: 1.1
      },
      methods: ['Boiled', 'Al dente', 'One-pot'],
      cookingTime: 12,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Bring a large pot of salted water to a rolling boil',
        'Add pasta and cook for 8-10 minutes, stirring occasionally',
        'Reserve some pasta water before draining',
        'Toss immediately with sauce or olive oil'
      ],
      allergens: ['wheat', 'gluten'],
      tags: ['whole-grain', 'high-fiber', 'plant-based']
    },
    {
      id: 'farro',
      name: 'Farro',
      serving: 130,
      per100g: {
        protein: 6.5,
        fat: 1.7,
        carbs: 26.6,
        calories: 140,
        fiber: 3.8,
        sugar: 0.4
      },
      methods: ['Boiled', 'Pilaf', 'Risotto-style', 'Soaked'],
      cookingTime: 30,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Rinse farro under cold water',
        'Optional: soak overnight to reduce cooking time',
        'Add 1 part farro to 3 parts water or broth',
        'Bring to a boil, then simmer uncovered for 25-30 minutes until tender',
        'Drain any excess liquid and fluff with a fork'
      ],
      allergens: ['wheat', 'gluten'],
      tags: ['ancient-grain', 'high-protein', 'chewy-texture']
    },
    {
      id: 'couscous',
      name: 'Whole Wheat Couscous',
      serving: 120,
      per100g: {
        protein: 6,
        fat: 0.6,
        carbs: 23,
        calories: 120,
        fiber: 3.8,
        sugar: 0.2
      },
      methods: ['Steamed', 'Instant', 'Pilaf', 'Cold'],
      cookingTime: 10,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Boil water or broth (1.5 parts liquid to 1 part couscous)',
        'Add couscous to a bowl and pour over boiling liquid',
        'Cover tightly and let sit for 5 minutes',
        'Fluff with a fork and add olive oil, lemon juice, and herbs'
      ],
      allergens: ['wheat', 'gluten'],
      tags: ['quick-cooking', 'versatile', 'Mediterranean']
    },
    {
      id: 'black-rice',
      name: 'Black Forbidden Rice',
      serving: 125,
      per100g: {
        protein: 3.5,
        fat: 1.5,
        carbs: 32,
        calories: 160,
        fiber: 2.3,
        sugar: 0.3
      },
      methods: ['Boiled', 'Steamed', 'Pressure Cooked'],
      cookingTime: 35,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'carb',
      recipeSteps: [
        'Rinse black rice thoroughly under cold water',
        'Combine 1 part rice with 2.5 parts water',
        'Bring to a boil, reduce heat, and simmer covered for 30-35 minutes',
        'Let stand for 10 minutes before fluffing with a fork',
        'Optionally finish with a touch of sesame oil'
      ],
      allergens: [],
      tags: ['antioxidant-rich', 'nutty-flavor', 'exotic']
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
      methods: ['Steamed', 'Roasted', 'Stir-fried', 'Blanched', 'Raw'],
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
      methods: ['Steamed', 'Boiled', 'Stir-fried', 'Roasted', 'Blanched'],
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
      methods: ['Steamed', 'Sautéed', 'Raw', 'Wilted', 'Creamed'],
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
      id: 'brussels-sprouts',
      name: 'Brussels Sprouts',
      serving: 140,
      per100g: {
        protein: 3.4,
        fat: 0.3,
        carbs: 9,
        calories: 43,
        fiber: 3.8,
        sugar: 2.2
      },
      methods: ['Roasted', 'Sautéed', 'Shaved', 'Air-fried', 'Steamed'],
      cookingTime: 18,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Trim ends and remove any damaged outer leaves',
        'Cut large Brussels sprouts in half lengthwise',
        'Toss with olive oil, salt, and pepper',
        'Roast at 425°F for 20-25 minutes until caramelized and tender',
        'Optional: drizzle with balsamic glaze before serving'
      ],
      allergens: [],
      tags: ['cruciferous', 'roasted', 'high-fiber']
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
        fiber: 2.5,
        sugar: 2
      },
      methods: ['Roasted', 'Riced', 'Mashed', 'Steamed', 'Air-fried'],
      cookingTime: 12,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Cut cauliflower into florets of similar size',
        'For roasting: Toss with olive oil, salt, and preferred spices',
        'Spread on baking sheet and roast at 425°F for 20-25 minutes, stirring halfway',
        'For cauliflower rice: Pulse florets in food processor until rice-sized, then sauté for 5-8 minutes'
      ],
      allergens: [],
      tags: ['cruciferous', 'low-carb', 'versatile']
    },
    {
      id: 'bell-peppers',
      name: 'Bell Peppers',
      serving: 120,
      per100g: {
        protein: 1,
        fat: 0.3,
        carbs: 6,
        calories: 31,
        fiber: 2.1,
        sugar: 4.2
      },
      methods: ['Roasted', 'Grilled', 'Sautéed', 'Raw', 'Stuffed'],
      cookingTime: 10,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Remove stem, seeds, and membranes',
        'Slice into strips or desired shapes',
        'For roasting: Toss with olive oil and place on baking sheet at 400°F for 15-20 minutes',
        'For sautéing: Cook in a hot pan with olive oil for 5-7 minutes until softened'
      ],
      allergens: [],
      tags: ['vitamin-c', 'colorful', 'antioxidants']
    },
    {
      id: 'asparagus',
      name: 'Asparagus',
      serving: 130,
      per100g: {
        protein: 2.4,
        fat: 0.2,
        carbs: 3.9,
        calories: 22,
        fiber: 2.1,
        sugar: 1.3
      },
      methods: ['Roasted', 'Grilled', 'Steamed', 'Blanched', 'Sautéed'],
      cookingTime: 8,
      complexity: 'easy',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Trim woody ends of asparagus spears',
        'For roasting: Toss with olive oil, salt, and pepper',
        'Roast at 425°F for 10-15 minutes depending on thickness',
        'Finish with a squeeze of lemon juice and optional shaved parmesan'
      ],
      allergens: [],
      tags: ['spring-vegetable', 'elegant', 'quick-cooking']
    },
    {
      id: 'kale',
      name: 'Tuscan Kale',
      serving: 100,
      per100g: {
        protein: 4.3,
        fat: 1.5,
        carbs: 8.8,
        calories: 49,
        fiber: 3.6,
        sugar: 1.3
      },
      methods: ['Sautéed', 'Massaged', 'Roasted', 'Chips', 'Braised'],
      cookingTime: 7,
      complexity: 'medium',
      spiceLevel: 'mild',
      category: 'vegetable',
      recipeSteps: [
        'Remove tough center stems and tear leaves into bite-sized pieces',
        'For sautéed kale: Heat olive oil with garlic, add kale and cook until wilted',
        'For kale salad: Massage raw kale with olive oil, salt, and lemon juice for 2-3 minutes to tenderize',
        'Season with salt, pepper, and red pepper flakes if desired'
      ],
      allergens: [],
      tags: ['superfood', 'high-iron', 'vitamin-k']
    }
  ]
};