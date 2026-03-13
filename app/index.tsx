import { Redirect } from "expo-router";

import { WelcomeScreenContent } from "@/features/auth/components/WelcomeScreenContent";
import { useAppStore } from "@/store/appStore";

export default function IndexScreen() {
  const session = useAppStore((state) => state.session);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);

  if (!session) {
    return <WelcomeScreenContent />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)/dashboard" />;
}
