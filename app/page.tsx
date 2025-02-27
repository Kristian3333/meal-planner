// src/app/page.tsx
import { MealPlanner } from './components/meal-planner/MealPlanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <MealPlanner />
    </main>
  );
}