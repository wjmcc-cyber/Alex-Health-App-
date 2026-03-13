import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/theme/tokens";

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function ScreenHeader({ eyebrow, title, description }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg
  },
  eyebrow: {
    color: colors.accent,
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: spacing.xs,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 32,
    fontWeight: "800"
  },
  description: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm
  }
});
