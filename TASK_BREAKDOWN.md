# Task Breakdown for Codex

## Objective

Build the MVP in a way that keeps the codebase runnable and investor-demo ready at every major checkpoint.

## Phase 1: foundation

### Tasks
- inspect repository contents
- determine final architecture
- create `docs/implementation-plan.md`
- set up folder structure
- configure Expo app
- configure TypeScript
- configure linting and formatting
- configure environment management
- set up Supabase client wiring

### Definition of done
- app boots
- routing works
- core folders are organized
- docs explain architecture choices

---

## Phase 2: schema and auth

### Tasks
- design database schema
- create migrations
- configure auth flow
- implement login and signup
- persist profiles
- configure row-level security assumptions where appropriate

### Definition of done
- user can create account and sign in
- schema exists and is documented
- profile persistence works

---

## Phase 3: onboarding

### Tasks
- build onboarding questionnaire
- validate inputs with Zod
- save:
  - body metrics
  - goal
  - injuries
  - equipment
  - schedule
  - preferences
- create initial user profile summary

### Definition of done
- onboarding is polished
- data persists correctly
- user lands in main app after completion

---

## Phase 4: workout engine

### Tasks
- create exercise seed data
- implement workout generation engine
- support:
  - full body
  - upper/lower
  - push/pull/legs
- build workout plan UI
- allow exercise completion logging
- create substitution logic

### Definition of done
- user receives plan based on profile
- workouts render correctly
- workout logs are stored

---

## Phase 5: nutrition engine

### Tasks
- create food seed data
- implement calorie target calculation
- implement macro calculation
- create manual food logging flow
- create custom food entry flow
- create meal suggestions
- create grocery list generation

### Definition of done
- user can see targets
- user can log meals
- adherence can be calculated

---

## Phase 6: progress and prediction

### Tasks
- build progress charts
- track body weight
- track workout consistency
- track calorie adherence
- implement prediction engine
- create 3 month and 6 month forecast cards
- show assumptions and uncertainty

### Definition of done
- user can see trends and predictions
- logic is transparent and conservative

---

## Phase 7: future scaffolding

### Tasks
- create body scan interfaces
- create placeholder body scan service
- create wearable integration models
- add TODO-marked extension points

### Definition of done
- codebase is ready for future extensions without cluttering MVP

---

## Phase 8: polish and quality

### Tasks
- improve visual polish
- add loading states
- add empty states
- add error states
- improve accessibility where practical
- add unit tests for critical engines
- verify app still runs cleanly
- update README

### Required tests
- calorie calculations
- macro calculations
- workout generation rules
- prediction logic
- critical utilities

### Definition of done
- tests pass
- app runs
- README is accurate
- documentation is current

---

## Final output expected from Codex

At the end of work, produce:
1. project tree summary
2. architecture summary
3. list of implemented features
4. list of deferred features
5. exact run instructions
6. known limitations
7. next recommended steps
