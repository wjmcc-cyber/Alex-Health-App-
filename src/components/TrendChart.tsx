import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/theme/tokens";

interface TrendChartProps {
  values: number[];
  labels: string[];
  unit: string;
}

export function TrendChart({ values, labels, unit }: TrendChartProps) {
  const max = Math.max(...values, 1);

  return (
    <View>
      <View style={styles.chart}>
        {values.map((value, index) => (
          <View key={`${labels[index]}-${value}`} style={styles.column}>
            <View style={[styles.bar, { height: `${(value / max) * 100}%` }]} />
            <Text style={styles.barLabel}>{labels[index]}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.unitLabel}>Scale shown in {unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.sm,
    height: 180,
    marginTop: spacing.sm
  },
  column: {
    alignItems: "center",
    flex: 1,
    gap: spacing.xs,
    height: "100%",
    justifyContent: "flex-end"
  },
  bar: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    minHeight: 12,
    width: "100%"
  },
  barLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12
  },
  unitLabel: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: spacing.sm
  }
});
