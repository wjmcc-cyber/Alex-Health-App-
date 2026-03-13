# Implementation Plan

## Goal

Build a production-lean MVP of a mobile-first AI fitness coaching app using Expo, TypeScript, Expo Router, Supabase, React Query, Zustand, React Hook Form, and Zod.

The app must support:
- auth and onboarding
- workout generation
- nutrition target generation and food logging
- progress analytics
- conservative goal prediction
- clean scaffolding for future body scan and wearable integrations

## Current Repository State

The repository now contains the Expo Router app shell, typed domain models, deterministic logic modules, Supabase wiring, SQL migrations, seed data, reusable UI primitives, and unit tests. Remaining work is focused on deployment validation, runtime verification, and incremental product depth.

## Architecture Decisions

### Frontend
- Expo + React Native + Expo Router for mobile-first navigation
- TypeScript in strict mode
- React Query for remote data fetching and cache coordination
- Zustand for lightweight app/session and onboarding state
- React Hook Form + Zod for validated forms
- Feature-oriented source structure with shared UI primitives and deterministic domain logic modules

### Backend
- Supabase for Auth, Postgres, and typed backend integration
- SQL migrations checked into `supabase/migrations`
- seed SQL for exercise and food starter data
- repository/service layer to isolate Supabase calls from UI components

### Domain Logic
- deterministic business logic modules under `src/features/*/logic`
- no core recommendation behavior hidden inside prompts
- explicit assumptions documented near calculations and in README/docs

### Future Integrations
- body scan interfaces and placeholder processing service
- wearable integration interfaces, schema, and disabled service adapters
- extension points documented with TODO markers where appropriate

## Proposed Project Structure

```text
app/
  (auth)/
  (onboarding)/
  (tabs)/
  _layout.tsx
src/
  components/
  constants/
  features/
    auth/
    dashboard/
    nutrition/
    onboarding/
    predictions/
    progress/
    profile/
    workouts/
  lib/
  services/
  store/
  theme/
  types/
  utils/
supabase/
  migrations/
  seeds/
docs/
tests/
```

## Milestones

### 1. Foundation and Architecture
- initialize Expo Router app with strict TypeScript
- add linting, testing, path aliases, and environment management
- set up theme, layout shell, reusable cards/buttons/inputs, and loading states
- wire Supabase client, QueryClient, and app providers

Validation:
- app boots
- navigation shell renders
- typecheck and lint succeed

### 2. Schema and Auth
- define database schema for all required entities
- create migrations and starter seed files
- implement Supabase Auth sign up, sign in, sign out, and session restore
- add typed repositories for profiles, goals, workouts, nutrition, and progress

Validation:
- migrations are documented
- auth flow compiles and routes correctly

### 3. Onboarding
- build multi-step onboarding questionnaire with validation
- persist profile, goal, equipment, injuries, schedule, and preferences
- generate initial recommendations after onboarding completion

Validation:
- user can complete onboarding end-to-end
- saved profile can be reloaded

### 4. Workout Engine
- add seeded exercise dataset and substitution map
- implement plan generation for full body, upper/lower, and push/pull/legs
- generate sets, reps, rest, notes, and substitutions using deterministic rules
- build workout screens and logging interactions

Validation:
- generated plans vary correctly by goal, experience, frequency, time, and equipment
- workout logs update dashboard/progress state

### 5. Nutrition Engine
- add food seed data
- implement maintenance calorie, target calorie, macro, meal suggestion, and grocery list logic
- build daily target UI and food logging flows including custom foods
- compute adherence scores from calorie consistency and logging behavior

Validation:
- target calculations are test-covered
- logging updates nutrition summaries and adherence

### 6. Progress and Prediction
- add progress dashboard charts and summary cards
- support weight logging and trend summaries
- implement conservative 3-month and 6-month prediction ranges with assumptions and confidence
- snapshot predictions over time

Validation:
- charts render seeded and live data paths
- prediction outputs include explanation, range, and confidence

### 7. Future Scaffolding
- add body scan job/result types and placeholder service
- add wearable integration models and service stubs
- expose clear interfaces without building full integrations

Validation:
- scaffolding compiles and is documented

### 8. Polish, Testing, and Docs
- improve empty, loading, and error states
- add unit tests for workout, nutrition, adherence, and prediction logic
- update README, implementation docs, and setup instructions

Validation:
- tests pass
- lint passes
- typecheck passes
- core user flows are documented
- Expo web export builds for Vercel deployment

## Key Product Assumptions

- The MVP will prioritize email/password authentication with Supabase Auth.
- Seeded data will provide a convincing first-run experience even if a live Supabase instance is not yet populated.
- Goal prediction will estimate realistic weight and body-composition direction using conservative rates and adherence adjustments, not speculative physique visuals.
- Body scan and wearable features will be interface-complete but intentionally non-functional beyond placeholders.
- Manual food search will use seeded/local query data for the MVP unless Supabase-backed data is available.

## Run and Verification Plan

After each milestone:
- run typecheck
- run lint
- run unit tests relevant to changed logic
- smoke test routing and affected flows
- update docs if architecture or assumptions changed

## Risks and Mitigations

- Greenfield scope risk: keep milestones thin and runnable; prefer pragmatic UI breadth over deep edge-case handling.
- Supabase environment dependency risk: add clear `.env` example, local fallback seed usage, and graceful empty states.
- Logic trust risk: keep formulas explicit, bounded, and covered by tests.
- UX polish risk: establish a theme system and reusable screen primitives early to avoid inconsistent screens later.
