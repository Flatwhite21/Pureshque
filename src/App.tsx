import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DiaryView } from './components/DiaryView';
import { ProductsView } from './components/ProductsView';
import { RecipesView } from './components/RecipesView';
import { AnalyticsView } from './components/AnalyticsView';
import { NormCalculatorView } from './components/NormCalculatorView';
import { WeightTrackerView } from './components/WeightTrackerView';
import { ExportView } from './components/ExportView';
import { AdminView } from './components/AdminView';
import { ProjectDocsView } from './components/ProjectDocsView';
import { AddDiaryModal } from './components/AddDiaryModal';
import { AuthModal } from './components/AuthModal';
import { MealType, Product, Recipe } from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeTab, notification, dismissNotification, setActiveTab } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddDiaryModalOpen, setIsAddDiaryModalOpen] = useState(false);
  const [selectedMealForAdd, setSelectedMealForAdd] = useState<MealType>('breakfast');
  const [selectedProductForAdd, setSelectedProductForAdd] = useState<Product | null>(null);
  const [selectedRecipeForAdd, setSelectedRecipeForAdd] = useState<Recipe | null>(null);

  const handleOpenAddModal = (mealType?: MealType) => {
    if (mealType) setSelectedMealForAdd(mealType);
    setSelectedProductForAdd(null);
    setSelectedRecipeForAdd(null);
    setIsAddDiaryModalOpen(true);
  };

  const handleQuickAddProductToDiary = (product: Product) => {
    setSelectedProductForAdd(product);
    setSelectedRecipeForAdd(null);
    setIsAddDiaryModalOpen(true);
  };

  const handleAddRecipeToDiary = (recipe: Recipe, servings: number) => {
    setSelectedProductForAdd(null);
    setSelectedRecipeForAdd(recipe);
    setIsAddDiaryModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFDF7] text-[#2D3748]">
      {/* Top Bar Navigation */}
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#1E3A1E] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#81C784] shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={dismissNotification}
            className="text-white/70 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <Dashboard onOpenAddModal={handleOpenAddModal} />}
        {activeTab === 'diary' && <DiaryView onOpenAddModal={handleOpenAddModal} />}
        {activeTab === 'products' && (
          <ProductsView onQuickAddToDiary={handleQuickAddProductToDiary} />
        )}
        {activeTab === 'recipes' && (
          <RecipesView onAddRecipeToDiary={handleAddRecipeToDiary} />
        )}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'norm' && <NormCalculatorView />}
        {activeTab === 'weight' && <WeightTrackerView />}
        {activeTab === 'export' && <ExportView />}
        {activeTab === 'admin' && <AdminView />}
        {activeTab === 'docs' && <ProjectDocsView />}
      </main>

      {/* Modals */}
      <AddDiaryModal
        isOpen={isAddDiaryModalOpen}
        initialMealType={selectedMealForAdd}
        initialProduct={selectedProductForAdd}
        initialRecipe={selectedRecipeForAdd}
        onClose={() => setIsAddDiaryModalOpen(false)}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Quiet Footer */}
      <footer className="border-t border-[#E2EBDC] bg-white py-6 mt-12 no-print text-xs text-[#718096]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E3A1E]">Pureshque</span>
            <span>· Сервис расчёта КБЖУ блюд, ведения дневника питания и анализа рациона</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('docs')}
              className="hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              Архитектура & API
            </button>
            <button
              onClick={() => setActiveTab('norm')}
              className="hover:text-[#2E7D32] transition-colors cursor-pointer"
            >
              Формула Миффлина-Сан Жеора
            </button>
            <span>© 2026 Pureshque</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
