import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Search, Plus, Filter, Globe, UserCheck, Trash2, CheckCircle2, ArrowUpDown, ExternalLink } from 'lucide-react';

interface ProductsViewProps {
  onQuickAddToDiary: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onQuickAddToDiary }) => {
  const { products, addProduct, deleteProduct, activeRole, user } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'global' | 'my'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExternalSearchOpen, setIsExternalSearchOpen] = useState(false);

  // New product form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Крупы и злаки');
  const [newCalories, setNewCalories] = useState('');
  const [newProteins, setNewProteins] = useState('');
  const [newFats, setNewFats] = useState('');
  const [newCarbs, setNewCarbs] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSource =
        sourceFilter === 'all' ||
        (sourceFilter === 'global' && p.isGlobal) ||
        (sourceFilter === 'my' && p.ownerId === user.id);
      return matchesSearch && matchesCategory && matchesSource;
    });
  }, [products, searchQuery, selectedCategory, sourceFilter, user.id]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCalories) return;

    addProduct({
      name: newName.trim(),
      category: newCategory,
      caloriesPer100g: Number(newCalories),
      proteinsPer100g: Number(newProteins || 0),
      fatsPer100g: Number(newFats || 0),
      carbsPer100g: Number(newCarbs || 0),
      description: newDescription.trim(),
      isGlobal: activeRole === 'admin',
      ownerId: activeRole === 'admin' ? null : user.id,
      source: activeRole === 'admin' ? 'admin' : 'manual',
    });

    // Reset
    setNewName('');
    setNewCalories('');
    setNewProteins('');
    setNewFats('');
    setNewCarbs('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  // Mock External Open Food Facts / USDA records
  const externalSamples: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Тунец в собственном соку Rio Mare',
      category: 'Рыба и морепродукты',
      caloriesPer100g: 101,
      proteinsPer100g: 24.0,
      fatsPer100g: 0.5,
      carbsPer100g: 0.0,
      isGlobal: true,
      source: 'external',
      description: 'Импортировано из Open Food Facts API (Штрихкод 8004030040012)',
    },
    {
      name: 'Хлебцы цельнозерновые Dr. Körner',
      category: 'Крупы и злаки',
      caloriesPer100g: 290,
      proteinsPer100g: 9.0,
      fatsPer100g: 2.0,
      carbsPer100g: 59.0,
      isGlobal: true,
      source: 'external',
      description: 'Импортировано из базы Open Food Facts',
    },
    {
      name: 'Сыр легкий Брест-Литовск 35%',
      category: 'Молочные продукты',
      caloriesPer100g: 285,
      proteinsPer100g: 31.0,
      fatsPer100g: 17.5,
      carbsPer100g: 0.0,
      isGlobal: true,
      source: 'external',
      description: 'Импортировано из USDA / OFF',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E]">База продуктов и ингредиентов</h1>
          <p className="text-xs sm:text-sm text-[#5D705D] mt-0.5">
            Полноценный каталог с расчётом пищевой ценности на 100 грамм
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExternalSearchOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-[#1E3A1E] bg-[#F1F8EC] border border-[#D8E6D0] hover:bg-[#E2F0DC] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Open Food Facts</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить свой продукт</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
            <input
              type="text"
              placeholder="Поиск по названию продукта (например, творог, курица, овсянка)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAFDF7] border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] transition-colors"
            />
          </div>

          {/* Segmented Control for Source */}
          <div className="flex items-center gap-1 p-1 bg-[#F1F6EE] rounded-xl text-xs font-medium self-stretch sm:self-auto shrink-0">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sourceFilter === 'all' ? 'bg-white text-[#1E3A1E] shadow-2xs font-semibold' : 'text-[#5D705D]'
              }`}
            >
              Все ({products.length})
            </button>
            <button
              onClick={() => setSourceFilter('global')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sourceFilter === 'global' ? 'bg-white text-[#1E3A1E] shadow-2xs font-semibold' : 'text-[#5D705D]'
              }`}
            >
              Общая база
            </button>
            <button
              onClick={() => setSourceFilter('my')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                sourceFilter === 'my' ? 'bg-white text-[#1E3A1E] shadow-2xs font-semibold' : 'text-[#5D705D]'
              }`}
            >
              Мои продукты
            </button>
          </div>
        </div>

        {/* Category Pills (Functional Filter Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#4CAF50] text-white font-semibold'
                : 'bg-[#F1F8EC] text-[#4A5D4A] hover:bg-[#E2F0DC]'
            }`}
          >
            Все категории
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4CAF50] text-white font-semibold'
                  : 'bg-[#F1F8EC] text-[#4A5D4A] hover:bg-[#E2F0DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-[#718096] bg-white rounded-2xl border border-[#E2EBDC]">
            Продукты по вашему запросу не найдены.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isOwner = p.ownerId === user.id || activeRole === 'admin';
            return (
              <div
                key={p.id}
                className="bg-white border border-[#E2EBDC] hover:border-[#A5D6A7] rounded-2xl p-4.5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#1A2E1A] leading-snug">{p.name}</h3>
                      <div className="text-xs text-[#718096] mt-0.5 flex items-center gap-1.5">
                        <span>{p.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className={p.isGlobal ? 'text-[#2E7D32]' : 'text-[#8D6E63]'}>
                          {p.isGlobal ? 'Общая база' : 'Личный'}
                        </span>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-[#CBD5E0] hover:text-[#E53E3E] p-1 rounded transition-colors cursor-pointer"
                        title="Удалить продукт"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {p.description && (
                    <p className="text-xs text-[#718096] mt-2 line-clamp-2">{p.description}</p>
                  )}

                  {/* KBJU Grid on 100g */}
                  <div className="grid grid-cols-4 gap-1.5 my-3.5 p-2 bg-[#FAFDF7] rounded-xl border border-[#EDF5EA] text-center">
                    <div>
                      <div className="text-[10px] text-[#718096]">Ккал</div>
                      <div className="font-mono font-bold text-xs text-[#2E7D32] tabular-nums">
                        {p.caloriesPer100g}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#718096]">Белки</div>
                      <div className="font-mono font-semibold text-xs text-[#4A5568] tabular-nums">
                        {p.proteinsPer100g}г
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#718096]">Жиры</div>
                      <div className="font-mono font-semibold text-xs text-[#4A5568] tabular-nums">
                        {p.fatsPer100g}г
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#718096]">Углев.</div>
                      <div className="font-mono font-semibold text-xs text-[#4A5568] tabular-nums">
                        {p.carbsPer100g}г
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EDF3E8] flex items-center justify-between">
                  <span className="text-[11px] text-[#A0AEC0]">на 100 г</span>
                  <button
                    onClick={() => onQuickAddToDiary(p)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#2E7D32] bg-[#F1F8EC] hover:bg-[#E2F0DC] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>В дневник</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2EBDC] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF3E8]">
              <h2 className="text-lg font-bold text-[#1E3A1E]">Добавить продукт</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#A0AEC0] hover:text-[#4A5568] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Название продукта *</label>
                <input
                  type="text"
                  required
                  placeholder="Например: Протеиновый батончик Bombbar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1">Категория</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] bg-white cursor-pointer"
                  >
                    <option value="Крупы и злаки">Крупы и злаки</option>
                    <option value="Мясо и птица">Мясо и птица</option>
                    <option value="Рыба и морепродукты">Рыба и морепродукты</option>
                    <option value="Молочные продукты">Молочные продукты</option>
                    <option value="Овощи и зелень">Овощи и зелень</option>
                    <option value="Фрукты и ягоды">Фрукты и ягоды</option>
                    <option value="Орехи и масла">Орехи и масла</option>
                    <option value="Снеки и десерты">Снеки и десерты</option>
                    <option value="Напитки">Напитки</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1">Калории на 100г *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="ккал"
                    value={newCalories}
                    onChange={(e) => setNewCalories(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1">Белки (г)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={newProteins}
                    onChange={(e) => setNewProteins(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1">Жиры (г)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={newFats}
                    onChange={(e) => setNewFats(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A5568] mb-1">Углеводы (г)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={newCarbs}
                    onChange={(e) => setNewCarbs(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Описание (опционально)</label>
                <textarea
                  rows={2}
                  placeholder="Бренд, примечание или особенности приготовления..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDF3E8]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#718096] hover:bg-[#F1F6EE] rounded-xl transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Сохранить продукт
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* External DB Search Dialog */}
      {isExternalSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E2EBDC] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF3E8]">
              <div>
                <h2 className="text-lg font-bold text-[#1E3A1E] flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#2E7D32]" />
                  <span>Внешняя база: Open Food Facts & USDA</span>
                </h2>
                <p className="text-xs text-[#718096]">
                  Импорт проверенных данных по пищевой ценности
                </p>
              </div>
              <button
                onClick={() => setIsExternalSearchOpen(false)}
                className="text-[#A0AEC0] hover:text-[#4A5568] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {externalSamples.map((ext, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-sm text-[#1A2E1A]">{ext.name}</div>
                    <div className="text-xs text-[#718096] mt-0.5">
                      {ext.caloriesPer100g} ккал · Б: {ext.proteinsPer100g}г, Ж: {ext.fatsPer100g}г, У: {ext.carbsPer100g}г
                    </div>
                    <div className="text-[11px] text-[#2E7D32] mt-1">{ext.description}</div>
                  </div>

                  <button
                    onClick={() => {
                      addProduct({
                        ...ext,
                        isGlobal: true,
                        ownerId: null,
                      });
                      setIsExternalSearchOpen(false);
                    }}
                    className="px-3 py-1.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
                  >
                    Импортировать
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsExternalSearchOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#718096] hover:bg-[#F1F6EE] rounded-xl cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
