import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Plus, Trash2, ArrowDownRight, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { TODAY_STR } from '../data/initialData';

export const WeightTrackerView: React.FC = () => {
  const { weightEntries, addWeightEntry, deleteWeightEntry, profile } = useApp();

  const [date, setDate] = useState(TODAY_STR);
  const [weightKg, setWeightKg] = useState('');
  const [note, setNote] = useState('');

  const sortedEntries = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date));
  const startWeight = sortedEntries[0]?.weightKg || profile.weightKg;
  const currentWeight = sortedEntries[sortedEntries.length - 1]?.weightKg || profile.weightKg;
  const totalChange = Number((currentWeight - startWeight).toFixed(1));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg) return;

    addWeightEntry({
      date,
      weightKg: Number(weightKg),
      note: note.trim() || undefined,
    });

    setWeightKg('');
    setNote('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E] flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#4CAF50]" />
            <span>Трекер изменения веса</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5D705D] mt-1">
            Фиксация массы тела и сопоставление с дневником питания
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-[#F1F8EC] px-4 py-2 rounded-xl border border-[#D8E6D0]">
          <div>
            <span className="text-[#718096]">Всего динамика: </span>
            <span
              className={`font-mono font-bold ${
                totalChange < 0 ? 'text-[#38A169]' : totalChange > 0 ? 'text-[#E53E3E]' : 'text-[#718096]'
              }`}
            >
              {totalChange > 0 ? `+${totalChange}` : totalChange} кг
            </span>
          </div>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Стартовый вес</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#1E3A1E] mt-1 tabular-nums">
            {startWeight} кг
          </div>
          <div className="text-[11px] text-[#718096] mt-0.5">{sortedEntries[0]?.date || 'Начало'}</div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Текущий вес</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#2E7D32] mt-1 tabular-nums">
            {currentWeight} кг
          </div>
          <div className="text-[11px] text-[#718096] mt-0.5">{sortedEntries[sortedEntries.length - 1]?.date}</div>
        </div>

        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-[#718096]">Общий сдвиг</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#4CAF50] mt-1 tabular-nums flex items-center gap-1">
            {totalChange <= 0 ? <ArrowDownRight className="w-5 h-5 text-[#38A169]" /> : <ArrowUpRight className="w-5 h-5 text-[#E53E3E]" />}
            <span>{Math.abs(totalChange)} кг</span>
          </div>
          <div className="text-[11px] text-[#718096] mt-0.5">В сторону цели</div>
        </div>
      </div>

      {/* Log Form */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#1E3A1E] uppercase tracking-wider">
          Внести новый замер массы тела
        </h2>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Дата</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Вес (кг) *</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="Например: 61.8"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Заметка</label>
            <input
              type="text"
              placeholder="Утренний замер натощак..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Зафиксировать</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1E3A1E]">История замеров</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDF3E8] text-xs text-[#718096]">
                <th className="py-2.5 font-medium">Дата</th>
                <th className="py-2.5 text-right font-medium">Вес</th>
                <th className="py-2.5 text-right font-medium">Динамика</th>
                <th className="py-2.5 font-medium">Заметка</th>
                <th className="py-2.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F6EE]">
              {sortedEntries.slice().reverse().map((item, index, arr) => {
                const prevInPast = arr[index + 1];
                const delta = prevInPast ? Number((item.weightKg - prevInPast.weightKg).toFixed(1)) : 0;
                return (
                  <tr key={item.id} className="hover:bg-[#F9FCF8] transition-colors">
                    <td className="py-2.5 font-mono text-xs text-[#4A5D4A] tabular-nums">{item.date}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#1E3A1E] tabular-nums">
                      {item.weightKg} кг
                    </td>
                    <td className="py-2.5 text-right font-mono text-xs tabular-nums">
                      {delta === 0 ? (
                        <span className="text-[#A0AEC0]">0.0 кг</span>
                      ) : delta > 0 ? (
                        <span className="text-[#E53E3E]">+ {delta} кг</span>
                      ) : (
                        <span className="text-[#38A169]">{delta} кг</span>
                      )}
                    </td>
                    <td className="py-2.5 text-xs text-[#718096]">{item.note || '—'}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => deleteWeightEntry(item.id)}
                        className="text-[#CBD5E0] hover:text-[#E53E3E] p-1 rounded transition-colors cursor-pointer"
                        title="Удалить запись"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
