// app/page.tsx
import { MealPlanner } from './components/meal-planner';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <MealPlanner />
    </main>
  );
}