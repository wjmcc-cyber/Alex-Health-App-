import { Tabs } from "expo-router";

import { colors, typography } from "@/theme/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.canvas,
          borderTopColor: colors.border,
          height: 84,
          paddingBottom: 12,
          paddingTop: 10
        },
        tabBarLabelStyle: {
          fontFamily: typography.body,
          fontSize: 12,
          fontWeight: "700"
        }
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="workouts" options={{ title: "Workouts" }} />
      <Tabs.Screen name="nutrition" options={{ title: "Nutrition" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
