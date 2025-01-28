'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const FOODS = {
  proteins: [
    { name: 'Chicken Breast', serving: 180, per100g: { protein: 31, fat: 3.6, carbs: 0, calories: 165 }, methods: ['Grilled', 'Pan-fried'] },
    { name: 'Salmon', serving: 180, per100g: { protein: 20, fat: 13, carbs: 0, calories: 208 }, methods: ['Baked', 'Pan-seared'] }
  ],
  carbs: [
    { name: 'Brown Rice', serving: 125, per100g: { protein: 2.6, fat: 0.9, carbs: 23, calories: 110 }, methods: ['Boiled'] },
    { name: 'Quinoa', serving: 125, per100g: { protein: 4.4, fat: 1.9, carbs: 21, calories: 120 }, methods: ['Boiled'] }
  ],
  vegetables: [
    { name: 'Broccoli', serving: 150, per100g: { protein: 2.8, fat: 0.4, carbs: 7, calories: 34 }, methods: ['Steamed', 'Roasted'] },
    { name: 'Green Beans', serving: 150, per100g: { protein: 1.8, fat: 0.2, carbs: 7, calories: 31 }, methods: ['Steamed'] }
  ]
};

export function MealPlanner() {
  const [cook, setCook] = useState('partner1');
  const [macroTargets, setMacroTargets] = useState({
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFats: 60
  });
  const [mealPlan, setMealPlan] = useState([]);

  const calculateCalories = (protein, carbs, fats) => {
    return (protein * 4) + (carbs * 4) + (fats * 9);
  };

  const [calculatedCalories, setCalculatedCalories] = useState(
    calculateCalories(macroTargets.dailyProtein, macroTargets.dailyCarbs, macroTargets.dailyFats)
  );

  useEffect(() => {
    setCalculatedCalories(
      calculateCalories(macroTargets.dailyProtein, macroTargets.dailyCarbs, macroTargets.dailyFats)
    );
  }, [macroTargets]);

  const calculateMacros = (item) => {
    const multiplier = item.serving / 100;
    return {
      protein: item.per100g.protein * multiplier,
      carbs: item.per100g.carbs * multiplier,
      fats: item.per100g.fat * multiplier,
      calories: item.per100g.calories * multiplier
    };
  };

  const selectRandomItem = (items, used = [], count = 1) => {
    const available = items.filter(item => !used.includes(item.name));
    if (count === 1) {
      return available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : items[Math.floor(Math.random() * items.length)];
    }
    
    const selected = [];
    for (let i = 0; i < count; i++) {
      const item = selectRandomItem(items, [...used, ...selected.map(s => s.name)]);
      selected.push(item);
    }
    return selected;
  };

  const generateMealPlan = () => {
    const meals = [];
    const usedProteins = [];
    const usedCarbs = [];
    const usedVegetables = [];

    for (let i = 0; i < 6; i++) {
      const protein = selectRandomItem(FOODS.proteins, usedProteins);
      const carb = selectRandomItem(FOODS.carbs, usedCarbs);
      const vegetables = selectRandomItem(FOODS.vegetables, usedVegetables, 2);
      
      usedProteins.push(protein.name);
      usedCarbs.push(carb.name);
      vegetables.forEach(v => usedVegetables.push(v.name));

      if (usedProteins.length > 2) usedProteins.shift();
      if (usedCarbs.length > 2) usedCarbs.shift();
      if (usedVegetables.length > 4) usedVegetables.splice(0, 2);

      const proteinMethod = protein.methods[Math.floor(Math.random() * protein.methods.length)];
      const carbMethod = carb.methods[Math.floor(Math.random() * carb.methods.length)];
      const vegMethods = vegetables.map(v => v.methods[Math.floor(Math.random() * v.methods.length)]);

      const proteinMacros = calculateMacros(protein);
      const carbMacros = calculateMacros(carb);
      const vegMacros = vegetables.map(v => calculateMacros(v));

      const mealMacros = {
        protein: proteinMacros.protein + carbMacros.protein + vegMacros.reduce((sum, m) => sum + m.protein, 0),
        carbs: proteinMacros.carbs + carbMacros.carbs + vegMacros.reduce((sum, m) => sum + m.carbs, 0),
        fats: proteinMacros.fats + carbMacros.fats + vegMacros.reduce((sum, m) => sum + m.fats, 0),
        calories: proteinMacros.calories + carbMacros.calories + vegMacros.reduce((sum, m) => sum + m.calories, 0)
      };

      meals.push({
        id: i + 1,
        meal: `Day ${Math.floor(i/2) + 1} - ${i % 2 === 0 ? 'Lunch' : 'Dinner'}`,
        protein: { ...protein, method: proteinMethod },
        carb: { ...carb, method: carbMethod },
        vegetables: vegetables.map((v, idx) => ({ ...v, method: vegMethods[idx] })),
        macros: mealMacros
      });
    }

    setMealPlan(meals);
  };

  const totalMacros = mealPlan.reduce((acc, meal) => ({
    protein: acc.protein + meal.macros.protein,
    carbs: acc.carbs + meal.macros.carbs,
    fats: acc.fats + meal.macros.fats,
    calories: acc.calories + meal.macros.calories
  }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

  const dailyAverageMacros = {
    protein: totalMacros.protein / 3,
    carbs: totalMacros.carbs / 3,
    fats: totalMacros.fats / 3,
    calories: totalMacros.calories / 3
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meal Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>Select Cook</Label>
              <Select value={cook} onValueChange={setCook}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Who's cooking?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner1">Partner 1 (Wednesday)</SelectItem>
                  <SelectItem value="partner2">Partner 2 (Sunday)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Daily Protein (g)</Label>
                <Input 
                  type="number"
                  value={macroTargets.dailyProtein}
                  onChange={(e) => setMacroTargets(prev => ({
                    ...prev,
                    dailyProtein: parseInt(e.target.value) || 0
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Daily Carbs (g)</Label>
                <Input 
                  type="number"
                  value={macroTargets.dailyCarbs}
                  onChange={(e) => setMacroTargets(prev => ({
                    ...prev,
                    dailyCarbs: parseInt(e.target.value) || 0
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Daily Fats (g)</Label>
                <Input 
                  type="number"
                  value={macroTargets.dailyFats}
                  onChange={(e) => setMacroTargets(prev => ({
                    ...prev,
                    dailyFats: parseInt(e.target.value) || 0
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Daily Calories (calculated)</Label>
                <div className="p-2 bg-gray-100 rounded border">
                  {calculatedCalories} kcal
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={generateMealPlan}
        className="w-full mb-6"
      >
        Generate Meal Plan
      </Button>

      {mealPlan.length > 0 && (
        <Tabs defaultValue="meals" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="meals" className="flex-1">Meals</TabsTrigger>
            <TabsTrigger value="macros" className="flex-1">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="meals">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mealPlan.map((meal) => (
                <Card key={meal.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{meal.meal}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Protein</h4>
                        <p>{meal.protein.method} {meal.protein.name} ({meal.protein.serving}g)</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Carbs</h4>
                        <p>{meal.carb.method} {meal.carb.name} ({meal.carb.serving}g)</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Vegetables</h4>
                        {meal.vegetables.map((veg, idx) => (
                          <p key={idx}>{veg.method} {veg.name} ({veg.serving}g)</p>
                        ))}
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Nutrition</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Calories:</div>
                          <div className="text-right">{Math.round(meal.macros.calories)} kcal</div>
                          <div>Protein:</div>
                          <div className="text-right">{Math.round(meal.macros.protein)}g</div>
                          <div>Carbs:</div>
                          <div className="text-right">{Math.round(meal.macros.carbs)}g</div>
                          <div>Fats:</div>
                          <div className="text-right">{Math.round(meal.macros.fats)}g</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="macros">
            <Card>
              <CardHeader>
                <CardTitle>Daily Average Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Current</h4>
                    <div className="space-y-1">
                      <p>Calories: {Math.round(dailyAverageMacros.calories)} kcal</p>
                      <p>Protein: {Math.round(dailyAverageMacros.protein)}g</p>
                      <p>Carbs: {Math.round(dailyAverageMacros.carbs)}g</p>
                      <p>Fats: {Math.round(dailyAverageMacros.fats)}g</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Target</h4>
                    <div className="space-y-1">
                      <p>Calories: {calculatedCalories} kcal</p>
                      <p>Protein: {macroTargets.dailyProtein}g</p>
                      <p>Carbs: {macroTargets.dailyCarbs}g</p>
                      <p>Fats: {macroTargets.dailyFats}g</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}