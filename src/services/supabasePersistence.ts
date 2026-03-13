import { getSupabaseClient } from "@/lib/supabase";
import type { NutritionTargets, PredictionSnapshot, UserProfile, WorkoutPlan } from "@/types/domain";

async function replaceChildRows(table: string, userId: string, rows: Record<string, unknown>[]) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  await supabase.from(table).delete().eq("user_id", userId);

  if (rows.length > 0) {
    const insertResponse = await supabase.from(table).insert(rows);

    if (insertResponse.error) {
      throw new Error(insertResponse.error.message);
    }
  }
}

export async function persistGeneratedProgram(input: {
  userId: string;
  profile: UserProfile;
  workoutPlan: WorkoutPlan;
  nutritionTargets: NutritionTargets;
  predictions: PredictionSnapshot[];
}): Promise<void> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  const profileResponse = await supabase.from("profiles").upsert({
    id: input.profile.id,
    user_id: input.userId,
    full_name: input.profile.fullName,
    age: input.profile.age,
    sex: input.profile.sex,
    height_cm: input.profile.heightCm,
    weight_kg: input.profile.weightKg,
    fitness_level: input.profile.fitnessLevel,
    training_experience_years: input.profile.trainingExperienceYears,
    dietary_preference: input.profile.dietaryPreference,
    weekly_sessions: input.profile.weeklySessions,
    session_minutes: input.profile.sessionMinutes,
    schedule_notes: input.profile.scheduleNotes
  });

  if (profileResponse.error) {
    throw new Error(profileResponse.error.message);
  }

  const goalResponse = await supabase.from("goals").upsert({
    user_id: input.userId,
    goal_type: input.profile.goal,
    starting_weight_kg: input.profile.weightKg,
    target_weight_kg: input.profile.targetWeightKg ?? null
  });

  if (goalResponse.error) {
    throw new Error(goalResponse.error.message);
  }

  const nutritionResponse = await supabase.from("nutrition_targets").upsert({
    user_id: input.userId,
    calories: input.nutritionTargets.calories,
    protein_grams: input.nutritionTargets.proteinGrams,
    carbs_grams: input.nutritionTargets.carbsGrams,
    fats_grams: input.nutritionTargets.fatsGrams,
    fiber_grams: input.nutritionTargets.fiberGrams,
    hydration_liters: input.nutritionTargets.hydrationLiters,
    maintenance_calories: input.nutritionTargets.maintenanceCalories,
    target_adjustment: input.nutritionTargets.targetAdjustment
  });

  if (nutritionResponse.error) {
    throw new Error(nutritionResponse.error.message);
  }

  const workoutPlanResponse = await supabase.from("workout_plans").upsert({
    id: input.workoutPlan.id,
    user_id: input.userId,
    split: input.workoutPlan.split,
    coaching_summary: input.workoutPlan.coachingSummary,
    weekly_frequency: input.workoutPlan.weeklyFrequency
  });

  if (workoutPlanResponse.error) {
    throw new Error(workoutPlanResponse.error.message);
  }

  await replaceChildRows(
    "equipment_inventory",
    input.userId,
    input.profile.availableEquipment.map((equipment) => ({
      user_id: input.userId,
      equipment_type: equipment
    }))
  );
  await replaceChildRows(
    "injuries_or_limitations",
    input.userId,
    input.profile.injuries.map((injury) => ({
      user_id: input.userId,
      limitation_area: injury
    }))
  );
  await replaceChildRows(
    "workout_days",
    input.userId,
    input.workoutPlan.sessions.map((sessionDay, index) => ({
      id: sessionDay.id,
      user_id: input.userId,
      workout_plan_id: input.workoutPlan.id,
      sort_order: index,
      day_label: sessionDay.dayLabel,
      focus: sessionDay.focus,
      estimated_minutes: sessionDay.estimatedMinutes,
      exercises_json: sessionDay.exercises
    }))
  );
  await replaceChildRows(
    "prediction_snapshots",
    input.userId,
    input.predictions.map((prediction) => ({
      id: prediction.id,
      user_id: input.userId,
      horizon: prediction.horizon,
      expected_weight_low_kg: prediction.expectedWeightRangeKg.low,
      expected_weight_high_kg: prediction.expectedWeightRangeKg.high,
      body_composition_direction: prediction.bodyCompositionDirection,
      confidence: prediction.confidence,
      assumptions_json: prediction.assumptions,
      explanation: prediction.explanation
    }))
  );
}
