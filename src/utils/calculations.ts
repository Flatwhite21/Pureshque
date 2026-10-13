import { ActivityLevel, Gender, Goal, Product, RecipeIngredient } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  min: 1.2,
  low: 1.375,
  medium: 1.55,
  high: 1.725,
  very_high: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  min: 'Минимальная (сидячая работа, нет тренировок)',
  low: 'Низкая (тренировки 1-3 раза в неделю)',
  medium: 'Средняя (умеренная активность 3-5 раз в неделю)',
  high: 'Высокая (интенсивные тренировки 6-7 раз в неделю)',
  very_high: 'Очень высокая (спортсмены, тяжелый физ. труд)',
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Снижение веса (дефицит ~20%)',
  maintain: 'Поддержание текущего веса',
  gain: 'Набор мышечной массы (профицит ~15%)',
};

/**
 * Calculates BMR using the Mifflin-St Jeor formula
 * Men: BMR = 10 * weight + 6.25 * height - 5 * age + 5
 * Women: BMR = 10 * weight + 6.25 * height - 5 * age - 161
 */
export function calculateBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? Math.round(base + 5) : Math.round(base - 161);
}

/**
 * Calculates TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * mult);
}

/**
 * Calculates Target Daily Calories and Macronutrients (КБЖУ)
 */
export function calculateDailyNorms(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel,
  goal: Goal
): {
  bmr: number;
  tdee: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
} {
  const bmr = calculateBMR(gender, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);

  let targetCalories = tdee;
  if (goal === 'lose') {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
  } else if (goal === 'gain') {
    targetCalories = Math.round(tdee * 1.15); // 15% surplus
  }

  // Proteins: 1.6 - 2.2 g/kg (e.g., 2.0 for deficit/surplus, 1.8 for maintain)
  const proteinGPerKg = goal === 'maintain' ? 1.8 : 2.0;
  const proteins = Math.round(weightKg * proteinGPerKg);

  // Fats: 0.8 - 1.1 g/kg (e.g., 0.9 for deficit, 1.0 for maintain/gain)
  const fatGPerKg = goal === 'lose' ? 0.9 : 1.0;
  const fats = Math.round(weightKg * fatGPerKg);

  // Carbs: (Calories - Protein*4 - Fat*9) / 4
  const caloriesFromProteinAndFat = proteins * 4 + fats * 9;
  const remainingCalories = Math.max(0, targetCalories - caloriesFromProteinAndFat);
  const carbs = Math.round(remainingCalories / 4);

  return {
    bmr,
    tdee,
    calories: targetCalories,
    proteins,
    fats,
    carbs,
  };
}

/**
 * Computes individual ingredient nutrients given grams
 */
export function calculateIngredientNutrients(product: Product, amountG: number): {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
} {
  const factor = amountG / 100;
  return {
    calories: Math.round(product.caloriesPer100g * factor * 10) / 10,
    proteins: Math.round(product.proteinsPer100g * factor * 10) / 10,
    fats: Math.round(product.fatsPer100g * factor * 10) / 10,
    carbs: Math.round(product.carbsPer100g * factor * 10) / 10,
  };
}

/**
 * Recalculates whole recipe totals, per 100g and per serving values
 */
export function calculateRecipeTotals(
  ingredients: RecipeIngredient[],
  servings: number
): {
  totalWeightG: number;
  totalCalories: number;
  totalProteins: number;
  totalFats: number;
  totalCarbs: number;
  caloriesPer100g: number;
  proteinsPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  caloriesPerServing: number;
  proteinsPerServing: number;
  fatsPerServing: number;
  carbsPerServing: number;
} {
  const validServings = Math.max(1, servings || 1);
  const totalWeightG = ingredients.reduce((sum, item) => sum + (item.amountG || 0), 0);

  const totalCalories = ingredients.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProteins = ingredients.reduce((sum, item) => sum + (item.proteins || 0), 0);
  const totalFats = ingredients.reduce((sum, item) => sum + (item.fats || 0), 0);
  const totalCarbs = ingredients.reduce((sum, item) => sum + (item.carbs || 0), 0);

  const factor100 = totalWeightG > 0 ? 100 / totalWeightG : 0;

  return {
    totalWeightG: Math.round(totalWeightG),
    totalCalories: Math.round(totalCalories),
    totalProteins: Math.round(totalProteins * 10) / 10,
    totalFats: Math.round(totalFats * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,

    caloriesPer100g: Math.round(totalCalories * factor100),
    proteinsPer100g: Math.round(totalProteins * factor100 * 10) / 10,
    fatsPer100g: Math.round(totalFats * factor100 * 10) / 10,
    carbsPer100g: Math.round(totalCarbs * factor100 * 10) / 10,

    caloriesPerServing: Math.round(totalCalories / validServings),
    proteinsPerServing: Math.round((totalProteins / validServings) * 10) / 10,
    fatsPerServing: Math.round((totalFats / validServings) * 10) / 10,
    carbsPerServing: Math.round((totalCarbs / validServings) * 10) / 10,
  };
}
