import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { MetricRow } from "@/components/MetricRow";
import { ProgressBar } from "@/components/ProgressBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
import { getDashboardSnapshot } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

export default function DashboardScreen() {
  const session = useAppStore((state) => state.session);
  const profile = useAppStore((state) => state.profile);
  const predictions = useAppStore((state) => state.predictions);
  const dashboardQuery = useQuery({
    queryKey: ["dashboard", profile?.id],
    queryFn: getDashboardSnapshot
  });

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (!profile) {
    return <Redirect href="/(onboarding)" />;
  }

  const snapshot = dashboardQuery.data;

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Dashboard"
        title={`Today for ${profile.fullName.split(" ")[0]}`}
        description="A quick read on training, intake, adherence, and your next realistic milestone."
      />

      <SectionCard subtitle="The next highest-value session on your plan" title="Today's workout" tone="accent">
        <Text style={styles.bigLine}>{snapshot?.todaysWorkout?.focus ?? "Plan is loading"}</Text>
        <Text style={styles.mutedLine}>
          {snapshot?.todaysWorkout?.exercises.length ?? 0} exercises | {snapshot?.todaysWorkout?.estimatedMinutes ?? 0} minutes
        </Text>
      </SectionCard>

      <View style={styles.statGrid}>
        <StatCard label="Calories remaining" value={`${snapshot?.remainingCalories ?? 0}`} hint="kcal left today" />
        <StatCard label="Current weight" value={`${snapshot?.currentWeightKg ?? profile.weightKg} kg`} hint="latest log" />
      </View>

      <SectionCard subtitle="Live intake versus target" title="Macro summary">
        <MetricRow
          label="Calories"
          value={`${snapshot?.consumedCalories ?? 0} / ${snapshot?.nutritionTargets.calories ?? 0} kcal`}
        />
        <MetricRow
          label="Protein"
          value={`${snapshot?.consumedProtein ?? 0} / ${snapshot?.nutritionTargets.proteinGrams ?? 0} g`}
        />
        <MetricRow
          label="Carbs"
          value={`${snapshot?.consumedCarbs ?? 0} / ${snapshot?.nutritionTargets.carbsGrams ?? 0} g`}
        />
        <MetricRow
          label="Fats"
          value={`${snapshot?.consumedFats ?? 0} / ${snapshot?.nutritionTargets.fatsGrams ?? 0} g`}
        />
      </SectionCard>

      <SectionCard subtitle="Workout, nutrition, logging, and trend behavior" title="Adherence snapshot">
        <View style={styles.adherenceHeader}>
          <Text style={styles.adherenceValue}>{snapshot?.adherence.overall ?? 0}%</Text>
          <Text style={styles.adherenceLabel}>{snapshot?.adherence.label?.replace("_", " ") ?? "needs attention"}</Text>
        </View>
        <ProgressBar value={snapshot?.adherence.overall ?? 0} />
      </SectionCard>

      <SectionCard subtitle="Conservative range, not a guarantee" title="Next milestone">
        <Text style={styles.bigLine}>{snapshot?.nextMilestone ?? "Add a few logs to unlock your next milestone."}</Text>
        <Text style={styles.mutedLine}>{predictions[0]?.explanation ?? "Predictions update when your training and nutrition data changes."}</Text>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  bigLine: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28
  },
  mutedLine: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  adherenceHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  adherenceValue: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 28,
    fontWeight: "800"
  },
  adherenceLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14
  }
});
