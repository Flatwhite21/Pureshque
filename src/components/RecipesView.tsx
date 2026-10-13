import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe, RecipeIngredientItem, Product } from '../types';
import { calculateRecipeNutrition, calculatePortionNutrition } from '../utils/calculator';
import { exportRecipesToExcel } from '../utils/export';
import { Plus, Trash2, FileSpreadsheet, Utensils, Users, Scale, ChefHat, Eye, Check } from 'lucide-react';

interface RecipesViewProps {
  onAddRecipeToDiary: (recipe: Recipe, servings: number) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({ onAddRecipeToDiary }) => {
  const { recipes, addRecipe, deleteRecipe, products, user, activeRole } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'create'>('all');
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Recipe | null>(null);

  // Servings adjustment for viewing
  const [adjustedServings, setAdjustedServings] = useState<Record<string, number>>({});

  // Recipe Builder State
  const [builderTitle, setBuilderTitle] = useState('');
  const [builderDesc, setBuilderDesc] = useState('');
  const [builderServings, setBuilderServings] = useState<number>(4);
  const [builderIsPublic, setBuilderIsPublic] = useState(true);
  const [builderIngredients, setBuilderIngredients] = useState<RecipeIngredientItem[]>([]);

  // Selected product to add to builder
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [ingredientGrams, setIngredientGrams] = useState<string>('100');

  const filteredRecipes = recipes.filter((r) => {
    if (activeTab === 'my') return r.authorId === user.id;
    return true;
  });

  const handleAddIngredientToBuilder = () => {
    const product = products.find((p) => p.id === selectedProductId);
    const grams = Number(ingredientGrams);
    if (!product || !grams || grams <= 0) return;

    const nutrition = calculatePortionNutrition(
      product.caloriesPer100g,
      product.proteinsPer100g,
      product.fatsPer100g,
      product.carbsPer100g,
      grams
    );

    const newItem: RecipeIngredientItem = {
      id: `ri_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      amountG: grams,
      calories: nutrition.calories,
      proteins: nutrition.proteins,
      fats: nutrition.fats,
      carbs: nutrition.carbs,
    };

    setBuilderIngredients((prev) => [...prev, newItem]);
    setIngredientGrams('100');
  };

  const handleRemoveBuilderIngredient = (id: string) => {
    setBuilderIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Live builder nutrition calculation
  const builderNutrition = calculateRecipeNutrition(builderIngredients, builderServings);

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderTitle.trim() || builderIngredients.length === 0) return;

    addRecipe({
      title: builderTitle.trim(),
      description: builderDesc.trim(),
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
      servings: builderServings,
      totalWeightG: builderNutrition.totalWeightG,
      totalCalories: builderNutrition.totalCalories,
      totalProteins: builderNutrition.totalProteins,
      totalFats: builderNutrition.totalFats,
      totalCarbs: builderNutrition.totalCarbs,
      caloriesPer100g: builderNutrition.caloriesPer100g,
      proteinsPer100g: builderNutrition.proteinsPer100g,
      fatsPer100g: builderNutrition.fatsPer100g,
      carbsPer100g: builderNutrition.carbsPer100g,
      caloriesPerServing: builderNutrition.caloriesPerServing,
      proteinsPerServing: builderNutrition.proteinsPerServing,
      fatsPerServing: builderNutrition.fatsPerServing,
      carbsPerServing: builderNutrition.carbsPerServing,
      isPublic: builderIsPublic,
      ingredients: builderIngredients,
    });

    // Reset
    setBuilderTitle('');
    setBuilderDesc('');
    setBuilderServings(4);
    setBuilderIngredients([]);
    setActiveTab('my');
  };

  const getServingsForRecipe = (recipe: Recipe) => {
    return adjustedServings[recipe.id] || recipe.servings;
  };

  const updateServingsForRecipe = (recipeId: string, count: number) => {
    if (count < 1) return;
    setAdjustedServings((prev) => ({ ...prev, [recipeId]: count }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E]">Кулинарные рецепты и блюда</h1>
          <p className="text-xs sm:text-sm text-[#5D705D] mt-0.5">
            Конструктор блюд с расчётом веса, КБЖУ на 100 г и на порцию
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportRecipesToExcel(recipes)}
            className="px-3.5 py-2 text-xs font-semibold text-[#1E3A1E] bg-[#F1F8EC] border border-[#D8E6D0] hover:bg-[#E2F0DC] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Экспорт всех рецептов в XLSX"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2E7D32]" />
            <span>Экспорт в XLSX</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Конструктор рецепта</span>
          </button>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="flex items-center gap-2 p-1 bg-[#F1F6EE] rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Все рецепты ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'my' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Мои рецепты ({recipes.filter((r) => r.authorId === user.id).length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'create' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          + Создать рецепт
        </button>
      </div>

      {/* CREATE RECIPE BUILDER TAB */}
      {activeTab === 'create' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#EDF3E8] pb-4">
            <h2 className="text-lg font-bold text-[#1E3A1E] flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#4CAF50]" />
              <span>Конструктор нового рецепта</span>
            </h2>
            <p className="text-xs text-[#718096]">
              Добавьте ингредиенты из каталога — система автоматически рассчитает вес, КБЖУ на 100 г и на порцию
            </p>
          </div>

          <form onSubmit={handleSaveRecipe} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-[#4A5568]">Название блюда *</label>
                <input
                  type="text"
                  required
                  placeholder="Например: Крем-суп из тыквы с семечками"
                  value={builderTitle}
                  onChange={(e) => setBuilderTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#4A5568]">Число порций по умолчанию</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={builderServings}
                  onChange={(e) => setBuilderServings(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#4A5568]">Описание / Способ приготовления</label>
              <textarea
                rows={2}
                placeholder="Краткое описание шагов приготовления, специй или условий сервировки..."
                value={builderDesc}
                onChange={(e) => setBuilderDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
              />
            </div>

            {/* Ingredient Picker Box */}
            <div className="p-4 bg-[#FAFDF7] border border-[#DCE8D4] rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-[#1E3A1E] uppercase tracking-wider">
                Добавление ингредиента в рецепт
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
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

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Граммы"
                    value={ingredientGrams}
                    onChange={(e) => setIngredientGrams(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredientToBuilder}
                    className="px-4 py-2 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    + Добавить
                  </button>
                </div>
              </div>

              {/* Ingredients List in Builder */}
              {builderIngredients.length > 0 ? (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2EBDC] text-[#718096]">
                        <th className="py-2">Ингредиент</th>
                        <th className="py-2 text-right">Вес</th>
                        <th className="py-2 text-right">Ккал</th>
                        <th className="py-2 text-right">Белки</th>
                        <th className="py-2 text-right">Жиры</th>
                        <th className="py-2 text-right">Углев.</th>
                        <th className="py-2 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F6EE]">
                      {builderIngredients.map((ing) => (
                        <tr key={ing.id} className="hover:bg-white/80">
                          <td className="py-2 font-medium text-[#1A2E1A]">{ing.productName}</td>
                          <td className="py-2 text-right font-mono tabular-nums">{ing.amountG} г</td>
                          <td className="py-2 text-right font-mono font-semibold text-[#2E7D32] tabular-nums">
                            {ing.calories}
                          </td>
                          <td className="py-2 text-right font-mono tabular-nums">{ing.proteins} г</td>
                          <td className="py-2 text-right font-mono tabular-nums">{ing.fats} г</td>
                          <td className="py-2 text-right font-mono tabular-nums">{ing.carbs} г</td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveBuilderIngredient(ing.id)}
                              className="text-[#CBD5E0] hover:text-[#E53E3E] p-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-[#A0AEC0] italic">
                  Пока не добавлено ни одного ингредиента. Выберите продукт выше.
                </div>
              )}
            </div>

            {/* Computed Recipe Summary Banner */}
            {builderIngredients.length > 0 && (
              <div className="p-4 bg-[#F1F8EC] border border-[#D5E8CC] rounded-2xl">
                <div className="text-xs font-bold text-[#1B5E20] mb-2 uppercase tracking-wider">
                  Итоговые расчёты по рецепту:
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-[#DCE8D4]">
                    <div className="text-[11px] text-[#718096]">Общий вес блюда</div>
                    <div className="font-mono font-bold text-base text-[#1E3A1E] tabular-nums">
                      {builderNutrition.totalWeightG} г
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#DCE8D4]">
                    <div className="text-[11px] text-[#718096]">Всего калорий</div>
                    <div className="font-mono font-bold text-base text-[#2E7D32] tabular-nums">
                      {builderNutrition.totalCalories} ккал
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#DCE8D4]">
                    <div className="text-[11px] text-[#718096]">КБЖУ на 100 г</div>
                    <div className="font-mono font-bold text-sm text-[#2E7D32] tabular-nums">
                      {builderNutrition.caloriesPer100g} ккал
                    </div>
                    <div className="text-[10px] text-[#718096] tabular-nums">
                      {builderNutrition.proteinsPer100g} / {builderNutrition.fatsPer100g} / {builderNutrition.carbsPer100g}
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#DCE8D4]">
                    <div className="text-[11px] text-[#718096]">На порцию ({builderServings} порц.)</div>
                    <div className="font-mono font-bold text-sm text-[#2E7D32] tabular-nums">
                      {builderNutrition.caloriesPerServing} ккал
                    </div>
                    <div className="text-[10px] text-[#718096] tabular-nums">
                      {builderNutrition.proteinsPerServing} / {builderNutrition.fatsPerServing} / {builderNutrition.carbsPerServing}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#EDF3E8]">
              <label className="flex items-center gap-2 text-xs text-[#4A5568] cursor-pointer">
                <input
                  type="checkbox"
                  checked={builderIsPublic}
                  onChange={(e) => setBuilderIsPublic(e.target.checked)}
                  className="rounded text-[#4CAF50] focus:ring-[#4CAF50]"
                />
                <span>Сделать рецепт публичным (доступным всем пользователям)</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="px-4 py-2 text-xs font-semibold text-[#718096] hover:bg-[#F1F6EE] rounded-xl cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={builderIngredients.length === 0}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Сохранить рецепт
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* RECIPES CATALOG GRID */}
      {activeTab !== 'create' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-[#718096] bg-white rounded-2xl border border-[#E2EBDC]">
              Рецепты не найдены. Создайте первый собственный рецепт!
            </div>
          ) : (
            filteredRecipes.map((recipe) => {
              const currentServings = getServingsForRecipe(recipe);
              const isOwner = recipe.authorId === user.id || activeRole === 'admin';

              // Dynamic recalculation per chosen servings
              const dynamicCaloriesPerServing = Math.round(recipe.totalCalories / currentServings);
              const dynamicProteinsPerServing = Number((recipe.totalProteins / currentServings).toFixed(1));
              const dynamicFatsPerServing = Number((recipe.totalFats / currentServings).toFixed(1));
              const dynamicCarbsPerServing = Number((recipe.totalCarbs / currentServings).toFixed(1));

              return (
                <div
                  key={recipe.id}
                  className="bg-white border border-[#E2EBDC] hover:border-[#A5D6A7] rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-base text-[#1E3A1E] leading-snug">{recipe.title}</h3>
                        <div className="text-xs text-[#718096] mt-0.5 flex items-center gap-1.5">
                          <span>Автор: {recipe.authorName}</span>
                          <span aria-hidden="true">·</span>
                          <span>Общий вес: {recipe.totalWeightG} г</span>
                        </div>
                      </div>

                      {isOwner && (
                        <button
                          onClick={() => deleteRecipe(recipe.id)}
                          className="text-[#CBD5E0] hover:text-[#E53E3E] p-1 rounded transition-colors cursor-pointer"
                          title="Удалить рецепт"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#4A5568] mt-2 line-clamp-2">{recipe.description}</p>

                    {/* Interactive Servings Stepper */}
                    <div className="flex items-center justify-between my-3 p-2 bg-[#F9FCF8] rounded-xl border border-[#EDF3E8] text-xs">
                      <span className="font-medium text-[#4A5D4A]">Расчёт на порцию:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateServingsForRecipe(recipe.id, currentServings - 1)}
                          className="w-6 h-6 rounded bg-white border border-[#DCE8D4] hover:bg-[#F1F8EC] flex items-center justify-center font-bold text-[#2E7D32] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-[#1E3A1E] tabular-nums">
                          {currentServings} порц.
                        </span>
                        <button
                          onClick={() => updateServingsForRecipe(recipe.id, currentServings + 1)}
                          className="w-6 h-6 rounded bg-white border border-[#DCE8D4] hover:bg-[#F1F8EC] flex items-center justify-center font-bold text-[#2E7D32] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Dual Nutrition Breakdown: Per 100g vs Per Serving */}
                    <div className="grid grid-cols-2 gap-3 my-3">
                      <div className="p-2.5 bg-[#FAFDF7] rounded-xl border border-[#EDF5EA] text-center">
                        <div className="text-[10px] text-[#718096]">На 100 грамм</div>
                        <div className="font-mono font-bold text-sm text-[#2E7D32] tabular-nums">
                          {recipe.caloriesPer100g} ккал
                        </div>
                        <div className="text-[10px] text-[#718096] tabular-nums mt-0.5">
                          Б: {recipe.proteinsPer100g} · Ж: {recipe.fatsPer100g} · У: {recipe.carbsPer100g}
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#FFFDE7]/80 rounded-xl border border-[#FFF9C4] text-center">
                        <div className="text-[10px] text-[#8D6E63]">На 1 порцию ({currentServings} порц.)</div>
                        <div className="font-mono font-bold text-sm text-[#E65100] tabular-nums">
                          {dynamicCaloriesPerServing} ккал
                        </div>
                        <div className="text-[10px] text-[#8D6E63] tabular-nums mt-0.5">
                          Б: {dynamicProteinsPerServing} · Ж: {dynamicFatsPerServing} · У: {dynamicCarbsPerServing}
                        </div>
                      </div>
                    </div>

                    {/* Ingredients summary */}
                    <div className="text-xs text-[#718096]">
                      <span className="font-medium text-[#4A5D4A]">Ингредиенты ({recipe.ingredients.length}): </span>
                      <span>
                        {recipe.ingredients.map((i) => `${i.productName} (${i.amountG}г)`).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-4 border-t border-[#EDF3E8] flex items-center justify-between">
                    <span className="text-[11px] text-[#718096]">Всего: {recipe.totalCalories} ккал</span>
                    <button
                      onClick={() => onAddRecipeToDiary(recipe, currentServings)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>В дневник (1 порция)</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
