import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { DiaryEntry, Profile, Recipe, User, WeightEntry } from '../types';
import { exportRecipesToCSV, printAnalyticsReport, printDiaryReport } from '../utils/export';

interface ExportProps {
  currentUser: User;
  profile: Profile;
  diaryEntries: DiaryEntry[];
  recipes: Recipe[];
  weights: WeightEntry[];
}

interface ExportTaskItem {
  id: string;
  name: string;
  type: 'diary_pdf' | 'recipes_xlsx' | 'analytics_pdf';
  date: string;
  status: 'pending' | 'processing' | 'done';
  fileSize: string;
}

export const Export: React.FC<ExportProps> = ({
  currentUser,
  profile,
  diaryEntries,
  recipes,
  weights,
}) => {
  const [diaryPeriod, setDiaryPeriod] = useState<string>('2026-10-13');
  const [tasks, setTasks] = useState<ExportTaskItem[]>([
    {
      id: 'task-1',
      name: 'Pureshque_Дневник_2026-10-12.pdf',
      type: 'diary_pdf',
      date: '2026-10-12 21:00',
      status: 'done',
      fileSize: '342 КБ',
    },
    {
      id: 'task-2',
      name: 'Pureshque_Рецепты_Каталог.xlsx',
      type: 'recipes_xlsx',
      date: '2026-10-10 14:15',
      status: 'done',
      fileSize: '48 КБ',
    },
  ]);

  const [loadingType, setLoadingType] = useState<string | null>(null);

  // Trigger Diary PDF export
  const handleExportDiary = () => {
    setLoadingType('diary');
    const dayEntries = diaryEntries.filter((e) => e.date === diaryPeriod);

    // Simulate Celery worker background export task
    setTimeout(() => {
      setLoadingType(null);
      printDiaryReport(
        dayEntries,
        diaryPeriod,
        profile,
        `${currentUser.firstName} ${currentUser.lastName}`
      );

      setTasks([
        {
          id: `task-${Date.now()}`,
          name: `Pureshque_Дневник_${diaryPeriod}.pdf`,
          type: 'diary_pdf',
          date: new Date().toLocaleTimeString('ru-RU').slice(0, 5),
          status: 'done',
          fileSize: '298 КБ',
        },
        ...tasks,
      ]);
    }, 600);
  };

  // Trigger Recipes XLSX export
  const handleExportRecipes = () => {
    setLoadingType('recipes');
    setTimeout(() => {
      setLoadingType(null);
      exportRecipesToCSV(recipes);

      setTasks([
        {
          id: `task-${Date.now()}`,
          name: `Pureshque_Рецепты_${new Date().toISOString().slice(0, 10)}.xlsx`,
          type: 'recipes_xlsx',
          date: new Date().toLocaleTimeString('ru-RU').slice(0, 5),
          status: 'done',
          fileSize: `${Math.round(recipes.length * 8 + 24)} КБ`,
        },
        ...tasks,
      ]);
    }, 600);
  };

  // Trigger Analytics PDF export
  const handleExportAnalytics = () => {
    setLoadingType('analytics');
    setTimeout(() => {
      setLoadingType(null);
      printAnalyticsReport(
        `${currentUser.firstName} ${currentUser.lastName}`,
        profile,
        weights,
        'Октябрь 2026 г.',
        {
          avgCalories: 1680,
          avgProteins: 114,
          avgFats: 56,
          avgCarbs: 180,
          minCalories: 1240,
          maxCalories: 1950,
          daysCount: 7,
        }
      );

      setTasks([
        {
          id: `task-${Date.now()}`,
          name: `Pureshque_Аналитика_Октябрь_2026.pdf`,
          type: 'analytics_pdf',
          date: new Date().toLocaleTimeString('ru-RU').slice(0, 5),
          status: 'done',
          fileSize: '512 КБ',
        },
        ...tasks,
      ]);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in-50 duration-200">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B5E20] tracking-tight">Экспорт данных и отчётов</h1>
        <p className="text-sm text-[#546E7A] mt-1">
          Выгрузка дневника для диетолога в PDF, базы рецептов в Excel и сводной аналитики
        </p>
      </div>

      {/* 3 Main Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Diary PDF */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E7DE] shadow-xs flex flex-col justify-between hover:border-[#81C784] transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Дневник питания в PDF</h3>
            <p className="text-xs text-[#718096] mt-1 leading-relaxed">
              Печатный протокол приемов пищи за день: завтрак, обед, ужин, перекусы с итоговым КБЖУ и полем для подписи диетолога.
            </p>

            <div className="mt-4">
              <label className="block text-[11px] font-semibold text-[#546E7A] uppercase mb-1">
                Выберите дату рациона:
              </label>
              <input
                type="date"
                value={diaryPeriod}
                onChange={(e) => setDiaryPeriod(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold"
              />
            </div>
          </div>

          <button
            onClick={handleExportDiary}
            disabled={loadingType === 'diary'}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {loadingType === 'diary' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            Сформировать PDF дневника
          </button>
        </div>

        {/* Card 2: Recipes Excel/XLSX */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E7DE] shadow-xs flex flex-col justify-between hover:border-[#81C784] transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">База рецептов в Excel (XLSX)</h3>
            <p className="text-xs text-[#718096] mt-1 leading-relaxed">
              Таблица всех сохраненных блюд с ингредиентным составом, граммовками, калорийностью на 100 г и на порцию.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] text-xs text-[#546E7A]">
              Всего рецептов в выгрузке: <strong>{recipes.length} шт.</strong>
              <div className="text-[10px] text-[#9E9E9E] mt-0.5">Кодировка UTF-8 BOM для Microsoft Excel</div>
            </div>
          </div>

          <button
            onClick={handleExportRecipes}
            disabled={loadingType === 'recipes'}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {loadingType === 'recipes' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Выгрузить XLSX файл
          </button>
        </div>

        {/* Card 3: Analytics PDF */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E7DE] shadow-xs flex flex-col justify-between hover:border-[#81C784] transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#1A202C]">Аналитический отчёт PDF</h3>
            <p className="text-xs text-[#718096] mt-1 leading-relaxed">
              Полный медицинский сводный отчёт с диаграммами калорий, балансом белков/жиров/углеводов и историей изменения веса.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAEFE8] text-xs text-[#546E7A]">
              Включает: <strong>Статистику, экстремумы и динамику веса</strong>
            </div>
          </div>

          <button
            onClick={handleExportAnalytics}
            disabled={loadingType === 'analytics'}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {loadingType === 'analytics' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Сформировать отчет аналитики
          </button>
        </div>
      </div>

      {/* Celery Background Tasks Simulation Queue */}
      <div className="bg-white rounded-2xl border border-[#E0E7DE] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#4CAF50]" />
            <h3 className="font-bold text-lg text-[#1A202C]">Очередь фоновых задач экспорта (Celery)</h3>
          </div>
          <span className="text-xs text-[#718096]">Файлы хранятся 7 дней</span>
        </div>

        <div className="divide-y divide-[#EDF2F7] border border-[#E2E8F0] rounded-xl overflow-hidden">
          {tasks.map((task) => (
            <div key={task.id} className="p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors text-xs">
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-semibold text-[#2D3748]">{task.name}</div>
                  <div className="text-[10px] text-[#A0AEC0]">
                    Сформирован: {task.date} &bull; Размер: {task.fileSize}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                  Готово
                </span>
                <button
                  onClick={() => {
                    if (task.type === 'recipes_xlsx') {
                      exportRecipesToCSV(recipes);
                    } else if (task.type === 'diary_pdf') {
                      handleExportDiary();
                    } else {
                      handleExportAnalytics();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#4A5568] font-semibold text-[11px] flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Скачать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
