# Repository instructions for Codex

## How to work in this repo

You are expected to act like a senior engineer shipping a coherent MVP.

Read before editing:
- `MASTER_PROMPT.md`
- `PRODUCT_SPEC.md`
- `TASK_BREAKDOWN.md`

## Operating principles

1. Keep the app runnable.
Do not leave the repo in a half-broken state after a major edit.

2. Prefer practical implementation over theoretical perfection.
This is an MVP, but it should be clean and extensible.

3. Use deterministic business logic wherever possible.
Do not hide key fitness logic inside vague model prompts.

4. Document assumptions.
If fitness logic is approximate, note the assumption near the implementation and in docs where relevant.

5. Avoid overbuilding future features.
Scaffold body scan and wearable integrations, but do not let them slow the MVP.

6. Build for demo quality.
The first-run experience should look populated and convincing using seeded data.

7. Keep changes organized.
Prefer feature folders, typed models, service separation, and reusable UI components.

## Code quality rules

- strict TypeScript
- prefer explicit types
- avoid `any`
- keep components focused
- keep logic testable
- avoid giant files when possible
- use consistent naming
- validate forms and inputs

## UX rules

- polished onboarding matters
- dashboard should feel immediately valuable
- charts should be clear
- use good empty states
- use friendly, high-trust language
- do not overstate prediction certainty

## Product rules

This app is for fitness coaching. It is not a medical product.

Do not:
- diagnose health conditions
- promise impossible body transformations
- generate extreme recommendations

## Before finishing

Before declaring completion:
- run tests where available
- run lint if configured
- verify navigation paths
- verify onboarding flow
- verify plan generation flow
- verify nutrition target flow
- verify progress dashboard flow
- update README and docs

## Completion format

When finished, summarize:
- what was built
- what assumptions were made
- what remains for later
- how to run the project
