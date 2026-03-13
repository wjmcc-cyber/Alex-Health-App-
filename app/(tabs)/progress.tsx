import { useMutation, useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";

import { MetricRow } from "@/components/MetricRow";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { TextField } from "@/components/TextField";
import { TrendChart } from "@/components/TrendChart";
import { getPredictions, logWeight } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

interface WeightFormValues {
  weightKg: number;
}

export default function ProgressScreen() {
  const session = useAppStore((state) => state.session);
  const profile = useAppStore((state) => state.profile);
  const progressMetrics = useAppStore((state) => state.progressMetrics);
  const workoutLogs = useAppStore((state) => state.workoutLogs);
  const predictionsQuery = useQuery({
    queryKey: ["predictions"],
    queryFn: getPredictions
  });
  const form = useForm<WeightFormValues>({
    defaultValues: {
      weightKg: progressMetrics[0]?.weightKg ?? 80
    }
  });
  const mutation = useMutation({
    mutationFn: ({ weightKg }: WeightFormValues) => logWeight(weightKg),
    onError: (error: Error) => {
      Alert.alert("Unable to log weight", error.message);
    }
  });

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (!profile) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Progress"
        title="Trend view"
        description="Track scale weight, session consistency, and your conservative forecast over 3 and 6 months."
      />

      <SectionCard subtitle="Most recent entries first" title="Body weight trend">
        <TrendChart
          labels={progressMetrics.slice(0, 6).reverse().map((metric) => metric.date.slice(5, 10))}
          values={progressMetrics.slice(0, 6).reverse().map((metric) => metric.weightKg)}
          unit="kg"
        />
      </SectionCard>

      <SectionCard subtitle="Workout and calorie signals" title="Consistency snapshot">
        <MetricRow label="Workout completions" value={`${workoutLogs.length}`} />
        <MetricRow
          label="Average calories"
          value={`${Math.round(
            progressMetrics.reduce((sum, metric) => sum + metric.caloriesConsumed, 0) / Math.max(progressMetrics.length, 1)
          )} kcal`}
        />
        <MetricRow label="Latest body weight" value={`${progressMetrics[0]?.weightKg ?? 0} kg`} />
      </SectionCard>

      <SectionCard subtitle="Conservative coaching estimates" title="Forecast ranges">
        {predictionsQuery.data?.map((prediction) => (
          <View key={prediction.id} style={styles.predictionBlock}>
            <Text style={styles.predictionTitle}>
              {prediction.horizon === "3_month" ? "3 month forecast" : "6 month forecast"}
            </Text>
            <Text style={styles.predictionRange}>
              {prediction.expectedWeightRangeKg.low} to {prediction.expectedWeightRangeKg.high} kg
            </Text>
            <Text style={styles.predictionText}>{prediction.bodyCompositionDirection}</Text>
            <Text style={styles.predictionText}>Confidence: {prediction.confidence}</Text>
            <Text style={styles.predictionText}>{prediction.explanation}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard subtitle="Add fresh data to update the forecast" title="Log weight">
        <TextField control={form.control} name="weightKg" label="Current weight (kg)" placeholder="80" keyboardType="numeric" />
        <PrimaryButton
          label={mutation.isPending ? "Saving..." : "Save weight entry"}
          onPress={form.handleSubmit((values) => mutation.mutate(values))}
        />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  predictionBlock: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
    paddingBottom: spacing.md
  },
  predictionTitle: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 18,
    fontWeight: "700"
  },
  predictionRange: {
    color: colors.accentStrong,
    fontFamily: typography.title,
    fontSize: 22,
    fontWeight: "800",
    marginTop: spacing.xs
  },
  predictionText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  }
});
