import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MealType, Product, Recipe } from '../types';
import { calculatePortionNutrition } from '../utils/calculator';
import { Search, Utensils, ChefHat, Check } from 'lucide-react';

interface AddDiaryModalProps {
  isOpen: boolean;
  initialMealType?: MealType;
  initialProduct?: Product | null;
  initialRecipe?: Recipe | null;
  onClose: () => void;
}

export const AddDiaryModal: React.FC<AddDiaryModalProps> = ({
  isOpen,
  initialMealType = 'breakfast',
  initialProduct = null,
  initialRecipe = null,
  onClose,
}) => {
  const { products, recipes, currentDate, addDiaryEntry } = useApp();

  const [mealType, setMealType] = useState<MealType>(initialMealType);
  const [tab, setTab] = useState<'product' | 'recipe'>(initialRecipe ? 'recipe' : 'product');

  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || products[0]?.id || ''
  );
  const [amountGrams, setAmountGrams] = useState<string>('150');

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    initialRecipe?.id || recipes[0]?.id || ''
  );
  const [servingsCount, setServingsCount] = useState<number>(1);

  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  // Live nutrition calculation
  const productNutrition = currentProduct
    ? calculatePortionNutrition(
        currentProduct.caloriesPer100g,
        currentProduct.proteinsPer100g,
        currentProduct.fatsPer100g,
        currentProduct.carbsPer100g,
        Number(amountGrams) || 0
      )
    : { calories: 0, proteins: 0, fats: 0, carbs: 0 };

  const recipeNutrition = currentRecipe
    ? {
        calories: Math.round((currentRecipe.totalCalories / currentRecipe.servings) * servingsCount),
        proteins: Number(
          ((currentRecipe.totalProteins / currentRecipe.servings) * servingsCount).toFixed(1)
        ),
        fats: Number(
          ((currentRecipe.totalFats / currentRecipe.servings) * servingsCount).toFixed(1)
        ),
        carbs: Number(
          ((currentRecipe.totalCarbs / currentRecipe.servings) * servingsCount).toFixed(1)
        ),
        weightG: Math.round((currentRecipe.totalWeightG / currentRecipe.servings) * servingsCount),
      }
    : { calories: 0, proteins: 0, fats: 0, carbs: 0, weightG: 0 };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'product' && currentProduct) {
      addDiaryEntry({
        date: currentDate,
        mealType,
        itemType: 'product',
        productId: currentProduct.id,
        name: currentProduct.name,
        amountG: Number(amountGrams),
        calories: productNutrition.calories,
        proteins: productNutrition.proteins,
        fats: productNutrition.fats,
        carbs: productNutrition.carbs,
      });
    } else if (tab === 'recipe' && currentRecipe) {
      addDiaryEntry({
        date: currentDate,
        mealType,
        itemType: 'recipe',
        recipeId: currentRecipe.id,
        name: `${currentRecipe.title} (${servingsCount} порц.)`,
        amountG: recipeNutrition.weightG,
        servings: servingsCount,
        calories: recipeNutrition.calories,
        proteins: recipeNutrition.proteins,
        fats: recipeNutrition.fats,
        carbs: recipeNutrition.carbs,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E2EBDC] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EDF3E8]">
          <h2 className="text-lg font-bold text-[#1E3A1E] flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#4CAF50]" />
            <span>Добавить запись в дневник</span>
          </h2>
          <button onClick={onClose} className="text-[#A0AEC0] hover:text-[#4A5568] text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Meal type selector */}
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">Приём пищи:</label>
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
              {(
                [
                  { id: 'breakfast', label: 'Завтрак' },
                  { id: 'lunch', label: 'Обед' },
                  { id: 'dinner', label: 'Ужин' },
                  { id: 'snack', label: 'Перекус' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMealType(m.id)}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mealType === m.id
                      ? 'bg-[#4CAF50] text-white shadow-xs'
                      : 'bg-[#F1F6EE] text-[#4A5D4A] hover:bg-[#E2F0DC]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Segmented Tab (Product vs Recipe) */}
          <div className="flex items-center gap-2 p-1 bg-[#F1F6EE] rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTab('product')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                tab === 'product' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
              }`}
            >
              Отдельный продукт
            </button>
            <button
              type="button"
              onClick={() => setTab('recipe')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                tab === 'recipe' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
              }`}
            >
              Готовое блюдо / Рецепт
            </button>
          </div>

          {/* Product Picker */}
          {tab === 'product' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Выберите продукт:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl bg-white focus:outline-none focus:border-[#4CAF50] cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.caloriesPer100g} ккал / 100г)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                  Размер порции в граммах (г):
                </label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  required
                  value={amountGrams}
                  onChange={(e) => setAmountGrams(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                />
              </div>

              {/* Dynamic summary preview */}
              <div className="p-3 bg-[#F1F8EC] border border-[#D5E8CC] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#1B5E20]">Итого на {amountGrams}г: </span>
                  <span className="text-[#4A5D4A]">
                    Б: {productNutrition.proteins}г · Ж: {productNutrition.fats}г · У: {productNutrition.carbs}г
                  </span>
                </div>
                <div className="font-mono font-bold text-sm text-[#2E7D32] tabular-nums">
                  {productNutrition.calories} ккал
                </div>
              </div>
            </div>
          ) : (
            /* Recipe Picker */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Выберите рецепт:</label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl bg-white focus:outline-none focus:border-[#4CAF50] cursor-pointer"
                >
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.caloriesPerServing} ккал / порц.)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Количество порций:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setServingsCount(Math.max(0.5, servingsCount - 0.5))}
                    className="w-8 h-8 rounded-lg bg-[#F1F6EE] hover:bg-[#E2F0DC] border border-[#DCE8D4] font-bold text-[#2E7D32] cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={servingsCount}
                    onChange={(e) => setServingsCount(Math.max(0.5, Number(e.target.value)))}
                    className="w-20 text-center py-1.5 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setServingsCount(servingsCount + 0.5)}
                    className="w-8 h-8 rounded-lg bg-[#F1F6EE] hover:bg-[#E2F0DC] border border-[#DCE8D4] font-bold text-[#2E7D32] cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs text-[#718096]">порций</span>
                </div>
              </div>

              {/* Dynamic summary preview */}
              <div className="p-3 bg-[#F1F8EC] border border-[#D5E8CC] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#1B5E20]">Итого ({recipeNutrition.weightG}г): </span>
                  <span className="text-[#4A5D4A]">
                    Б: {recipeNutrition.proteins}г · Ж: {recipeNutrition.fats}г · У: {recipeNutrition.carbs}г
                  </span>
                </div>
                <div className="font-mono font-bold text-sm text-[#2E7D32] tabular-nums">
                  {recipeNutrition.calories} ккал
                </div>
              </div>
            </div>
          )}

          {/* Modal Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDF3E8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#718096] hover:bg-[#F1F6EE] rounded-xl cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Добавить в дневник
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
