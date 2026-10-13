import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { ShieldCheck, User as UserIcon, BookOpen, ChevronRight, FileDown } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { activeTab, setActiveTab, activeRole, switchRole, user } = useApp();

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Главная' },
    { id: 'diary', label: 'Дневник' },
    { id: 'products', label: 'Продукты' },
    { id: 'recipes', label: 'Рецепты' },
    { id: 'analytics', label: 'Аналитика' },
    { id: 'weight', label: 'Вес' },
    { id: 'norm', label: 'Норма и цели' },
    { id: 'export', label: 'Экспорт' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E0EBD9] transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4CAF50] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-[#43A047] transition-colors">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1E3A1E] font-['Plus_Jakarta_Sans'] whitespace-nowrap">
              Pureshque
            </span>
          </button>

          {/* Zone 2: Navigation Links (Single-line, unboxed, hover underline) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                  activeTab === link.id
                    ? 'text-[#2E7D32] font-semibold border-b-2 border-[#4CAF50]'
                    : 'text-[#4A5568] hover:text-[#2E7D32]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Role switcher & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick switcher: User vs Admin */}
            <button
              onClick={switchRole}
              title={`Текущий режим: ${activeRole === 'admin' ? 'Администратор' : 'Пользователь'}. Нажмите для переключения.`}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]'
                  : 'bg-[#F5F5DC]/60 text-[#5D4037] border border-[#E0D8B0] hover:bg-[#F5F5DC]'
              }`}
            >
              {activeRole === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span className="hidden sm:inline">Режим: Админ</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-3.5 h-3.5 text-[#5D4037]" />
                  <span className="hidden sm:inline">Режим: Пользователь</span>
                </>
              )}
            </button>

            {/* Admin panel link if admin role */}
            {activeRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]'
                }`}
              >
                Панель управления
              </button>
            )}

            {/* View Documentation & Architecture */}
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'docs'
                  ? 'bg-[#1E3A1E] text-white'
                  : 'text-[#4A5568] hover:bg-[#F0F4EC]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Код & Документация</span>
            </button>

            {/* User profile button */}
            <button
              onClick={onOpenAuth}
              className="w-9 h-9 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32] hover:bg-[#C8E6C9] transition-colors cursor-pointer"
              title="Профиль / Авторизация"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-[#E8F5E9] text-xs">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                activeTab === link.id
                  ? 'bg-[#E8F5E9] text-[#2E7D32] font-semibold'
                  : 'text-[#4A5568]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
