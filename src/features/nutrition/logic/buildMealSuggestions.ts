import type { FoodItem, GoalType, GroceryList, MealSuggestion } from "@/types/domain";

export function buildMealSuggestions(goal: GoalType, foods: FoodItem[]): {
  mealSuggestions: MealSuggestion[];
  groceryList: GroceryList;
} {
  const proteinFoods = foods.filter((food) => food.category === "protein").slice(0, 3);
  const carbFoods = foods.filter((food) => food.category === "carbs").slice(0, 3);
  const produceFoods = foods.filter((food) => food.category === "produce").slice(0, 2);

  const mealSuggestions: MealSuggestion[] = [
    {
      id: "meal-1",
      title: goal === "lose_fat" ? "Lean lunch bowl" : "Performance rice bowl",
      description: "A repeatable default meal that is easy to prep in batches.",
      category: "high_protein",
      items: [proteinFoods[0]?.name, carbFoods[0]?.name, produceFoods[0]?.name].filter(Boolean) as string[]
    },
    {
      id: "meal-2",
      title: "Quick breakfast anchor",
      description: "High-protein first meal to improve adherence early in the day.",
      category: "quick_prep",
      items: [foods[0]?.name, foods[1]?.name, foods[9]?.name].filter(Boolean) as string[]
    },
    {
      id: "meal-3",
      title: "Post-workout reset",
      description: "Balanced carbs and protein to support recovery after training.",
      category: "post_workout",
      items: [proteinFoods[1]?.name, carbFoods[1]?.name, produceFoods[1]?.name].filter(Boolean) as string[]
    }
  ];

  const groceryList: GroceryList = {
    id: "groceries-default",
    title: "This week's grocery list",
    items: [...new Set(mealSuggestions.flatMap((suggestion) => suggestion.items))].map((name, index) => ({
      id: `grocery-${index + 1}`,
      name,
      quantityLabel: "2-4 servings"
    }))
  };

  return { mealSuggestions, groceryList };
}
