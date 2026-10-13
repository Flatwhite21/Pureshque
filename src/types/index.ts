export type UserRole = 'user' | 'admin';
export type AuthProvider = 'email' | 'vk' | 'yandex';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'min' | 'low' | 'medium' | 'high' | 'very_high';
export type NutritionGoal = 'lose' | 'maintain' | 'gain';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExportTaskType = 'diary_pdf' | 'recipes_xlsx' | 'analytics_pdf';
export type ExportStatus = 'pending' | 'processing' | 'done' | 'error';
export type RecommendationType = 'calories' | 'protein' | 'fat' | 'carbs' | 'weight';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  provider: AuthProvider;
  isActive: boolean;
  isStaff: boolean;
  emailVerified: boolean;
  dateJoined: string;
  lastLogin?: string;
}

export interface Profile {
  id: string;
  userId: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  dailyCalorieNorm: number;
  dailyProteinNorm: number;
  dailyFatNorm: number;
  dailyCarbNorm: number;
  avatar?: string;
  timezone: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  caloriesPer100g: number;
  proteinsPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  category: string;
  isGlobal: boolean;
  ownerId?: string | null;
  image?: string;
  source: 'manual' | 'external' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinsPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  isGlobal: boolean;
  ownerId?: string | null;
}

export interface RecipeIngredientItem {
  id: string;
  productId: string;
  productName: string;
  amountG: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  servings: number;
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
  image?: string;
  isPublic: boolean;
  ingredients: RecipeIngredientItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  itemType: 'product' | 'recipe';
  productId?: string;
  recipeId?: string;
  name: string;
  amountG: number;
  servings?: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  date: string;
  type: RecommendationType;
  message: string;
  isRead: boolean;
}

export interface ExportTask {
  id: string;
  userId: string;
  exportType: ExportTaskType;
  periodStart: string;
  periodEnd: string;
  status: ExportStatus;
  filePath?: string;
  createdAt: string;
}

export interface Backup {
  id: string;
  createdById: string;
  createdByName: string;
  filePath: string;
  sizeBytes: number;
  status: 'completed' | 'uploading' | 'failed';
  yandexDiskSynced: boolean;
  createdAt: string;
}
