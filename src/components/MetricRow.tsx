import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/theme/tokens";

interface MetricRowProps {
  label: string;
  value: string;
}

export function MetricRow({ label, value }: MetricRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs
  },
  label: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14
  },
  value: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: "600"
  }
});
