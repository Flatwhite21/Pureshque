import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  Database,
  Cloud,
  CheckCircle2,
  XCircle,
  Trash2,
  Lock,
  Unlock,
  RotateCcw,
  Plus,
  Settings,
  Server,
  FileCode,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    user,
    activeRole,
    switchRole,
    allUsers,
    products,
    recipes,
    backups,
    createBackup,
    restoreBackup,
    toggleUserBlock,
    deleteUser,
    deleteProduct,
    deleteRecipe,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'recipes' | 'backups' | 'settings'>('users');
  const [userSearch, setUserSearch] = useState('');

  if (activeRole !== 'admin') {
    return (
      <div className="bg-white border border-[#FFE082] rounded-2xl p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1E3A1E]">Доступ ограничен</h2>
        <p className="text-sm text-[#718096]">
          Раздел администрирования доступен только для роли Администратора. Вы вошли как обычный пользователь ({user.firstName}).
        </p>
        <button
          onClick={switchRole}
          className="px-5 py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Переключиться в режим Администратора
        </button>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.lastName.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32] rounded">
              Панель управления
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E] mt-1">Административный центр Pureshque</h1>
          <p className="text-xs sm:text-sm text-[#5D705D]">
            Управление пользователями, модерация продуктов и рецептов, резервные копии и интеграции
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={createBackup}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Cloud className="w-4 h-4" />
            <span>Создать бэкап БД</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Пользователей</div>
          <div className="text-2xl font-bold font-mono text-[#1E3A1E] mt-1 tabular-nums">
            {allUsers.length}
          </div>
          <div className="text-[11px] text-[#4CAF50] mt-0.5">Все аккаунты активны</div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Продуктов в базе</div>
          <div className="text-2xl font-bold font-mono text-[#2E7D32] mt-1 tabular-nums">
            {products.length}
          </div>
          <div className="text-[11px] text-[#718096] mt-0.5">
            {products.filter((p) => p.isGlobal).length} в общей базе
          </div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Рецептов в каталоге</div>
          <div className="text-2xl font-bold font-mono text-[#1E3A1E] mt-1 tabular-nums">
            {recipes.length}
          </div>
          <div className="text-[11px] text-[#718096] mt-0.5">
            {recipes.filter((r) => r.isPublic).length} публичных
          </div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Яндекс.Диск Бэкап</div>
          <div className="text-sm font-bold font-mono text-[#4CAF50] mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Синхронизирован</span>
          </div>
          <div className="text-[11px] text-[#718096] mt-0.5">{backups.length} архива сохранено</div>
        </div>
      </div>

      {/* Segmented Admin Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F1F6EE] rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'users' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Пользователи ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'products' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Модерация продуктов ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'recipes' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Модерация рецептов ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('backups')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'backups' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Резервные копии ({backups.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Интеграции & Настройки
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#1E3A1E]">Список зарегистрированных пользователей</h2>
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#DCE8D4] rounded-xl w-full sm:w-64 focus:outline-none focus:border-[#4CAF50]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDF3E8] text-[#718096]">
                  <th className="py-2.5 font-medium">Пользователь</th>
                  <th className="py-2.5 font-medium">Email</th>
                  <th className="py-2.5 font-medium">Роль</th>
                  <th className="py-2.5 font-medium">Провайдер</th>
                  <th className="py-2.5 font-medium">Статус</th>
                  <th className="py-2.5 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F6EE]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F9FCF8]">
                    <td className="py-3 font-semibold text-[#1A2E1A]">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3 font-mono text-[#4A5568] tabular-nums">{u.email}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.role === 'admin' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#F1F6EE] text-[#4A5D4A]'
                        }`}
                      >
                        {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="py-3 uppercase text-[10px] font-mono text-[#718096]">{u.provider}</td>
                    <td className="py-3">
                      {u.isActive ? (
                        <span className="text-[#2E7D32] flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Активен
                        </span>
                      ) : (
                        <span className="text-[#E53E3E] flex items-center gap-1 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Заблокирован
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.id !== user.id && (
                          <>
                            <button
                              onClick={() => toggleUserBlock(u.id)}
                              className="p-1.5 text-[#718096] hover:text-[#1E3A1E] rounded hover:bg-[#F1F6EE] transition-colors cursor-pointer"
                              title={u.isActive ? 'Заблокировать' : 'Разблокировать'}
                            >
                              {u.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 text-[#CBD5E0] hover:text-[#E53E3E] rounded hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                              title="Удалить аккаунт (обезличивание данных)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MODERATION */}
      {activeTab === 'products' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1E3A1E]">Каталог продуктов и ингредиентов</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDF3E8] text-[#718096]">
                  <th className="py-2.5 font-medium">Название</th>
                  <th className="py-2.5 font-medium">Категория</th>
                  <th className="py-2.5 text-right font-medium">Ккал / 100г</th>
                  <th className="py-2.5 text-right font-medium">Б / Ж / У</th>
                  <th className="py-2.5 font-medium">Статус базы</th>
                  <th className="py-2.5 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F6EE]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9FCF8]">
                    <td className="py-2.5 font-semibold text-[#1A2E1A]">{p.name}</td>
                    <td className="py-2.5 text-[#718096]">{p.category}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#2E7D32] tabular-nums">
                      {p.caloriesPer100g}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#718096] tabular-nums">
                      {p.proteinsPer100g} / {p.fatsPer100g} / {p.carbsPer100g}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.isGlobal ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF8E1] text-[#F57F17]'
                        }`}
                      >
                        {p.isGlobal ? 'Общая база' : 'Пользовательский'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 text-[#CBD5E0] hover:text-[#E53E3E] rounded transition-colors cursor-pointer"
                        title="Удалить из каталога"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RECIPES MODERATION */}
      {activeTab === 'recipes' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1E3A1E]">Модерация рецептов пользователей</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDF3E8] text-[#718096]">
                  <th className="py-2.5 font-medium">Название рецепта</th>
                  <th className="py-2.5 font-medium">Автор</th>
                  <th className="py-2.5 text-right font-medium">Вес</th>
                  <th className="py-2.5 text-right font-medium">Ккал / 100г</th>
                  <th className="py-2.5 text-right font-medium">Ккал / порция</th>
                  <th className="py-2.5 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F6EE]">
                {recipes.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F9FCF8]">
                    <td className="py-2.5 font-semibold text-[#1A2E1A]">{r.title}</td>
                    <td className="py-2.5 text-[#718096]">{r.authorName}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{r.totalWeightG} г</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#2E7D32] tabular-nums">
                      {r.caloriesPer100g}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{r.caloriesPerServing}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => deleteRecipe(r.id)}
                        className="p-1 text-[#CBD5E0] hover:text-[#E53E3E] rounded transition-colors cursor-pointer"
                        title="Удалить рецепт"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUPS & YANDEX DISK */}
      {activeTab === 'backups' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1E3A1E]">Резервные копии базы данных (PostgreSQL)</h2>
              <p className="text-xs text-[#718096]">
                Хранилище: Локальный архив + Яндекс.Диск API (автоматическая выгрузка по расписанию Celery)
              </p>
            </div>
            <button
              onClick={createBackup}
              className="px-4 py-2 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              + Создать резервную копию
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDF3E8] text-[#718096]">
                  <th className="py-2.5">Файл архива</th>
                  <th className="py-2.5">Размер</th>
                  <th className="py-2.5">Синхронизация Яндекс.Диск</th>
                  <th className="py-2.5">Создатель</th>
                  <th className="py-2.5">Дата</th>
                  <th className="py-2.5 text-right">Восстановление</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F6EE]">
                {backups.map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#F9FCF8]">
                    <td className="py-2.5 font-mono text-[#1E3A1E] font-medium">{bk.filePath}</td>
                    <td className="py-2.5 font-mono tabular-nums text-[#718096]">
                      {(bk.sizeBytes / 1024 / 1024).toFixed(1)} МБ
                    </td>
                    <td className="py-2.5">
                      <span className="text-[#2E7D32] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" /> Выгружено на диск
                      </span>
                    </td>
                    <td className="py-2.5 text-[#718096]">{bk.createdByName}</td>
                    <td className="py-2.5 font-mono text-[#718096] tabular-nums">
                      {bk.createdAt.slice(0, 16).replace('T', ' ')}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => restoreBackup(bk.id)}
                        className="px-3 py-1 bg-[#F1F8EC] hover:bg-[#E2F0DC] text-[#2E7D32] border border-[#D8E6D0] rounded-lg font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Восстановить</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: INTEGRATIONS STATUS */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#1E3A1E]">Статус внешних интеграций сервиса</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#1E3A1E]">Яндекс.Диск API</span>
                <span className="text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">
                  Подключено
                </span>
              </div>
              <p className="text-xs text-[#718096]">
                OAuth-токен активен. Автоматическое зеркалирование ежедневных снимков базы данных PostgreSQL.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#1E3A1E]">OAuth 2.0: ВКонтакте & Яндекс</span>
                <span className="text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">
                  Готово к входу
                </span>
              </div>
              <p className="text-xs text-[#718096]">
                Клиентские идентификаторы настроены, авторизация в 1 клик для быстрых входов пользователей.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#1E3A1E]">Email-сервис (SMTP)</span>
                <span className="text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">
                  Активно
                </span>
              </div>
              <p className="text-xs text-[#718096]">
                Подтверждение email, отправка писем сброса паролей и системные алерты диетологов.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#1E3A1E]">Open Food Facts / USDA API</span>
                <span className="text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">
                  Онлайн
                </span>
              </div>
              <p className="text-xs text-[#718096]">
                Интеграционный адаптер для пополнения и верификации справочника продуктов по штрихкоду.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
