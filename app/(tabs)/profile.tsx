import { useMutation } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

import { MetricRow } from "@/components/MetricRow";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { signOut } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

export default function ProfileScreen() {
  const router = useRouter();
  const session = useAppStore((state) => state.session);
  const profile = useAppStore((state) => state.profile);
  const setSession = useAppStore((state) => state.setSession);
  const resetAll = useAppStore((state) => state.resetAll);
  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      setSession(null);
      router.replace("/welcome");
    },
    onError: (error: Error) => {
      Alert.alert("Unable to sign out", error.message);
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
        eyebrow="Profile"
        title={profile?.fullName ?? session.displayName}
        description="Review the assumptions behind your plan, then edit or reset when you want a fresh onboarding run."
      />

      <SectionCard subtitle="Current coaching profile" title="Profile summary">
        <MetricRow label="Goal" value={profile?.goal?.replaceAll("_", " ") ?? "Not set"} />
        <MetricRow label="Fitness level" value={profile?.fitnessLevel ?? "Not set"} />
        <MetricRow label="Schedule" value={`${profile?.weeklySessions ?? 0} sessions | ${profile?.sessionMinutes ?? 0} min`} />
        <MetricRow label="Diet" value={profile?.dietaryPreference?.replaceAll("_", " ") ?? "Not set"} />
        <MetricRow label="Equipment" value={profile?.availableEquipment?.join(", ") ?? "Not set"} />
      </SectionCard>

      <SectionCard subtitle="Future MVP extension points" title="Connected systems">
        <Text style={styles.integrationText}>Body scan: placeholder upload and processing architecture ready for future photo-based estimation.</Text>
        <Text style={styles.integrationText}>Wearables: provider models are scaffolded for Apple Health, Google Fit, Garmin, and Whoop.</Text>
      </SectionCard>

      <View style={styles.actions}>
        <PrimaryButton
          label={mutation.isPending ? "Signing out..." : "Sign out"}
          onPress={() => mutation.mutate()}
        />
        <PrimaryButton
          label="Reset preview data"
          onPress={() => {
            resetAll();
            router.replace("/welcome");
          }}
          variant="ghost"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  integrationText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.sm
  },
  actions: {
    gap: spacing.sm
  }
});
