import type { ExerciseDefinition } from "@/types/domain";

export const exerciseLibrary: ExerciseDefinition[] = [
  {
    id: "goblet-squat",
    name: "Goblet Squat",
    category: "legs",
    primaryMuscles: ["quads", "glutes"],
    equipment: ["dumbbells", "kettlebell"],
    injuryTags: ["knee"],
    coachingCue: "Keep ribs stacked over hips and drive through mid-foot.",
    substitutions: ["split-squat", "leg-press"]
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "legs",
    primaryMuscles: ["hamstrings", "glutes"],
    equipment: ["dumbbells", "barbell"],
    injuryTags: ["lower_back"],
    coachingCue: "Hinge back softly and keep the load close.",
    substitutions: ["hip-thrust", "hamstring-curl"]
  },
  {
    id: "push-up",
    name: "Push-Up",
    category: "push",
    primaryMuscles: ["chest", "triceps"],
    equipment: ["bodyweight"],
    injuryTags: ["wrist", "shoulder"],
    coachingCue: "Brace the trunk and keep the floor away as you press.",
    substitutions: ["machine-chest-press", "dumbbell-bench-press"]
  },
  {
    id: "dumbbell-bench-press",
    name: "Dumbbell Bench Press",
    category: "push",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    equipment: ["dumbbells"],
    injuryTags: ["shoulder", "wrist"],
    coachingCue: "Lower under control and keep elbows stacked under wrists.",
    substitutions: ["push-up", "machine-chest-press"]
  },
  {
    id: "seated-row",
    name: "Seated Cable Row",
    category: "pull",
    primaryMuscles: ["lats", "upper_back"],
    equipment: ["cable"],
    injuryTags: ["lower_back"],
    coachingCue: "Pull elbows toward the torso and pause at the finish.",
    substitutions: ["one-arm-row", "band-row"]
  },
  {
    id: "one-arm-row",
    name: "One-Arm Dumbbell Row",
    category: "pull",
    primaryMuscles: ["lats", "upper_back"],
    equipment: ["dumbbells"],
    injuryTags: ["lower_back"],
    coachingCue: "Brace through the bench and sweep your elbow toward your hip.",
    substitutions: ["seated-row", "band-row"]
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: "pull",
    primaryMuscles: ["lats", "biceps"],
    equipment: ["cable", "machine"],
    injuryTags: ["shoulder", "neck"],
    coachingCue: "Lead with elbows and avoid leaning back to finish the rep.",
    substitutions: ["assisted-pull-up", "band-row"]
  },
  {
    id: "split-squat",
    name: "Rear Foot Elevated Split Squat",
    category: "legs",
    primaryMuscles: ["quads", "glutes"],
    equipment: ["bodyweight", "dumbbells"],
    injuryTags: ["knee", "ankle"],
    coachingCue: "Stay tall and let the front knee travel naturally.",
    substitutions: ["goblet-squat", "step-up"]
  },
  {
    id: "overhead-press",
    name: "Standing Overhead Press",
    category: "push",
    primaryMuscles: ["shoulders", "triceps"],
    equipment: ["dumbbells", "barbell"],
    injuryTags: ["shoulder", "lower_back", "neck"],
    coachingCue: "Squeeze glutes and press with ribs stacked.",
    substitutions: ["landmine-press", "incline-press"]
  },
  {
    id: "landmine-press",
    name: "Half-Kneeling Landmine Press",
    category: "push",
    primaryMuscles: ["shoulders", "upper_chest"],
    equipment: ["barbell"],
    injuryTags: ["shoulder", "knee"],
    coachingCue: "Press slightly forward and keep your front ribs quiet.",
    substitutions: ["incline-press", "machine-chest-press"]
  },
  {
    id: "hip-thrust",
    name: "Hip Thrust",
    category: "legs",
    primaryMuscles: ["glutes", "hamstrings"],
    equipment: ["barbell", "dumbbells"],
    injuryTags: ["lower_back", "neck"],
    coachingCue: "Finish with glutes, not lumbar extension.",
    substitutions: ["romanian-deadlift", "glute-bridge"]
  },
  {
    id: "plank",
    name: "Front Plank",
    category: "core",
    primaryMuscles: ["core"],
    equipment: ["bodyweight"],
    injuryTags: ["shoulder", "lower_back"],
    coachingCue: "Exhale fully and keep a straight line through the body.",
    substitutions: ["dead-bug", "side-plank"]
  },
  {
    id: "bike-erg",
    name: "Bike Erg Intervals",
    category: "conditioning",
    primaryMuscles: ["conditioning"],
    equipment: ["machine"],
    injuryTags: ["knee", "ankle"],
    coachingCue: "Keep efforts short, crisp, and repeatable.",
    substitutions: ["incline-walk", "rower-intervals"]
  },
  {
    id: "leg-press",
    name: "Leg Press",
    category: "legs",
    primaryMuscles: ["quads", "glutes"],
    equipment: ["machine"],
    injuryTags: ["knee", "lower_back"],
    coachingCue: "Control the bottom and keep the pelvis stable.",
    substitutions: ["goblet-squat", "split-squat"]
  },
  {
    id: "band-row",
    name: "Band Row",
    category: "pull",
    primaryMuscles: ["upper_back", "biceps"],
    equipment: ["bands"],
    injuryTags: ["shoulder"],
    coachingCue: "Set the shoulders first, then finish with elbows.",
    substitutions: ["one-arm-row", "seated-row"]
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    category: "core",
    primaryMuscles: ["core"],
    equipment: ["bodyweight"],
    injuryTags: ["neck", "lower_back"],
    coachingCue: "Move slowly and keep the low back gently planted.",
    substitutions: ["plank", "side-plank"]
  }
];
