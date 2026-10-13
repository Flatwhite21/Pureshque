import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  Flame,
  LineChart,
  PieChart,
  Plus,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { DiaryEntry, Profile, User, WeightEntry } from '../types';
import { printAnalyticsReport } from '../utils/export';

interface AnalyticsProps {
  currentUser: User;
  profile: Profile;
  diaryEntries: DiaryEntry[];
  weights: WeightEntry[];
  onAddWeight: (weight: Omit<WeightEntry, 'id'>) => void;
  onDeleteWeight?: (id: string) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  currentUser,
  profile,
  diaryEntries,
  weights,
  onAddWeight,
  onDeleteWeight,
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(profile.weightKg || 62.0);
  const [newWeightDate, setNewWeightDate] = useState<string>('2026-10-13');
  const [newWeightNote, setNewWeightNote] = useState<string>('');

  // Group diary by date
  const dateMap: Record<string, { calories: number; proteins: number; fats: number; carbs: number }> = {};
  diaryEntries.forEach((entry) => {
    if (!dateMap[entry.date]) {
      dateMap[entry.date] = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
    }
    dateMap[entry.date].calories += entry.calories;
    dateMap[entry.date].proteins += entry.proteins;
    dateMap[entry.date].fats += entry.fats;
    dateMap[entry.date].carbs += entry.carbs;
  });

  // Sort dates
  const sortedDates = Object.keys(dateMap).sort();
  const filteredDates =
    period === 'week' ? sortedDates.slice(-7) : period === 'month' ? sortedDates.slice(-30) : sortedDates;

  // Calculate stats
  const totalDays = Math.max(1, filteredDates.length);
  const avgCalories = Math.round(
    filteredDates.reduce((s, d) => s + dateMap[d].calories, 0) / totalDays
  );
  const avgProteins = Math.round(
    filteredDates.reduce((s, d) => s + dateMap[d].proteins, 0) / totalDays
  );
  const avgFats = Math.round(
    filteredDates.reduce((s, d) => s + dateMap[d].fats, 0) / totalDays
  );
  const avgCarbs = Math.round(
    filteredDates.reduce((s, d) => s + dateMap[d].carbs, 0) / totalDays
  );

  const dailyCaloriesList = filteredDates.map((d) => dateMap[d].calories);
  const minCalories = dailyCaloriesList.length > 0 ? Math.min(...dailyCaloriesList) : 0;
  const maxCalories = dailyCaloriesList.length > 0 ? Math.max(...dailyCaloriesList) : 0;

  // Macro Energy Percentages: P (4 kcal), F (9 kcal), C (4 kcal)
  const pKcal = avgProteins * 4;
  const fKcal = avgFats * 9;
  const cKcal = avgCarbs * 4;
  const totalMacroKcal = Math.max(1, pKcal + fKcal + cKcal);

  const pPercent = Math.round((pKcal / totalMacroKcal) * 100);
  const fPercent = Math.round((fKcal / totalMacroKcal) * 100);
  const cPercent = 100 - pPercent - fPercent;

  // Handle weight submit
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWeight({
      userId: currentUser.id,
      date: newWeightDate,
      weightKg: Number(newWeight),
      note: newWeightNote.trim() || undefined,
    });
    setWeightModalOpen(false);
    setNewWeightNote('');
  };

  const handleExportPDF = () => {
    printAnalyticsReport(
      `${currentUser.firstName} ${currentUser.lastName}`,
      profile,
      weights,
      period === 'week' ? 'Последние 7 дней' : period === 'month' ? 'Последние 30 дней' : 'Весь период',
      {
        avgCalories,
        avgProteins,
        avgFats,
        avgCarbs,
        minCalories,
        maxCalories,
        daysCount: totalDays,
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B5E20] tracking-tight">Аналитика рациона</h1>
          <p className="text-sm text-[#546E7A] mt-1">
            Графики потребления КБЖУ, сравнение с целевой нормой и динамика изменения веса
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Pills */}
          <div className="flex rounded-xl bg-white border border-[#D5E1D4] p-1 shadow-2xs">
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === 'week' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
              }`}
            >
              Неделя
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === 'month' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
              }`}
            >
              Месяц
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === 'all' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-[#546E7A] hover:bg-[#F1F8E9]'
              }`}
            >
              Все время
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] hover:bg-[#C8E6C9] text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#4CAF50]" />
            PDF отчёт
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs">
          <span className="text-xs font-bold text-[#718096] uppercase block mb-1">
            Средняя калорийность
          </span>
          <div className="text-2xl font-extrabold text-[#1B5E20]">
            {avgCalories} <span className="text-sm font-normal text-[#546E7A]">ккал / день</span>
          </div>
          <div className="text-xs text-[#2E7D32] mt-2 flex items-center justify-between">
            <span>Норма: {profile.dailyCalorieNorm} ккал</span>
            <span className="font-semibold">
              {Math.round((avgCalories / profile.dailyCalorieNorm) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs">
          <span className="text-xs font-bold text-[#718096] uppercase block mb-1">
            Минимум / Максимум
          </span>
          <div className="text-xl font-bold text-[#37474F]">
            {minCalories} — {maxCalories} <span className="text-xs font-normal">ккал</span>
          </div>
          <div className="text-xs text-[#718096] mt-2">
            Разброс: {maxCalories - minCalories} ккал за период
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs">
          <span className="text-xs font-bold text-[#718096] uppercase block mb-1">
            Среднее БЖУ за день
          </span>
          <div className="text-base font-bold text-[#2D3748]">
            Б: <span className="text-blue-600">{avgProteins}г</span> &bull; Ж:{' '}
            <span className="text-amber-600">{avgFats}г</span> &bull; У:{' '}
            <span className="text-emerald-600">{avgCarbs}г</span>
          </div>
          <div className="text-xs text-[#718096] mt-2">
            Баланс макронутриентов в норме
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E0E7DE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#718096] uppercase">Текущий вес</span>
              <button
                onClick={() => setWeightModalOpen(true)}
                className="text-[11px] text-[#2E7D32] hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Взвеситься
              </button>
            </div>
            <div className="text-2xl font-extrabold text-[#1B5E20] mt-1">
              {weights.length > 0 ? weights[weights.length - 1].weightKg : profile.weightKg} кг
            </div>
          </div>
          <div className="text-xs text-[#546E7A]">
            {weights.length > 1 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                -{(weights[0].weightKg - weights[weights.length - 1].weightKg).toFixed(1)} кг с начала программы
              </span>
            ) : (
              '1 зафиксированное измерение'
            )}
          </div>
        </div>
      </div>

      {/* Main Charts Row: Daily Calories Chart & Donut Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Calories Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0E7DE] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-[#1A202C]">Потребление калорий по дням</h3>
              <p className="text-xs text-[#718096]">
                Пунктирная линия обозначает дневную норму ({profile.dailyCalorieNorm} ккал)
              </p>
            </div>
          </div>

          {/* SVG Visual Bar Chart */}
          <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-[#EDF2F7]">
            {filteredDates.map((date) => {
              const cal = dateMap[date]?.calories || 0;
              const maxDisplay = Math.max(profile.dailyCalorieNorm * 1.25, 2500);
              const heightPercent = Math.min(100, Math.round((cal / maxDisplay) * 100));
              const isOver = cal > profile.dailyCalorieNorm;

              return (
                <div key={date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A202C] text-white text-[10px] py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-md">
                    {date}: {cal} ккал
                  </div>

                  <div className="text-[10px] font-bold text-[#455A64] mb-1 group-hover:text-[#1B5E20]">
                    {cal}
                  </div>

                  <div
                    className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                      isOver ? 'bg-[#FFB74D]' : 'bg-[#81C784] hover:bg-[#4CAF50]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2 text-[11px] text-[#718096]">
            {filteredDates.map((d) => (
              <span key={d} className="flex-1 text-center truncate">
                {d.slice(5)}
              </span>
            ))}
          </div>
        </div>

        {/* Macro Ratio Donut / Proportion Card */}
        <div className="bg-white rounded-2xl border border-[#E0E7DE] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-[#1A202C] mb-1">Соотношение БЖУ</h3>
            <p className="text-xs text-[#718096] mb-4">Процент от общей суточной энергии</p>

            {/* Circular representation */}
            <div className="flex justify-center my-4">
              <div className="relative w-40 h-40 rounded-full flex items-center justify-center p-3 bg-gradient-to-tr from-[#3B82F6] via-[#F59E0B] to-[#10B981] shadow-inner">
                <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-md">
                  <span className="text-xs text-[#718096] uppercase font-semibold">Энергия</span>
                  <span className="text-sm font-extrabold text-[#1B5E20]">100%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Белки ({avgProteins}г)</span>
                </span>
                <strong>{pPercent}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Жиры ({avgFats}г)</span>
                </span>
                <strong>{fPercent}%</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Углеводы ({avgCarbs}г)</span>
                </span>
                <strong>{cPercent}%</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EDF2F7] text-[11px] text-[#718096] text-center">
            Классическое здоровое распределение: 25-30% Б &bull; 25-30% Ж &bull; 40-50% У
          </div>
        </div>
      </div>

      {/* Weight History Dynamics & Log */}
      <div className="bg-white rounded-2xl border border-[#E0E7DE] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-lg text-[#1A202C]">Динамика изменения веса</h3>
            <p className="text-xs text-[#718096]">
              Отслеживание массы тела в процессе соблюдения целевого калоража
            </p>
          </div>

          <button
            onClick={() => setWeightModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4CAF50] text-white hover:bg-[#43A047] text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить взвешивание
          </button>
        </div>

        {/* Weight timeline table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-[#546E7A] uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Дата</th>
                <th className="px-4 py-3">Вес</th>
                <th className="px-4 py-3">Изменение к предыдущему</th>
                <th className="px-4 py-3">Заметка</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4EF]">
              {weights.map((w, index) => {
                const prevWeight = index > 0 ? weights[index - 1].weightKg : w.weightKg;
                const diff = (w.weightKg - prevWeight).toFixed(1);
                const isDown = Number(diff) < 0;

                return (
                  <tr key={w.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#2D3748]">{w.date}</td>
                    <td className="px-4 py-3 font-extrabold text-[#1B5E20] text-sm">
                      {w.weightKg} кг
                    </td>
                    <td className="px-4 py-3">
                      {index === 0 ? (
                        <span className="text-[#A0AEC0]">Старт программы</span>
                      ) : (
                        <span
                          className={`font-semibold ${
                            isDown ? 'text-emerald-600' : Number(diff) === 0 ? 'text-gray-500' : 'text-amber-600'
                          }`}
                        >
                          {Number(diff) > 0 ? `+${diff}` : diff} кг
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#718096]">{w.note || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      {onDeleteWeight && (
                        <button
                          onClick={() => onDeleteWeight(w.id)}
                          className="text-[#CBD5E0] hover:text-red-500 text-xs"
                        >
                          Удалить
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Weight Modal */}
      {weightModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#CBD5E1] animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
              <h3 className="text-base font-bold text-[#1A202C]">Зафиксировать новый вес</h3>
              <button onClick={() => setWeightModalOpen(false)} className="p-1 rounded-lg text-[#A0AEC0]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">Дата взвешивания</label>
                <input
                  type="date"
                  required
                  value={newWeightDate}
                  onChange={(e) => setNewWeightDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">
                  Текущий вес (кг) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-lg font-extrabold text-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">
                  Примечание (самочувствие, тренировки)
                </label>
                <input
                  type="text"
                  placeholder="Например, утро натощак, после кардио"
                  value={newWeightNote}
                  onChange={(e) => setNewWeightNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWeightModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#4A5568]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#4CAF50] text-white text-xs font-bold shadow-sm hover:bg-[#43A047]"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
