import { calculateAdherenceScore } from "@/features/progress/logic/calculateAdherenceScore";
import type {
  NutritionTargets,
  PredictionSnapshot,
  ProgressMetric,
  UserProfile,
  WorkoutLog,
  WorkoutPlan
} from "@/types/domain";

function getWeeklyChangeRange(profileGoal: UserProfile["goal"]): { low: number; high: number; direction: string } {
  switch (profileGoal) {
    case "lose_fat":
      return { low: -0.6, high: -0.25, direction: "Body weight trends down while lean mass is protected." };
    case "build_muscle":
      return { low: 0.05, high: 0.2, direction: "Weight trends slightly up with a lean-mass focus." };
    case "recomposition":
      return { low: -0.15, high: 0.05, direction: "Scale weight stays relatively stable while composition improves gradually." };
    case "athletic_performance":
      return { low: -0.1, high: 0.15, direction: "Body weight stays mostly stable while training capacity improves." };
    default:
      return { low: -0.1, high: 0.1, direction: "Body weight remains broadly stable." };
  }
}

export function predictGoalOutcome(input: {
  profile: UserProfile;
  workoutPlan: WorkoutPlan | null;
  workoutLogs: WorkoutLog[];
  nutritionTargets: NutritionTargets | null;
  progressMetrics: ProgressMetric[];
}): PredictionSnapshot[] {
  const adherence = calculateAdherenceScore({
    workoutPlan: input.workoutPlan,
    workoutLogs: input.workoutLogs,
    nutritionTargets: input.nutritionTargets,
    progressMetrics: input.progressMetrics
  });
  const weekly = getWeeklyChangeRange(input.profile.goal);
  const adherenceModifier = adherence.overall >= 80 ? 1 : adherence.overall >= 60 ? 0.8 : 0.55;
  const currentWeight = input.progressMetrics[0]?.weightKg ?? input.profile.weightKg;

  return [
    { horizon: "3_month" as const, weeks: 12 },
    { horizon: "6_month" as const, weeks: 24 }
  ].map(({ horizon, weeks }) => {
    const lowChange = Number((weekly.low * weeks * adherenceModifier).toFixed(1));
    const highChange = Number((weekly.high * weeks * adherenceModifier).toFixed(1));
    const lowerWeight = Number((currentWeight + Math.min(lowChange, highChange)).toFixed(1));
    const upperWeight = Number((currentWeight + Math.max(lowChange, highChange)).toFixed(1));
    const confidence = adherence.overall >= 80 ? "high" : adherence.overall >= 60 ? "moderate" : "low";

    return {
      id: `${horizon}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      horizon,
      expectedWeightRangeKg: {
        low: lowerWeight,
        high: upperWeight
      },
      bodyCompositionDirection: weekly.direction,
      confidence,
      assumptions: [
        "Training consistency stays close to the current trend.",
        "Average calorie intake remains near the recommended target.",
        "Sleep, stress, and recovery stay within a typical non-clinical range."
      ],
      explanation:
        `This ${horizon === "3_month" ? "3-month" : "6-month"} range uses conservative weekly change rates, then adjusts the outlook based on recent adherence. It is a coaching estimate, not a guarantee.`
    };
  });
}
