import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Profile,
  Product,
  Recipe,
  DiaryEntry,
  WeightEntry,
  Recommendation,
  ExportTask,
  Backup,
  UserRole,
  MealType,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ADMIN_USER,
  INITIAL_PROFILE,
  INITIAL_PRODUCTS,
  INITIAL_RECIPES,
  INITIAL_DIARY_ENTRIES,
  HISTORICAL_DIARY_ENTRIES,
  INITIAL_WEIGHT_ENTRIES,
  INITIAL_RECOMMENDATIONS,
  INITIAL_BACKUPS,
  TODAY_STR,
} from '../data/initialData';
import { calculateTargetCalories, calculateMacros, calculateBMR, calculateTDEE } from '../utils/calculator';

export type ActiveTab =
  | 'dashboard'
  | 'diary'
  | 'products'
  | 'recipes'
  | 'analytics'
  | 'norm'
  | 'weight'
  | 'export'
  | 'admin'
  | 'docs';

interface AppContextType {
  user: User;
  profile: Profile;
  activeRole: UserRole;
  activeTab: ActiveTab;
  currentDate: string;
  products: Product[];
  recipes: Recipe[];
  diaryEntries: DiaryEntry[];
  weightEntries: WeightEntry[];
  recommendations: Recommendation[];
  exportTasks: ExportTask[];
  backups: Backup[];
  allUsers: User[];
  notification: string | null;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentDate: (date: string) => void;
  setActiveRole: (role: UserRole) => void;
  switchRole: () => void;
  showNotification: (msg: string) => void;
  dismissNotification: () => void;

  // Diary
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'userId' | 'createdAt'>) => void;
  deleteDiaryEntry: (id: string) => void;

  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteProduct: (id: string) => void;

  // Recipes
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteRecipe: (id: string) => void;

  // Weight
  addWeightEntry: (entry: Omit<WeightEntry, 'id' | 'userId'>) => void;
  deleteWeightEntry: (id: string) => void;

  // Profile & Norms
  updateProfile: (updated: Partial<Profile>) => void;
  recalculateNorms: () => void;

  // Recommendations
  markRecommendationRead: (id: string) => void;

  // Backups
  createBackup: () => void;
  restoreBackup: (backupId: string) => void;

  // User Management (Admin)
  toggleUserBlock: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Export Tasks
  addExportTask: (task: Omit<ExportTask, 'id' | 'userId' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UserRole>('user');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentDate, setCurrentDate] = useState<string>(TODAY_STR);
  const [notification, setNotification] = useState<string | null>(null);

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('pureshque_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('pureshque_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pureshque_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('pureshque_recipes');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('pureshque_diary');
    return saved ? JSON.parse(saved) : [...INITIAL_DIARY_ENTRIES, ...HISTORICAL_DIARY_ENTRIES];
  });

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('pureshque_weight');
    return saved ? JSON.parse(saved) : INITIAL_WEIGHT_ENTRIES;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem('pureshque_recommendations');
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [exportTasks, setExportTasks] = useState<ExportTask[]>(() => {
    const saved = localStorage.getItem('pureshque_export_tasks');
    return saved ? JSON.parse(saved) : [
      {
        id: 'task_demo_1',
        userId: 'usr_alexandra',
        exportType: 'diary_pdf',
        periodStart: '2026-10-01',
        periodEnd: '2026-10-13',
        status: 'done',
        filePath: '/exports/diary_october_2026.pdf',
        createdAt: '2026-10-13T07:15:00Z',
      },
    ];
  });

  const [backups, setBackups] = useState<Backup[]>(() => {
    const saved = localStorage.getItem('pureshque_backups');
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });

  const [allUsers, setAllUsers] = useState<User[]>([
    INITIAL_USER,
    INITIAL_ADMIN_USER,
    {
      id: 'usr_ivan',
      email: 'ivan.trener@mail.ru',
      firstName: 'Иван',
      lastName: 'Морозов',
      role: 'user',
      provider: 'vk',
      isActive: true,
      isStaff: false,
      emailVerified: true,
      dateJoined: '2026-09-14T11:20:00Z',
    },
    {
      id: 'usr_olga',
      email: 'olga.diet@yandex.ru',
      firstName: 'Ольга',
      lastName: 'Васильева',
      role: 'user',
      provider: 'yandex',
      isActive: false, // заблокирован для демонстрации
      isStaff: false,
      emailVerified: true,
      dateJoined: '2026-09-28T16:45:00Z',
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pureshque_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pureshque_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('pureshque_diary', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem('pureshque_weight', JSON.stringify(weightEntries));
  }, [weightEntries]);

  useEffect(() => {
    localStorage.setItem('pureshque_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const dismissNotification = () => setNotification(null);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (role === 'admin') {
      setUser(INITIAL_ADMIN_USER);
      showNotification('Включен режим Администратора (полный доступ к админ-панели и модерации)');
    } else {
      setUser(INITIAL_USER);
      showNotification('Включен режим пользователя (Александра)');
    }
  };

  const switchRole = () => {
    setActiveRole(activeRole === 'user' ? 'admin' : 'user');
  };

  // Diary Actions
  const addDiaryEntry = (entry: Omit<DiaryEntry, 'id' | 'userId' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `de_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);
    showNotification(`Добавлено в дневник: ${entry.name} (${entry.calories} ккал)`);
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries((prev) => prev.filter((e) => e.id !== id));
    showNotification('Запись удалена из дневника');
  };

  // Product Actions
  const addProduct = (prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...prod,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showNotification(`Продукт «${prod.name}» успешно сохранен в базе!`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('Продукт удален из базы');
  };

  // Recipe Actions
  const addRecipe = (rec: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecipe: Recipe = {
      ...rec,
      id: `rec_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecipes((prev) => [newRecipe, ...prev]);
    showNotification(`Рецепт «${rec.title}» успешно сохранен!`);
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    showNotification('Рецепт удален');
  };

  // Weight Actions
  const addWeightEntry = (w: Omit<WeightEntry, 'id' | 'userId'>) => {
    const newW: WeightEntry = {
      ...w,
      id: `w_${Date.now()}`,
      userId: user.id,
    };
    setWeightEntries((prev) => [...prev.filter((item) => item.date !== w.date), newW].sort((a, b) => a.date.localeCompare(b.date)));
    // Также обновим вес в текущем профиле
    setProfile((prev) => ({
      ...prev,
      weightKg: w.weightKg,
      updatedAt: new Date().toISOString(),
    }));
    showNotification(`Новый замер веса: ${w.weightKg} кг зафиксирован!`);
  };

  const deleteWeightEntry = (id: string) => {
    setWeightEntries((prev) => prev.filter((w) => w.id !== id));
    showNotification('Замер веса удален');
  };

  // Profile & Norms
  const updateProfile = (updated: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      localStorage.setItem('pureshque_profile', JSON.stringify(next));
      return next;
    });
    showNotification('Параметры профиля обновлены');
  };

  const recalculateNorms = () => {
    const bmr = calculateBMR(profile.gender, profile.weightKg, profile.heightCm, profile.age);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, profile.goal);
    const { proteins, fats, carbs } = calculateMacros(targetCalories, profile.weightKg);

    updateProfile({
      dailyCalorieNorm: targetCalories,
      dailyProteinNorm: proteins,
      dailyFatNorm: fats,
      dailyCarbNorm: carbs,
    });
    showNotification(`Дневная норма пересчитана: ${targetCalories} ккал (Б: ${proteins}г, Ж: ${fats}г, У: ${carbs}г)`);
  };

  const markRecommendationRead = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isRead: true } : r))
    );
  };

  // Backups
  const createBackup = () => {
    const now = new Date();
    const stamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const newBackup: Backup = {
      id: `bk_${Date.now()}`,
      createdById: user.id,
      createdByName: `${user.firstName} ${user.lastName}`,
      filePath: `/var/backups/pureshque_db_${stamp}.sql.gz`,
      sizeBytes: 15124000 + Math.floor(Math.random() * 200000),
      status: 'completed',
      yandexDiskSynced: true,
      createdAt: now.toISOString(),
    };
    setBackups((prev) => [newBackup, ...prev]);
    showNotification('Резервная копия базы данных успешно создана и синхронизирована с Яндекс.Диском!');
  };

  const restoreBackup = (backupId: string) => {
    const bk = backups.find((b) => b.id === backupId);
    if (bk) {
      showNotification(`База данных успешно восстановлена из архива: ${bk.filePath}`);
    }
  };

  // User Admin Management
  const toggleUserBlock = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
    showNotification('Статус блокировки пользователя обновлен');
  };

  const deleteUser = (userId: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    showNotification('Пользователь и его персональные данные удалены');
  };

  // Export Tasks
  const addExportTask = (task: Omit<ExportTask, 'id' | 'userId' | 'createdAt'>) => {
    const newTask: ExportTask = {
      ...task,
      id: `task_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    setExportTasks((prev) => [newTask, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        activeRole,
        activeTab,
        currentDate,
        products,
        recipes,
        diaryEntries,
        weightEntries,
        recommendations,
        exportTasks,
        backups,
        allUsers,
        notification,
        setActiveTab,
        setCurrentDate,
        setActiveRole,
        switchRole,
        showNotification,
        dismissNotification,
        addDiaryEntry,
        deleteDiaryEntry,
        addProduct,
        deleteProduct,
        addRecipe,
        deleteRecipe,
        addWeightEntry,
        deleteWeightEntry,
        updateProfile,
        recalculateNorms,
        markRecommendationRead,
        createBackup,
        restoreBackup,
        toggleUserBlock,
        deleteUser,
        addExportTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
