import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme/tokens";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    padding: spacing.md
  },
  label: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 13
  },
  value: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 24,
    fontWeight: "700"
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12
  }
});
