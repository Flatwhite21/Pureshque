import React, { useState } from 'react';
import {
  Apple,
  ArrowRight,
  BookOpen,
  Calendar,
  ChefHat,
  CheckCircle2,
  Download,
  Flame,
  Heart,
  LineChart,
  Lock,
  Mail,
  Scale,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: () => void;
  onQuickDemoLogin: (userId: string) => void;
  onCalculateQuick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onQuickDemoLogin,
}) => {
  // Quick instant calorie calculator widget on landing
  const [quickWeight, setQuickWeight] = useState(65);
  const [quickHeight, setQuickHeight] = useState(170);
  const [quickAge, setQuickAge] = useState(25);
  const [quickGender, setQuickGender] = useState<'female' | 'male'>('female');

  const baseBMR =
    quickGender === 'female'
      ? Math.round(10 * quickWeight + 6.25 * quickHeight - 5 * quickAge - 161)
      : Math.round(10 * quickWeight + 6.25 * quickHeight - 5 * quickAge + 5);
  const baseTDEE = Math.round(baseBMR * 1.55);

  return (
    <div className="space-y-16 py-8 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold border border-[#C8E6C9] shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#4CAF50]" />
          Веб-платформа для осознанного питания и здоровья
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1B5E20] tracking-tight max-w-4xl mx-auto leading-tight">
          Управляйте КБЖУ, весом и рационом с легким вкусом{' '}
          <span className="text-[#4CAF50] underline decoration-[#81C784]/60">Pureshque</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#546E7A] max-w-2xl mx-auto font-normal leading-relaxed">
          Точный расчёт калорий блюд по граммам, дневник питания по приёмам пищи, автоматический баланс белков, жиров и углеводов по формуле Миффлина-Сан Жеора.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-base shadow-sm hover:shadow-md transition-all transform active:scale-98"
          >
            Зарегистрироваться бесплатно
          </button>

          <button
            onClick={() => onQuickDemoLogin('user-1')}
            className="px-6 py-3.5 rounded-xl bg-white text-[#1B5E20] font-bold text-base border border-[#A5D6A7] hover:bg-[#E8F5E9] shadow-xs transition-all flex items-center gap-2"
          >
            Войти как Александра (Демо)
            <ArrowRight className="w-4 h-4 text-[#4CAF50]" />
          </button>
        </div>
      </section>

      {/* Interactive Quick Mini Calculator on Landing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-[#F9FBF8] rounded-3xl p-6 sm:p-8 border border-[#C8E6C9] shadow-md space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">
              Экспресс-расчёт
            </span>
            <h2 className="text-2xl font-extrabold text-[#1B5E20] mt-1">
              Узнайте свою суточную норму калорий прямо сейчас
            </h2>
            <p className="text-xs text-[#718096] mt-1">
              Расчет по клинической формуле Миффлина-Сан Жеора
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#4A5568] mb-1">Пол</label>
              <select
                value={quickGender}
                onChange={(e) => setQuickGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold"
              >
                <option value="female">Женский</option>
                <option value="male">Мужской</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A5568] mb-1">Вес (кг)</label>
              <input
                type="number"
                value={quickWeight}
                onChange={(e) => setQuickWeight(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#1B5E20]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A5568] mb-1">Рост (см)</label>
              <input
                type="number"
                value={quickHeight}
                onChange={(e) => setQuickHeight(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A5568] mb-1">Возраст (лет)</label>
              <input
                type="number"
                value={quickAge}
                onChange={(e) => setQuickAge(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold"
              />
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAEFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#718096]">Ваш базовый расход (BMR): {baseBMR} ккал</div>
              <div className="text-xl font-black text-[#1B5E20]">
                Ориентировочная норма: {baseTDEE} ккал / день
              </div>
              <div className="text-[11px] text-[#4CAF50] font-medium">
                Снижение веса: {Math.round(baseTDEE * 0.8)} ккал &bull; Набор массы: {Math.round(baseTDEE * 1.15)} ккал
              </div>
            </div>

            <button
              onClick={() => onQuickDemoLogin('user-1')}
              className="px-5 py-2.5 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-xs shadow-xs"
            >
              Перейти к полноценному дневнику
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1B5E20]">Возможности сервиса Pureshque</h2>
          <p className="text-sm text-[#718096] max-w-xl mx-auto">
            Все необходимые инструменты для контроля питания в одном продуманном интерфейсе
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Дневник по приёмам пищи</h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Завтрак, обед, ужин и перекусы с моментальным подсчетом калорий и макросов за каждый прием и за весь день.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Конструктор рецептов</h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Создавайте сложные блюда из отдельных ингредиентов. Система сама посчитает КБЖУ на 100 грамм и на порцию.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Графики и аналитика</h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Отслеживайте динамику веса, графики калорий по дням, соотношение белков, жиров и углеводов за неделю и месяц.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FCE4EC] text-[#C2185B] flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Экспорт отчётов в PDF и Excel</h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Выгрузка дневника для вашего врача-диетолога в PDF с подписью, а также каталога рецептов в формате таблицы XLSX.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Умные рекомендации</h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Подсказки при отклонении калорий или макронутриентов более чем на 15-20% от вашей целевой индивидуальной нормы.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E7DE] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E0F2F1] text-[#00796B] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Админ-панель и бэкапы</h3>
            <p className="text-xs text-[#718096] leading-relaxed">
              Полный контур администрирования пользователей, модерации базы продуктов и создания резервных копий на Яндекс.Диск.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience (Lab 1 Section 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] rounded-3xl p-8 border border-[#E0E7DE]">
        <h2 className="text-2xl font-extrabold text-[#1B5E20] text-center mb-6">
          Для кого создан Pureshque:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <strong className="block text-[#1B5E20] text-sm mb-1">Следящие за здоровьем</strong>
            Контролируйте калории и БЖУ, плавно снижайте или удерживайте вес без голодания.
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <strong className="block text-[#1B5E20] text-sm mb-1">Спортсмены и тренеры</strong>
            Точно соблюдайте нормы белка (1.8-2.2 г/кг) для набора мышечной массы и рельефа.
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <strong className="block text-[#1B5E20] text-sm mb-1">Диетологи и нутрициологи</strong>
            Составляйте рационы клиентам и выгружайте подробные PDF-отчёты с аналитикой.
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <strong className="block text-[#1B5E20] text-sm mb-1">Домашние кулинары</strong>
            Сохраняйте любимые рецепты, пересчитывайте порции и граммовки на лету.
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center space-y-4 max-w-xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-[#1A202C]">Готовы начать свой здоровый рацион?</h3>
        <p className="text-xs text-[#718096]">
          Попробуйте возможности сервиса в один клик без заполнения сложных форм.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onQuickDemoLogin('user-1')}
            className="px-6 py-3 rounded-xl bg-[#4CAF50] text-white font-bold text-sm shadow-md hover:bg-[#43A047]"
          >
            Войти как пользователь
          </button>
          <button
            onClick={() => onQuickDemoLogin('user-admin')}
            className="px-6 py-3 rounded-xl bg-[#FFF3E0] text-[#E65100] font-bold text-sm border border-[#FFB74D] hover:bg-[#FFE0B2]"
          >
            Войти как администратор
          </button>
        </div>
      </section>
    </div>
  );
};
