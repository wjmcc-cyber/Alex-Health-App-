import { StyleSheet, Text } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { colors, typography } from "@/theme/tokens";

interface AppErrorFallbackProps {
  error: Error;
  retry: () => void;
}

export function AppErrorFallback({ error, retry }: AppErrorFallbackProps) {
  return (
    <Screen>
      <ScreenHeader
        eyebrow="App error"
        title="The app hit a runtime error"
        description="This screen replaces the blank white page so the underlying issue is visible."
      />
      <SectionCard
        subtitle="If this appears in production, send the message below so the failing code path can be fixed."
        title="Error details"
        tone="accent"
      >
        <Text selectable style={styles.message}>
          {error.message}
        </Text>
      </SectionCard>
      <PrimaryButton label="Try again" onPress={retry} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  message: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 14
  }
});
