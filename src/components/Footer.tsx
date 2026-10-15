import React from 'react';
import { Flame } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-[#E0E7DE] mt-16 text-xs text-[#718096]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4CAF50] text-white flex items-center justify-center shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-white/20" />
            </div>
            <span className="font-bold text-sm text-[#1B5E20]">Pureshque</span>
            <span className="text-[#A0AEC0]">&bull;</span>
            <span>Сервис расчёта КБЖУ, ведения дневника питания и анализа рациона</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-[#1B5E20] transition-colors">Дашборд</button>
            <button onClick={() => onNavigate('diary')} className="hover:text-[#1B5E20] transition-colors">Дневник</button>
            <button onClick={() => onNavigate('products')} className="hover:text-[#1B5E20] transition-colors">Продукты</button>
            <button onClick={() => onNavigate('recipes')} className="hover:text-[#1B5E20] transition-colors">Рецепты</button>
            <button onClick={() => onNavigate('analytics')} className="hover:text-[#1B5E20] transition-colors">Аналитика</button>
            <button onClick={() => onNavigate('export')} className="hover:text-[#1B5E20] transition-colors">Экспорт</button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#F0F4EF] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A0AEC0] gap-2">
          <div>
            &copy; 2026 Pureshque. Все права защищены.
          </div>
          <div>
            Сделано с заботой о сбалансированном рационе и здоровье
          </div>
        </div>
      </div>
    </footer>
  );
};
