import React from 'react';
import {
  AlertCircle,
  Apple,
  ArrowRight,
  Calendar,
  ChefHat,
  CheckCircle2,
  ChevronRight,
  Flame,
  Info,
  LineChart,
  Plus,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { DiaryEntry, Profile, Recommendation, User, WeightEntry } from '../types';

interface DashboardProps {
  currentUser: User;
  profile: Profile;
  todayEntries: DiaryEntry[];
  recommendations: Recommendation[];
  weights: WeightEntry[];
  onNavigate: (tab: string) => void;
  onOpenAddModal: (mealType?: string) => void;
  onDismissRecommendation: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  profile,
  todayEntries,
  recommendations,
  weights,
  onNavigate,
  onOpenAddModal,
  onDismissRecommendation,
}) => {
  // Aggregate today's food by meal
  const mealsData = {
    breakfast: todayEntries.filter((e) => e.mealType === 'breakfast'),
    lunch: todayEntries.filter((e) => e.mealType === 'lunch'),
    dinner: todayEntries.filter((e) => e.mealType === 'dinner'),
    snack: todayEntries.filter((e) => e.mealType === 'snack'),
  };

  const breakfastCalories = Math.round(mealsData.breakfast.reduce((sum, e) => sum + e.calories, 0));
  const lunchCalories = Math.round(mealsData.lunch.reduce((sum, e) => sum + e.calories, 0));
  const dinnerCalories = Math.round(mealsData.dinner.reduce((sum, e) => sum + e.calories, 0));
  const snackCalories = Math.round(mealsData.snack.reduce((sum, e) => sum + e.calories, 0));

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
  const totalProteins = Math.round(todayEntries.reduce((sum, e) => sum + e.proteins, 0));
  const totalFats = Math.round(todayEntries.reduce((sum, e) => sum + e.fats, 0));
  const totalCarbs = Math.round(todayEntries.reduce((sum, e) => sum + e.carbs, 0));

  const calorieNorm = profile.dailyCalorieNorm || 1800;
  const progressPercent = Math.min(100, Math.round((totalCalories / calorieNorm) * 100));
  const remainingCalories = Math.max(0, calorieNorm - totalCalories);

  // Latest weight
  const latestWeight = weights.length > 0 ? weights[weights.length - 1].weightKg : profile.weightKg;

  // Active unread recommendations
  const activeRecs = recommendations.filter((r) => !r.isRead);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in-50 duration-200">
      {/* Top Welcome Title Banner (Exact match to Lab 5 wireframe) */}
      <div className="bg-gradient-to-r from-[#E8F5E9] via-[#FAF0E6]/60 to-[#FFF8E1] rounded-2xl p-6 sm:p-8 border border-[#C8E6C9] shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2E7D32] mb-1">
              <Sparkles className="w-4 h-4 text-[#4CAF50]" />
              Персональный рацион Pureshque
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B5E20] tracking-tight">
              Добрый день, {currentUser.firstName}!
            </h1>
            <p className="text-lg text-[#37474F] mt-1 font-medium">
              Ваш рацион за сегодня:
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('diary')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#1B5E20] font-semibold text-sm border border-[#A5D6A7] hover:bg-[#F1F8E9] shadow-xs transition-all"
            >
              <Calendar className="w-4 h-4 text-[#4CAF50]" />
              Открыть дневник
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4CAF50] text-white font-semibold text-sm hover:bg-[#43A047] shadow-sm transition-all"
            >
              <Scale className="w-4 h-4" />
              Текущий вес: {latestWeight} кг
            </button>
          </div>
        </div>

        {/* Ambient Leaf Motif */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none text-[#2E7D32]">
          <Apple className="w-64 h-64" />
        </div>
      </div>

      {/* Main KPI Grid matching Lab 5 mock:
          - Калории (1240/1800)
          - Ваша цель (Дневная норма: 1800, Прогресс 69%)
          - БЖУ (Белки 82г, Жиры 41г, Углеводы 156г)
          - Питание за сегодня (Завтрак 420, Обед 510, Ужин 310, Перекусы 0)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Калории */}
        <div className="bg-[#FFF9C4]/40 hover:bg-[#FFF9C4]/60 transition-colors rounded-2xl p-6 border border-[#FFF176] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-[#5D4037]">Калории</span>
              <span className="p-2 rounded-lg bg-[#FFF59D] text-[#F57F17]">
                <Flame className="w-5 h-5 fill-current" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#2E7D32]">
              {totalCalories} <span className="text-lg font-medium text-[#546E7A]">/ {calorieNorm}</span>
            </div>
            <p className="text-xs text-[#607D8B] mt-1">ккал употреблено за день</p>
          </div>

          <div className="mt-5 space-y-2">
            <div className="w-full bg-white/80 rounded-full h-3.5 overflow-hidden p-0.5 border border-[#FFE082]">
              <div
                className="bg-gradient-to-r from-[#81C784] to-[#4CAF50] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-[#455A64]">
              <span>Осталось: <strong>{remainingCalories} ккал</strong></span>
              <span><strong>{progressPercent}%</strong></span>
            </div>
          </div>
        </div>

        {/* Card 2: Ваша цель */}
        <div className="bg-[#E8F5E9] hover:bg-[#E8F5E9]/90 transition-colors rounded-2xl p-6 border border-[#A5D6A7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-[#1B5E20]">Ваша цель</span>
              <span className="p-2 rounded-lg bg-[#C8E6C9] text-[#2E7D32]">
                <TrendingDown className="w-5 h-5" />
              </span>
            </div>
            <div className="text-lg font-semibold text-[#1B5E20]">
              {profile.goal === 'lose' ? 'Снижение веса' : profile.goal === 'gain' ? 'Набор массы' : 'Поддержание'}
            </div>
            <div className="text-sm text-[#388E3C] mt-1">
              Дневная норма: <strong>{calorieNorm} ккал</strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#C8E6C9]/60">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2E7D32]">Прогресс дня:</span>
              <span className="font-extrabold text-[#1B5E20] text-lg">{progressPercent}%</span>
            </div>
            <div className="text-xs text-[#4E7D52] mt-0.5">
              {progressPercent < 80 ? 'В пределах целевого коридора' : 'Цель на сегодня почти закрыта'}
            </div>
          </div>
        </div>

        {/* Card 3: БЖУ */}
        <div className="bg-[#FAF0E6] hover:bg-[#FAF0E6]/90 transition-colors rounded-2xl p-6 border border-[#FFE0B2] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold uppercase tracking-wider text-[#6D4C41]">БЖУ (Макросы)</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFE0B2] text-[#E65100]">
                Факт / Норма
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {/* Protein */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#1565C0]">Белки</span>
                  <span className="text-[#37474F]"><strong>{totalProteins}г</strong> / {profile.dailyProteinNorm}г</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#42A5F5] h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.round((totalProteins / profile.dailyProteinNorm) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {/* Fats */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#E65100]">Жиры</span>
                  <span className="text-[#37474F]"><strong>{totalFats}г</strong> / {profile.dailyFatNorm}г</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#FFA726] h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.round((totalFats / profile.dailyFatNorm) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#2E7D32]">Углеводы</span>
                  <span className="text-[#37474F]"><strong>{totalCarbs}г</strong> / {profile.dailyCarbNorm}г</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#66BB6A] h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.round((totalCarbs / profile.dailyCarbNorm) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-[#8D6E63] text-center">
            Энергия: Б 4 ккал &bull; Ж 9 ккал &bull; У 4 ккал
          </div>
        </div>

        {/* Card 4: Питание за сегодня */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E7DE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-[#2D3748]">
                Питание за сегодня
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-medium">
                4 приёма
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#4A5568]">
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span>Завтрак:</span>
                <span className="font-semibold text-[#1A202C]">{breakfastCalories} ккал</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span>Обед:</span>
                <span className="font-semibold text-[#1A202C]">{lunchCalories} ккал</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EDF2F7]">
                <span>Ужин:</span>
                <span className="font-semibold text-[#1A202C]">{dinnerCalories} ккал</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Перекусы:</span>
                <span className="font-semibold text-[#1A202C]">{snackCalories} ккал</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenAddModal()}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1B5E20] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#A5D6A7]"
          >
            <Plus className="w-3.5 h-3.5" />
            Добавить продукт/блюдо
          </button>
        </div>
      </div>

      {/* Main 3 Action Buttons (Exact Lab 5 mock layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onOpenAddModal()}
          className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-base shadow-sm transition-all transform active:scale-98"
        >
          <Plus className="w-5 h-5" />
          Добавить в дневник
        </button>

        <button
          onClick={() => onNavigate('recipes')}
          className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#81C784] hover:bg-[#66BB6A] text-[#1B5E20] font-bold text-base shadow-sm transition-all border border-[#66BB6A]/40 transform active:scale-98"
        >
          <ChefHat className="w-5 h-5" />
          Создать рецепт
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#F1F8E9] hover:bg-[#DCEDC8] text-[#2E7D32] font-bold text-base shadow-sm transition-all border border-[#A5D6A7] transform active:scale-98"
        >
          <LineChart className="w-5 h-5 text-[#2E7D32]" />
          Открыть аналитику
        </button>
      </div>

      {/* Today's Meals Quick List & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Meal list preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0E7DE] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#1A202C]">Записи рациона на сегодня</h2>
              <p className="text-xs text-[#718096]">Все блюда, добавленные за 13 октября 2026 г.</p>
            </div>
            <button
              onClick={() => onNavigate('diary')}
              className="text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] flex items-center gap-1"
            >
              Подробный дневник <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {todayEntries.length === 0 ? (
              <div className="text-center py-8 text-[#A0AEC0]">
                <Apple className="w-12 h-12 mx-auto mb-2 opacity-40 text-[#4CAF50]" />
                <p>Записей на сегодня пока нет. Нажмите «Добавить в дневник», чтобы начать.</p>
              </div>
            ) : (
              todayEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] hover:border-[#C8E6C9] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]"></span>
                    <div>
                      <div className="font-semibold text-sm text-[#2D3748]">{entry.productName}</div>
                      <div className="text-xs text-[#718096]">
                        {entry.mealType === 'breakfast' && 'Завтрак'}
                        {entry.mealType === 'lunch' && 'Обед'}
                        {entry.mealType === 'dinner' && 'Ужин'}
                        {entry.mealType === 'snack' && 'Перекус'}
                        {' &bull; '}
                        {entry.amountG ? `${entry.amountG} г` : `${entry.servings} порц.`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-sm text-[#1B5E20]">{Math.round(entry.calories)} ккал</div>
                    <div className="text-[11px] text-[#718096]">
                      Б: {entry.proteins.toFixed(0)}г &bull; Ж: {entry.fats.toFixed(0)}г &bull; У: {entry.carbs.toFixed(0)}г
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Recommendations & Health Advice */}
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E0E7DE] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#1A202C] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#4CAF50]" />
                Умные рекомендации
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                {activeRecs.length} активных
              </span>
            </div>

            <div className="space-y-3">
              {activeRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs relative text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[#2D3748] leading-relaxed pr-4">{rec.message}</p>
                    <button
                      onClick={() => onDismissRecommendation(rec.id)}
                      className="text-[#A0AEC0] hover:text-[#4A5568] text-xs"
                      title="Пометить как прочитанное"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] text-[#718096] flex items-center justify-between">
                    <span>{rec.date}</span>
                    <span className="text-[#388E3C] font-medium">КБЖУ анализ</span>
                  </div>
                </div>
              ))}
              {activeRecs.length === 0 && (
                <p className="text-xs text-[#718096] text-center py-4">
                  Все рекомендации прочитаны. Ваш рацион сбалансирован!
                </p>
              )}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-[#FFFDE7] border border-[#FFF59D] text-[11px] text-[#795548] leading-relaxed">
              <strong>Обратите внимание:</strong> Автоматические расчеты формируются по формуле Миффлина-Сан Жеора и носят ознакомительный характер.
            </div>
          </div>

          {/* Quick shortcuts widget */}
          <div className="bg-[#E8F5E9]/50 rounded-2xl border border-[#C8E6C9] p-5 text-xs text-[#2E7D32] space-y-2">
            <div className="font-bold text-sm text-[#1B5E20]">Быстрый старт:</div>
            <div
              className="flex items-center justify-between p-2 rounded-lg bg-white/70 hover:bg-white cursor-pointer transition-colors"
              onClick={() => onNavigate('products')}
            >
              <span>Поиск в базе из 20+ продуктов</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div
              className="flex items-center justify-between p-2 rounded-lg bg-white/70 hover:bg-white cursor-pointer transition-colors"
              onClick={() => onNavigate('export')}
            >
              <span>Экспорт дневника в PDF для врача</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
