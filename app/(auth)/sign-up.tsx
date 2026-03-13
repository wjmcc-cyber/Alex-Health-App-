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
import { signUpSchema, type SignUpValues } from "@/features/auth/schema";
import { signUp } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

export default function SignUpScreen() {
  const router = useRouter();
  const session = useAppStore((state) => state.session);
  const setSession = useAppStore((state) => state.setSession);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);
  const { control, handleSubmit } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });
  const mutation = useMutation({
    mutationFn: ({ email, password, fullName }: SignUpValues) => signUp(email, password, fullName),
    onSuccess: (nextSession) => {
      setSession(nextSession);
      router.replace(onboardingComplete ? "/(tabs)/dashboard" : "/(onboarding)");
    },
    onError: (error: Error) => {
      Alert.alert("Sign up failed", error.message);
    }
  });

  if (session) {
    return <Redirect href={onboardingComplete ? "/(tabs)/dashboard" : "/(onboarding)"} />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Create account"
        title="Build your coaching profile"
        description="We'll use your setup, training background, and nutrition preferences to generate a plan that feels realistic from day one."
      />

      <SectionCard subtitle="Email and password are used for Supabase Auth when configured." title="Create your account">
        <TextField control={control} name="fullName" label="Full name" placeholder="Alex Carter" />
        <TextField control={control} name="email" label="Email" placeholder="alex@example.com" keyboardType="email-address" />
        <TextField control={control} name="password" label="Password" placeholder="Minimum 6 characters" secureTextEntry />
        <PrimaryButton
          label={mutation.isPending ? "Creating account..." : "Continue to onboarding"}
          onPress={handleSubmit((values) => mutation.mutate(values))}
        />
      </SectionCard>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already registered?</Text>
        <Link href="/sign-in" style={styles.footerLink}>
          Sign in
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
