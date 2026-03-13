import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/theme/tokens";

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    height: 10,
    overflow: "hidden"
  },
  fill: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: "100%"
  }
});
