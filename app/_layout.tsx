import { Slot } from "expo-router";
import type { ErrorBoundaryProps } from "expo-router";

import { AppErrorFallback } from "@/components/AppErrorFallback";
import { AppProviders } from "@/providers/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <Slot />
    </AppProviders>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppErrorFallback error={error} retry={retry} />;
}
