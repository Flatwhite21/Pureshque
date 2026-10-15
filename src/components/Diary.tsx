import React, { useState } from 'react';
import {
  Apple,
  Calendar,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Download,
  Flame,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { DiaryEntry, MealType, Product, Profile, Recipe, User } from '../types';
import { calculateIngredientNutrients } from '../utils/calculations';
import { printDiaryReport } from '../utils/export';

interface DiaryProps {
  currentUser: User;
  profile: Profile;
  diaryEntries: DiaryEntry[];
  products: Product[];
  recipes: Recipe[];
  onAddEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
  initialMealTypeModal?: MealType | null;
  onCloseInitialMealModal?: () => void;
}

export const Diary: React.FC<DiaryProps> = ({
  currentUser,
  profile,
  diaryEntries,
  products,
  recipes,
  onAddEntry,
  onDeleteEntry,
  initialMealTypeModal,
  onCloseInitialMealModal,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-13');
  const [addModalOpen, setAddModalOpen] = useState(!!initialMealTypeModal);
  const [activeMealType, setActiveMealType] = useState<MealType>(initialMealTypeModal || 'breakfast');
  const [addMode, setAddMode] = useState<'product' | 'recipe' | 'custom'>('product');

  // Add form states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  const [amountGrams, setAmountGrams] = useState<number>(100);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(recipes[0] || null);
  const [recipeServings, setRecipeServings] = useState<number>(1);

  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState<number>(150);
  const [customProteins, setCustomProteins] = useState<number>(10);
  const [customFats, setCustomFats] = useState<number>(5);
  const [customCarbs, setCustomCarbs] = useState<number>(15);

  // Filter entries for the selected date
  const dayEntries = diaryEntries.filter((e) => e.date === selectedDate);

  const meals: { key: MealType; label: string; icon: string }[] = [
    { key: 'breakfast', label: 'Завтрак', icon: '☀️' },
    { key: 'lunch', label: 'Обед', icon: '🍲' },
    { key: 'dinner', label: 'Ужин', icon: '🌙' },
    { key: 'snack', label: 'Перекусы', icon: '🍏' },
  ];

  const totalDayCalories = Math.round(dayEntries.reduce((s, e) => s + e.calories, 0));
  const totalDayProteins = Math.round(dayEntries.reduce((s, e) => s + e.proteins, 0));
  const totalDayFats = Math.round(dayEntries.reduce((s, e) => s + e.fats, 0));
  const totalDayCarbs = Math.round(dayEntries.reduce((s, e) => s + e.carbs, 0));

  const calorieProgress = Math.min(100, Math.round((totalDayCalories / profile.dailyCalorieNorm) * 100));

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().slice(0, 10));
  };

  const handleOpenAdd = (meal: MealType) => {
    setActiveMealType(meal);
    setAddModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();

    if (addMode === 'product' && selectedProduct) {
      const nutrients = calculateIngredientNutrients(selectedProduct, amountGrams);
      onAddEntry({
        userId: currentUser.id,
        date: selectedDate,
        mealType: activeMealType,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        amountG: amountGrams,
        calories: nutrients.calories,
        proteins: nutrients.proteins,
        fats: nutrients.fats,
        carbs: nutrients.carbs,
        image: selectedProduct.image,
      });
    } else if (addMode === 'recipe' && selectedRecipe) {
      onAddEntry({
        userId: currentUser.id,
        date: selectedDate,
        mealType: activeMealType,
        recipeId: selectedRecipe.id,
        productName: selectedRecipe.title,
        servings: recipeServings,
        calories: Math.round(selectedRecipe.caloriesPerServing * recipeServings),
        proteins: Math.round(selectedRecipe.proteinsPerServing * recipeServings * 10) / 10,
        fats: Math.round(selectedRecipe.fatsPerServing * recipeServings * 10) / 10,
        carbs: Math.round(selectedRecipe.carbsPerServing * recipeServings * 10) / 10,
        image: selectedRecipe.image,
      });
    } else if (addMode === 'custom' && customName.trim()) {
      onAddEntry({
        userId: currentUser.id,
        date: selectedDate,
        mealType: activeMealType,
        productName: customName.trim(),
        amountG: 100,
        calories: Number(customCalories),
        proteins: Number(customProteins),
        fats: Number(customFats),
        carbs: Number(customCarbs),
      });
    }

    setAddModalOpen(false);
    if (onCloseInitialMealModal) onCloseInitialMealModal();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar: Date Selector & Export Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E0E7DE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Stepper */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl border border-[#D5E1D4] hover:bg-[#F1F8E9] text-[#2E7D32] transition-colors"
            title="Предыдущий день"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4CAF50]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#D5E1D4] font-semibold text-[#1B5E20] text-base focus:outline-hidden focus:ring-2 focus:ring-[#81C784]"
            />
          </div>

          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl border border-[#D5E1D4] hover:bg-[#F1F8E9] text-[#2E7D32] transition-colors"
            title="Следующий день"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedDate('2026-10-13')}
            className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1B5E20] font-semibold text-xs border border-[#A5D6A7]"
          >
            Сегодня
          </button>
        </div>

        {/* Print / Export Report for this day */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              printDiaryReport(dayEntries, selectedDate, profile, `${currentUser.firstName} ${currentUser.lastName}`)
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F1F8E9] text-[#1B5E20] border border-[#A5D6A7] hover:bg-[#E8F5E9] text-sm font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-[#4CAF50]" />
            Печать / PDF отчёт дня
          </button>
        </div>
      </div>

      {/* Daily KBJU Summary Card */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E0E7DE] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between text-xs text-[#718096] mb-1 font-semibold uppercase">
              <span>Калории</span>
              <Flame className="w-4 h-4 text-[#F57F17]" />
            </div>
            <div className="text-2xl font-extrabold text-[#1B5E20]">
              {totalDayCalories} <span className="text-sm font-normal text-[#718096]">/ {profile.dailyCalorieNorm} ккал</span>
            </div>
            <div className="w-full bg-[#EDF2F7] rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-[#4CAF50] h-full rounded-full transition-all duration-300"
                style={{ width: `${calorieProgress}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#718096] mt-1 text-right">{calorieProgress}% от нормы</div>
          </div>

          {/* Proteins */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between text-xs text-[#718096] mb-1 font-semibold uppercase">
              <span>Белки (1.8-2.0 г/кг)</span>
              <span className="text-blue-500 font-bold">Б</span>
            </div>
            <div className="text-2xl font-extrabold text-[#1E3A8A]">
              {totalDayProteins} <span className="text-sm font-normal text-[#718096]">/ {profile.dailyProteinNorm} г</span>
            </div>
            <div className="w-full bg-[#EDF2F7] rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-[#3B82F6] h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalDayProteins / profile.dailyProteinNorm) * 100))}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#718096] mt-1 text-right">
              {Math.round((totalDayProteins / profile.dailyProteinNorm) * 100)}%
            </div>
          </div>

          {/* Fats */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between text-xs text-[#718096] mb-1 font-semibold uppercase">
              <span>Жиры (0.8-1.0 г/кг)</span>
              <span className="text-amber-500 font-bold">Ж</span>
            </div>
            <div className="text-2xl font-extrabold text-[#92400E]">
              {totalDayFats} <span className="text-sm font-normal text-[#718096]">/ {profile.dailyFatNorm} г</span>
            </div>
            <div className="w-full bg-[#EDF2F7] rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-[#F59E0B] h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalDayFats / profile.dailyFatNorm) * 100))}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#718096] mt-1 text-right">
              {Math.round((totalDayFats / profile.dailyFatNorm) * 100)}%
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between text-xs text-[#718096] mb-1 font-semibold uppercase">
              <span>Углеводы</span>
              <span className="text-emerald-500 font-bold">У</span>
            </div>
            <div className="text-2xl font-extrabold text-[#065F46]">
              {totalDayCarbs} <span className="text-sm font-normal text-[#718096]">/ {profile.dailyCarbNorm} г</span>
            </div>
            <div className="w-full bg-[#EDF2F7] rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-[#10B981] h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalDayCarbs / profile.dailyCarbNorm) * 100))}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-[#718096] mt-1 text-right">
              {Math.round((totalDayCarbs / profile.dailyCarbNorm) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* 4 Meals Breakdown */}
      <div className="space-y-6">
        {meals.map((meal) => {
          const mealEntries = dayEntries.filter((e) => e.mealType === meal.key);
          const mealCalories = Math.round(mealEntries.reduce((s, e) => s + e.calories, 0));
          const mealProteins = Math.round(mealEntries.reduce((s, e) => s + e.proteins, 0) * 10) / 10;
          const mealFats = Math.round(mealEntries.reduce((s, e) => s + e.fats, 0) * 10) / 10;
          const mealCarbs = Math.round(mealEntries.reduce((s, e) => s + e.carbs, 0) * 10) / 10;

          return (
            <div key={meal.key} className="bg-white rounded-2xl border border-[#E0E7DE] shadow-xs overflow-hidden">
              {/* Meal Section Header */}
              <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#EAEFE8] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meal.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-[#1A202C]">{meal.label}</h3>
                    <div className="text-xs text-[#718096]">
                      {mealCalories} ккал &bull; Б: {mealProteins}г &bull; Ж: {mealFats}г &bull; У: {mealCarbs}г
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAdd(meal.key)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1B5E20] font-semibold text-xs border border-[#A5D6A7] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Добавить в {meal.label.toLowerCase()}
                </button>
              </div>

              {/* Entries List */}
              <div className="divide-y divide-[#F0F4EF]">
                {mealEntries.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#A0AEC0]">
                    Ничего не добавлено в этот приём пищи.
                  </div>
                ) : (
                  mealEntries.map((item) => {
                    const itemImage =
                      item.image ||
                      recipes.find((r) => r.id === item.recipeId || r.title === item.productName)?.image ||
                      products.find((p) => p.id === item.productId || p.name === item.productName)?.image;

                    return (
                      <div
                        key={item.id}
                        className="px-6 py-3.5 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors"
                      >
                        <div className="flex items-center gap-3.5 flex-1 pr-4">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={item.productName}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E0E7DE] shadow-2xs"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C8E6C9]">
                              <Apple className="w-5 h-5 text-[#4CAF50]" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-sm text-[#2D3748]">{item.productName}</div>
                            <div className="text-xs text-[#718096]">
                              {item.amountG ? `${item.amountG} г` : `${item.servings} порц.`}
                              <span className="mx-2 text-[#CBD5E0]">&bull;</span>
                              <span>Б: {item.proteins}г</span>
                              <span className="mx-1.5 text-[#CBD5E0]">&bull;</span>
                              <span>Ж: {item.fats}г</span>
                              <span className="mx-1.5 text-[#CBD5E0]">&bull;</span>
                              <span>У: {item.carbs}г</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="font-bold text-sm text-[#1B5E20]">{Math.round(item.calories)}</span>
                            <span className="text-xs text-[#718096] ml-1">ккал</span>
                          </div>
                          <button
                            onClick={() => onDeleteEntry(item.id)}
                            className="p-1.5 rounded-lg text-[#CBD5E0] hover:text-[#E53E3E] hover:bg-[#FFF5F5] transition-colors"
                            title="Удалить запись"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Entry Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#CBD5E1] animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDF2F7]">
              <div>
                <h3 className="text-lg font-bold text-[#1A202C]">
                  Добавить в {meals.find((m) => m.key === activeMealType)?.label.toLowerCase()}
                </h3>
                <p className="text-xs text-[#718096]">Дата: {selectedDate}</p>
              </div>
              <button
                onClick={() => {
                  setAddModalOpen(false);
                  if (onCloseInitialMealModal) onCloseInitialMealModal();
                }}
                className="p-1.5 rounded-lg text-[#A0AEC0] hover:text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-[#F1F5F9] p-1 mt-4">
              <button
                type="button"
                onClick={() => setAddMode('product')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  addMode === 'product' ? 'bg-white text-[#1B5E20] shadow-xs' : 'text-[#64748B]'
                }`}
              >
                Продукт из базы
              </button>
              <button
                type="button"
                onClick={() => setAddMode('recipe')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  addMode === 'recipe' ? 'bg-white text-[#1B5E20] shadow-xs' : 'text-[#64748B]'
                }`}
              >
                Готовое блюдо (рецепт)
              </button>
              <button
                type="button"
                onClick={() => setAddMode('custom')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  addMode === 'custom' ? 'bg-white text-[#1B5E20] shadow-xs' : 'text-[#64748B]'
                }`}
              >
                Ввести вручную
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="mt-4 space-y-4">
              {/* Product Mode */}
              {addMode === 'product' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#4A5568] mb-1">
                      Поиск продукта в базе:
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#A0AEC0] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Например, овсяные хлопья, курица..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#CBD5E1] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#81C784]"
                      />
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-[#E2E8F0] rounded-xl divide-y divide-[#F1F5F9]">
                    {filteredProducts.slice(0, 8).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={`p-2 text-xs cursor-pointer flex justify-between items-center transition-colors ${
                          selectedProduct?.id === p.id ? 'bg-[#E8F5E9] text-[#1B5E20] font-semibold' : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E2E8F0]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center shrink-0">
                              <Apple className="w-4 h-4 text-[#4CAF50]" />
                            </div>
                          )}
                          <span className="font-medium text-[#2D3748]">{p.name}</span>
                        </div>
                        <span className="text-[#64748B] text-[11px] shrink-0">{p.caloriesPer100g} ккал / 100г</span>
                      </div>
                    ))}
                  </div>

                  {selectedProduct && (
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#2D3748]">Вес порции (грамм):</span>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={amountGrams}
                          onChange={(e) => setAmountGrams(Number(e.target.value))}
                          className="w-24 px-2 py-1 rounded-lg border border-[#CBD5E1] text-sm text-right font-bold"
                        />
                      </div>
                      {/* Calculated preview */}
                      {(() => {
                        const n = calculateIngredientNutrients(selectedProduct, amountGrams);
                        return (
                          <div className="text-xs text-[#2E7D32] flex justify-between font-medium">
                            <span>Итог: <strong>{Math.round(n.calories)} ккал</strong></span>
                            <span>Б: {n.proteins}г &bull; Ж: {n.fats}г &bull; У: {n.carbs}г</span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}

              {/* Recipe Mode */}
              {addMode === 'recipe' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#4A5568] mb-1">Выберите рецепт:</label>
                    <select
                      value={selectedRecipe?.id || ''}
                      onChange={(e) => {
                        const found = recipes.find((r) => r.id === e.target.value);
                        if (found) setSelectedRecipe(found);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-sm focus:outline-hidden"
                    >
                      {recipes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title} ({r.caloriesPerServing} ккал / порция)
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedRecipe && (
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] space-y-2">
                      {selectedRecipe.image && (
                        <div className="h-32 w-full rounded-xl overflow-hidden mb-2">
                          <img
                            src={selectedRecipe.image}
                            alt={selectedRecipe.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#2D3748]">Количество порций:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="10"
                          value={recipeServings}
                          onChange={(e) => setRecipeServings(Number(e.target.value))}
                          className="w-20 px-2 py-1 rounded-lg border border-[#CBD5E1] text-sm text-right font-bold"
                        />
                      </div>
                      <div className="text-xs text-[#2E7D32] flex justify-between font-medium">
                        <span>
                          Итог: <strong>{Math.round(selectedRecipe.caloriesPerServing * recipeServings)} ккал</strong>
                        </span>
                        <span>
                          Б: {(selectedRecipe.proteinsPerServing * recipeServings).toFixed(1)}г &bull; Ж:{' '}
                          {(selectedRecipe.fatsPerServing * recipeServings).toFixed(1)}г &bull; У:{' '}
                          {(selectedRecipe.carbsPerServing * recipeServings).toFixed(1)}г
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Custom Mode */}
              {addMode === 'custom' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A5568] mb-1">Название блюда:</label>
                    <input
                      type="text"
                      required
                      placeholder="Например, Кофе с молоком и круассан"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#718096]">Ккал</label>
                      <input
                        type="number"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#718096]">Белки (г)</label>
                      <input
                        type="number"
                        value={customProteins}
                        onChange={(e) => setCustomProteins(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#718096]">Жиры (г)</label>
                      <input
                        type="number"
                        value={customFats}
                        onChange={(e) => setCustomFats(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#718096]">Углеводы (г)</label>
                      <input
                        type="number"
                        value={customCarbs}
                        onChange={(e) => setCustomCarbs(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddModalOpen(false);
                    if (onCloseInitialMealModal) onCloseInitialMealModal();
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#4A5568] hover:bg-[#F8FAFC]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold shadow-sm"
                >
                  Записать в дневник
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
