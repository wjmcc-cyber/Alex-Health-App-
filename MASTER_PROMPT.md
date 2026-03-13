# Codex Build Directive: AI Fitness Body Scanner & Coaching App

You are the lead engineer for this repository. Build a production-lean MVP of an AI fitness coaching mobile app from the product specification in `PRODUCT_SPEC.md`.

Your job is to execute, not brainstorm. Make pragmatic engineering decisions, implement the app, keep the codebase runnable, and document your choices clearly.

## Core mandate

Build a mobile-first AI fitness app that includes:

- onboarding and profile creation
- personalized workout generation
- nutrition target generation and food logging
- progress analytics
- realistic goal prediction
- architecture for future body scan and wearable integrations

Do not build a fake demo. Build a real MVP with strong structure, clean UX, typed contracts, and testable business logic.

## Primary outcome

When finished, the repository must contain:

- a runnable React Native Expo app
- a working backend integration with Supabase
- a documented database schema and migrations
- seeded exercise and food data
- deterministic business logic modules for workouts, nutrition, and predictions
- polished core screens
- unit tests for critical logic
- a clear README with setup and run instructions

## Required stack

Use these defaults unless a strong implementation reason requires a change:

- React Native with Expo
- TypeScript
- Expo Router
- Supabase
- PostgreSQL
- Supabase Auth
- React Query
- Zustand
- React Hook Form
- Zod

## Execution rules

1. Start by reading:
   - `PRODUCT_SPEC.md`
   - `TASK_BREAKDOWN.md`
   - `AGENTS.md`

2. Then inspect the repo and determine what already exists.

3. Create an implementation plan in `docs/implementation-plan.md` before large changes.

4. Work in small, coherent milestones:
   - foundation and architecture
   - auth and onboarding
   - workout engine
   - nutrition engine
   - progress dashboard
   - goal prediction
   - polish, testing, docs

5. After each milestone:
   - run relevant checks
   - fix errors
   - update documentation
   - keep the app runnable

6. Prefer deterministic business logic over hiding behavior inside LLM prompts.

7. For anything related to body scanning or wearables in the MVP:
   - create clean interfaces
   - create placeholder services
   - do not overbuild the actual feature

8. Do not ask repeated confirmation questions. If a detail is underspecified, choose the most launch-ready option and document the assumption.

## Product quality bar

The app should feel like a premium consumer fitness app, not an internal tool.

Prioritize:
- modern visual design
- strong onboarding
- clear dashboards
- smooth navigation
- fast perceived performance
- realistic default data
- empty states, loading states, and error states

## Engineering quality bar

- strict TypeScript
- no `any` unless absolutely unavoidable and justified
- small reusable modules
- feature-oriented structure where appropriate
- service layer separation
- typed interfaces
- testable utilities and engines
- explicit assumptions
- minimal but helpful comments

## Logic requirements

Implement deterministic modules for:

- workout generation
- nutrition target calculation
- macro target calculation
- adherence scoring
- goal prediction

The prediction system must be conservative. It must show:
- ranges
- assumptions
- confidence or uncertainty
- explanation text

Never present speculative physique outcomes as guaranteed facts.

## Deliverables at completion

When you are done, provide:

1. a concise project tree summary
2. architecture choices
3. implemented features
4. deferred features
5. exact setup and run instructions
6. known limitations
7. next recommended build steps

Begin now by reading the spec files, inspecting the repository, and writing `docs/implementation-plan.md`.
