import { calculateNutritionTargets } from "@/features/nutrition/logic/calculateNutritionTargets";
import type { UserProfileInput } from "@/types/domain";

const baseProfile: UserProfileInput = {
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
  goal: "recomposition",
  targetWeightKg: 78
};

describe("calculateNutritionTargets", () => {
  it("returns a calorie target above the minimum floor", () => {
    const result = calculateNutritionTargets(baseProfile);

    expect(result.calories).toBeGreaterThanOrEqual(1500);
    expect(result.maintenanceCalories).toBeGreaterThan(result.calories);
  });

  it("raises calories for build muscle compared with fat loss", () => {
    const build = calculateNutritionTargets({ ...baseProfile, goal: "build_muscle" });
    const cut = calculateNutritionTargets({ ...baseProfile, goal: "lose_fat" });

    expect(build.calories).toBeGreaterThan(cut.calories);
    expect(build.proteinGrams).toBeGreaterThanOrEqual(cut.proteinGrams);
  });
});
