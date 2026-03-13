# Product Specification: AI Fitness Coaching App

## Product vision

Build an AI-powered fitness application that combines body scanning architecture, adaptive workout programming, nutrition tracking, and predictive goal modeling into one platform.

The MVP should focus on the highest-value software experience first:
- personalized coaching
- adaptive training plans
- nutrition intelligence
- progress tracking
- realistic goal prediction

The long-term vision is the most intelligent personal trainer available on a smartphone.

---

## Problem

Most people fail to achieve fitness goals because of:

1. lack of personalization
2. poor understanding of body composition
3. unrealistic expectations
4. weak nutrition adherence
5. poor progress feedback
6. lack of adaptation to schedule constraints

Current fitness apps usually solve only one part of the problem.

---

## MVP solution

The MVP solves this through four main systems:

### 1. Onboarding and profile intelligence

Users provide:
- age
- sex
- height
- weight
- fitness level
- training experience
- injuries or limitations
- dietary preferences
- weekly schedule
- available equipment
- time available per session
- main goal:
  - lose fat
  - build muscle
  - recomposition
  - athletic performance

### 2. AI workout generator

Generate personalized plans using:
- goal
- experience level
- schedule
- equipment
- injuries
- time constraints

Supported structures:
- push / pull / legs
- upper / lower
- full body

Each workout plan should include:
- split structure
- daily exercises
- sets
- reps
- rest periods
- coaching notes
- substitution options

Plans should be able to adapt as the user logs progress.

### 3. Nutrition intelligence

Support:
- calorie target generation
- macro targets
- meal suggestions
- daily food logging
- daily adherence scoring
- grocery list generation

Logging methods for MVP:
- manual food search
- custom food entry

Architect placeholders for:
- barcode logging
- photo logging

### 4. Goal prediction engine

Based on current metrics, goal type, and adherence, estimate:
- expected weight trend
- 3 month outcome range
- 6 month outcome range
- broad body composition direction
- explanation of assumptions

Predictions must be conservative and transparent.

### 5. Progress dashboard

Track:
- body weight
- workout consistency
- strength progression
- calorie adherence
- milestone progress
- prediction snapshots over time

---

## Future architecture targets

The codebase must be designed to support future additions:

### Body scan system
Future support for:
- front photo
- side photo
- back photo
- body fat estimation
- lean mass estimation
- posture analysis
- symmetry analysis

For now:
- create interfaces
- create placeholder upload and processing flow
- do not build full computer vision implementation

### Wearable integrations
Future support for:
- Apple Health
- Google Fit
- smartwatch data
- HRV
- sleep
- recovery metrics
- calorie expenditure

For now:
- create schema and integration scaffolding
- do not build full wearable sync

---

## User flow

Implement this flow:

1. splash / welcome
2. sign up / log in
3. onboarding questionnaire
4. generated profile and recommendations
5. main tabbed app

Main tabs:
- Dashboard
- Workouts
- Nutrition
- Progress
- Profile / Settings

---

## Screen requirements

### Dashboard
Show:
- today’s workout
- calorie target
- calories remaining
- macro summary
- adherence snapshot
- current goal progress
- next predicted milestone

### Workouts
Show:
- weekly split
- current day plan
- exercise list
- sets, reps, rest
- completion tracking
- exercise substitution options

### Nutrition
Show:
- daily calorie target
- protein, carbs, fats targets
- food log
- meal suggestions
- grocery list

### Progress
Show:
- body weight graph
- workout adherence
- calorie adherence
- prediction summary
- 3 month forecast
- 6 month forecast

### Profile / Settings
Support:
- editing profile
- goal updates
- schedule updates
- equipment updates
- injury updates
- preferences

---

## Data model requirements

Create tables for:

- users
- profiles
- goals
- injuries_or_limitations
- equipment_inventory
- workout_plans
- workout_weeks
- workout_days
- exercises
- exercise_substitutions
- workout_logs
- nutrition_targets
- food_entries
- foods
- meal_suggestions
- grocery_lists
- grocery_list_items
- progress_metrics
- prediction_snapshots
- wearable_integrations
- body_scan_jobs
- body_scan_results
- app_settings

Each table should include:
- primary key
- created_at
- updated_at
- foreign keys where needed
- useful indexes

---

## Business logic requirements

### Workout engine
Must consider:
- goal
- experience
- weekly frequency
- session length
- equipment
- injuries

Output a structured plan object that is easy to render and persist.

### Nutrition engine
Must calculate:
- estimated maintenance calories
- deficit or surplus logic
- macro targets
- meal suggestion categories

### Goal prediction engine
Must estimate realistic ranges for:
- fat loss
- muscle gain
- recomposition

Must include:
- assumptions
- uncertainty
- explanation text
- confidence indicator

### Adherence logic
Create an adherence score using:
- workout completion
- calorie consistency
- logging consistency
- recent weight trend

---

## Design direction

The UI should feel:
- premium
- modern
- minimal
- mobile-native
- fitness-focused

Use:
- stat cards
- charts
- clear typography
- polished onboarding
- smooth empty states and loading states

Avoid:
- admin-dashboard aesthetics
- clutter
- excessive color noise

---

## Monetization architecture

Build the codebase so it can support:

### Free tier
- workout plans
- basic nutrition tracking
- limited analytics

### Premium tier
- advanced analytics
- adaptive updates
- body scan features
- richer prediction modeling
- advanced nutrition planning

For MVP, create placeholders or flags for future paywalling, but do not spend major time implementing payments unless the repo already requires it.

---

## Safety and product boundaries

This is a fitness coaching app, not a medical tool.

Do not:
- provide medical diagnoses
- make unsafe extreme-diet recommendations
- make guaranteed body transformation promises

Use reasonable defaults and document all important assumptions.

---

## Completion criteria

The MVP is complete when:
- a new user can sign up
- complete onboarding
- receive a workout plan
- receive calorie and macro targets
- log food
- view dashboard stats
- track progress
- see 3 month and 6 month predictions
- run the app locally with clear docs
