import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";

import { OptionChips } from "@/components/OptionChips";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { TextField } from "@/components/TextField";
import {
  dietaryOptions,
  equipmentOptions,
  experienceOptions,
  goalOptions,
  injuryOptions
} from "@/constants/options";
import { calculateNutritionTargets } from "@/features/nutrition/logic/calculateNutritionTargets";
import { onboardingSchema, type OnboardingFormValues } from "@/features/onboarding/schema";
import { generateWorkoutPlan } from "@/features/workouts/logic/generateWorkoutPlan";
import { saveOnboarding } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

const sexOptions = [
  { label: "Female", value: "female" as const },
  { label: "Male", value: "male" as const },
  { label: "Other", value: "other" as const }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const session = useAppStore((state) => state.session);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);
  const { control, handleSubmit, watch, trigger } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: session?.displayName ?? "",
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
      scheduleNotes: "Weeknights and Saturday morning",
      availableEquipment: ["dumbbells", "bodyweight"],
      goal: "recomposition",
      targetWeightKg: 78
    }
  });
  const profilePreview = watch();
  const previewTargets = useMemo(() => calculateNutritionTargets(profilePreview), [profilePreview]);
  const previewPlan = useMemo(() => generateWorkoutPlan(profilePreview), [profilePreview]);
  const mutation = useMutation({
    mutationFn: (values: OnboardingFormValues) => saveOnboarding(values),
    onSuccess: () => {
      router.replace("/(tabs)/dashboard");
    },
    onError: (error: Error) => {
      Alert.alert("Unable to save onboarding", error.message);
    }
  });

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (onboardingComplete) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  const nextStep = async () => {
    const stepFields: Array<Array<keyof OnboardingFormValues>> = [
      ["fullName", "age", "sex", "heightCm", "weightKg", "fitnessLevel", "trainingExperienceYears"],
      ["goal", "weeklySessions", "sessionMinutes", "availableEquipment", "injuries"],
      ["dietaryPreference", "scheduleNotes", "targetWeightKg"]
    ];
    const valid = await trigger(stepFields[step]);

    if (valid) {
      setStep((current) => Math.min(current + 1, 2));
    }
  };

  return (
    <Screen>
      <ScreenHeader
        eyebrow={`Step ${step + 1} of 3`}
        title="Build your launch plan"
        description="Answer a few questions and we'll create your first training split, calorie target, macro budget, and milestone forecast."
      />

      {step === 0 ? (
        <SectionCard subtitle="Baseline metrics and training history" title="About you">
          <TextField control={control} name="fullName" label="Full name" placeholder="Alex Carter" />
          <TextField control={control} name="age" label="Age" placeholder="29" keyboardType="numeric" />
          <Controller
            control={control}
            name="sex"
            render={({ field: { value, onChange } }) => (
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Sex</Text>
                <OptionChips options={sexOptions} selected={[value]} onChange={(values) => onChange(values[0])} />
              </View>
            )}
          />
          <TextField control={control} name="heightCm" label="Height (cm)" placeholder="178" keyboardType="numeric" />
          <TextField control={control} name="weightKg" label="Weight (kg)" placeholder="82" keyboardType="numeric" />
          <Controller
            control={control}
            name="fitnessLevel"
            render={({ field: { value, onChange } }) => (
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Fitness level</Text>
                <OptionChips options={experienceOptions} selected={[value]} onChange={(values) => onChange(values[0])} />
              </View>
            )}
          />
          <TextField
            control={control}
            name="trainingExperienceYears"
            label="Training experience (years)"
            placeholder="3"
            keyboardType="numeric"
          />
        </SectionCard>
      ) : null}

      {step === 1 ? (
        <SectionCard subtitle="Goal, schedule, and practical constraints" title="How you train">
          <Controller
            control={control}
            name="goal"
            render={({ field: { value, onChange } }) => (
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Primary goal</Text>
                <OptionChips options={goalOptions} selected={[value]} onChange={(values) => onChange(values[0])} />
              </View>
            )}
          />
          <TextField control={control} name="weeklySessions" label="Sessions per week" placeholder="4" keyboardType="numeric" />
          <TextField control={control} name="sessionMinutes" label="Minutes per session" placeholder="50" keyboardType="numeric" />
          <Controller
            control={control}
            name="availableEquipment"
            render={({ field: { value, onChange } }) => (
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Available equipment</Text>
                <OptionChips options={equipmentOptions} selected={value} onChange={onChange} multi />
              </View>
            )}
          />
          <Controller
            control={control}
            name="injuries"
            render={({ field: { value, onChange } }) => (
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Injuries or limitations</Text>
                <OptionChips options={injuryOptions} selected={value} onChange={onChange} multi />
              </View>
            )}
          />
        </SectionCard>
      ) : null}

      {step === 2 ? (
        <>
          <SectionCard subtitle="Nutrition preference and schedule notes" title="Nutrition setup">
            <Controller
              control={control}
              name="dietaryPreference"
              render={({ field: { value, onChange } }) => (
                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>Diet style</Text>
                  <OptionChips options={dietaryOptions} selected={[value]} onChange={(values) => onChange(values[0])} />
                </View>
              )}
            />
            <TextField control={control} name="scheduleNotes" label="Schedule notes" placeholder="Weeknights after work" />
            <TextField control={control} name="targetWeightKg" label="Target weight (optional)" placeholder="78" keyboardType="numeric" />
          </SectionCard>

          <SectionCard subtitle="Generated in real time from your inputs" title="Plan preview" tone="accent">
            <Text style={styles.previewLine}>
              Split: <Text style={styles.previewStrong}>{previewPlan.split.replaceAll("_", " ")}</Text>
            </Text>
            <Text style={styles.previewLine}>
              Calories: <Text style={styles.previewStrong}>{previewTargets.calories} kcal/day</Text>
            </Text>
            <Text style={styles.previewLine}>
              Macros: <Text style={styles.previewStrong}>{previewTargets.proteinGrams}P / {previewTargets.carbsGrams}C / {previewTargets.fatsGrams}F</Text>
            </Text>
            <Text style={styles.previewLine}>
              Sessions: <Text style={styles.previewStrong}>{previewPlan.sessions.length} per week</Text>
            </Text>
          </SectionCard>
        </>
      ) : null}

      <View style={styles.buttonRow}>
        {step > 0 ? <PrimaryButton label="Back" onPress={() => setStep((current) => current - 1)} variant="ghost" /> : null}
        {step < 2 ? (
          <PrimaryButton label="Next" onPress={nextStep} />
        ) : (
          <PrimaryButton
            label={mutation.isPending ? "Saving..." : "Generate my plan"}
            onPress={handleSubmit((values) => mutation.mutate(values))}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: spacing.md
  },
  fieldLabel: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.xs
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  previewLine: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.xs
  },
  previewStrong: {
    fontWeight: "700"
  }
});
