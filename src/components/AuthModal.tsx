import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';
import { INITIAL_USER, INITIAL_ADMIN_USER } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setActiveRole, showNotification } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('alexandra@pureshque.ru');
  const [password, setPassword] = useState('••••••••');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (email.toLowerCase().includes('admin')) {
        setActiveRole('admin');
        showNotification('Успешный вход: Главный Администратор');
      } else {
        setActiveRole('user');
        showNotification('Успешный вход: Александра Смирнова');
      }
    } else if (mode === 'register') {
      showNotification(`Регистрация успешна! На почту ${email} отправлена ссылка для подтверждения.`);
      setActiveRole('user');
    } else {
      showNotification(`Инструкция по восстановлению пароля отправлена на ${email}`);
    }
    onClose();
  };

  const handleOAuth = (provider: 'VK' | 'Яндекс') => {
    setActiveRole('user');
    showNotification(`Авторизация через ${provider} ID успешно выполнена!`);
    onClose();
  };

  const handleQuickLogin = (role: 'user' | 'admin') => {
    setActiveRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2EBDC] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EDF3E8]">
          <h2 className="text-lg font-bold text-[#1E3A1E]">
            {mode === 'login' ? 'Вход в Pureshque' : mode === 'register' ? 'Регистрация аккаунта' : 'Восстановление доступа'}
          </h2>
          <button onClick={onClose} className="text-[#A0AEC0] hover:text-[#4A5568] text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {/* Demo Fast Account Switcher Buttons */}
        <div className="p-3 bg-[#FAFDF7] border border-[#DCE8D4] rounded-xl text-xs space-y-2">
          <div className="text-[11px] font-semibold text-[#5D705D]">
            Быстрый вход для проверки функционала:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="py-1.5 px-2 bg-white hover:bg-[#F1F8EC] border border-[#C8E6C9] rounded-lg text-[#2E7D32] font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Александра (User)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-2 bg-white hover:bg-[#F1F8EC] border border-[#C8E6C9] rounded-lg text-[#2E7D32] font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Администратор</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Имя</label>
                <input
                  type="text"
                  required
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Фамилия</label>
                <input
                  type="text"
                  required
                  placeholder="Иванов"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Электронная почта (Email) *</label>
            <input
              type="email"
              required
              placeholder="example@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#4A5568]">Пароль *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#2E7D32] hover:underline cursor-pointer"
                  >
                    Забыли пароль?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="Минимум 8 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {mode === 'login' ? 'Войти в личный кабинет' : mode === 'register' ? 'Зарегистрироваться' : 'Отправить ссылку для сброса'}
          </button>
        </form>

        {/* OAuth Social Logins */}
        <div className="space-y-2 pt-2 border-t border-[#EDF3E8]">
          <div className="text-center text-[11px] text-[#718096]">Или войдите через социальные сервисы</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOAuth('VK')}
              className="py-2 px-3 bg-[#0077FF]/10 hover:bg-[#0077FF]/20 text-[#0077FF] border border-[#0077FF]/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              ВКонтакте ID
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('Яндекс')}
              className="py-2 px-3 bg-[#FC3F1D]/10 hover:bg-[#FC3F1D]/20 text-[#FC3F1D] border border-[#FC3F1D]/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Яндекс ID
            </button>
          </div>
        </div>

        {/* Bottom Switcher */}
        <div className="text-center text-xs text-[#718096] pt-1">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#2E7D32] font-semibold hover:underline cursor-pointer"
              >
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#2E7D32] font-semibold hover:underline cursor-pointer"
              >
                Войти
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
