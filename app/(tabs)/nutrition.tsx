import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";

import { OptionChips } from "@/components/OptionChips";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { TextField } from "@/components/TextField";
import { createCustomFood, logFoodEntry } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

interface FoodLogValues {
  mealLabel: "breakfast" | "lunch" | "dinner" | "snack";
  foodId: string;
  servings: number;
}

interface CustomFoodValues {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
}

const mealOptions = [
  { label: "Breakfast", value: "breakfast" as const },
  { label: "Lunch", value: "lunch" as const },
  { label: "Dinner", value: "dinner" as const },
  { label: "Snack", value: "snack" as const }
];

export default function NutritionScreen() {
  const queryClient = useQueryClient();
  const session = useAppStore((state) => state.session);
  const nutritionTargets = useAppStore((state) => state.nutritionTargets);
  const foods = useAppStore((state) => state.foods);
  const foodEntries = useAppStore((state) => state.foodEntries);
  const mealSuggestions = useAppStore((state) => state.mealSuggestions);
  const groceryList = useAppStore((state) => state.groceryList);
  const { control, handleSubmit, setValue, watch } = useForm<FoodLogValues>({
    defaultValues: {
      mealLabel: "lunch",
      foodId: foods[0]?.id ?? "",
      servings: 1
    }
  });
  const selectedFoodId = watch("foodId");
  const customFoodForm = useForm<CustomFoodValues>({
    defaultValues: {
      name: "",
      calories: 200,
      protein: 20,
      carbs: 15,
      fats: 6,
      servingSize: "1 serving"
    }
  });
  const selectedFood = useMemo(
    () => foods.find((food) => food.id === selectedFoodId) ?? foods[0],
    [foods, selectedFoodId]
  );
  const logMutation = useMutation({
    mutationFn: async (values: FoodLogValues) => {
      const food = foods.find((item) => item.id === values.foodId);

      if (!food) {
        throw new Error("Select a food item first.");
      }

      await logFoodEntry({
        foodId: food.id,
        date: new Date().toISOString().slice(0, 10),
        mealLabel: values.mealLabel,
        servings: values.servings,
        foodName: food.name,
        calories: Math.round(food.calories * values.servings),
        protein: Math.round(food.protein * values.servings),
        carbs: Math.round(food.carbs * values.servings),
        fats: Math.round(food.fats * values.servings)
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      Alert.alert("Unable to log food", error.message);
    }
  });
  const customFoodMutation = useMutation({
    mutationFn: createCustomFood,
    onSuccess: (food) => {
      setValue("foodId", food.id);
      Alert.alert("Custom food added", `${food.name} is now available in your food list.`);
    },
    onError: (error: Error) => {
      Alert.alert("Unable to add food", error.message);
    }
  });

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (!nutritionTargets) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Nutrition"
        title="Targets and daily logging"
        description="Track intake against calorie and macro goals, save custom foods, and keep a grocery list that matches your plan."
      />

      <SectionCard subtitle="Daily target budget" title={`${nutritionTargets.calories} kcal`}>
        <Text style={styles.targetLine}>
          {nutritionTargets.proteinGrams}g protein | {nutritionTargets.carbsGrams}g carbs | {nutritionTargets.fatsGrams}g fats
        </Text>
        <Text style={styles.targetSubtext}>
          Maintenance estimate: {nutritionTargets.maintenanceCalories} kcal | Adjustment: {nutritionTargets.targetAdjustment} kcal
        </Text>
      </SectionCard>

      <SectionCard subtitle="Manual food search for the MVP" title="Log food">
        <Controller
          control={control}
          name="mealLabel"
          render={({ field: { value, onChange } }) => (
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Meal</Text>
              <OptionChips options={mealOptions} selected={[value]} onChange={(values) => onChange(values[0])} />
            </View>
          )}
        />
        <Controller
          control={control}
          name="foodId"
          render={({ field: { value, onChange } }) => (
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Food</Text>
              <OptionChips
                options={foods.slice(0, 8).map((food) => ({ label: food.name, value: food.id }))}
                selected={[value]}
                onChange={(values) => onChange(values[0])}
              />
            </View>
          )}
        />
        <TextField control={control} name="servings" label="Servings" placeholder="1" keyboardType="numeric" />
        <Text style={styles.selectedFood}>
          Selected: {selectedFood?.name ?? "None"} | {selectedFood?.calories ?? 0} kcal per serving
        </Text>
        <PrimaryButton
          label={logMutation.isPending ? "Logging..." : "Add to daily log"}
          onPress={handleSubmit((values) => logMutation.mutate(values))}
        />
      </SectionCard>

      <SectionCard subtitle="For foods not in the starter library" title="Create custom food">
        <TextField control={customFoodForm.control} name="name" label="Food name" placeholder="Homemade turkey chili" />
        <TextField control={customFoodForm.control} name="calories" label="Calories" placeholder="220" keyboardType="numeric" />
        <TextField control={customFoodForm.control} name="protein" label="Protein" placeholder="24" keyboardType="numeric" />
        <TextField control={customFoodForm.control} name="carbs" label="Carbs" placeholder="18" keyboardType="numeric" />
        <TextField control={customFoodForm.control} name="fats" label="Fats" placeholder="7" keyboardType="numeric" />
        <TextField control={customFoodForm.control} name="servingSize" label="Serving size" placeholder="1 bowl" />
        <PrimaryButton
          label={customFoodMutation.isPending ? "Saving..." : "Save custom food"}
          onPress={customFoodForm.handleSubmit((values) =>
            customFoodMutation.mutate({
              ...values,
              category: "mixed"
            })
          )}
          variant="ghost"
        />
      </SectionCard>

      <SectionCard subtitle="Guided defaults from your goal" title="Meal suggestions">
        {mealSuggestions.map((suggestion) => (
          <View key={suggestion.id} style={styles.suggestionBlock}>
            <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
            <Text style={styles.suggestionText}>{suggestion.description}</Text>
            <Text style={styles.suggestionText}>{suggestion.items.join(" | ")}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard subtitle="Seeded from current meal suggestions" title={groceryList?.title ?? "Grocery list"}>
        {(groceryList?.items ?? []).map((item) => (
          <View key={item.id} style={styles.groceryRow}>
            <Text style={styles.groceryName}>{item.name}</Text>
            <Text style={styles.groceryQty}>{item.quantityLabel}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard subtitle="Most recent additions first" title="Food log">
        {foodEntries.map((entry) => (
          <View key={entry.id} style={styles.logRow}>
            <Text style={styles.groceryName}>{entry.foodName}</Text>
            <Text style={styles.groceryQty}>{entry.calories} kcal | {entry.mealLabel}</Text>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  targetLine: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 20,
    fontWeight: "700"
  },
  targetSubtext: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    marginTop: spacing.xs
  },
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
  selectedFood: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13,
    marginBottom: spacing.md
  },
  suggestionBlock: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
    paddingBottom: spacing.md
  },
  suggestionTitle: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 18,
    fontWeight: "700"
  },
  suggestionText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    marginTop: spacing.xs
  },
  groceryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  groceryName: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: "600"
  },
  groceryQty: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13
  },
  logRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm
  }
});
