import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  X,
} from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  onRegister: (data: { email: string; firstName: string; lastName: string }) => void;
  onQuickSelectUser: (userId: string) => void;
  users: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onQuickSelectUser,
  users,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setMessage('Пожалуйста, введите email и пароль');
        return;
      }
      onLogin(email.trim());
      onClose();
    } else if (mode === 'register') {
      if (!email.trim() || !firstName.trim() || !password.trim()) {
        setMessage('Заполните все обязательные поля');
        return;
      }
      onRegister({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || 'Пользователь',
      });
      setMessage('Письмо с подтверждением отправлено на ваш email!');
      setTimeout(() => onClose(), 1200);
    } else if (mode === 'forgot') {
      setMessage(`Инструкция по восстановлению пароля отправлена на ${email}`);
      setTimeout(() => {
        setMessage(null);
        setMode('login');
      }, 2000);
    }
  };

  const handleOAuth = (provider: 'VK' | 'Yandex') => {
    // Simulate OAuth callback
    const targetUser = users.find((u) => u.provider === provider.toLowerCase()) || users[0];
    onQuickSelectUser(targetUser.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#CBD5E1] animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
          <div>
            <h3 className="text-lg font-bold text-[#1A202C]">
              {mode === 'login' && 'Вход в аккаунт'}
              {mode === 'register' && 'Регистрация в Pureshque'}
              {mode === 'forgot' && 'Восстановление пароля'}
            </h3>
            <p className="text-xs text-[#718096]">
              {mode === 'login' && 'Введите ваши учетные данные'}
              {mode === 'register' && 'Создайте учетную запись для сохранения дневника'}
              {mode === 'forgot' && 'Введите email, указанный при регистрации'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#A0AEC0] hover:text-[#4A5568]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Selector */}
        <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8]">
          <span className="text-[11px] font-bold text-[#546E7A] uppercase block mb-1.5">
            Быстрый вход для проверки (демо):
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onQuickSelectUser('user-1');
                onClose();
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#81C784] text-xs font-semibold text-[#1B5E20] shadow-2xs"
            >
              Александра (Юзер)
            </button>
            <button
              type="button"
              onClick={() => {
                onQuickSelectUser('user-admin');
                onClose();
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#FFB74D] text-xs font-semibold text-[#E65100] shadow-2xs"
            >
              Иван (Админ)
            </button>
          </div>
        </div>

        {/* Social OAuth Buttons */}
        {mode !== 'forgot' && (
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleOAuth('VK')}
                className="py-2 px-3 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>ВК ID</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('Yandex')}
                className="py-2 px-3 rounded-xl bg-[#FC3F1D] hover:bg-[#E53515] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Яндекс ID</span>
              </button>
            </div>
            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-3 text-[11px] text-gray-400">или через email</span>
              <div className="grow border-t border-gray-200"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#4A5568] mb-1">Имя *</label>
                <input
                  type="text"
                  required
                  placeholder="Александра"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A5568] mb-1">Фамилия</label>
                <input
                  type="text"
                  placeholder="Смирнова"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-[#4A5568] mb-1">Email *</label>
            <input
              type="email"
              required
              placeholder="alexandra@pureshque.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-medium text-[#4A5568]">Пароль *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-[#2E7D32] hover:underline"
                  >
                    Забыли пароль?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
              />
            </div>
          )}

          {message && (
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold shadow-sm transition-all"
          >
            {mode === 'login' && 'Войти в личный кабинет'}
            {mode === 'register' && 'Зарегистрироваться'}
            {mode === 'forgot' && 'Отправить ссылку на сброс'}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="mt-4 pt-3 border-t border-[#EDF2F7] text-center text-xs text-[#718096]">
          {mode === 'login' ? (
            <span>
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#2E7D32] font-semibold hover:underline"
              >
                Создать профиль
              </button>
            </span>
          ) : (
            <span>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#2E7D32] font-semibold hover:underline"
              >
                Войти
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
