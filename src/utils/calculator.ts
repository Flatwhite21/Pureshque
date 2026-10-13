import { ActivityLevel, Gender, NutritionGoal, RecipeIngredientItem } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  min: 1.2,
  low: 1.375,
  medium: 1.55,
  high: 1.725,
  very_high: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  min: 'Минимальная (сидячий образ жизни, 1.2)',
  low: 'Низкая (легкие тренировки 1-3 раза в неделю, 1.375)',
  medium: 'Средняя (умеренная активность 3-5 раз в неделю, 1.55)',
  high: 'Высокая (интенсивные тренировки 6-7 раз в неделю, 1.725)',
  very_high: 'Очень высокая (тяжелая работа / 2 тренировки в день, 1.9)',
};

export const GOAL_LABELS: Record<NutritionGoal, string> = {
  lose: 'Снижение веса (-20% калорий)',
  maintain: 'Поддержание текущего веса (норма)',
  gain: 'Набор мышечной массы (+15% калорий)',
};

/**
 * 7.1 Расчёт дневной нормы калорий по формуле Миффлина-Сан Жеора
 * Мужчины: BMR = 10 * вес(кг) + 6.25 * рост(см) - 5 * возраст + 5
 * Женщины: BMR = 10 * вес(кг) + 6.25 * рост(см) - 5 * возраст - 161
 * TDEE = BMR * коэффициент активности
 * Коррекция: lose => TDEE * 0.8, maintain => TDEE, gain => TDEE * 1.15
 */
export function calculateBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  return bmr * multiplier;
}

export function calculateTargetCalories(tdee: number, goal: NutritionGoal): number {
  let adjusted = tdee;
  if (goal === 'lose') {
    adjusted = tdee * 0.8; // -20%
  } else if (goal === 'gain') {
    adjusted = tdee * 1.15; // +15%
  }
  return Math.round(adjusted);
}

/**
 * 7.2 Расчёт БЖУ:
 * Белки: 1.6–2.2 г/кг (по умолчанию 1.8 г/кг)
 * Жиры: 0.8–1.1 г/кг (по умолчанию 0.9 г/кг)
 * Углеводы: (калории - белки*4 - жиры*9) / 4
 * Округление до целых граммов.
 */
export function calculateMacros(
  targetCalories: number,
  weightKg: number,
  proteinFactor: number = 1.8,
  fatFactor: number = 0.9
): { proteins: number; fats: number; carbs: number } {
  const proteins = Math.round(weightKg * proteinFactor);
  const fats = Math.round(weightKg * fatFactor);
  const proteinCalories = proteins * 4;
  const fatCalories = fats * 9;
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbs = Math.round(remainingCalories / 4);

  return { proteins, fats, carbs };
}

/**
 * 7.3 Расчёт КБЖУ рецепта
 * Для каждого ингредиента: КБЖУ = значение на 100 г * количество / 100.
 * Общий вес = сумма граммов
 * КБЖУ на 100 г = общее КБЖУ / общий вес * 100
 * КБЖУ на порцию = общее КБЖУ / количество порций
 */
export function calculateRecipeNutrition(ingredients: RecipeIngredientItem[], servings: number) {
  const totalWeightG = ingredients.reduce((sum, item) => sum + item.amountG, 0);
  const totalCalories = ingredients.reduce((sum, item) => sum + item.calories, 0);
  const totalProteins = ingredients.reduce((sum, item) => sum + item.proteins, 0);
  const totalFats = ingredients.reduce((sum, item) => sum + item.fats, 0);
  const totalCarbs = ingredients.reduce((sum, item) => sum + item.carbs, 0);

  const safeWeight = totalWeightG > 0 ? totalWeightG : 1;
  const safeServings = servings > 0 ? servings : 1;

  return {
    totalWeightG: Math.round(totalWeightG),
    totalCalories: Math.round(totalCalories),
    totalProteins: Number(totalProteins.toFixed(1)),
    totalFats: Number(totalFats.toFixed(1)),
    totalCarbs: Number(totalCarbs.toFixed(1)),
    caloriesPer100g: Math.round((totalCalories / safeWeight) * 100),
    proteinsPer100g: Number(((totalProteins / safeWeight) * 100).toFixed(1)),
    fatsPer100g: Number(((totalFats / safeWeight) * 100).toFixed(1)),
    carbsPer100g: Number(((totalCarbs / safeWeight) * 100).toFixed(1)),
    caloriesPerServing: Math.round(totalCalories / safeServings),
    proteinsPerServing: Number((totalProteins / safeServings).toFixed(1)),
    fatsPerServing: Number((totalFats / safeServings).toFixed(1)),
    carbsPerServing: Number((totalCarbs / safeServings).toFixed(1)),
  };
}

/**
 * Расчёт КБЖУ порции продукта
 */
export function calculatePortionNutrition(
  caloriesPer100g: number,
  proteinsPer100g: number,
  fatsPer100g: number,
  carbsPer100g: number,
  amountG: number
) {
  const factor = amountG / 100;
  return {
    calories: Math.round(caloriesPer100g * factor),
    proteins: Number((proteinsPer100g * factor).toFixed(1)),
    fats: Number((fatsPer100g * factor).toFixed(1)),
    carbs: Number((carbsPer100g * factor).toFixed(1)),
  };
}
