import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ArrowRight, TrendingUp, AlertCircle, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { TODAY_STR } from '../data/initialData';

interface DashboardProps {
  onOpenAddModal: (mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenAddModal }) => {
  const { user, profile, diaryEntries, currentDate, setActiveTab, recommendations, markRecommendationRead } = useApp();

  // Filter entries for today or current selected date
  const todayEntries = diaryEntries.filter((e) => e.date === currentDate);

  const breakfastCalories = todayEntries
    .filter((e) => e.mealType === 'breakfast')
    .reduce((sum, e) => sum + e.calories, 0);

  const lunchCalories = todayEntries
    .filter((e) => e.mealType === 'lunch')
    .reduce((sum, e) => sum + e.calories, 0);

  const dinnerCalories = todayEntries
    .filter((e) => e.mealType === 'dinner')
    .reduce((sum, e) => sum + e.calories, 0);

  const snackCalories = todayEntries
    .filter((e) => e.mealType === 'snack')
    .reduce((sum, e) => sum + e.calories, 0);

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
  const totalProteins = Math.round(todayEntries.reduce((sum, e) => sum + e.proteins, 0));
  const totalFats = Math.round(todayEntries.reduce((sum, e) => sum + e.fats, 0));
  const totalCarbs = Math.round(todayEntries.reduce((sum, e) => sum + e.carbs, 0));

  const calorieNorm = profile.dailyCalorieNorm || 1800;
  const progressPercent = Math.min(100, Math.round((totalCalories / calorieNorm) * 100));
  const remainingCalories = Math.max(0, calorieNorm - totalCalories);

  const activeRecommendations = recommendations.filter((r) => !r.isRead);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="border-b border-[#E2EBDC] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A2E1A] font-['Plus_Jakarta_Sans']">
              Добрый день, {user.firstName}!
            </h1>
            <p className="text-base text-[#4A5D4A] mt-1 font-medium">
              Ваш рацион за {currentDate === TODAY_STR ? 'сегодня' : currentDate}:
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5D705D] bg-[#F1F8EC] px-3.5 py-1.5 rounded-lg border border-[#D5E8CC] self-start md:self-auto">
            <span>Цель: {profile.goal === 'lose' ? 'Снижение веса (-20%)' : profile.goal === 'gain' ? 'Набор мышечной массы (+15%)' : 'Поддержание веса'}</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('norm')}
              className="text-[#2E7D32] font-semibold hover:underline cursor-pointer"
            >
              Изменить норму
            </button>
          </div>
        </div>
      </div>

      {/* Active Recommendations (deviation alerts) */}
      {activeRecommendations.length > 0 && (
        <div className="space-y-2">
          {activeRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start justify-between gap-3 p-4 bg-[#FFFDE7] border border-[#FFF59D] rounded-xl text-sm text-[#5D4037]"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F57F17] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#E65100]">Рекомендация по рациону: </span>
                  <span>{rec.message}</span>
                </div>
              </div>
              <button
                onClick={() => markRecommendationRead(rec.id)}
                className="text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] hover:underline whitespace-nowrap cursor-pointer shrink-0"
              >
                Понятно
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Metric Cards Grid (Matching Lab 5 NinjaMock Layout & Values) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Питание за сегодня */}
        <div className="bg-[#FAF0E6]/80 border border-[#E8DCC8] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#3E2723] text-base">Питание за сегодня</h3>
              <span className="text-xs text-[#8D6E63]">4 приёма</span>
            </div>

            <div className="space-y-2.5 text-sm text-[#4E342E]">
              <div className="flex justify-between items-center py-0.5 border-b border-[#E8DCC8]/50">
                <span>Завтрак</span>
                <span className="font-mono font-semibold text-[#2E7D32] tabular-nums">{breakfastCalories} ккал</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#E8DCC8]/50">
                <span>Обед</span>
                <span className="font-mono font-semibold text-[#2E7D32] tabular-nums">{lunchCalories} ккал</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#E8DCC8]/50">
                <span>Ужин</span>
                <span className="font-mono font-semibold text-[#2E7D32] tabular-nums">{dinnerCalories} ккал</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Перекусы</span>
                <span className="font-mono font-semibold text-[#757575] tabular-nums">{snackCalories} ккал</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenAddModal()}
            className="mt-5 w-full py-2 px-3 bg-[#81C784]/30 hover:bg-[#81C784]/50 text-[#1B5E20] text-xs font-semibold rounded-lg border border-[#A5D6A7] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить продукт/блюдо</span>
          </button>
        </div>

        {/* Card 2: Ваша цель */}
        <div className="bg-[#FFF8E1]/90 border border-[#FFE082] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="font-bold text-[#5D4037] text-base mb-3">Ваша цель</h3>
            <div className="space-y-2 text-sm text-[#4E342E]">
              <div className="flex justify-between">
                <span className="text-[#6D4C41]">Дневная норма:</span>
                <span className="font-mono font-bold text-[#1B5E20] tabular-nums">{calorieNorm} ккал</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D4C41]">Прогресс дня:</span>
                <span className="font-mono font-bold text-[#2E7D32] tabular-nums">{progressPercent}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-[#E0E0E0] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#4CAF50] h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#8D6E63] mt-1.5 tabular-nums">
                <span>0 ккал</span>
                <span>Осталось {remainingCalories} ккал</span>
                <span>{calorieNorm} ккал</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#FFE082]/60 text-xs text-[#6D4C41] flex items-center justify-between">
            <span>Дефицит для сброса:</span>
            <span className="font-semibold text-[#2E7D32]">-20% TDEE</span>
          </div>
        </div>

        {/* Card 3: Калории */}
        <div className="bg-[#E8F5E9]/80 border border-[#C8E6C9] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#1B5E20] text-base">Калории</h3>
              <Flame className="w-4 h-4 text-[#4CAF50]" />
            </div>

            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2E7D32] font-mono tabular-nums">
                {totalCalories} <span className="text-base font-normal text-[#558B2F]">/ {calorieNorm}</span>
              </div>
              <p className="text-xs text-[#4E6B4E] mt-1">
                {remainingCalories > 0
                  ? `Осталось употребить ${remainingCalories} ккал`
                  : `Норма выполнена на ${progressPercent}%`}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#C8E6C9] flex items-center justify-between text-xs text-[#2E7D32]">
            <span>Потреблено:</span>
            <span className="font-mono font-bold tabular-nums">{totalCalories} ккал</span>
          </div>
        </div>

        {/* Card 4: БЖУ */}
        <div className="bg-[#FAF0E6]/80 border border-[#E8DCC8] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="font-bold text-[#3E2723] text-base mb-3">БЖУ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-0.5 border-b border-[#E8DCC8]/50">
                <span className="text-[#4E342E]">Белки</span>
                <span className="font-mono font-bold text-[#2E7D32] tabular-nums">
                  {totalProteins}г <span className="text-xs font-normal text-[#8D6E63]">/ {profile.dailyProteinNorm}г</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#E8DCC8]/50">
                <span className="text-[#4E342E]">Жиры</span>
                <span className="font-mono font-bold text-[#2E7D32] tabular-nums">
                  {totalFats}г <span className="text-xs font-normal text-[#8D6E63]">/ {profile.dailyFatNorm}г</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[#4E342E]">Углеводы</span>
                <span className="font-mono font-bold text-[#2E7D32] tabular-nums">
                  {totalCarbs}г <span className="text-xs font-normal text-[#8D6E63]">/ {profile.dailyCarbNorm}г</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8DCC8] text-[11px] text-[#8D6E63] flex justify-between tabular-nums">
            <span>Б: {Math.round((totalProteins * 4 * 100) / Math.max(1, totalCalories))}%</span>
            <span>Ж: {Math.round((totalFats * 9 * 100) / Math.max(1, totalCalories))}%</span>
            <span>У: {Math.round((totalCarbs * 4 * 100) / Math.max(1, totalCalories))}%</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons Bar (Exactly as designed in Lab 5: Добавить в дневник, Создать рецепт, Открыть аналитику) */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => setActiveTab('diary')}
          className="px-5 py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить в дневник</span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className="px-5 py-2.5 bg-[#81C784]/30 hover:bg-[#81C784]/50 text-[#1B5E20] border border-[#A5D6A7] text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Создать рецепт</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className="px-5 py-2.5 bg-[#81C784]/30 hover:bg-[#81C784]/50 text-[#1B5E20] border border-[#A5D6A7] text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Открыть аналитику</span>
        </button>
      </div>

      {/* Quick Meal Summary & Item List for Today */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDF3E8]">
          <h2 className="text-lg font-bold text-[#1E3A1E]">Записи в рационе за {currentDate}</h2>
          <button
            onClick={() => setActiveTab('diary')}
            className="text-xs font-semibold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Полный дневник</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayEntries.length === 0 ? (
          <div className="text-center py-8 text-[#718096] text-sm">
            В рационе за эту дату пока нет продуктов.
            <div className="mt-3">
              <button
                onClick={() => onOpenAddModal()}
                className="px-4 py-2 bg-[#4CAF50] text-white text-xs font-semibold rounded-lg hover:bg-[#43A047] cursor-pointer"
              >
                Добавить первый продукт
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-[#718096] border-b border-[#EDF3E8]">
                  <th className="py-2.5 font-medium">Приём пищи</th>
                  <th className="py-2.5 font-medium">Продукт / Блюдо</th>
                  <th className="py-2.5 text-right font-medium">Граммы</th>
                  <th className="py-2.5 text-right font-medium">Калории</th>
                  <th className="py-2.5 text-right font-medium">Белки</th>
                  <th className="py-2.5 text-right font-medium">Жиры</th>
                  <th className="py-2.5 text-right font-medium">Углеводы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F6EE]">
                {todayEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F9FCF8] transition-colors">
                    <td className="py-2.5 font-medium text-[#4A5D4A]">
                      {entry.mealType === 'breakfast'
                        ? 'Завтрак'
                        : entry.mealType === 'lunch'
                        ? 'Обед'
                        : entry.mealType === 'dinner'
                        ? 'Ужин'
                        : 'Перекус'}
                    </td>
                    <td className="py-2.5 font-medium text-[#1A2E1A]">{entry.name}</td>
                    <td className="py-2.5 text-right font-mono text-[#5D705D] tabular-nums">{entry.amountG} г</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-[#2E7D32] tabular-nums">
                      {entry.calories} ккал
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#4A5568] tabular-nums">{entry.proteins} г</td>
                    <td className="py-2.5 text-right font-mono text-[#4A5568] tabular-nums">{entry.fats} г</td>
                    <td className="py-2.5 text-right font-mono text-[#4A5568] tabular-nums">{entry.carbs} г</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
