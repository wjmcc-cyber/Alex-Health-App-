import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme/tokens";

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric";
  secureTextEntry?: boolean;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false
}: TextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            keyboardType={keyboardType}
            onChangeText={(text) => {
              if (keyboardType === "numeric") {
                onChange(text === "" ? "" : Number(text));
                return;
              }

              onChange(text);
            }}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={secureTextEntry}
            style={[styles.input, error && styles.inputError]}
            value={value ? String(value) : ""}
          />
          {error ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md
  },
  label: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.xs
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.md
  },
  inputError: {
    borderColor: colors.danger
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: spacing.xs
  }
});
