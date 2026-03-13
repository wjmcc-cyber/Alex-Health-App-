import { Redirect } from "expo-router";

import { useAppStore } from "@/store/appStore";

export default function IndexScreen() {
  const session = useAppStore((state) => state.session);
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)/dashboard" />;
}
