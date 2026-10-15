import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AdminPanel } from './components/AdminPanel';
import { Analytics } from './components/Analytics';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Diary } from './components/Diary';
import { Export } from './components/Export';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Products } from './components/Products';
import { ProfileView } from './components/Profile';
import { Recipes } from './components/Recipes';
import {
  Backup,
  DiaryEntry,
  MealType,
  Product,
  Profile,
  Recipe,
  Recommendation,
  User,
  WeightEntry,
} from './types';
import { StorageService } from './utils/storage';

export default function App() {
  // Global State
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    StorageService.getCurrentUserId()
  );
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [profiles, setProfiles] = useState<Record<string, Profile>>(
    StorageService.getProfiles()
  );
  const [products, setProducts] = useState<Product[]>(
    StorageService.getProducts()
  );
  const [recipes, setRecipes] = useState<Recipe[]>(StorageService.getRecipes());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(
    StorageService.getDiary()
  );
  const [weights, setWeights] = useState<WeightEntry[]>(
    StorageService.getWeights()
  );
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    StorageService.getRecommendations()
  );
  const [backups, setBackups] = useState<Backup[]>(StorageService.getBackups());

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quickAddMealType, setQuickAddMealType] = useState<MealType | null>(
    null
  );

  // Derive Current User & Profile
  const currentUser = currentUserId
    ? users.find((u) => u.id === currentUserId) || null
    : null;
  const currentProfile = currentUserId
    ? profiles[currentUserId] || {
        userId: currentUserId,
        gender: 'female',
        age: 26,
        heightCm: 168,
        weightKg: 62.0,
        activityLevel: 'medium',
        goal: 'lose',
        dailyCalorieNorm: 1800,
        dailyProteinNorm: 110,
        dailyFatNorm: 55,
        dailyCarbNorm: 215,
        timezone: 'Europe/Moscow',
        updatedAt: new Date().toISOString(),
      }
    : null;

  // Persist storage on change
  useEffect(() => {
    StorageService.setCurrentUserId(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    StorageService.setUsers(users);
  }, [users]);

  useEffect(() => {
    StorageService.setProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    StorageService.setProducts(products);
  }, [products]);

  useEffect(() => {
    StorageService.setRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    StorageService.setDiary(diaryEntries);
  }, [diaryEntries]);

  useEffect(() => {
    StorageService.setWeights(weights);
  }, [weights]);

  useEffect(() => {
    StorageService.setRecommendations(recommendations);
  }, [recommendations]);

  useEffect(() => {
    StorageService.setBackups(backups);
  }, [backups]);

  // Auth Handlers
  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    setActiveTab('landing');
  };

  const handleLogin = (email: string) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      setCurrentUserId(existing.id);
      setActiveTab('dashboard');
    } else {
      // Auto-create user for frictionless experience
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        firstName: email.split('@')[0],
        lastName: 'Пользователь',
        role: 'user',
        provider: 'email',
        isActive: true,
        emailVerified: true,
        dateJoined: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      setCurrentUserId(newUser.id);
      setActiveTab('dashboard');
    }
  };

  const handleRegister = (data: {
    email: string;
    firstName: string;
    lastName: string;
  }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user',
      provider: 'email',
      isActive: true,
      emailVerified: true,
      dateJoined: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    setCurrentUserId(newUser.id);
    setActiveTab('dashboard');
  };

  // Diary Handlers
  const handleAddDiaryEntry = (
    entry: Omit<DiaryEntry, 'id' | 'createdAt'>
  ) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDiaryEntries([newEntry, ...diaryEntries]);

    // Delight celebration on entry
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleDeleteDiaryEntry = (id: string) => {
    setDiaryEntries(diaryEntries.filter((e) => e.id !== id));
  };

  // Products Handlers
  const handleAddProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Recipes Handlers
  const handleAddRecipe = (
    recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecipes([newRecipe, ...recipes]);
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  const handleAddRecipeToDiary = (recipe: Recipe, servings: number) => {
    if (!currentUser) return;
    handleAddDiaryEntry({
      userId: currentUser.id,
      date: '2026-10-13',
      mealType: 'lunch',
      recipeId: recipe.id,
      productName: recipe.title,
      servings,
      calories: Math.round(recipe.caloriesPerServing * servings),
      proteins: Math.round(recipe.proteinsPerServing * servings * 10) / 10,
      fats: Math.round(recipe.fatsPerServing * servings * 10) / 10,
      carbs: Math.round(recipe.carbsPerServing * servings * 10) / 10,
    });
    setActiveTab('diary');
  };

  // Weight Handlers
  const handleAddWeight = (weight: Omit<WeightEntry, 'id'>) => {
    const newWeight: WeightEntry = {
      ...weight,
      id: `w-${Date.now()}`,
    };
    setWeights([...weights, newWeight]);

    // Also update profile current weight
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        weightKg: weight.weightKg,
      };
      setProfiles({
        ...profiles,
        [currentProfile.userId]: updatedProfile,
      });
    }
  };

  const handleDeleteWeight = (id: string) => {
    setWeights(weights.filter((w) => w.id !== id));
  };

  // Profile Update
  const handleUpdateProfile = (updated: Profile) => {
    setProfiles({
      ...profiles,
      [updated.userId]: updated,
    });
  };

  // Admin Handlers
  const handleToggleUserActive = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleCreateBackup = () => {
    const newBackup: Backup = {
      id: `b-${Date.now()}`,
      createdById: currentUser?.id || 'admin',
      createdByName: currentUser?.firstName || 'Администратор',
      filename: `pureshque_backup_${new Date().toISOString().slice(0, 10)}.sql.gz`,
      sizeMb: 14.6,
      status: 'synced_yandex_disk',
      createdAt: new Date().toISOString(),
    };
    setBackups([newBackup, ...backups]);
  };

  const handleRestoreBackup = (_backupId: string) => {
    // Simulated restore
  };

  const handleDismissRecommendation = (id: string) => {
    setRecommendations(
      recommendations.map((r) =>
        r.id === id ? { ...r, isRead: true } : r
      )
    );
  };

  const handleResetData = () => {
    StorageService.resetAllData();
    setCurrentUserId('user-1');
    setUsers(StorageService.getUsers());
    setProfiles(StorageService.getProfiles());
    setProducts(StorageService.getProducts());
    setRecipes(StorageService.getRecipes());
    setDiaryEntries(StorageService.getDiary());
    setWeights(StorageService.getWeights());
    setRecommendations(StorageService.getRecommendations());
    setBackups(StorageService.getBackups());
    setActiveTab('dashboard');
  };

  // Today's entries for current user (filtered by today date 2026-10-13)
  const todayDate = '2026-10-13';
  const todayEntries = diaryEntries.filter(
    (e) => e.date === todayDate && (!currentUser || e.userId === currentUser.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2D312E]">
      {/* Main Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={users}
      />

      {/* Main Content Router */}
      <main className="grow">
        {(!currentUser || activeTab === 'landing') && (
          <LandingPage
            onOpenAuth={() => setAuthModalOpen(true)}
            onQuickDemoLogin={(id) => handleSwitchUser(id)}
            onCalculateQuick={() => setActiveTab('diary')}
          />
        )}

        {currentUser && currentProfile && (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                currentUser={currentUser}
                profile={currentProfile}
                todayEntries={todayEntries}
                recommendations={recommendations.filter(
                  (r) => r.userId === currentUser.id
                )}
                weights={weights.filter((w) => w.userId === currentUser.id)}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenAddModal={(meal) => {
                  setQuickAddMealType((meal as MealType) || 'breakfast');
                  setActiveTab('diary');
                }}
                onDismissRecommendation={handleDismissRecommendation}
              />
            )}

            {activeTab === 'diary' && (
              <Diary
                currentUser={currentUser}
                profile={currentProfile}
                diaryEntries={diaryEntries.filter(
                  (e) => e.userId === currentUser.id
                )}
                products={products}
                recipes={recipes}
                onAddEntry={handleAddDiaryEntry}
                onDeleteEntry={handleDeleteDiaryEntry}
                initialMealTypeModal={quickAddMealType}
                onCloseInitialMealModal={() => setQuickAddMealType(null)}
              />
            )}

            {activeTab === 'products' && (
              <Products
                currentUser={currentUser}
                products={products}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onSelectForDiary={(prod) => {
                  setActiveTab('diary');
                }}
              />
            )}

            {activeTab === 'recipes' && (
              <Recipes
                currentUser={currentUser}
                recipes={recipes}
                products={products}
                onAddRecipe={handleAddRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                onAddRecipeToDiary={handleAddRecipeToDiary}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics
                currentUser={currentUser}
                profile={currentProfile}
                diaryEntries={diaryEntries.filter(
                  (e) => e.userId === currentUser.id
                )}
                weights={weights.filter((w) => w.userId === currentUser.id)}
                onAddWeight={handleAddWeight}
                onDeleteWeight={handleDeleteWeight}
              />
            )}

            {activeTab === 'export' && (
              <Export
                currentUser={currentUser}
                profile={currentProfile}
                diaryEntries={diaryEntries.filter(
                  (e) => e.userId === currentUser.id
                )}
                recipes={recipes}
                weights={weights.filter((w) => w.userId === currentUser.id)}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                profile={currentProfile}
                onUpdateProfile={handleUpdateProfile}
                onResetData={handleResetData}
              />
            )}

            {activeTab === 'admin' && currentUser.role === 'admin' && (
              <AdminPanel
                currentUser={currentUser}
                users={users}
                products={products}
                recipes={recipes}
                backups={backups}
                onToggleUserActive={handleToggleUserActive}
                onDeleteUser={handleDeleteUser}
                onDeleteProduct={handleDeleteProduct}
                onDeleteRecipe={handleDeleteRecipe}
                onCreateBackup={handleCreateBackup}
                onRestoreBackup={handleRestoreBackup}
              />
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onQuickSelectUser={handleSwitchUser}
        users={users}
      />
    </div>
  );
}
