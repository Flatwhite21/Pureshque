import React, { useState } from 'react';
import {
  AlertTriangle,
  Apple,
  Ban,
  CheckCircle2,
  ChefHat,
  Cloud,
  Database,
  Globe,
  HardDrive,
  Key,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { Backup, Product, Recipe, User } from '../types';

interface AdminPanelProps {
  currentUser: User;
  users: User[];
  products: Product[];
  recipes: Recipe[];
  backups: Backup[];
  onToggleUserActive: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onDeleteRecipe: (recipeId: string) => void;
  onCreateBackup: () => void;
  onRestoreBackup: (backupId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  users,
  products,
  recipes,
  backups,
  onToggleUserActive,
  onDeleteUser,
  onDeleteProduct,
  onDeleteRecipe,
  onCreateBackup,
  onRestoreBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'recipes' | 'backups' | 'settings'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.lastName.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-[#FFF3E0] rounded-2xl p-6 border border-[#FFE0B2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E65100] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#FB8C00]" />
            Система администрирования Pureshque (Лабораторные работы 1, 4)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#BF360C]">
            Панель управления проектом
          </h1>
          <p className="text-xs text-[#795548] mt-1">
            Доступно администраторам: модерация базы продуктов, пользователей и интеграций с Яндекс.Диском
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Бэкенд & БД: Online
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white border border-[#E0E7DE] p-1.5 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
          }`}
        >
          <Server className="w-4 h-4" />
          Общая статистика
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'users' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
          }`}
        >
          <Users className="w-4 h-4" />
          Пользователи ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'products' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
          }`}
        >
          <Apple className="w-4 h-4" />
          Продукты ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'recipes' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          Рецепты ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('backups')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'backups' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
          }`}
        >
          <Database className="w-4 h-4" />
          Резервные копии ({backups.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'settings' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
          }`}
        >
          <Globe className="w-4 h-4" />
          Интеграции & Настройки
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs">
              <span className="text-xs text-[#718096] uppercase font-bold">Всего аккаунтов</span>
              <div className="text-2xl font-extrabold text-[#1B5E20] mt-1">{users.length}</div>
              <div className="text-xs text-[#4CAF50] mt-1 font-medium">100% подтвержденный email</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs">
              <span className="text-xs text-[#718096] uppercase font-bold">База продуктов</span>
              <div className="text-2xl font-extrabold text-[#1B5E20] mt-1">{products.length}</div>
              <div className="text-xs text-[#718096] mt-1">
                Глобальных: {products.filter((p) => p.isGlobal).length}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs">
              <span className="text-xs text-[#718096] uppercase font-bold">Опубликовано блюд</span>
              <div className="text-2xl font-extrabold text-[#1B5E20] mt-1">{recipes.length}</div>
              <div className="text-xs text-[#718096] mt-1">Все проверены модерацией</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs">
              <span className="text-xs text-[#718096] uppercase font-bold">Резервные копии</span>
              <div className="text-2xl font-extrabold text-[#1B5E20] mt-1">{backups.length}</div>
              <div className="text-xs text-[#2E7D32] mt-1 font-semibold flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-blue-500" />
                Яндекс.Диск подключен
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs">
            <h3 className="text-base font-bold text-[#1A202C] mb-3">Состояние микросервисов и серверов</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="font-bold text-[#334155]">Django REST API v5.0</div>
                <div className="text-emerald-600 font-semibold mt-1">● Работает (Latency: 24ms)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="font-bold text-[#334155]">PostgreSQL 16 Database</div>
                <div className="text-emerald-600 font-semibold mt-1">● 12 таблиц, 0 блокировок</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="font-bold text-[#334155]">Celery Worker & Redis</div>
                <div className="text-emerald-600 font-semibold mt-1">● 4 воркера активны</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#E0E7DE] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#9E9E9E] absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Поиск пользователя по имени или email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5E1D4] text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#546E7A] uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Пользователь</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Роль</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Провайдер</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EF]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-semibold text-[#1A202C]">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#546E7A]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.isActive ? (
                        <span className="text-emerald-600 font-semibold">Активен</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Заблокирован</span>
                      )}
                    </td>
                    <td className="px-4 py-3 uppercase text-[10px] text-[#718096]">{u.provider}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          onToggleUserActive(u.id);
                          showSuccess(`Статус пользователя ${u.firstName} изменен`);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[11px] font-semibold"
                        title={u.isActive ? 'Заблокировать' : 'Разблокировать'}
                      >
                        {u.isActive ? 'Блок' : 'Разблок'}
                      </button>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            if (confirm(`Удалить аккаунт ${u.firstName}?`)) {
                              onDeleteUser(u.id);
                              showSuccess('Пользователь удален');
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-semibold"
                        >
                          Удалить
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Products Moderation */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-[#E0E7DE] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#1A202C]">Каталог продуктов (Модерация)</h3>
            <span className="text-xs text-[#718096]">Всего: {products.length} продуктов</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#546E7A] uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Название</th>
                  <th className="px-4 py-3">Категория</th>
                  <th className="px-4 py-3">Ккал / 100г</th>
                  <th className="px-4 py-3">БЖУ</th>
                  <th className="px-4 py-3">Тип</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Управление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EF]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-semibold text-[#1A202C]">{p.name}</td>
                    <td className="px-4 py-3 text-[#546E7A]">{p.category}</td>
                    <td className="px-4 py-3 font-bold text-[#1B5E20]">{p.caloriesPer100g}</td>
                    <td className="px-4 py-3 text-[#546E7A]">
                      Б:{p.proteinsPer100g} Ж:{p.fatsPer100g} У:{p.carbsPer100g}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                        {p.isGlobal ? 'Глобальный' : 'Пользовательский'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          onDeleteProduct(p.id);
                          showSuccess('Продукт удален из базы');
                        }}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Recipes Moderation */}
      {activeTab === 'recipes' && (
        <div className="bg-white rounded-2xl border border-[#E0E7DE] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#1A202C]">Модерация рецептов</h3>
            <span className="text-xs text-[#718096]">Всего: {recipes.length} рецептов</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#546E7A] uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Название блюда</th>
                  <th className="px-4 py-3">Автор</th>
                  <th className="px-4 py-3">Вес (г)</th>
                  <th className="px-4 py-3">Ккал / 100г</th>
                  <th className="px-4 py-3">Порций</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EF]">
                {recipes.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-semibold text-[#1A202C]">{r.title}</td>
                    <td className="px-4 py-3 text-[#546E7A]">{r.authorName}</td>
                    <td className="px-4 py-3">{r.totalWeightG}г</td>
                    <td className="px-4 py-3 font-bold text-[#1B5E20]">{r.caloriesPer100g}</td>
                    <td className="px-4 py-3">{r.servings}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          onDeleteRecipe(r.id);
                          showSuccess('Рецепт удален');
                        }}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Backups & Yandex.Disk */}
      {activeTab === 'backups' && (
        <div className="bg-white rounded-2xl border border-[#E0E7DE] shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDF2F7]">
            <div>
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-[#1A202C]">
                  Резервное копирование (Яндекс.Диск API)
                </h3>
              </div>
              <p className="text-xs text-[#718096] mt-0.5">
                Автоматические дампы PostgreSQL со сжатием Gzip и синхронизацией в облачное хранилище
              </p>
            </div>

            <button
              onClick={() => {
                onCreateBackup();
                showSuccess('Создана новая резервная копия и отправлена на Яндекс.Диск');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать резервную копию сейчас
            </button>
          </div>

          <div className="space-y-3">
            {backups.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-sm text-[#1A202C] font-mono">{b.filename}</div>
                  <div className="text-[11px] text-[#718096] mt-0.5">
                    Создана: {new Date(b.createdAt).toLocaleString('ru-RU')} &bull; Автор: {b.createdByName} &bull; Размер: {b.sizeMb} МБ
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] flex items-center gap-1">
                    <Cloud className="w-3 h-3" />
                    Яндекс.Диск синхронизирован
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Восстановить базу данных из копии ${b.filename}?`)) {
                        onRestoreBackup(b.id);
                        showSuccess('База данных успешно восстановлена!');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#1B5E20] font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Восстановить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Integrations & Settings */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#1A202C] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#4CAF50]" />
              Внешние авторизации (OAuth 2.0)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] flex justify-between items-center">
                <div>
                  <strong>ВКонтакте ID (VK ID)</strong>
                  <div className="text-[10px] text-[#718096]">Client ID: 51839201 &bull; Redirect URI настроен</div>
                </div>
                <span className="text-emerald-600 font-semibold">Активен</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] flex justify-between items-center">
                <div>
                  <strong>Яндекс ID (Yandex OAuth)</strong>
                  <div className="text-[10px] text-[#718096]">App ID: yndx_pureshque_app &bull; Срок токена: 365 дн.</div>
                </div>
                <span className="text-emerald-600 font-semibold">Активен</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#1A202C] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#4CAF50]" />
              Почтовый шлюз и API продуктов
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] flex justify-between items-center">
                <div>
                  <strong>SMTP Email-сервер</strong>
                  <div className="text-[10px] text-[#718096]">smtp.pureshque.ru:587 (TLS шифрование)</div>
                </div>
                <span className="text-emerald-600 font-semibold">Готов</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] flex justify-between items-center">
                <div>
                  <strong>Open Food Facts API адаптер</strong>
                  <div className="text-[10px] text-[#718096]">Поиск по штрихкоду и пополнение базы</div>
                </div>
                <span className="text-emerald-600 font-semibold">Включен</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
