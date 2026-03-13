import { calculateAdherenceScore } from "@/features/progress/logic/calculateAdherenceScore";
import type { NutritionTargets, ProgressMetric, WorkoutLog, WorkoutPlan } from "@/types/domain";

const workoutPlan: WorkoutPlan = {
  id: "plan-1",
  split: "full_body",
  coachingSummary: "Summary",
  weeklyFrequency: 3,
  createdAt: new Date().toISOString(),
  sessions: [
    { id: "a", dayLabel: "Mon", focus: "A", estimatedMinutes: 45, exercises: [] },
    { id: "b", dayLabel: "Wed", focus: "B", estimatedMinutes: 45, exercises: [] },
    { id: "c", dayLabel: "Fri", focus: "C", estimatedMinutes: 45, exercises: [] }
  ]
};

const nutritionTargets: NutritionTargets = {
  calories: 2200,
  proteinGrams: 170,
  carbsGrams: 220,
  fatsGrams: 70,
  fiberGrams: 30,
  hydrationLiters: 2.8,
  maintenanceCalories: 2350,
  targetAdjustment: -150
};

const progressMetrics: ProgressMetric[] = [
  {
    id: "metric-1",
    date: "2026-03-13",
    weightKg: 80,
    workoutMinutes: 45,
    caloriesConsumed: 2180,
    calorieTarget: 2200
  }
];

const workoutLogs: WorkoutLog[] = [
  {
    id: "log-1",
    workoutDayId: "a",
    completedAt: new Date().toISOString(),
    perceivedEffort: 7,
    notes: ""
  }
];

describe("calculateAdherenceScore", () => {
  it("returns a bounded score and component breakdown", () => {
    const score = calculateAdherenceScore({
      workoutPlan,
      workoutLogs,
      nutritionTargets,
      progressMetrics
    });

    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
    expect(score.workout).toBe(33);
  });
});
