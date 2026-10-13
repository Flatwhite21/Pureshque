import { Backup, DiaryEntry, Product, Profile, Recipe, Recommendation, User, WeightEntry } from '../types';
import {
  INITIAL_BACKUPS,
  INITIAL_DIARY,
  INITIAL_PRODUCTS,
  INITIAL_PROFILES,
  INITIAL_RECIPES,
  INITIAL_RECOMMENDATIONS,
  INITIAL_USERS,
  INITIAL_WEIGHTS,
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'pureshque_current_user_id',
  USERS: 'pureshque_users',
  PROFILES: 'pureshque_profiles',
  PRODUCTS: 'pureshque_products',
  RECIPES: 'pureshque_recipes',
  DIARY: 'pureshque_diary',
  WEIGHTS: 'pureshque_weights',
  RECOMMENDATIONS: 'pureshque_recommendations',
  BACKUPS: 'pureshque_backups',
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

export const StorageService = {
  getCurrentUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-1';
  },

  setCurrentUserId(id: string | null): void {
    if (id === null) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    }
  },

  getUsers(): User[] {
    return getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  setUsers(users: User[]): void {
    setStorageItem(STORAGE_KEYS.USERS, users);
  },

  getProfiles(): Record<string, Profile> {
    return getStorageItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },

  setProfiles(profiles: Record<string, Profile>): void {
    setStorageItem(STORAGE_KEYS.PROFILES, profiles);
  },

  getProducts(): Product[] {
    return getStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  setProducts(products: Product[]): void {
    setStorageItem(STORAGE_KEYS.PRODUCTS, products);
  },

  getRecipes(): Recipe[] {
    return getStorageItem(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
  },

  setRecipes(recipes: Recipe[]): void {
    setStorageItem(STORAGE_KEYS.RECIPES, recipes);
  },

  getDiary(): DiaryEntry[] {
    return getStorageItem(STORAGE_KEYS.DIARY, INITIAL_DIARY);
  },

  setDiary(entries: DiaryEntry[]): void {
    setStorageItem(STORAGE_KEYS.DIARY, entries);
  },

  getWeights(): WeightEntry[] {
    return getStorageItem(STORAGE_KEYS.WEIGHTS, INITIAL_WEIGHTS);
  },

  setWeights(weights: WeightEntry[]): void {
    setStorageItem(STORAGE_KEYS.WEIGHTS, weights);
  },

  getRecommendations(): Recommendation[] {
    return getStorageItem(STORAGE_KEYS.RECOMMENDATIONS, INITIAL_RECOMMENDATIONS);
  },

  setRecommendations(recs: Recommendation[]): void {
    setStorageItem(STORAGE_KEYS.RECOMMENDATIONS, recs);
  },

  getBackups(): Backup[] {
    return getStorageItem(STORAGE_KEYS.BACKUPS, INITIAL_BACKUPS);
  },

  setBackups(backups: Backup[]): void {
    setStorageItem(STORAGE_KEYS.BACKUPS, backups);
  },

  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-1');
    setStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStorageItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    setStorageItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStorageItem(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
    setStorageItem(STORAGE_KEYS.DIARY, INITIAL_DIARY);
    setStorageItem(STORAGE_KEYS.WEIGHTS, INITIAL_WEIGHTS);
    setStorageItem(STORAGE_KEYS.RECOMMENDATIONS, INITIAL_RECOMMENDATIONS);
    setStorageItem(STORAGE_KEYS.BACKUPS, INITIAL_BACKUPS);
  },
};
