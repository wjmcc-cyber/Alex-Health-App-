import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { isSupabaseConfigured } from "@/lib/env";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export function WelcomeScreenContent() {
  const router = useRouter();

  return (
    <Screen>
      <LinearGradient
        colors={["#0E725A", "#8CBF74", "#F4F1EA"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.hero}
      >
        <Text style={styles.badge}>Adaptive Fitness Coaching</Text>
        <ScreenHeader
          title="Coach harder. Guess less."
          description="Alex Health combines structured workouts, nutrition targets, progress analytics, and conservative prediction ranges into one mobile-first coaching flow."
        />
      </LinearGradient>

      {!isSupabaseConfigured ? (
        <SectionCard
          subtitle="Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to switch from preview mode to live auth and persistence."
          title="Preview mode is active"
          tone="accent"
        >
          <Text style={styles.previewText}>
            You can still walk through onboarding, plan generation, food logging, and progress tracking locally.
          </Text>
        </SectionCard>
      ) : null}

      <SectionCard subtitle="Launch-ready MVP features" title="What you can do">
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>
            Personalized training split based on goal, schedule, equipment, and injuries.
          </Text>
          <Text style={styles.featureItem}>
            Deterministic calorie and macro targets with meal ideas and grocery support.
          </Text>
          <Text style={styles.featureItem}>
            Progress snapshots with adherence scoring and 3- and 6-month prediction ranges.
          </Text>
        </View>
      </SectionCard>

      <View style={styles.buttonStack}>
        <PrimaryButton label="Create account" onPress={() => router.push("/sign-up")} />
        <PrimaryButton
          label="I already have an account"
          onPress={() => router.push("/sign-in")}
          variant="ghost"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    padding: spacing.xl
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: radius.pill,
    color: colors.accentStrong,
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.md,
    overflow: "hidden",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  previewText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20
  },
  featureList: {
    gap: spacing.sm
  },
  featureItem: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  buttonStack: {
    gap: spacing.sm,
    marginTop: spacing.sm
  }
});
