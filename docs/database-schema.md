# Database Schema

## Overview

The MVP uses Supabase Auth plus a `public.users` mirror table keyed to `auth.users.id`. All user-owned tables reference `public.users(id)` for consistent row-level security.

## Core tables

- `users`: auth mirror row for RLS ownership.
- `profiles`: demographic and training context captured during onboarding.
- `goals`: active goal type, starting weight, and optional target weight.
- `injuries_or_limitations`: saved constraint list used by the workout generator.
- `equipment_inventory`: available equipment used by workout filtering.
- `workout_plans`: active generated program metadata.
- `workout_weeks`: scaffold for future plan progression.
- `workout_days`: renderable session definitions with `exercises_json`.
- `workout_logs`: completed session history.
- `nutrition_targets`: deterministic calorie, macro, fiber, hydration, and maintenance estimates.
- `foods`: seeded foods plus optional user-created custom foods.
- `food_entries`: day-level food logs.
- `meal_suggestions`: stored suggestion cards generated from current goal and foods.
- `grocery_lists`: grocery list container.
- `grocery_list_items`: grocery list rows.
- `progress_metrics`: daily weight, workout minutes, calorie intake, and target data.
- `prediction_snapshots`: saved forecast ranges and explanation payloads.

## Future-ready tables

- `wearable_integrations`: provider connection state and sync timestamps.
- `body_scan_jobs`: queued placeholder jobs for future image workflows.
- `body_scan_results`: non-medical estimate storage and posture/symmetry summaries.
- `app_settings`: units, coaching tone, and future premium flags.

## Public reference tables

- `exercises`: seeded exercise library for plan generation.
- `exercise_substitutions`: substitution pairs for equipment or injury constraints.

## RLS assumptions

- Each user can read and write only their own rows.
- `foods` allows public read for seeded catalog rows and owner access for custom foods.
- `exercises` and `exercise_substitutions` are globally readable.

## Seed contents

The seed file includes starter exercise and food rows that match the in-app local seed data so preview mode and Supabase-backed mode stay conceptually aligned.
