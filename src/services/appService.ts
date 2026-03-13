import { buildDashboardSnapshot } from "@/features/dashboard/logic/buildDashboardSnapshot";
import { calculateNutritionTargets } from "@/features/nutrition/logic/calculateNutritionTargets";
import { predictGoalOutcome } from "@/features/predictions/logic/predictGoalOutcome";
import { generateWorkoutPlan } from "@/features/workouts/logic/generateWorkoutPlan";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import { createId } from "@/services/ids";
import { persistGeneratedProgram } from "@/services/supabasePersistence";
import { useAppStore } from "@/store/appStore";
import type {
  DashboardSnapshot,
  FoodEntry,
  FoodItem,
  NutritionTargets,
  SessionUser,
  UserProfile,
  UserProfileInput,
  WorkoutPlan
} from "@/types/domain";

function previewSignIn(email: string): SessionUser {
  const displayName = email.split("@")[0] ?? "Athlete";
  return {
    id: createId("session-user"),
    email,
    displayName
  };
}

export async function signIn(email: string, password: string): Promise<SessionUser> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const response = await supabase.auth.signInWithPassword({ email, password });

    if (response.error || !response.data.user) {
      throw new Error(response.error?.message ?? "Unable to sign in.");
    }

    return {
      id: response.data.user.id,
      email: response.data.user.email ?? email,
      displayName: response.data.user.user_metadata.full_name ?? email.split("@")[0]
    };
  }

  void password;
  return previewSignIn(email);
}

export async function signUp(email: string, password: string, fullName: string): Promise<SessionUser> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (response.error || !response.data.user) {
      throw new Error(response.error?.message ?? "Unable to create account.");
    }

    return {
      id: response.data.user.id,
      email: response.data.user.email ?? email,
      displayName: fullName
    };
  }

  return {
    id: createId("session-user"),
    email,
    displayName: fullName
  };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const response = await supabase.auth.signOut();

    if (response.error) {
      throw new Error(response.error.message);
    }
  }
}

export async function saveOnboarding(profileInput: UserProfileInput): Promise<{
  profile: UserProfile;
  workoutPlan: WorkoutPlan;
  nutritionTargets: NutritionTargets;
}> {
  const state = useAppStore.getState();

  if (!state.session) {
    throw new Error("No active session.");
  }

  const now = new Date().toISOString();
  const profile: UserProfile = {
    id: createId("profile"),
    email: state.session.email,
    createdAt: now,
    updatedAt: now,
    ...profileInput
  };
  const workoutPlan = generateWorkoutPlan(profile);
  const nutritionTargets = calculateNutritionTargets(profile);
  const predictions = predictGoalOutcome({
    profile,
    workoutPlan,
    workoutLogs: [],
    nutritionTargets,
    progressMetrics: [
      {
        id: createId("metric"),
        date: now,
        weightKg: profile.weightKg,
        workoutMinutes: 0,
        caloriesConsumed: Math.round(nutritionTargets.calories * 0.92),
        calorieTarget: nutritionTargets.calories
      }
    ]
  });

  if (isSupabaseConfigured) {
    await persistGeneratedProgram({
      userId: state.session.id,
      profile,
      workoutPlan,
      nutritionTargets,
      predictions
    });
  }

  state.setGeneratedProgram({
    profile,
    workoutPlan,
    nutritionTargets,
    predictions
  });

  return { profile, workoutPlan, nutritionTargets };
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot | null> {
  const state = useAppStore.getState();

  if (!state.profile || !state.nutritionTargets) {
    return null;
  }

  return buildDashboardSnapshot({
    profile: state.profile,
    workoutPlan: state.workoutPlan,
    nutritionTargets: state.nutritionTargets,
    foodEntries: state.foodEntries,
    workoutLogs: state.workoutLogs,
    progressMetrics: state.progressMetrics,
    predictions: state.predictions
  });
}

export async function logFoodEntry(entry: Omit<FoodEntry, "id">): Promise<void> {
  useAppStore.getState().addFoodEntry(entry);
}

export async function createCustomFood(food: Omit<FoodItem, "id">): Promise<FoodItem> {
  return useAppStore.getState().addCustomFood(food);
}

export async function markWorkoutComplete(workoutDayId: string): Promise<void> {
  useAppStore.getState().logWorkoutCompletion(workoutDayId);
}

export async function logWeight(weightKg: number): Promise<void> {
  useAppStore.getState().logWeight(weightKg);
}

export async function getPredictions() {
  const state = useAppStore.getState();

  if (!state.profile || !state.nutritionTargets) {
    return [];
  }

  return predictGoalOutcome({
    profile: state.profile,
    workoutPlan: state.workoutPlan,
    workoutLogs: state.workoutLogs,
    nutritionTargets: state.nutritionTargets,
    progressMetrics: state.progressMetrics
  });
}
