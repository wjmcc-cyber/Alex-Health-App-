import type {
  AdherenceScore,
  NutritionTargets,
  ProgressMetric,
  WorkoutLog,
  WorkoutPlan
} from "@/types/domain";

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, current) => sum + current, 0) / values.length;
}

export function calculateAdherenceScore(input: {
  workoutPlan: WorkoutPlan | null;
  workoutLogs: WorkoutLog[];
  nutritionTargets: NutritionTargets | null;
  progressMetrics: ProgressMetric[];
}): AdherenceScore {
  const plannedSessions = input.workoutPlan?.sessions.length ?? 0;
  const completedSessions = input.workoutLogs.length;
  const workout = plannedSessions === 0 ? 0 : Math.min(100, Math.round((completedSessions / plannedSessions) * 100));

  const nutrition = !input.nutritionTargets
    ? 0
    : Math.round(
        average(
          input.progressMetrics.map((metric) => {
            const deviation = Math.abs(metric.caloriesConsumed - input.nutritionTargets!.calories);
            return Math.max(0, 100 - (deviation / input.nutritionTargets!.calories) * 130);
          })
        )
      );

  const logging = Math.min(100, input.progressMetrics.length * 25);
  const weightTrend = input.progressMetrics.length < 2 ? 60 : 78;
  const overall = Math.round((workout * 0.35) + (nutrition * 0.35) + (logging * 0.15) + (weightTrend * 0.15));

  return {
    overall,
    workout,
    nutrition,
    logging,
    weightTrend,
    label: overall >= 80 ? "excellent" : overall >= 60 ? "steady" : "needs_attention"
  };
}
