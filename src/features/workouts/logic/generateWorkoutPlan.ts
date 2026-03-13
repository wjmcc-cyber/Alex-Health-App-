import { exerciseLibrary } from "@/features/workouts/data/exercises";
import type {
  ExerciseDefinition,
  GoalType,
  UserProfileInput,
  WorkoutDay,
  WorkoutExercise,
  WorkoutPlan,
  WorkoutSplit
} from "@/types/domain";

function chooseSplit(frequency: number): WorkoutSplit {
  if (frequency <= 3) {
    return "full_body";
  }

  if (frequency === 4) {
    return "upper_lower";
  }

  return "push_pull_legs";
}

function filterExercises(
  profile: UserProfileInput,
  category: ExerciseDefinition["category"]
): ExerciseDefinition[] {
  return exerciseLibrary.filter((exercise) => {
    const equipmentMatch =
      exercise.equipment.includes("bodyweight") ||
      exercise.equipment.some((item) => profile.availableEquipment.includes(item));
    const injuryConflict = exercise.injuryTags.some((injury) => profile.injuries.includes(injury));

    return equipmentMatch && !injuryConflict && exercise.category === category;
  });
}

function prescription(
  goal: GoalType,
  category: ExerciseDefinition["category"]
): Pick<WorkoutExercise, "sets" | "reps" | "restSeconds"> {
  if (goal === "athletic_performance" && category === "conditioning") {
    return { sets: 6, reps: "30 sec hard / 60 sec easy", restSeconds: 60 };
  }

  if (goal === "lose_fat") {
    return {
      sets: 3,
      reps: category === "conditioning" ? "10 min intervals" : "10-14",
      restSeconds: 60
    };
  }

  if (goal === "build_muscle") {
    return {
      sets: category === "core" ? 3 : 4,
      reps: "6-10",
      restSeconds: 90
    };
  }

  if (goal === "recomposition") {
    return {
      sets: 3,
      reps: "8-12",
      restSeconds: 75
    };
  }

  return {
    sets: 4,
    reps: category === "conditioning" ? "8 rounds" : "5-8",
    restSeconds: 105
  };
}

function buildExercise(exercise: ExerciseDefinition, goal: GoalType): WorkoutExercise {
  const setPrescription = prescription(goal, exercise.category);

  return {
    exerciseId: exercise.id,
    name: exercise.name,
    sets: setPrescription.sets,
    reps: setPrescription.reps,
    restSeconds: setPrescription.restSeconds,
    note: exercise.coachingCue,
    substitutions: exercise.substitutions
  };
}

function fallbackExercise(category: ExerciseDefinition["category"]): ExerciseDefinition {
  const fallback = exerciseLibrary.find((exercise) => exercise.category === category);

  if (!fallback) {
    throw new Error(`Missing fallback exercise for category: ${category}`);
  }

  return fallback;
}

function takeExercises(
  profile: UserProfileInput,
  category: ExerciseDefinition["category"],
  count: number
): WorkoutExercise[] {
  const matches = filterExercises(profile, category);
  const usable = matches.length > 0 ? matches : [fallbackExercise(category)];

  return usable.slice(0, count).map((exercise) => buildExercise(exercise, profile.goal));
}

function buildDay(
  profile: UserProfileInput,
  id: string,
  dayLabel: string,
  focus: string,
  categories: ExerciseDefinition["category"][]
): WorkoutDay {
  const exercises = categories.flatMap((category, index) =>
    takeExercises(profile, category, index === 0 ? 2 : 1)
  );

  return {
    id,
    dayLabel,
    focus,
    estimatedMinutes: Math.min(profile.sessionMinutes, 35 + exercises.length * 10),
    exercises
  };
}

export function generateWorkoutPlan(profile: UserProfileInput): WorkoutPlan {
  const split = chooseSplit(profile.weeklySessions);
  const createdAt = new Date().toISOString();
  let sessions: WorkoutDay[] = [];

  if (split === "full_body") {
    sessions = [
      buildDay(profile, "day-1", "Monday", "Full Body A", ["legs", "push", "pull", "core"]),
      buildDay(profile, "day-2", "Wednesday", "Full Body B", ["legs", "pull", "push", "conditioning"]),
      buildDay(profile, "day-3", "Friday", "Full Body C", ["legs", "push", "pull", "core"])
    ].slice(0, profile.weeklySessions);
  }

  if (split === "upper_lower") {
    sessions = [
      buildDay(profile, "day-1", "Monday", "Upper Strength", ["push", "pull", "core"]),
      buildDay(profile, "day-2", "Tuesday", "Lower Strength", ["legs", "core"]),
      buildDay(profile, "day-3", "Thursday", "Upper Volume", ["push", "pull", "conditioning"]),
      buildDay(profile, "day-4", "Saturday", "Lower Volume", ["legs", "core", "conditioning"])
    ];
  }

  if (split === "push_pull_legs") {
    sessions = [
      buildDay(profile, "day-1", "Monday", "Push", ["push", "core"]),
      buildDay(profile, "day-2", "Tuesday", "Pull", ["pull", "core"]),
      buildDay(profile, "day-3", "Wednesday", "Legs", ["legs", "core"]),
      buildDay(profile, "day-4", "Friday", "Push + Conditioning", ["push", "conditioning"]),
      buildDay(profile, "day-5", "Saturday", "Pull + Legs", ["pull", "legs"])
    ].slice(0, Math.min(profile.weeklySessions, 5));
  }

  return {
    id: `plan-${createdAt}`,
    split,
    coachingSummary:
      split === "full_body"
        ? "Three high-value full body sessions keep recovery simple while building consistency."
        : split === "upper_lower"
          ? "Upper/lower balances frequency and recovery for a busy week."
          : "Push/pull/legs gives enough volume for progress while staying practical.",
    weeklyFrequency: profile.weeklySessions,
    sessions,
    createdAt
  };
}
