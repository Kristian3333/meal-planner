// app/page.tsx
import { MealPlanner } from './components/meal-planner';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <MealPlanner />
    </main>
  );
}