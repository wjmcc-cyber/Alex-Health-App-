import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, Redirect, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { TextField } from "@/components/TextField";
import { signInSchema, type SignInValues } from "@/features/auth/schema";
import { signIn } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

export default function SignInScreen() {
  const router = useRouter();
  const session = useAppStore((state) => state.session);
  const setSession = useAppStore((state) => state.setSession);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);
  const { control, handleSubmit } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const mutation = useMutation({
    mutationFn: ({ email, password }: SignInValues) => signIn(email, password),
    onSuccess: (nextSession) => {
      setSession(nextSession);
      router.replace(onboardingComplete ? "/(tabs)/dashboard" : "/(onboarding)");
    },
    onError: (error: Error) => {
      Alert.alert("Sign in failed", error.message);
    }
  });

  if (session) {
    return <Redirect href={onboardingComplete ? "/(tabs)/dashboard" : "/(onboarding)"} />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Sign in"
        title="Welcome back"
        description="Pick up today's workout, food log, and progress snapshot where you left off."
      />

      <SectionCard subtitle="Use your Alex Health account credentials." title="Account access">
        <TextField control={control} name="email" label="Email" placeholder="alex@example.com" keyboardType="email-address" />
        <TextField control={control} name="password" label="Password" placeholder="Minimum 6 characters" secureTextEntry />
        <PrimaryButton
          label={mutation.isPending ? "Signing in..." : "Sign in"}
          onPress={handleSubmit((values) => mutation.mutate(values))}
        />
      </SectionCard>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Need an account?</Text>
        <Link href="/sign-up" style={styles.footerLink}>
          Create one
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    marginTop: spacing.md
  },
  footerText: {
    color: colors.textMuted,
    fontFamily: typography.body,
    fontSize: 14
  },
  footerLink: {
    color: colors.accent,
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: "700"
  }
});
