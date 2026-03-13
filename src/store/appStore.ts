import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { foodLibrary } from "@/features/nutrition/data/foods";
import { buildMealSuggestions } from "@/features/nutrition/logic/buildMealSuggestions";
import { predictGoalOutcome } from "@/features/predictions/logic/predictGoalOutcome";
import { createId } from "@/services/ids";
import type {
  FoodEntry,
  FoodItem,
  GroceryList,
  MealSuggestion,
  NutritionTargets,
  PredictionSnapshot,
  ProgressMetric,
  SessionUser,
  UserProfile,
  WorkoutLog,
  WorkoutPlan
} from "@/types/domain";

interface AppState {
  session: SessionUser | null;
  onboardingComplete: boolean;
  profile: UserProfile | null;
  workoutPlan: WorkoutPlan | null;
  nutritionTargets: NutritionTargets | null;
  foods: FoodItem[];
  foodEntries: FoodEntry[];
  workoutLogs: WorkoutLog[];
  progressMetrics: ProgressMetric[];
  predictions: PredictionSnapshot[];
  mealSuggestions: MealSuggestion[];
  groceryList: GroceryList | null;
  setSession: (_session: SessionUser | null) => void;
  setGeneratedProgram: (input: {
    profile: UserProfile;
    workoutPlan: WorkoutPlan;
    nutritionTargets: NutritionTargets;
    predictions: PredictionSnapshot[];
  }) => void;
  addFoodEntry: (_entry: Omit<FoodEntry, "id">) => void;
  addCustomFood: (_food: Omit<FoodItem, "id">) => FoodItem;
  logWorkoutCompletion: (_workoutDayId: string) => void;
  logWeight: (_weightKg: number) => void;
  resetAll: () => void;
}

const seededProgress: ProgressMetric[] = [
  {
    id: "metric-1",
    date: new Date().toISOString(),
    weightKg: 78.4,
    workoutMinutes: 0,
    caloriesConsumed: 0,
    calorieTarget: 0
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: null,
      onboardingComplete: false,
      profile: null,
      workoutPlan: null,
      nutritionTargets: null,
      foods: foodLibrary,
      foodEntries: [],
      workoutLogs: [],
      progressMetrics: seededProgress,
      predictions: [],
      mealSuggestions: [],
      groceryList: null,
      setSession: (session) => set({ session }),
      setGeneratedProgram: ({ profile, workoutPlan, nutritionTargets, predictions }) => {
        const now = new Date().toISOString();
        const progressMetrics: ProgressMetric[] = [
          {
            id: createId("metric"),
            date: now,
            weightKg: profile.weightKg,
            workoutMinutes: 0,
            caloriesConsumed: Math.round(nutritionTargets.calories * 0.92),
            calorieTarget: nutritionTargets.calories
          }
        ];
        const mealBundle = buildMealSuggestions(profile.goal, get().foods);

        set({
          onboardingComplete: true,
          profile,
          nutritionTargets,
          workoutPlan,
          progressMetrics,
          predictions,
          mealSuggestions: mealBundle.mealSuggestions,
          groceryList: mealBundle.groceryList
        });
      },
      addFoodEntry: (entry) => {
        const nextEntry: FoodEntry = {
          id: createId("food-entry"),
          ...entry
        };
        const nextEntries = [nextEntry, ...get().foodEntries];
        const latestMetric = get().progressMetrics[0];
        const caloriesConsumed = nextEntries
          .filter((item) => item.date === entry.date)
          .reduce((sum, item) => sum + item.calories, 0);
        const updatedMetric = latestMetric
          ? {
              ...latestMetric,
              caloriesConsumed
            }
          : undefined;

        set({
          foodEntries: nextEntries,
          progressMetrics: updatedMetric
            ? [updatedMetric, ...get().progressMetrics.slice(1)]
            : get().progressMetrics
        });
      },
      addCustomFood: (food) => {
        const nextFood: FoodItem = {
          id: createId("food"),
          isCustom: true,
          ...food
        };
        set({
          foods: [nextFood, ...get().foods]
        });
        return nextFood;
      },
      logWorkoutCompletion: (workoutDayId) => {
        const log: WorkoutLog = {
          id: createId("workout-log"),
          workoutDayId,
          completedAt: new Date().toISOString(),
          perceivedEffort: 7,
          notes: "Completed as prescribed."
        };
        const nextWorkoutLogs = [log, ...get().workoutLogs];
        const latestMetric = get().progressMetrics[0];
        const updatedMetric = latestMetric
          ? {
              ...latestMetric,
              workoutMinutes: latestMetric.workoutMinutes + 45
            }
          : undefined;
        const profile = get().profile;
        const workoutPlan = get().workoutPlan;
        const nutritionTargets = get().nutritionTargets;

        set({
          workoutLogs: nextWorkoutLogs,
          progressMetrics: updatedMetric
            ? [updatedMetric, ...get().progressMetrics.slice(1)]
            : get().progressMetrics
        });

        if (profile && nutritionTargets) {
          set({
            predictions: predictGoalOutcome({
              profile,
              workoutPlan,
              workoutLogs: nextWorkoutLogs,
              nutritionTargets,
              progressMetrics: get().progressMetrics
            })
          });
        }
      },
      logWeight: (weightKg) => {
        const current = get().progressMetrics[0];
        const nutritionTargets = get().nutritionTargets;
        const nextMetric: ProgressMetric = {
          id: createId("metric"),
          date: new Date().toISOString(),
          weightKg,
          workoutMinutes: current?.workoutMinutes ?? 0,
          caloriesConsumed: current?.caloriesConsumed ?? 0,
          calorieTarget: nutritionTargets?.calories ?? current?.calorieTarget ?? 0
        };
        const profile = get().profile;
        const nextProgressMetrics = [nextMetric, ...get().progressMetrics];

        set({
          progressMetrics: nextProgressMetrics
        });

        if (profile && nutritionTargets) {
          set({
            predictions: predictGoalOutcome({
              profile,
              workoutPlan: get().workoutPlan,
              workoutLogs: get().workoutLogs,
              nutritionTargets,
              progressMetrics: nextProgressMetrics
            })
          });
        }
      },
      resetAll: () =>
        set({
          session: null,
          onboardingComplete: false,
          profile: null,
          workoutPlan: null,
          nutritionTargets: null,
          foods: foodLibrary,
          foodEntries: [],
          workoutLogs: [],
          progressMetrics: seededProgress,
          predictions: [],
          mealSuggestions: [],
          groceryList: null
        })
    }),
    {
      name: "alex-health-store",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
