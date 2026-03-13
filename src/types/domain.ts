export type GoalType =
  | "lose_fat"
  | "build_muscle"
  | "recomposition"
  | "athletic_performance";

export type BiologicalSex = "female" | "male" | "other";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type WorkoutSplit = "full_body" | "upper_lower" | "push_pull_legs";
export type EquipmentType =
  | "bodyweight"
  | "dumbbells"
  | "barbell"
  | "bands"
  | "cable"
  | "machine"
  | "kettlebell";
export type InjuryArea =
  | "lower_back"
  | "shoulder"
  | "knee"
  | "wrist"
  | "ankle"
  | "neck";
export type DietaryPreference =
  | "balanced"
  | "high_protein"
  | "vegetarian"
  | "vegan"
  | "pescatarian";

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
}

export interface UserProfileInput {
  fullName: string;
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  fitnessLevel: ExperienceLevel;
  trainingExperienceYears: number;
  injuries: InjuryArea[];
  dietaryPreference: DietaryPreference;
  weeklySessions: number;
  sessionMinutes: number;
  scheduleNotes: string;
  availableEquipment: EquipmentType[];
  goal: GoalType;
  targetWeightKg?: number;
}

export interface UserProfile extends UserProfileInput {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: "push" | "pull" | "legs" | "core" | "conditioning";
  primaryMuscles: string[];
  equipment: EquipmentType[];
  injuryTags: InjuryArea[];
  coachingCue: string;
  substitutions: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  note: string;
  substitutions: string[];
}

export interface WorkoutDay {
  id: string;
  dayLabel: string;
  focus: string;
  estimatedMinutes: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  split: WorkoutSplit;
  coachingSummary: string;
  weeklyFrequency: number;
  sessions: WorkoutDay[];
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  workoutDayId: string;
  completedAt: string;
  perceivedEffort: number;
  notes: string;
}

export interface NutritionTargets {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  hydrationLiters: number;
  maintenanceCalories: number;
  targetAdjustment: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
  category: "protein" | "carbs" | "fat" | "produce" | "mixed";
  isCustom?: boolean;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  date: string;
  mealLabel: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealSuggestion {
  id: string;
  title: string;
  description: string;
  category: "pre_workout" | "post_workout" | "high_protein" | "quick_prep";
  items: string[];
}

export interface GroceryListItem {
  id: string;
  name: string;
  quantityLabel: string;
}

export interface GroceryList {
  id: string;
  title: string;
  items: GroceryListItem[];
}

export interface ProgressMetric {
  id: string;
  date: string;
  weightKg: number;
  workoutMinutes: number;
  caloriesConsumed: number;
  calorieTarget: number;
}

export interface AdherenceScore {
  overall: number;
  workout: number;
  nutrition: number;
  logging: number;
  weightTrend: number;
  label: "needs_attention" | "steady" | "excellent";
}

export interface PredictionRange {
  low: number;
  high: number;
}

export interface PredictionSnapshot {
  id: string;
  createdAt: string;
  horizon: "3_month" | "6_month";
  expectedWeightRangeKg: PredictionRange;
  bodyCompositionDirection: string;
  confidence: "low" | "moderate" | "high";
  assumptions: string[];
  explanation: string;
}

export interface WearableIntegration {
  id: string;
  provider: "apple_health" | "google_fit" | "garmin" | "whoop";
  status: "not_connected" | "connected" | "error";
  lastSyncAt?: string;
}

export interface BodyScanJob {
  id: string;
  createdAt: string;
  status: "pending" | "processing" | "complete";
  uploadCount: number;
}

export interface BodyScanResult {
  id: string;
  bodyFatEstimate?: number;
  leanMassEstimateKg?: number;
  postureSummary: string;
  symmetrySummary: string;
  confidence: "not_available" | "experimental";
}

export interface DashboardSnapshot {
  todaysWorkout?: WorkoutDay;
  nutritionTargets: NutritionTargets;
  remainingCalories: number;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFats: number;
  adherence: AdherenceScore;
  nextMilestone: string;
  currentWeightKg: number;
}
