import type {
  DietaryPreference,
  EquipmentType,
  ExperienceLevel,
  GoalType,
  InjuryArea
} from "@/types/domain";

export const goalOptions: Array<{ label: string; value: GoalType }> = [
  { label: "Lose fat", value: "lose_fat" },
  { label: "Build muscle", value: "build_muscle" },
  { label: "Recomposition", value: "recomposition" },
  { label: "Athletic performance", value: "athletic_performance" }
];

export const experienceOptions: Array<{ label: string; value: ExperienceLevel }> = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" }
];

export const dietaryOptions: Array<{ label: string; value: DietaryPreference }> = [
  { label: "Balanced", value: "balanced" },
  { label: "High protein", value: "high_protein" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Pescatarian", value: "pescatarian" }
];

export const equipmentOptions: Array<{ label: string; value: EquipmentType }> = [
  { label: "Bodyweight", value: "bodyweight" },
  { label: "Dumbbells", value: "dumbbells" },
  { label: "Barbell", value: "barbell" },
  { label: "Bands", value: "bands" },
  { label: "Cable", value: "cable" },
  { label: "Machine", value: "machine" },
  { label: "Kettlebell", value: "kettlebell" }
];

export const injuryOptions: Array<{ label: string; value: InjuryArea }> = [
  { label: "Lower back", value: "lower_back" },
  { label: "Shoulder", value: "shoulder" },
  { label: "Knee", value: "knee" },
  { label: "Wrist", value: "wrist" },
  { label: "Ankle", value: "ankle" },
  { label: "Neck", value: "neck" }
];
