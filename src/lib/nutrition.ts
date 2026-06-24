export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityKey = 'sedentary' | 'light' | 'moderate' | 'active' | 'very';

export interface Profile {
  weight: number;
  height: number;
  birthDate: string;
  gender: Gender;
  activity: ActivityKey;
  goal: Goal;
  pace: number;
}

export interface Targets {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export const ACTIVITY_LEVELS: { key: ActivityKey; label: string; desc: string; factor: number }[] = [
  { key: 'sedentary', label: 'Сидячий', desc: 'Мало движения, офисная работа', factor: 1.2 },
  { key: 'light', label: 'Лёгкая', desc: 'Тренировки 1–3 раза в неделю', factor: 1.375 },
  { key: 'moderate', label: 'Умеренная', desc: 'Тренировки 3–5 раз в неделю', factor: 1.55 },
  { key: 'active', label: 'Активная', desc: 'Тренировки 6–7 раз в неделю', factor: 1.725 },
  { key: 'very', label: 'Очень активная', desc: 'Спорт + физическая работа', factor: 1.9 },
];

export const GOALS: { key: Goal; label: string; desc: string; icon: string }[] = [
  { key: 'lose', label: 'Похудеть', desc: 'Мягкий дефицит калорий', icon: 'TrendingDown' },
  { key: 'maintain', label: 'Поддерживать', desc: 'Сохранить текущий вес', icon: 'Minus' },
  { key: 'gain', label: 'Набрать массу', desc: 'Профицит для роста мышц', icon: 'TrendingUp' },
];

export function ageFromDate(birthDate: string): number {
  if (!birthDate) return 30;
  const today = new Date();
  const b = new Date(birthDate);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

export function calcTargets(p: Profile): Targets {
  const age = ageFromDate(p.birthDate);
  const base = 10 * p.weight + 6.25 * p.height - 5 * age;
  const bmr = Math.round(p.gender === 'male' ? base + 5 : base - 161);
  const factor = ACTIVITY_LEVELS.find((a) => a.key === p.activity)?.factor ?? 1.2;
  const tdee = Math.round(bmr * factor);

  let calories = tdee;
  if (p.goal === 'lose') calories = tdee - Math.round((p.pace * 7700) / 7);
  if (p.goal === 'gain') calories = tdee + 400;
  calories = Math.max(calories, Math.round(bmr * 1.1));

  const proteinPerKg = p.goal === 'maintain' ? 1.6 : 2.0;
  const protein = Math.round(p.weight * proteinPerKg);
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { bmr, tdee, calories, protein, fat, carbs };
}
