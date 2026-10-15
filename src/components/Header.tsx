import React, { useState } from 'react';
import {
  Apple,
  BookOpen,
  Calendar,
  ChefHat,
  Download,
  Flame,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  ShieldCheck,
  User as UserIcon,
  X,
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onSwitchUser,
  allUsers,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'diary', label: 'Дневник', icon: Calendar },
    { id: 'products', label: 'Продукты', icon: Apple },
    { id: 'recipes', label: 'Рецепты', icon: ChefHat },
    { id: 'analytics', label: 'Аналитика', icon: LineChart },
    { id: 'export', label: 'Экспорт', icon: Download },
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E0E7DE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center text-white shadow-sm ring-2 ring-[#A5D6A7]/40">
              <Flame className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#1B5E20] font-sans">
                Pureshque
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                КБЖУ & Дневник
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#E8F5E9] text-[#1B5E20] font-semibold shadow-xs ring-1 ring-[#81C784]/30'
                        : 'text-[#4A5568] hover:text-[#1B5E20] hover:bg-[#F0F4EF]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D32]' : 'text-[#718096]'}`} />
                    {item.label}
                  </button>
                );
              })}

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleNav('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#FFF3E0] text-[#E65100] font-semibold shadow-xs ring-1 ring-[#FFB74D]'
                      : 'text-[#B45309] hover:bg-[#FFF8E1]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#FB8C00]" />
                  Админ-панель
                </button>
              )}
            </nav>
          )}

          {/* Right Action / User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[#D5E1D4] bg-white hover:border-[#81C784] transition-all shadow-xs"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#81C784]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-sm">
                      {currentUser.firstName[0]}
                    </div>
                  )}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#2D3748] leading-tight">
                      {currentUser.firstName}
                    </span>
                    <span className="text-[10px] text-[#718096]">
                      {currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50 animate-in fade-in-50 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#EDF2F7]">
                      <p className="text-sm font-semibold text-[#1A202C]">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-[#718096] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-4 py-2 text-sm text-[#4A5568] hover:bg-[#F7FAFC] flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#718096]" />
                      Мой профиль и цели
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-4 py-2 text-sm text-[#E65100] hover:bg-[#FFF8E1] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#FB8C00]" />
                        Панель администратора
                      </button>
                    )}

                    <div className="border-t border-[#EDF2F7] my-1"></div>
                    <div className="px-4 py-1.5 text-[11px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
                      Быстрое переключение роли:
                    </div>

                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => onSwitchUser(u.id)}
                        className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between ${
                          currentUser.id === u.id ? 'bg-[#E8F5E9] text-[#1B5E20] font-semibold' : 'text-[#4A5568] hover:bg-[#F7FAFC]'
                        }`}
                      >
                        <span>{u.firstName} ({u.role === 'admin' ? 'Админ' : 'Юзер'})</span>
                        {currentUser.id === u.id && <span className="text-[10px] text-[#2E7D32]">активен</span>}
                      </button>
                    ))}

                    <div className="border-t border-[#EDF2F7] my-1"></div>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#E53E3E] hover:bg-[#FFF5F5] flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти (режим Гостя)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-lg bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold shadow-xs transition-colors"
                >
                  Войти / Регистрация
                </button>
                <button
                  onClick={() => onSwitchUser('user-1')}
                  className="hidden sm:inline-flex px-3 py-2 rounded-lg bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1B5E20] text-xs font-medium border border-[#A5D6A7]"
                >
                  Демо-вход
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#4A5568] hover:bg-[#EDF2F7]"
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-1 shadow-md">
          {currentUser ? (
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'text-[#4A5568] hover:bg-[#F7FAFC]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#4CAF50]" />
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={() => handleNav('profile')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#4A5568] hover:bg-[#F7FAFC]"
              >
                <UserIcon className="w-5 h-5 text-[#4CAF50]" />
                Мой профиль
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#E65100] hover:bg-[#FFF8E1]"
                >
                  <ShieldCheck className="w-5 h-5 text-[#FB8C00]" />
                  Панель администратора
                </button>
              )}
            </>
          ) : (
            <div className="py-2">
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 rounded-lg bg-[#4CAF50] text-white text-sm font-semibold"
              >
                Войти в Pureshque
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
