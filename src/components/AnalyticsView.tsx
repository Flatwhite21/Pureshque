import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, TrendingUp, Award, AlertTriangle, FileDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { diaryEntries, weightEntries, profile, user, setActiveTab } = useApp();

  const [period, setPeriod] = useState<'7' | '14' | '30'>('7');

  // Aggregate diary entries by date
  const aggregatedByDate = useMemo(() => {
    const map = new Map<
      string,
      { date: string; calories: number; proteins: number; fats: number; carbs: number }
    >();

    diaryEntries.forEach((entry) => {
      const existing = map.get(entry.date) || {
        date: entry.date,
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
      };
      existing.calories += entry.calories;
      existing.proteins += entry.proteins;
      existing.fats += entry.fats;
      existing.carbs += entry.carbs;
      map.set(entry.date, existing);
    });

    // Sort by date ascending
    const list = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
    const daysLimit = Number(period);
    return list.slice(-daysLimit);
  }, [diaryEntries, period]);

  // Statistics
  const calorieValues = aggregatedByDate.map((d) => d.calories);
  const avgCalories = calorieValues.length
    ? Math.round(calorieValues.reduce((a, b) => a + b, 0) / calorieValues.length)
    : 0;
  const maxCalories = calorieValues.length ? Math.max(...calorieValues) : 0;
  const minCalories = calorieValues.length ? Math.min(...calorieValues) : 0;

  const avgProteins = aggregatedByDate.length
    ? Math.round(aggregatedByDate.reduce((a, b) => a + b.proteins, 0) / aggregatedByDate.length)
    : 0;
  const avgFats = aggregatedByDate.length
    ? Math.round(aggregatedByDate.reduce((a, b) => a + b.fats, 0) / aggregatedByDate.length)
    : 0;
  const avgCarbs = aggregatedByDate.length
    ? Math.round(aggregatedByDate.reduce((a, b) => a + b.carbs, 0) / aggregatedByDate.length)
    : 0;

  const totalMacroGrams = avgProteins + avgFats + avgCarbs || 1;
  const proteinPercent = Math.round(((avgProteins * 4) / Math.max(1, avgCalories)) * 100);
  const fatPercent = Math.round(((avgFats * 9) / Math.max(1, avgCalories)) * 100);
  const carbPercent = Math.round(((avgCarbs * 4) / Math.max(1, avgCalories)) * 100);

  const calorieNorm = profile.dailyCalorieNorm || 1800;
  const deviationPercent = Math.round(((avgCalories - calorieNorm) / calorieNorm) * 100);

  // SVG Chart Dimensions
  const chartHeight = 160;
  const maxCalorieChartValue = Math.max(calorieNorm * 1.25, maxCalories * 1.1, 2200);

  return (
    <div className="space-y-6">
      {/* Header & Period Selector */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E]">Аналитика и статистика рациона</h1>
          <p className="text-xs sm:text-sm text-[#5D705D] mt-0.5">
            Контроль калорийности, соотношения БЖУ и динамики массы тела
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Period Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F1F6EE] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPeriod('7')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                period === '7' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
              }`}
            >
              7 дней
            </button>
            <button
              onClick={() => setPeriod('14')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                period === '14' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
              }`}
            >
              14 дней
            </button>
            <button
              onClick={() => setPeriod('30')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                period === '30' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
              }`}
            >
              30 дней
            </button>
          </div>

          <button
            onClick={() => setActiveTab('export')}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#1E3A1E] bg-[#F1F8EC] border border-[#D8E6D0] hover:bg-[#E2F0DC] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Экспорт PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Среднее за период</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#2E7D32] mt-1 tabular-nums">
            {avgCalories} <span className="text-xs font-normal text-[#718096]">ккал/день</span>
          </div>
          <div className="text-[11px] text-[#4A5D4A] mt-1">
            Норма: {calorieNorm} ккал ({deviationPercent >= 0 ? `+${deviationPercent}%` : `${deviationPercent}%`})
          </div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Максимум / Минимум</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#1E3A1E] mt-1 tabular-nums">
            {maxCalories} <span className="text-xs font-normal text-[#718096]">/ {minCalories} ккал</span>
          </div>
          <div className="text-[11px] text-[#718096] mt-1">Размах: {maxCalories - minCalories} ккал</div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Среднее БЖУ</div>
          <div className="text-base sm:text-lg font-bold font-mono text-[#1E3A1E] mt-1 tabular-nums">
            {avgProteins} / {avgFats} / {avgCarbs} г
          </div>
          <div className="text-[11px] text-[#718096] mt-1">Белки · Жиры · Углеводы</div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Соответствие норме</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#4CAF50] mt-1 tabular-nums">
            {Math.abs(deviationPercent) <= 15 ? 'В норме' : 'Отклонение'}
          </div>
          <div className="text-[11px] text-[#718096] mt-1">Целевой диапазон ±15%</div>
        </div>
      </div>

      {/* Main Charts: 1. Calories per Day with Target Line */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDF3E8] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#1E3A1E]">Потребление калорий по дням</h2>
            <p className="text-xs text-[#718096]">
              Пунктирная линия обозначает рекомендуемую норму ({calorieNorm} ккал)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#2E7D32]">
              <span className="w-3 h-3 rounded-xs bg-[#4CAF50] inline-block" /> Факт
            </span>
            <span className="flex items-center gap-1.5 text-[#C05621]">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#DD6B20] inline-block" /> Норма ({calorieNorm})
            </span>
          </div>
        </div>

        {aggregatedByDate.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#718096]">Недостаточно данных для построения графика</div>
        ) : (
          <div className="relative pt-6 pb-2">
            {/* SVG Interactive Chart */}
            <div className="h-52 w-full flex items-end gap-2 sm:gap-4 px-2">
              {aggregatedByDate.map((item, idx) => {
                const heightPercent = Math.min(100, (item.calories / maxCalorieChartValue) * 100);
                const normHeightPercent = (calorieNorm / maxCalorieChartValue) * 100;
                const isOver = item.calories > calorieNorm * 1.15;
                const isUnder = item.calories < calorieNorm * 0.8;

                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono bg-[#1E3A1E] text-white px-2 py-0.5 rounded shadow-sm mb-1 whitespace-nowrap pointer-events-none tabular-nums">
                      {item.calories} ккал
                    </div>

                    {/* Bar */}
                    <div className="w-full relative flex items-end justify-center h-full">
                      {/* Target reference horizontal indicator marker on each column */}
                      <div
                        className="absolute w-full border-t border-dashed border-[#DD6B20] pointer-events-none z-10"
                        style={{ bottom: `${normHeightPercent}%` }}
                      />

                      <div
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                          isOver ? 'bg-[#FFB74D]' : isUnder ? 'bg-[#A5D6A7]' : 'bg-[#4CAF50]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-[#718096] mt-2 font-mono tabular-nums text-center truncate w-full">
                      {item.date.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dual Analytics: Macronutrient Distribution & Weight Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Macronutrient Distribution Card */}
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-[#EDF3E8] pb-3">
            <h2 className="text-base font-bold text-[#1E3A1E]">Соотношение БЖУ (проценты калорий)</h2>
            <p className="text-xs text-[#718096]">Фактическое распределение макронутриентов в рационе</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center my-4">
            <div className="p-3 bg-[#E8F5E9]/60 rounded-xl border border-[#C8E6C9]">
              <div className="text-xs font-semibold text-[#2E7D32]">Белки ({proteinPercent}%)</div>
              <div className="text-lg font-mono font-bold text-[#1B5E20] mt-0.5 tabular-nums">
                {avgProteins} г
              </div>
              <div className="text-[10px] text-[#558B2F]">Цель: {profile.dailyProteinNorm}г</div>
            </div>

            <div className="p-3 bg-[#FFF8E1]/80 rounded-xl border border-[#FFE082]">
              <div className="text-xs font-semibold text-[#F57F17]">Жиры ({fatPercent}%)</div>
              <div className="text-lg font-mono font-bold text-[#E65100] mt-0.5 tabular-nums">
                {avgFats} г
              </div>
              <div className="text-[10px] text-[#E65100]">Цель: {profile.dailyFatNorm}г</div>
            </div>

            <div className="p-3 bg-[#FAF0E6]/80 rounded-xl border border-[#E8DCC8]">
              <div className="text-xs font-semibold text-[#8D6E63]">Углеводы ({carbPercent}%)</div>
              <div className="text-lg font-mono font-bold text-[#4E342E] mt-0.5 tabular-nums">
                {avgCarbs} г
              </div>
              <div className="text-[10px] text-[#6D4C41]">Цель: {profile.dailyCarbNorm}г</div>
            </div>
          </div>

          {/* Stacked macro bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-[#E0E0E0] rounded-full h-3 overflow-hidden flex">
              <div style={{ width: `${proteinPercent}%` }} className="bg-[#4CAF50]" title="Белки" />
              <div style={{ width: `${fatPercent}%` }} className="bg-[#FFB74D]" title="Жиры" />
              <div style={{ width: `${carbPercent}%` }} className="bg-[#8D6E63]" title="Углеводы" />
            </div>
            <div className="flex justify-between text-[11px] text-[#718096]">
              <span>Белки: 4 ккал/г</span>
              <span>Жиры: 9 ккал/г</span>
              <span>Углеводы: 4 ккал/г</span>
            </div>
          </div>
        </div>

        {/* Weight Dynamics Card */}
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDF3E8] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1E3A1E]">Динамика изменения веса</h2>
              <p className="text-xs text-[#718096]">Контрольные замеры массы тела (кг)</p>
            </div>
            <button
              onClick={() => setActiveTab('weight')}
              className="text-xs font-semibold text-[#2E7D32] hover:underline cursor-pointer"
            >
              + Добавить вес
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDF3E8] text-[#718096]">
                  <th className="py-2">Дата</th>
                  <th className="py-2 text-right">Вес (кг)</th>
                  <th className="py-2 text-right">Изменение</th>
                  <th className="py-2">Заметка</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F6EE]">
                {weightEntries.slice(-5).map((w, i, arr) => {
                  const prev = arr[i - 1];
                  const diff = prev ? Number((w.weightKg - prev.weightKg).toFixed(1)) : 0;
                  return (
                    <tr key={w.id} className="hover:bg-[#F9FCF8]">
                      <td className="py-2 font-mono text-[#4A5D4A] tabular-nums">{w.date}</td>
                      <td className="py-2 text-right font-mono font-bold text-[#1E3A1E] tabular-nums">
                        {w.weightKg} кг
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {diff === 0 ? (
                          <span className="text-[#A0AEC0]">0.0 кг</span>
                        ) : diff > 0 ? (
                          <span className="text-[#E53E3E] flex items-center justify-end">
                            <ArrowUpRight className="w-3 h-3" /> +{diff}
                          </span>
                        ) : (
                          <span className="text-[#38A169] flex items-center justify-end">
                            <ArrowDownRight className="w-3 h-3" /> {diff}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-[#718096] truncate max-w-[120px]">{w.note || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
