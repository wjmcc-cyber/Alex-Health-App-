import { calculateAdherenceScore } from "@/features/progress/logic/calculateAdherenceScore";
import type {
  DashboardSnapshot,
  FoodEntry,
  NutritionTargets,
  PredictionSnapshot,
  ProgressMetric,
  UserProfile,
  WorkoutLog,
  WorkoutPlan
} from "@/types/domain";

export function buildDashboardSnapshot(input: {
  profile: UserProfile;
  workoutPlan: WorkoutPlan | null;
  nutritionTargets: NutritionTargets;
  foodEntries: FoodEntry[];
  workoutLogs: WorkoutLog[];
  progressMetrics: ProgressMetric[];
  predictions: PredictionSnapshot[];
}): DashboardSnapshot {
  const consumedCalories = input.foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const consumedProtein = input.foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const consumedCarbs = input.foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const consumedFats = input.foodEntries.reduce((sum, entry) => sum + entry.fats, 0);
  const adherence = calculateAdherenceScore({
    workoutPlan: input.workoutPlan,
    workoutLogs: input.workoutLogs,
    nutritionTargets: input.nutritionTargets,
    progressMetrics: input.progressMetrics
  });
  const nextPrediction = input.predictions[0];

  return {
    todaysWorkout: input.workoutPlan?.sessions[0],
    nutritionTargets: input.nutritionTargets,
    remainingCalories: Math.max(0, input.nutritionTargets.calories - consumedCalories),
    consumedCalories,
    consumedProtein,
    consumedCarbs,
    consumedFats,
    adherence,
    nextMilestone: nextPrediction
      ? `${nextPrediction.horizon === "3_month" ? "3-month" : "6-month"} range: ${nextPrediction.expectedWeightRangeKg.low}-${nextPrediction.expectedWeightRangeKg.high} kg`
      : "Complete a week of logs to unlock prediction ranges.",
    currentWeightKg: input.progressMetrics[0]?.weightKg ?? input.profile.weightKg
  };
}
