import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealType, DiaryEntry } from '../types';
import { ChevronLeft, ChevronRight, Calendar, Plus, Trash2, Printer, FileSpreadsheet, Utensils } from 'lucide-react';
import { exportDiaryToExcel, generatePrintableDiaryHTML } from '../utils/export';
import { TODAY_STR } from '../data/initialData';

interface DiaryViewProps {
  onOpenAddModal: (mealType?: MealType) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({ onOpenAddModal }) => {
  const { diaryEntries, currentDate, setCurrentDate, deleteDiaryEntry, user, profile } = useApp();

  const changeDateByDays = (days: number) => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() + days);
    const newStr = current.toISOString().slice(0, 10);
    setCurrentDate(newStr);
  };

  const dayEntries = diaryEntries.filter((e) => e.date === currentDate);

  const meals: { type: MealType; title: string; hint: string }[] = [
    { type: 'breakfast', title: 'Завтрак', hint: 'Рекомендуется 25-30% суточных калорий' },
    { type: 'lunch', title: 'Обед', hint: 'Рекомендуется 35-40% суточных калорий' },
    { type: 'dinner', title: 'Ужин', hint: 'Рекомендуется 20-25% суточных калорий' },
    { type: 'snack', title: 'Перекусы', hint: 'Рекомендуется 10-15% суточных калорий' },
  ];

  const dayTotals = {
    calories: dayEntries.reduce((s, e) => s + e.calories, 0),
    proteins: Number(dayEntries.reduce((s, e) => s + e.proteins, 0).toFixed(1)),
    fats: Number(dayEntries.reduce((s, e) => s + e.fats, 0).toFixed(1)),
    carbs: Number(dayEntries.reduce((s, e) => s + e.carbs, 0).toFixed(1)),
  };

  const norm = profile.dailyCalorieNorm || 1800;
  const progressPercent = Math.min(100, Math.round((dayTotals.calories / norm) * 100));

  const handlePrintPDF = () => {
    const html = generatePrintableDiaryHTML(user, profile, currentDate, dayEntries);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Pureshque — Дневник питания (${currentDate})</title>
          </head>
          <body>
            ${html}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation & Actions Header */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDateByDays(-1)}
            className="p-2 rounded-lg border border-[#D8E6D0] hover:bg-[#F1F8EC] text-[#2E7D32] transition-colors cursor-pointer"
            title="Предыдущий день"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4CAF50]" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="font-bold text-lg text-[#1E3A1E] border-none focus:outline-none bg-transparent cursor-pointer font-mono"
            />
          </div>

          <button
            onClick={() => changeDateByDays(1)}
            className="p-2 rounded-lg border border-[#D8E6D0] hover:bg-[#F1F8EC] text-[#2E7D32] transition-colors cursor-pointer"
            title="Следующий день"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {currentDate !== TODAY_STR && (
            <button
              onClick={() => setCurrentDate(TODAY_STR)}
              className="text-xs text-[#2E7D32] font-semibold underline ml-2 cursor-pointer"
            >
              Вернуться на Сегодня
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 text-xs font-semibold text-[#1E3A1E] bg-[#F1F8EC] border border-[#D8E6D0] hover:bg-[#E2F0DC] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Печать / Сохранить в PDF"
          >
            <Printer className="w-4 h-4 text-[#2E7D32]" />
            <span>Печать / PDF</span>
          </button>
          <button
            onClick={() => exportDiaryToExcel(dayEntries, `pureshque_diary_${currentDate}.xlsx`)}
            className="px-3.5 py-2 text-xs font-semibold text-[#1E3A1E] bg-[#F1F8EC] border border-[#D8E6D0] hover:bg-[#E2F0DC] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Экспорт в Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2E7D32]" />
            <span>Экспорт в XLSX</span>
          </button>
          <button
            onClick={() => onOpenAddModal()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить запись</span>
          </button>
        </div>
      </div>

      {/* Daily Total Summary Strip */}
      <div className="bg-[#FAF0E6]/90 border border-[#E8DCC8] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[#8D6E63]">Сводка за {currentDate}</span>
            <div className="text-xl sm:text-2xl font-bold text-[#3E2723] font-mono tabular-nums">
              {dayTotals.calories} <span className="text-sm font-normal text-[#6D4C41]">/ {norm} ккал ({progressPercent}%)</span>
            </div>
            {/* Progress bar */}
            <div className="w-full lg:w-72 bg-[#E0E0E0] rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-[#4CAF50] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2.5 bg-white/70 rounded-xl border border-[#E8DCC8]/60">
              <div className="text-xs text-[#8D6E63]">Белки</div>
              <div className="font-mono font-bold text-sm sm:text-base text-[#2E7D32] tabular-nums">
                {dayTotals.proteins}г <span className="text-xs text-[#8D6E63] font-normal">/ {profile.dailyProteinNorm}г</span>
              </div>
            </div>
            <div className="p-2.5 bg-white/70 rounded-xl border border-[#E8DCC8]/60">
              <div className="text-xs text-[#8D6E63]">Жиры</div>
              <div className="font-mono font-bold text-sm sm:text-base text-[#2E7D32] tabular-nums">
                {dayTotals.fats}г <span className="text-xs text-[#8D6E63] font-normal">/ {profile.dailyFatNorm}г</span>
              </div>
            </div>
            <div className="p-2.5 bg-white/70 rounded-xl border border-[#E8DCC8]/60">
              <div className="text-xs text-[#8D6E63]">Углеводы</div>
              <div className="font-mono font-bold text-sm sm:text-base text-[#2E7D32] tabular-nums">
                {dayTotals.carbs}г <span className="text-xs text-[#8D6E63] font-normal">/ {profile.dailyCarbNorm}г</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meals.map((meal) => {
          const mealEntries = dayEntries.filter((e) => e.mealType === meal.type);
          const mealCalories = mealEntries.reduce((s, e) => s + e.calories, 0);
          const mealProteins = Number(mealEntries.reduce((s, e) => s + e.proteins, 0).toFixed(1));
          const mealFats = Number(mealEntries.reduce((s, e) => s + e.fats, 0).toFixed(1));
          const mealCarbs = Number(mealEntries.reduce((s, e) => s + e.carbs, 0).toFixed(1));

          return (
            <div
              key={meal.type}
              className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Meal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EDF3E8]">
                  <div>
                    <h3 className="font-bold text-base text-[#1E3A1E] flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#4CAF50]" />
                      <span>{meal.title}</span>
                    </h3>
                    <p className="text-[11px] text-[#718096]">{meal.hint}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-[#2E7D32] tabular-nums">
                      {mealCalories} ккал
                    </span>
                    <div className="text-[11px] text-[#718096] tabular-nums">
                      Б: {mealProteins}г · Ж: {mealFats}г · У: {mealCarbs}г
                    </div>
                  </div>
                </div>

                {/* Items in Meal */}
                <div className="py-3 space-y-2 min-h-[90px]">
                  {mealEntries.length === 0 ? (
                    <div className="flex items-center justify-center h-20 text-xs text-[#A0AEC0] italic">
                      В этот приём пищи пока ничего не добавлено
                    </div>
                  ) : (
                    mealEntries.map((item) => (
                      <div
                        key={item.id}
                        className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#F9FCF8] transition-colors border border-transparent hover:border-[#EDF3E8]"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-semibold text-[#1A2E1A] truncate">{item.name}</div>
                          <div className="text-[11px] text-[#718096] tabular-nums">
                            {item.amountG} г · Б: {item.proteins}г, Ж: {item.fats}г, У: {item.carbs}г
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-semibold text-xs text-[#2E7D32] tabular-nums">
                            {item.calories} ккал
                          </span>
                          <button
                            onClick={() => deleteDiaryEntry(item.id)}
                            className="p-1 text-[#CBD5E0] hover:text-[#E53E3E] rounded transition-colors cursor-pointer"
                            title="Удалить запись"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add item to this meal */}
              <button
                onClick={() => onOpenAddModal(meal.type)}
                className="mt-2 w-full py-2 bg-[#F1F8EC] hover:bg-[#E2F0DC] text-[#2E7D32] text-xs font-semibold rounded-xl border border-[#D5E8CC] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить в {meal.title.toLowerCase()}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
