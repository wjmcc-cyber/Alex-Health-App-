import type { GoalType, NutritionTargets, UserProfileInput } from "@/types/domain";

function getActivityMultiplier(weeklySessions: number, sessionMinutes: number): number {
  const sessionLoad = weeklySessions * sessionMinutes;

  if (sessionLoad <= 90) {
    return 1.35;
  }

  if (sessionLoad <= 180) {
    return 1.45;
  }

  if (sessionLoad <= 270) {
    return 1.55;
  }

  return 1.65;
}

function getGoalAdjustment(goal: GoalType): number {
  switch (goal) {
    case "lose_fat":
      return -450;
    case "build_muscle":
      return 225;
    case "recomposition":
      return -125;
    case "athletic_performance":
      return 150;
    default:
      return 0;
  }
}

export function calculateNutritionTargets(profile: UserProfileInput): NutritionTargets {
  const baseBmr =
    10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + (profile.sex === "male" ? 5 : -161);
  const activityMultiplier = getActivityMultiplier(profile.weeklySessions, profile.sessionMinutes);
  const maintenanceCalories = Math.round(baseBmr * activityMultiplier);
  const targetAdjustment = getGoalAdjustment(profile.goal);
  const calories = Math.max(1500, maintenanceCalories + targetAdjustment);

  const proteinPerKg =
    profile.goal === "build_muscle" || profile.goal === "recomposition" ? 2.1 : 1.9;
  const proteinGrams = Math.round(profile.weightKg * proteinPerKg);
  const fatsGrams = Math.round((calories * 0.27) / 9);
  const carbsCalories = calories - proteinGrams * 4 - fatsGrams * 9;
  const carbsGrams = Math.max(110, Math.round(carbsCalories / 4));
  const fiberGrams = Math.round(calories / 1000 * 14);
  const hydrationLiters = Number((profile.weightKg * 0.033).toFixed(1));

  return {
    calories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    fiberGrams,
    hydrationLiters,
    maintenanceCalories,
    targetAdjustment
  };
}
