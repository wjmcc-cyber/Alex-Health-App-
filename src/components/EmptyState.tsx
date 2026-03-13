import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/theme/tokens";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 22,
    borderStyle: "dashed",
    borderWidth: 1,
    padding: spacing.xl
  },
  title: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 18,
    fontWeight: "700"
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    marginTop: spacing.xs,
    textAlign: "center"
  }
});
