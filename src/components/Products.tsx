import React, { useState } from 'react';
import {
  Apple,
  Filter,
  Flame,
  Info,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { Product, ProductCategory, User } from '../types';

interface ProductsProps {
  currentUser: User | null;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onDeleteProduct: (id: string) => void;
  onSelectForDiary?: (product: Product) => void;
}

const CATEGORIES: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Все категории' },
  { key: 'meat', label: 'Мясо и птица' },
  { key: 'fish', label: 'Рыба и морепродукты' },
  { key: 'dairy', label: 'Молочные продукты' },
  { key: 'grains', label: 'Крупы и злаки' },
  { key: 'vegetables', label: 'Овощи и зелень' },
  { key: 'fruits', label: 'Фрукты и ягоды' },
  { key: 'nuts_oils', label: 'Орехи и масла' },
  { key: 'bakery_dessert', label: 'Выпечка и десерты' },
];

export const Products: React.FC<ProductsProps> = ({
  currentUser,
  products,
  onAddProduct,
  onDeleteProduct,
  onSelectForDiary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'global' | 'my'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'calories_asc' | 'calories_desc' | 'protein_desc'>('name');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [testGrams, setTestGrams] = useState<number>(100);

  // New product form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('vegetables');
  const [newCalories, setNewCalories] = useState<number>(100);
  const [newProteins, setNewProteins] = useState<number>(5);
  const [newFats, setNewFats] = useState<number>(2);
  const [newCarbs, setNewCarbs] = useState<number>(15);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddProduct({
      name: newName.trim(),
      description: newDesc.trim() || undefined,
      category: newCategory,
      caloriesPer100g: Number(newCalories),
      proteinsPer100g: Number(newProteins),
      fatsPer100g: Number(newFats),
      carbsPer100g: Number(newCarbs),
      isGlobal: currentUser?.role === 'admin',
      ownerId: currentUser?.id,
      source: currentUser?.role === 'admin' ? 'admin' : 'manual',
    });

    setCreateModalOpen(false);
    setNewName('');
    setNewDesc('');
  };

  // Filter & Sort logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSource =
      sourceFilter === 'all' ||
      (sourceFilter === 'global' && p.isGlobal) ||
      (sourceFilter === 'my' && p.ownerId === currentUser?.id);

    return matchesSearch && matchesCategory && matchesSource;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'calories_asc') return a.caloriesPer100g - b.caloriesPer100g;
    if (sortBy === 'calories_desc') return b.caloriesPer100g - a.caloriesPer100g;
    if (sortBy === 'protein_desc') return b.proteinsPer100g - a.proteinsPer100g;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Create Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B5E20] tracking-tight">База продуктов</h1>
          <p className="text-sm text-[#546E7A] mt-1">
            Пополняемый каталог пищевой ценности продуктов с расчетом КБЖУ на 100 грамм
          </p>
        </div>

        {currentUser && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-sm shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить свой продукт
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 text-[#9E9E9E] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или описанию (например, гречка, творог)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E1D4] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#81C784]"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#757575] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D5E1D4] text-xs font-medium text-[#37474F] bg-white focus:outline-hidden"
            >
              <option value="name">По алфавиту (А-Я)</option>
              <option value="calories_asc">Калории (по возрастанию)</option>
              <option value="calories_desc">Калории (по убыванию)</option>
              <option value="protein_desc">Максимум белка</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-[#F1F8E9] text-[#2E7D32] hover:bg-[#E8F5E9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Source Filter Switcher */}
        {currentUser && (
          <div className="flex items-center gap-3 pt-2 border-t border-[#EDF2F7] text-xs text-[#546E7A]">
            <span className="font-medium">Источник:</span>
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-2 py-0.5 rounded-md ${sourceFilter === 'all' ? 'bg-[#E0E7DE] font-bold text-[#1B5E20]' : 'hover:underline'}`}
            >
              Все ({products.length})
            </button>
            <button
              onClick={() => setSourceFilter('global')}
              className={`px-2 py-0.5 rounded-md ${sourceFilter === 'global' ? 'bg-[#E0E7DE] font-bold text-[#1B5E20]' : 'hover:underline'}`}
            >
              Базовая база ({products.filter((p) => p.isGlobal).length})
            </button>
            <button
              onClick={() => setSourceFilter('my')}
              className={`px-2 py-0.5 rounded-md ${sourceFilter === 'my' ? 'bg-[#E0E7DE] font-bold text-[#1B5E20]' : 'hover:underline'}`}
            >
              Мои продукты ({products.filter((p) => p.ownerId === currentUser.id).length})
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedProduct(p);
              setTestGrams(100);
            }}
            className="bg-white rounded-2xl p-5 border border-[#E0E7DE] hover:border-[#81C784] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F8E9] text-[#2E7D32]">
                  {CATEGORIES.find((c) => c.key === p.category)?.label || 'Прочее'}
                </span>
                {p.ownerId === currentUser?.id ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFF3E0] text-[#E65100] font-medium">
                    Мой
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F5F5] text-[#757575]">
                    База
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-[#2D3748] group-hover:text-[#1B5E20] transition-colors leading-snug">
                {p.name}
              </h3>
              {p.description && (
                <p className="text-xs text-[#718096] line-clamp-2 mt-1 leading-relaxed">
                  {p.description}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0F4EF]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-[#718096]">КБЖУ на 100 г:</span>
                <span className="font-extrabold text-base text-[#1B5E20]">
                  {p.caloriesPer100g} <span className="text-xs font-normal">ккал</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 text-center text-[11px] bg-[#FAF8F5] p-1.5 rounded-xl border border-[#EAEFE8]">
                <div>
                  <span className="block text-[#1565C0] font-semibold">Б</span>
                  <span className="font-medium text-[#37474F]">{p.proteinsPer100g}г</span>
                </div>
                <div>
                  <span className="block text-[#E65100] font-semibold">Ж</span>
                  <span className="font-medium text-[#37474F]">{p.fatsPer100g}г</span>
                </div>
                <div>
                  <span className="block text-[#2E7D32] font-semibold">У</span>
                  <span className="font-medium text-[#37474F]">{p.carbsPer100g}г</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#CBD5E1]">
          <Apple className="w-12 h-12 mx-auto text-[#A5D6A7] mb-2" />
          <h3 className="text-base font-bold text-[#37474F]">Продукты не найдены</h3>
          <p className="text-xs text-[#78909C] mt-1">
            Попробуйте изменить поисковый запрос или добавьте собственный продукт.
          </p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#CBD5E1] animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#EDF2F7]">
              <div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {CATEGORIES.find((c) => c.key === selectedProduct.category)?.label}
                </span>
                <h3 className="text-lg font-bold text-[#1A202C] mt-1">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg text-[#A0AEC0] hover:text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedProduct.description && (
              <p className="text-xs text-[#546E7A] mt-3 leading-relaxed">
                {selectedProduct.description}
              </p>
            )}

            {/* Live Portion KBJU Recalculator */}
            <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D3748]">Вес порции для расчета:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    step="10"
                    value={testGrams}
                    onChange={(e) => setTestGrams(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded-lg border border-[#CBD5E1] text-xs font-bold text-right"
                  />
                  <span className="text-xs text-[#718096]">г</span>
                </div>
              </div>

              {(() => {
                const factor = testGrams / 100;
                const cal = Math.round(selectedProduct.caloriesPer100g * factor);
                const p = (selectedProduct.proteinsPer100g * factor).toFixed(1);
                const f = (selectedProduct.fatsPer100g * factor).toFixed(1);
                const c = (selectedProduct.carbsPer100g * factor).toFixed(1);

                return (
                  <div>
                    <div className="text-center py-2 bg-white rounded-lg border border-[#E0E7DE] mb-2">
                      <span className="text-2xl font-extrabold text-[#1B5E20]">{cal}</span>
                      <span className="text-xs text-[#718096] ml-1">ккал на {testGrams}г</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-blue-50/70 p-2 rounded-lg">
                        <span className="text-[10px] text-blue-600 block">Белки</span>
                        <strong className="text-blue-900">{p} г</strong>
                      </div>
                      <div className="bg-amber-50/70 p-2 rounded-lg">
                        <span className="text-[10px] text-amber-600 block">Жиры</span>
                        <strong className="text-amber-900">{f} г</strong>
                      </div>
                      <div className="bg-emerald-50/70 p-2 rounded-lg">
                        <span className="text-[10px] text-emerald-600 block">Углеводы</span>
                        <strong className="text-emerald-900">{c} г</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal actions */}
            <div className="mt-5 flex gap-2">
              {currentUser && selectedProduct.ownerId === currentUser.id && (
                <button
                  onClick={() => {
                    onDeleteProduct(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </button>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#4A5568]"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#CBD5E1] animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
              <h3 className="text-lg font-bold text-[#1A202C]">Добавить собственный продукт</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#A0AEC0] hover:text-[#4A5568]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">
                  Название продукта *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например, Домашний цельнозерновой хлеб"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:ring-2 focus:ring-[#81C784]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">Категория</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
                >
                  {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">Описание (опционально)</label>
                <input
                  type="text"
                  placeholder="Состав, бренд или особенности приготовления"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
                />
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAEFE8]">
                <div className="text-xs font-semibold text-[#2D3748] mb-2">КБЖУ на 100 грамм:</div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#718096]">Ккал</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="1000"
                      value={newCalories}
                      onChange={(e) => setNewCalories(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#718096]">Белки (г)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="0"
                      max="100"
                      value={newProteins}
                      onChange={(e) => setNewProteins(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#718096]">Жиры (г)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="0"
                      max="100"
                      value={newFats}
                      onChange={(e) => setNewFats(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#718096]">Углеводы (г)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="0"
                      max="100"
                      value={newCarbs}
                      onChange={(e) => setNewCarbs(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#4A5568]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#4CAF50] text-white text-xs font-bold shadow-sm hover:bg-[#43A047]"
                >
                  Сохранить в базу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
