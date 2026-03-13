import { predictGoalOutcome } from "@/features/predictions/logic/predictGoalOutcome";
import type { NutritionTargets, ProgressMetric, UserProfile, WorkoutPlan } from "@/types/domain";

const profile: UserProfile = {
  id: "profile-1",
  email: "alex@example.com",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  fullName: "Alex Carter",
  age: 29,
  sex: "male",
  heightCm: 178,
  weightKg: 82,
  fitnessLevel: "intermediate",
  trainingExperienceYears: 3,
  injuries: [],
  dietaryPreference: "high_protein",
  weeklySessions: 4,
  sessionMinutes: 50,
  scheduleNotes: "Weeknights",
  availableEquipment: ["bodyweight", "dumbbells"],
  goal: "lose_fat",
  targetWeightKg: 78
};

const workoutPlan: WorkoutPlan = {
  id: "plan-1",
  split: "upper_lower",
  coachingSummary: "Summary",
  weeklyFrequency: 4,
  createdAt: new Date().toISOString(),
  sessions: [
    { id: "1", dayLabel: "Mon", focus: "Upper", estimatedMinutes: 50, exercises: [] },
    { id: "2", dayLabel: "Tue", focus: "Lower", estimatedMinutes: 50, exercises: [] },
    { id: "3", dayLabel: "Thu", focus: "Upper", estimatedMinutes: 50, exercises: [] },
    { id: "4", dayLabel: "Sat", focus: "Lower", estimatedMinutes: 50, exercises: [] }
  ]
};

const nutritionTargets: NutritionTargets = {
  calories: 2150,
  proteinGrams: 170,
  carbsGrams: 210,
  fatsGrams: 68,
  fiberGrams: 30,
  hydrationLiters: 2.8,
  maintenanceCalories: 2600,
  targetAdjustment: -450
};

const progressMetrics: ProgressMetric[] = [
  {
    id: "metric-1",
    date: "2026-03-13",
    weightKg: 82,
    workoutMinutes: 45,
    caloriesConsumed: 2100,
    calorieTarget: 2150
  }
];

describe("predictGoalOutcome", () => {
  it("returns 3-month and 6-month forecast ranges", () => {
    const predictions = predictGoalOutcome({
      profile,
      workoutPlan,
      workoutLogs: [],
      nutritionTargets,
      progressMetrics
    });

    expect(predictions).toHaveLength(2);
    expect(predictions[0]?.horizon).toBe("3_month");
    expect(predictions[1]?.horizon).toBe("6_month");
    expect(predictions[0]?.expectedWeightRangeKg.low).toBeLessThan(predictions[0]?.expectedWeightRangeKg.high);
  });
});
