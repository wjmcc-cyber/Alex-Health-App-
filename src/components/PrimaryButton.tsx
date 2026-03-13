import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, spacing, typography } from "@/theme/tokens";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  variant = "solid",
  disabled = false
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "solid" ? styles.solid : styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.pill,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg
  },
  solid: {
    backgroundColor: colors.accent
  },
  ghost: {
    backgroundColor: colors.accentSoft
  },
  pressed: {
    opacity: 0.92
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    color: "#FFFFFF",
    fontFamily: typography.title,
    fontSize: 16,
    fontWeight: "700"
  },
  ghostLabel: {
    color: colors.accentStrong
  }
});
