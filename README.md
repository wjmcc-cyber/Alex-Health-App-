# Alex Health App

Alex Health is a production-lean MVP for an AI fitness coaching mobile app built with Expo, TypeScript, Expo Router, Supabase, React Query, Zustand, React Hook Form, and Zod.

## What is included

- email/password auth flow with Supabase-ready session wiring
- validated multi-step onboarding
- deterministic workout plan generation
- deterministic calorie and macro target generation
- manual food logging plus custom food entry
- dashboard, workouts, nutrition, progress, and profile screens
- conservative 3-month and 6-month prediction ranges
- Supabase schema, migrations, and seed data
- preview-mode local persistence when Supabase env vars are not configured
- placeholder services for body scan and wearable integrations
- unit tests for core logic modules

## Project structure

```text
app/
  (auth)/
  (onboarding)/
  (tabs)/
src/
  components/
  constants/
  features/
  lib/
  providers/
  services/
  store/
  theme/
  types/
supabase/
  migrations/
  seeds/
tests/
docs/
```

## Architecture notes

- `app/` contains Expo Router route groups and navigation shells.
- `src/features/*/logic` contains deterministic business logic for workouts, nutrition, adherence, and predictions.
- `src/store/appStore.ts` provides persisted app state for preview mode and local UX continuity.
- `src/services/appService.ts` is the main app-facing service layer.
- `src/services/supabasePersistence.ts` persists onboarding outputs to Supabase tables when env vars are configured.
- `supabase/migrations/` contains the database schema and RLS setup.

## Assumptions

- This is a fitness coaching app, not a medical product.
- Predictions are intentionally conservative and must be framed as estimates.
- Preview mode is acceptable for local app exploration before Supabase is configured.
- Body scan and wearable features are scaffolded but intentionally non-functional beyond typed placeholders.

## Environment

Create a `.env` file from `.env.example`.

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If those variables are omitted, the app runs in preview mode using persisted local state and seeded data.

## Setup

1. Install Node.js 20.19+ or 22 LTS.
2. Install dependencies:

```bash
npm install
```

3. Start Expo in development:

```bash
npm run start
```

4. Open the app:
- press `w` in the Expo terminal for the browser
- scan the Expo QR code with Expo Go for the native preview

5. Optional checks:

```bash
npm run typecheck
npm run lint
npm run test
```

If PowerShell blocks `npm`, use `npm.cmd` or temporarily allow scripts for the current shell only:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
npm.cmd run start
```

If Expo says port `8081` is already in use, accept the next port it offers.

## Vercel deployment

Vercel deploys the Expo web build, which runs in a phone browser. This is the simplest path for sharing the MVP on mobile without installing a native build.

1. Ensure dependencies are installed locally:

```bash
npm install
```

2. Verify the web export builds:

```bash
npm run build:web
```

3. Deploy to Vercel:
- import the repo into Vercel
- Vercel will use [`vercel.json`](/c:/Users/wjmcc/Downloads/Alex%20Health%20App/vercel.json)
- build command: `npm run build:web`
- output directory: `dist`

4. Open the deployed URL on your phone.

Assumption: Vercel is being used to host the Expo web version, not a native iOS or Android binary.

## Supabase setup

1. Create a Supabase project.
2. Apply the SQL migration in `supabase/migrations/20260313190000_init.sql`.
3. Run the seed SQL in `supabase/seeds/seed.sql`.
4. Add your project URL and anon key to `.env`.

## Current MVP flows

- create an account or sign in
- complete onboarding
- receive a workout split and nutrition targets
- log workouts
- log food and add custom foods
- view dashboard and progress analytics
- review 3-month and 6-month prediction ranges

## Known limitations

- `npm` in PowerShell may be blocked by the local execution policy. `npm.cmd` works without changing the global policy.
- Vitest may require a less restricted local shell because `esbuild` spawns a helper process during startup.
- Supabase read hydration after sign-in is minimal; the app currently prioritizes auth, onboarding persistence, and local continuity.
- Barcode logging, photo logging, body scan image analysis, and wearable sync are deferred.

## Next build steps

1. Add remote hydration queries so Supabase data repopulates the app after reinstall or device switch.
2. Expand workout logging to per-exercise performance and progression.
3. Add searchable food catalog UI instead of quick-pick chips.
4. Add richer prediction snapshots with strength trend inputs and adherence history windows.
