import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme/tokens";

interface Option<T extends string> {
  label: string;
  value: T;
}

interface OptionChipsProps<T extends string> {
  options: Option<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
  multi?: boolean;
}

export function OptionChips<T extends string>({
  options,
  selected,
  onChange,
  multi = false
}: OptionChipsProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <Pressable
            key={option.value}
            onPress={() => {
              if (multi) {
                onChange(
                  isSelected
                    ? selected.filter((item) => item !== option.value)
                    : [...selected, option.value]
                );
                return;
              }

              onChange([option.value]);
            }}
            style={[styles.chip, isSelected && styles.selectedChip]}
          >
            <Text style={[styles.label, isSelected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  selectedChip: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  label: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: "600"
  },
  selectedLabel: {
    color: "#FFFFFF"
  }
});
