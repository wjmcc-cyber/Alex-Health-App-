import { generateWorkoutPlan } from "@/features/workouts/logic/generateWorkoutPlan";
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

describe("generateWorkoutPlan", () => {
  it("selects upper lower for four sessions per week", () => {
    const plan = generateWorkoutPlan(baseProfile);

    expect(plan.split).toBe("upper_lower");
    expect(plan.sessions).toHaveLength(4);
  });

  it("falls back to full body for lower frequency", () => {
    const plan = generateWorkoutPlan({ ...baseProfile, weeklySessions: 3 });

    expect(plan.split).toBe("full_body");
    expect(plan.sessions).toHaveLength(3);
  });
});
