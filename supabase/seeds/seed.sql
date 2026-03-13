insert into public.exercises (id, name, category, primary_muscles, equipment_types, injury_tags, coaching_cue)
values
  ('goblet-squat', 'Goblet Squat', 'legs', array['quads','glutes'], array['dumbbells','kettlebell'], array['knee'], 'Keep ribs stacked over hips and drive through mid-foot.'),
  ('romanian-deadlift', 'Romanian Deadlift', 'legs', array['hamstrings','glutes'], array['dumbbells','barbell'], array['lower_back'], 'Hinge back softly and keep the load close.'),
  ('push-up', 'Push-Up', 'push', array['chest','triceps'], array['bodyweight'], array['wrist','shoulder'], 'Brace the trunk and keep the floor away as you press.'),
  ('dumbbell-bench-press', 'Dumbbell Bench Press', 'push', array['chest','shoulders','triceps'], array['dumbbells'], array['shoulder','wrist'], 'Lower under control and keep elbows stacked under wrists.'),
  ('seated-row', 'Seated Cable Row', 'pull', array['lats','upper_back'], array['cable'], array['lower_back'], 'Pull elbows toward the torso and pause at the finish.'),
  ('one-arm-row', 'One-Arm Dumbbell Row', 'pull', array['lats','upper_back'], array['dumbbells'], array['lower_back'], 'Brace through the bench and sweep your elbow toward your hip.'),
  ('lat-pulldown', 'Lat Pulldown', 'pull', array['lats','biceps'], array['cable','machine'], array['shoulder','neck'], 'Lead with elbows and avoid leaning back to finish the rep.'),
  ('split-squat', 'Rear Foot Elevated Split Squat', 'legs', array['quads','glutes'], array['bodyweight','dumbbells'], array['knee','ankle'], 'Stay tall and let the front knee travel naturally.'),
  ('plank', 'Front Plank', 'core', array['core'], array['bodyweight'], array['shoulder','lower_back'], 'Exhale fully and keep a straight line through the body.'),
  ('bike-erg', 'Bike Erg Intervals', 'conditioning', array['conditioning'], array['machine'], array['knee','ankle'], 'Keep efforts short, crisp, and repeatable.')
on conflict (id) do nothing;

insert into public.exercise_substitutions (exercise_id, substitution_exercise_id)
values
  ('goblet-squat', 'split-squat'),
  ('romanian-deadlift', 'goblet-squat'),
  ('push-up', 'dumbbell-bench-press'),
  ('seated-row', 'one-arm-row'),
  ('lat-pulldown', 'one-arm-row')
on conflict do nothing;

insert into public.foods (id, name, calories, protein, carbs, fats, serving_size, category, is_custom)
values
  ('food-greek-yogurt', 'Greek Yogurt', 140, 17, 7, 4, '170 g', 'protein', false),
  ('food-oats', 'Rolled Oats', 150, 5, 27, 3, '40 g dry', 'carbs', false),
  ('food-eggs', 'Whole Eggs', 140, 12, 1, 10, '2 eggs', 'protein', false),
  ('food-chicken', 'Chicken Breast', 165, 31, 0, 4, '100 g cooked', 'protein', false),
  ('food-salmon', 'Salmon Fillet', 208, 22, 0, 13, '100 g cooked', 'protein', false),
  ('food-rice', 'Cooked Rice', 205, 4, 45, 0, '1 cup', 'carbs', false),
  ('food-sweet-potato', 'Sweet Potato', 180, 4, 41, 0, '1 medium potato', 'carbs', false),
  ('food-avocado', 'Avocado', 120, 1, 6, 11, '1/2 avocado', 'fat', false),
  ('food-olive-oil', 'Olive Oil', 119, 0, 0, 14, '1 tbsp', 'fat', false),
  ('food-berries', 'Mixed Berries', 70, 1, 17, 0, '1 cup', 'produce', false),
  ('food-spinach', 'Spinach', 20, 2, 3, 0, '2 cups', 'produce', false),
  ('food-protein-wrap', 'Protein Wrap', 210, 14, 24, 7, '1 wrap', 'mixed', false)
on conflict (id) do nothing;
