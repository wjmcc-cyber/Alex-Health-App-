import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { MetricRow } from "@/components/MetricRow";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SectionCard } from "@/components/SectionCard";
import { markWorkoutComplete } from "@/services/appService";
import { useAppStore } from "@/store/appStore";
import { colors, spacing, typography } from "@/theme/tokens";

export default function WorkoutsScreen() {
  const queryClient = useQueryClient();
  const session = useAppStore((state) => state.session);
  const workoutPlan = useAppStore((state) => state.workoutPlan);
  const workoutLogs = useAppStore((state) => state.workoutLogs);
  const mutation = useMutation({
    mutationFn: markWorkoutComplete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
    onError: (error: Error) => {
      Alert.alert("Unable to log workout", error.message);
    }
  });

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (!workoutPlan) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow="Workouts"
        title="Your weekly split"
        description="Exercises, sets, reps, rest, and built-in substitutions generated from your goal, time, equipment, and limitations."
      />

      <SectionCard subtitle="Current structure" title={workoutPlan.split.replaceAll("_", " ")}>
        <Text style={styles.summary}>{workoutPlan.coachingSummary}</Text>
      </SectionCard>

      {workoutPlan.sessions.map((sessionDay) => {
        const completed = workoutLogs.some((log) => log.workoutDayId === sessionDay.id);

        return (
          <SectionCard
            key={sessionDay.id}
            subtitle={`${sessionDay.dayLabel} | ${sessionDay.estimatedMinutes} min`}
            title={sessionDay.focus}
          >
            {sessionDay.exercises.map((exercise) => (
              <View key={exercise.exerciseId} style={styles.exerciseBlock}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <MetricRow label="Prescription" value={`${exercise.sets} sets | ${exercise.reps}`} />
                <MetricRow label="Rest" value={`${exercise.restSeconds} sec`} />
                <MetricRow label="Substitute" value={exercise.substitutions[0] ?? "Keep current"} />
              </View>
            ))}

            <PrimaryButton
              label={completed ? "Completed" : mutation.isPending ? "Saving..." : "Mark complete"}
              onPress={() => {
                if (!completed) {
                  mutation.mutate(sessionDay.id);
                }
              }}
              disabled={completed}
            />
          </SectionCard>
        );
      })}

      {workoutPlan.sessions.length === 0 ? (
        <EmptyState
          title="No sessions generated yet"
          description="Finish onboarding and Alex Health will create your first weekly split."
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    color: colors.text,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  exerciseBlock: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
    paddingBottom: spacing.md
  },
  exerciseName: {
    color: colors.text,
    fontFamily: typography.title,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.xs
  }
});
