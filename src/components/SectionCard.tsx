import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme/tokens";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  tone?: "default" | "accent";
}

export function SectionCard({ children, title, subtitle, tone = "default" }: SectionCardProps) {
  return (
    <View style={[styles.card, tone === "accent" && styles.cardAccent]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.canvas,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md
  },
  cardAccent: {
    backgroundColor: colors.cardAlt
  },
  title: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 20,
    fontWeight: "700"
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14,
    marginTop: spacing.xs
  },
  body: {
    marginTop: spacing.md
  }
});
