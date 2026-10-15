export type Role = 'user' | 'admin';
export type AuthProvider = 'email' | 'vk' | 'yandex';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'min' | 'low' | 'medium' | 'high' | 'very_high';
export type Goal = 'lose' | 'maintain' | 'gain';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ProductCategory = 
  | 'vegetables'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'grains'
  | 'fruits'
  | 'nuts_oils'
  | 'drinks'
  | 'bakery_dessert'
  | 'other';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  provider: AuthProvider;
  isActive: boolean;
  emailVerified: boolean;
  dateJoined: string;
  lastLogin: string;
  avatarUrl?: string;
}

export interface Profile {
  userId: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  dailyCalorieNorm: number;
  dailyProteinNorm: number;
  dailyFatNorm: number;
  dailyCarbNorm: number;
  timezone: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  caloriesPer100g: number;
  proteinsPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  isGlobal: boolean;
  ownerId?: string | null;
  image?: string;
  source: 'manual' | 'external' | 'admin';
  createdAt: string;
}

export interface RecipeIngredient {
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
  ingredients: RecipeIngredient[];
  image?: string;
  isPublic: boolean;
  cookTimeMinutes?: number;
  instructions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  productId?: string | null;
  productName: string;
  recipeId?: string | null;
  amountG?: number;
  servings?: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  image?: string;
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
  type: 'calories' | 'protein' | 'fat' | 'carbs' | 'weight';
  severity: 'info' | 'warning' | 'success';
  message: string;
  isRead: boolean;
}

export interface ExportTask {
  id: string;
  userId: string;
  exportType: 'diary_pdf' | 'recipes_xlsx' | 'analytics_pdf';
  periodStart: string;
  periodEnd: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  filePath?: string;
  createdAt: string;
}

export interface Backup {
  id: string;
  createdById: string;
  createdByName: string;
  filename: string;
  sizeMb: number;
  status: 'created' | 'synced_yandex_disk' | 'restored';
  createdAt: string;
}
