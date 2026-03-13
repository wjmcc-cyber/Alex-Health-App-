import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { PropsWithChildren, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthBootstrap } from "@/providers/AuthBootstrap";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <StatusBar style="dark" />
          {children}
        </AuthBootstrap>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
