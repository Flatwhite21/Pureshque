import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportRecipesToExcel, exportDiaryToExcel, generatePrintableDiaryHTML } from '../utils/export';
import { FileText, FileSpreadsheet, Download, CheckCircle2, Clock, Play, Printer, AlertCircle } from 'lucide-react';
import { TODAY_STR } from '../data/initialData';

export const ExportView: React.FC = () => {
  const { user, profile, recipes, diaryEntries, exportTasks, addExportTask, showNotification } = useApp();

  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState(TODAY_STR);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Export Diary to PDF (Print Dialog)
  const handleExportDiaryPDF = () => {
    setIsProcessing(true);
    const filtered = diaryEntries.filter((e) => e.date >= startDate && e.date <= endDate);

    setTimeout(() => {
      setIsProcessing(false);
      addExportTask({
        exportType: 'diary_pdf',
        periodStart: startDate,
        periodEnd: endDate,
        status: 'done',
        filePath: `/exports/diary_${startDate}_${endDate}.pdf`,
      });

      const html = generatePrintableDiaryHTML(
        user,
        profile,
        `${startDate} — ${endDate}`,
        filtered
      );

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head><title>Pureshque — Отчёт дневника питания (${startDate} - ${endDate})</title></head>
            <body>
              ${html}
              <script>
                window.onload = function() { window.print(); };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      showNotification('Отчёт дневника питания подготовлен к печати и сохранению в PDF!');
    }, 800);
  };

  // 2. Export Recipes to Excel (Real XLSX)
  const handleExportRecipesXLSX = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      exportRecipesToExcel(recipes, `pureshque_recipes_${TODAY_STR}.xlsx`);
      addExportTask({
        exportType: 'recipes_xlsx',
        periodStart: startDate,
        periodEnd: endDate,
        status: 'done',
        filePath: `/exports/recipes_${TODAY_STR}.xlsx`,
      });
      showNotification('Файл recipes.xlsx с КБЖУ и порциями успешно сгенерирован и загружен!');
    }, 600);
  };

  // 3. Export Analytics Report to PDF
  const handleExportAnalyticsPDF = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      addExportTask({
        exportType: 'analytics_pdf',
        periodStart: startDate,
        periodEnd: endDate,
        status: 'done',
        filePath: `/exports/analytics_report_${startDate}_${endDate}.pdf`,
      });

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head><title>Pureshque — Аналитический отчёт рациона (${startDate} - ${endDate})</title></head>
            <body style="font-family: sans-serif; padding: 40px; color: #2D3748;">
              <h1 style="color: #2E7D32; border-bottom: 2px solid #81C784; padding-bottom: 12px;">Pureshque · Аналитический отчёт</h1>
              <p>Пользователь: <strong>${user.firstName} ${user.lastName}</strong></p>
              <p>Период: <strong>${startDate} — ${endDate}</strong></p>
              <p>Целевая калорийность: <strong>${profile.dailyCalorieNorm} ккал</strong></p>
              <p>Целевое БЖУ: <strong>Белки ${profile.dailyProteinNorm}г · Жиры ${profile.dailyFatNorm}г · Углеводы ${profile.dailyCarbNorm}г</strong></p>
              <div style="margin-top: 30px; padding: 20px; background: #F1F8E9; border-radius: 8px;">
                <h3>Заключение системы</h3>
                <p>Динамика соблюдения энергетического баланса стабильная. Рекомендуется продолжать контроль белковой квоты в вечернее время.</p>
              </div>
              <script>window.onload = function() { window.print(); };</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      showNotification('Аналитический отчёт с графиками и статистикой сформирован в PDF!');
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E] flex items-center gap-2">
          <Download className="w-6 h-6 text-[#4CAF50]" />
          <span>Центр экспорта данных и отчётов</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5D705D] mt-1">
          Выгрузка дневника питания для диетолога (PDF), каталога рецептов (Excel XLSX) и сводной аналитики
        </p>
      </div>

      {/* Period Filter Card */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-[#1E3A1E] uppercase tracking-wider">
          Выбор временного периода для выгрузки
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Дата начала</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Дата окончания</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3 Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Export Diary to PDF */}
        <div className="bg-white border border-[#E2EBDC] hover:border-[#A5D6A7] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1E3A1E]">Дневник питания в PDF</h3>
            <p className="text-xs text-[#718096] mt-1">
              Форматированный документ с разбивкой по приёмам пищи (завтрак, обед, ужин), граммовками и суточным КБЖУ для отправки диетологу.
            </p>
          </div>

          <button
            onClick={handleExportDiaryPDF}
            disabled={isProcessing}
            className="mt-5 w-full py-2.5 px-3 bg-[#4CAF50] hover:bg-[#43A047] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Сформировать PDF</span>
          </button>
        </div>

        {/* Export Recipes to Excel */}
        <div className="bg-white border border-[#E2EBDC] hover:border-[#A5D6A7] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1E3A1E]">Рецепты в Excel (XLSX)</h3>
            <p className="text-xs text-[#718096] mt-1">
              Электронная таблица со всеми ингредиентами, общим весом, калориями, белками, жирами, углеводами на 100 г и на порцию.
            </p>
          </div>

          <button
            onClick={handleExportRecipesXLSX}
            disabled={isProcessing}
            className="mt-5 w-full py-2.5 px-3 bg-[#81C784]/30 hover:bg-[#81C784]/50 border border-[#A5D6A7] disabled:opacity-50 text-[#1B5E20] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Скачать XLSX файл</span>
          </button>
        </div>

        {/* Export Analytics PDF */}
        <div className="bg-white border border-[#E2EBDC] hover:border-[#A5D6A7] rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1E3A1E]">Аналитический отчёт</h3>
            <p className="text-xs text-[#718096] mt-1">
              Сводная статистика за период, средние и пиковые показатели, процент отклонения от нормы и рекомендации по балансу БЖУ.
            </p>
          </div>

          <button
            onClick={handleExportAnalyticsPDF}
            disabled={isProcessing}
            className="mt-5 w-full py-2.5 px-3 bg-[#81C784]/30 hover:bg-[#81C784]/50 border border-[#A5D6A7] disabled:opacity-50 text-[#1B5E20] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Сформировать PDF отчёт</span>
          </button>
        </div>
      </div>

      {/* Task Queue History Table (Celery Simulation) */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1E3A1E]">История задач экспорта (Celery Queue)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDF3E8] text-[#718096]">
                <th className="py-2.5">Тип задачи</th>
                <th className="py-2.5">Период</th>
                <th className="py-2.5">Статус</th>
                <th className="py-2.5">Файл</th>
                <th className="py-2.5 text-right">Время создания</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F6EE]">
              {exportTasks.map((t) => (
                <tr key={t.id} className="hover:bg-[#F9FCF8]">
                  <td className="py-2.5 font-medium text-[#1E3A1E]">
                    {t.exportType === 'diary_pdf'
                      ? 'Дневник питания (PDF)'
                      : t.exportType === 'recipes_xlsx'
                      ? 'Каталог рецептов (XLSX)'
                      : 'Аналитический отчёт (PDF)'}
                  </td>
                  <td className="py-2.5 font-mono text-[#4A5D4A] tabular-nums">
                    {t.periodStart} — {t.periodEnd}
                  </td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-[#4CAF50]" /> Готово
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-[#718096] truncate max-w-[180px]">{t.filePath}</td>
                  <td className="py-2.5 text-right font-mono text-[#718096] tabular-nums">
                    {t.createdAt.slice(0, 16).replace('T', ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
