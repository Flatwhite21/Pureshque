import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  Download,
  Flame,
  Plus,
  Scale,
  Search,
  Sparkles,
  Trash2,
  Users,
  Utensils,
  X,
} from 'lucide-react';
import { Product, Recipe, RecipeIngredient, User } from '../types';
import { calculateIngredientNutrients, calculateRecipeTotals } from '../utils/calculations';
import { exportRecipesToCSV } from '../utils/export';

interface RecipesProps {
  currentUser: User | null;
  recipes: Recipe[];
  products: Product[];
  onAddRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteRecipe: (id: string) => void;
  onAddRecipeToDiary?: (recipe: Recipe, servings: number) => void;
}

export const Recipes: React.FC<RecipesProps> = ({
  currentUser,
  recipes,
  products,
  onAddRecipe,
  onDeleteRecipe,
  onAddRecipeToDiary,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [interactiveServings, setInteractiveServings] = useState<number>(1);

  // Recipe Builder Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState<number>(1);
  const [cookTime, setCookTime] = useState<number>(20);
  const [isPublic, setIsPublic] = useState(true);

  // Ingredients in builder
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [selectedProductForIng, setSelectedProductForIng] = useState<Product | null>(products[0] || null);
  const [ingGrams, setIngGrams] = useState<number>(100);

  // Builder totals calculated on the fly
  const builderTotals = calculateRecipeTotals(ingredients, servings);

  const handleAddIngredient = () => {
    if (!selectedProductForIng || ingGrams <= 0) return;
    const n = calculateIngredientNutrients(selectedProductForIng, ingGrams);
    const newIng: RecipeIngredient = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: selectedProductForIng.id,
      productName: selectedProductForIng.name,
      amountG: ingGrams,
      calories: n.calories,
      proteins: n.proteins,
      fats: n.fats,
      carbs: n.carbs,
    };
    setIngredients([...ingredients, newIng]);
    setIngGrams(100);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || ingredients.length === 0) {
      alert('Пожалуйста, укажите название и добавьте хотя бы один ингредиент!');
      return;
    }

    onAddRecipe({
      title: title.trim(),
      description: description.trim(),
      authorId: currentUser?.id || 'guest',
      authorName: currentUser?.firstName || 'Гость',
      servings: Number(servings),
      totalWeightG: builderTotals.totalWeightG,
      totalCalories: builderTotals.totalCalories,
      totalProteins: builderTotals.totalProteins,
      totalFats: builderTotals.totalFats,
      totalCarbs: builderTotals.totalCarbs,
      caloriesPer100g: builderTotals.caloriesPer100g,
      proteinsPer100g: builderTotals.proteinsPer100g,
      fatsPer100g: builderTotals.fatsPer100g,
      carbsPer100g: builderTotals.carbsPer100g,
      caloriesPerServing: builderTotals.caloriesPerServing,
      proteinsPerServing: builderTotals.proteinsPerServing,
      fatsPerServing: builderTotals.fatsPerServing,
      carbsPerServing: builderTotals.carbsPerServing,
      ingredients,
      isPublic,
      cookTimeMinutes: Number(cookTime),
    });

    setBuilderOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setIngredients([]);
    setServings(1);
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (currentUser && r.authorId === currentUser.id);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B5E20] tracking-tight">Рецепты и блюда</h1>
          <p className="text-sm text-[#546E7A] mt-1">
            Конструктор блюд с автоматическим расчетом веса, КБЖУ на 100 г и на порцию
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportRecipesToCSV(recipes)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white text-[#2E7D32] border border-[#C8E6C9] hover:bg-[#F1F8E9] text-xs font-semibold shadow-2xs transition-colors"
            title="Экспорт всех рецептов в Excel (.csv)"
          >
            <Download className="w-4 h-4 text-[#4CAF50]" />
            Экспорт в Excel
          </button>

          {currentUser && (
            <button
              onClick={() => {
                setIngredients([]);
                setBuilderOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать рецепт
            </button>
          )}
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0E7DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9E9E9E] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по рецептам и блюдам..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5E1D4] text-xs focus:ring-2 focus:ring-[#81C784]"
          />
        </div>

        <div className="flex rounded-xl bg-[#F1F5F9] p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-white text-[#1B5E20] shadow-xs' : 'text-[#64748B]'
            }`}
          >
            Все рецепты ({recipes.length})
          </button>
          {currentUser && (
            <button
              onClick={() => setActiveTab('my')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'my' ? 'bg-white text-[#1B5E20] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Мои рецепты ({recipes.filter((r) => r.authorId === currentUser.id).length})
            </button>
          )}
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => {
              setSelectedRecipe(recipe);
              setInteractiveServings(recipe.servings || 1);
            }}
            className="bg-white rounded-2xl border border-[#E0E7DE] hover:border-[#81C784] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5">
              <div className="flex items-center justify-between text-xs text-[#718096] mb-2">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#4CAF50]" />
                  {recipe.cookTimeMinutes || 20} мин
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-[#4CAF50]" />
                  {recipe.servings} порц.
                </span>
                <span className="text-[11px] text-[#A0AEC0]">Автор: {recipe.authorName}</span>
              </div>

              <h3 className="font-bold text-lg text-[#2D3748] group-hover:text-[#1B5E20] transition-colors leading-snug">
                {recipe.title}
              </h3>
              <p className="text-xs text-[#718096] line-clamp-2 mt-1 leading-relaxed">
                {recipe.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#4A5568]">
                <Utensils className="w-3.5 h-3.5 text-[#81C784]" />
                <span>Ингредиентов: <strong>{recipe.ingredients.length}</strong></span>
                <span className="text-[#CBD5E0]">&bull;</span>
                <span>Общий вес: <strong>{recipe.totalWeightG}г</strong></span>
              </div>
            </div>

            {/* Nutrients Box */}
            <div className="bg-[#FAF8F5] p-4 border-t border-[#EAEFE8]">
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-[11px] text-[#718096]">На 1 порцию:</span>
                  <div className="text-xl font-extrabold text-[#1B5E20]">
                    {recipe.caloriesPerServing} <span className="text-xs font-normal text-[#546E7A]">ккал</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#718096]">На 100 г:</span>
                  <div className="text-sm font-bold text-[#37474F]">
                    {recipe.caloriesPer100g} ккал
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 text-center text-[10px] bg-white p-1 rounded-lg border border-[#E0E7DE]">
                <div>
                  <span className="text-blue-600 block font-semibold">Б</span>
                  <span className="font-bold text-gray-700">{recipe.proteinsPerServing}г</span>
                </div>
                <div>
                  <span className="text-amber-600 block font-semibold">Ж</span>
                  <span className="font-bold text-gray-700">{recipe.fatsPerServing}г</span>
                </div>
                <div>
                  <span className="text-emerald-600 block font-semibold">У</span>
                  <span className="font-bold text-gray-700">{recipe.carbsPerServing}г</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#CBD5E1] max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#EDF2F7]">
              <div>
                <h3 className="text-xl font-bold text-[#1A202C]">{selectedRecipe.title}</h3>
                <p className="text-xs text-[#718096] mt-0.5">Автор: {selectedRecipe.authorName}</p>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-1 rounded-lg text-[#A0AEC0] hover:text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#546E7A] mt-3 leading-relaxed">
              {selectedRecipe.description}
            </p>

            {/* Interactive Servings Stepper */}
            <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#2D3748]">Количество порций для расчета:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInteractiveServings(Math.max(1, interactiveServings - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] text-sm font-bold hover:bg-[#F1F8E9]"
                  >
                    -
                  </button>
                  <span className="font-bold text-base w-6 text-center">{interactiveServings}</span>
                  <button
                    onClick={() => setInteractiveServings(interactiveServings + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] text-sm font-bold hover:bg-[#F1F8E9]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic KBJU display */}
              {(() => {
                const totalCal = Math.round(selectedRecipe.caloriesPerServing * interactiveServings);
                const totalProt = (selectedRecipe.proteinsPerServing * interactiveServings).toFixed(1);
                const totalFat = (selectedRecipe.fatsPerServing * interactiveServings).toFixed(1);
                const totalCarb = (selectedRecipe.carbsPerServing * interactiveServings).toFixed(1);

                return (
                  <div className="bg-white p-3 rounded-xl border border-[#E0E7DE]">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs text-[#718096]">Калорийность порции:</span>
                      <span className="text-xl font-extrabold text-[#1B5E20]">
                        {totalCal} <span className="text-xs font-normal">ккал</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <span className="text-[10px] text-blue-600 block">Белки</span>
                        <strong className="text-blue-900">{totalProt}г</strong>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-lg">
                        <span className="text-[10px] text-amber-600 block">Жиры</span>
                        <strong className="text-amber-900">{totalFat}г</strong>
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-lg">
                        <span className="text-[10px] text-emerald-600 block">Углеводы</span>
                        <strong className="text-emerald-900">{totalCarb}г</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Ingredients Table */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096] mb-2">
                Состав ингредиентов (всего {selectedRecipe.totalWeightG}г):
              </h4>
              <div className="divide-y divide-[#EDF2F7] border border-[#E2E8F0] rounded-xl overflow-hidden">
                {selectedRecipe.ingredients.map((ing) => (
                  <div key={ing.id} className="p-2.5 text-xs flex justify-between items-center hover:bg-[#F8FAFC]">
                    <div>
                      <span className="font-medium text-[#2D3748]">{ing.productName}</span>
                      <span className="text-[#718096] ml-2">({ing.amountG}г)</span>
                    </div>
                    <div className="text-right text-[#4A5568]">
                      <span>{Math.round(ing.calories)} ккал</span>
                      <span className="text-[10px] text-[#A0AEC0] ml-1.5">
                        (Б:{ing.proteins} Ж:{ing.fats} У:{ing.carbs})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex gap-2">
              {currentUser && onAddRecipeToDiary && (
                <button
                  onClick={() => {
                    onAddRecipeToDiary(selectedRecipe, interactiveServings);
                    setSelectedRecipe(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold shadow-sm"
                >
                  Добавить в дневник ({interactiveServings} порц.)
                </button>
              )}

              {currentUser && selectedRecipe.authorId === currentUser.id && (
                <button
                  onClick={() => {
                    onDeleteRecipe(selectedRecipe.id);
                    setSelectedRecipe(null);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold"
                >
                  Удалить
                </button>
              )}

              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#4A5568]"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Builder Modal */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#CBD5E1] max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#4CAF50]" />
                <h3 className="text-lg font-bold text-[#1A202C]">Конструктор рецепта</h3>
              </div>
              <button onClick={() => setBuilderOpen(false)} className="p-1 rounded-lg text-[#A0AEC0]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipe} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4A5568] mb-1">
                    Название блюда *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например, Запеченная индейка с овощами гриль"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#81C784]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4A5568] mb-1">Описание блюда</label>
                  <input
                    type="text"
                    placeholder="Краткий рецепт, способ термообработки или секреты вкуса"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A5568] mb-1">
                    Количество порций
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={servings}
                    onChange={(e) => setServings(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A5568] mb-1">
                    Время приготовления (мин)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
                  />
                </div>
              </div>

              {/* Add Ingredient Section */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] space-y-3">
                <div className="text-xs font-bold text-[#2D3748]">Добавить ингредиент в блюдо:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedProductForIng?.id || ''}
                      onChange={(e) => {
                        const found = products.find((p) => p.id === e.target.value);
                        if (found) setSelectedProductForIng(found);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs bg-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.caloriesPer100g} ккал / 100г)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="5"
                      max="3000"
                      value={ingGrams}
                      onChange={(e) => setIngGrams(Number(e.target.value))}
                      placeholder="Грамм"
                      className="w-24 px-2 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-right"
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20]"
                    >
                      + Добавить
                    </button>
                  </div>
                </div>

                {/* List of currently added ingredients */}
                <div className="space-y-1.5 pt-2">
                  {ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-2 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong>{ing.productName}</strong> — {ing.amountG}г ({Math.round(ing.calories)} ккал)
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {ingredients.length === 0 && (
                    <div className="text-center py-3 text-xs text-[#A0AEC0]">
                      Ингредиенты еще не добавлены.
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Live Calculations for Recipe */}
              {ingredients.length > 0 && (
                <div className="p-4 rounded-xl bg-[#E8F5E9]/60 border border-[#A5D6A7] space-y-2">
                  <div className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
                    Автоматический расчет КБЖУ блюда:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-[#C8E6C9]">
                      <span className="text-[10px] text-[#718096] block">Общий вес блюда</span>
                      <strong className="text-base text-[#1B5E20]">{builderTotals.totalWeightG} г</strong>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#C8E6C9]">
                      <span className="text-[10px] text-[#718096] block">На 100 грамм</span>
                      <strong className="text-base text-[#1B5E20]">{builderTotals.caloriesPer100g} ккал</strong>
                      <div className="text-[10px] text-[#718096]">
                        Б:{builderTotals.proteinsPer100g} Ж:{builderTotals.fatsPer100g} У:{builderTotals.carbsPer100g}
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#C8E6C9] col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-[#718096] block">На 1 порцию ({servings} порц.)</span>
                      <strong className="text-base text-[#2E7D32]">{builderTotals.caloriesPerServing} ккал</strong>
                      <div className="text-[10px] text-[#718096]">
                        Б:{builderTotals.proteinsPerServing} Ж:{builderTotals.fatsPerServing} У:{builderTotals.carbsPerServing}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBuilderOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#4A5568]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={ingredients.length === 0}
                  className="flex-1 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] disabled:opacity-50 text-white text-xs font-bold shadow-sm"
                >
                  Сохранить рецепт
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
