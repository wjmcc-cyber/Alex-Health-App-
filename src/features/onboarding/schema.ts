import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Please enter your name."),
  age: z.number().min(16).max(80),
  sex: z.enum(["female", "male", "other"]),
  heightCm: z.number().min(130).max(230),
  weightKg: z.number().min(40).max(250),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  trainingExperienceYears: z.number().min(0).max(40),
  injuries: z.array(z.enum(["lower_back", "shoulder", "knee", "wrist", "ankle", "neck"])),
  dietaryPreference: z.enum(["balanced", "high_protein", "vegetarian", "vegan", "pescatarian"]),
  weeklySessions: z.number().min(2).max(6),
  sessionMinutes: z.number().min(25).max(120),
  scheduleNotes: z.string().max(180),
  availableEquipment: z
    .array(z.enum(["bodyweight", "dumbbells", "barbell", "bands", "cable", "machine", "kettlebell"]))
    .min(1),
  goal: z.enum(["lose_fat", "build_muscle", "recomposition", "athletic_performance"]),
  targetWeightKg: z.number().optional()
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
