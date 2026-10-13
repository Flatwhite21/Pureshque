import React from 'react';
import { Flame, Heart, Shield } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-[#E0E7DE] mt-16 text-xs text-[#718096]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4CAF50] text-white flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-white/20" />
            </div>
            <span className="font-bold text-sm text-[#1B5E20]">Pureshque</span>
            <span className="text-[#A0AEC0]">&bull;</span>
            <span>Сервис расчёта КБЖУ, ведения дневника питания и анализа рациона</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-[#1B5E20]">Дашборд</button>
            <button onClick={() => onNavigate('diary')} className="hover:text-[#1B5E20]">Дневник</button>
            <button onClick={() => onNavigate('products')} className="hover:text-[#1B5E20]">Продукты</button>
            <button onClick={() => onNavigate('recipes')} className="hover:text-[#1B5E20]">Рецепты</button>
            <button onClick={() => onNavigate('analytics')} className="hover:text-[#1B5E20]">Аналитика</button>
            <button onClick={() => onNavigate('code')} className="hover:text-[#1B5E20] text-blue-600 font-semibold">Архитектура ЛР</button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#F0F4EF] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A0AEC0] gap-2">
          <div>
            Лабораторные работы 1–5 &bull; Учебный полнофункциональный проект Pureshque
          </div>
          <div>
            Формула Миффлина-Сан Жеора &bull; Сделано с заботой о балансе питания
          </div>
        </div>
      </div>
    </footer>
  );
};
