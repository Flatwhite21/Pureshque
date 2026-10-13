import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gender, ActivityLevel, NutritionGoal } from '../types';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  ACTIVITY_LABELS,
  GOAL_LABELS,
  ACTIVITY_MULTIPLIERS,
} from '../utils/calculator';
import { Calculator, Check, Sparkles, Scale, Activity } from 'lucide-react';

export const NormCalculatorView: React.FC = () => {
  const { profile, updateProfile, recalculateNorms } = useApp();

  const [gender, setGender] = useState<Gender>(profile.gender || 'female');
  const [age, setAge] = useState<number>(profile.age || 26);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 168);
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 62);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'medium');
  const [goal, setGoal] = useState<NutritionGoal>(profile.goal || 'lose');

  const [proteinRate, setProteinRate] = useState<number>(1.8);
  const [fatRate, setFatRate] = useState<number>(0.9);

  // Live Calculations
  const bmr = Math.round(calculateBMR(gender, weightKg, heightCm, age));
  const tdee = Math.round(calculateTDEE(bmr, activityLevel));
  const targetCalories = calculateTargetCalories(tdee, goal);
  const macros = calculateMacros(targetCalories, weightKg, proteinRate, fatRate);

  const handleApplyToProfile = () => {
    updateProfile({
      gender,
      age,
      heightCm,
      weightKg,
      activityLevel,
      goal,
      dailyCalorieNorm: targetCalories,
      dailyProteinNorm: macros.proteins,
      dailyFatNorm: macros.fats,
      dailyCarbNorm: macros.carbs,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E] flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#4CAF50]" />
          <span>Расчёт дневной нормы калорий и БЖУ</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5D705D] mt-1">
          Научный метод расчёта по формуле Миффлина-Сан Жеора с учётом уровня метаболизма, двигательной активности и цели
        </p>
      </div>

      {/* Inputs Form Grid */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#4A5568]">Пол</label>
            <div className="flex items-center gap-2 p-1 bg-[#F1F6EE] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  gender === 'female' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
                }`}
              >
                Женский
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  gender === 'male' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
                }`}
              >
                Мужской
              </button>
            </div>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#4A5568]">Возраст (лет)</label>
            <input
              type="number"
              min="14"
              max="100"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
            />
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#4A5568]">Рост (см)</label>
            <input
              type="number"
              min="120"
              max="230"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#4A5568]">Текущий вес (кг)</label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="250"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-sm border border-[#DCE8D4] rounded-xl focus:outline-none focus:border-[#4CAF50] font-mono"
            />
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#4A5568]">Уровень физической активности</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setActivityLevel(level)}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  activityLevel === level
                    ? 'border-[#4CAF50] bg-[#F1F8EC] text-[#1E3A1E] font-medium'
                    : 'border-[#E2EBDC] hover:bg-[#FAFDF7] text-[#4A5568]'
                }`}
              >
                {ACTIVITY_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#4A5568]">Основная цель</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {(['lose', 'maintain', 'gain'] as NutritionGoal[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`p-3.5 text-center rounded-xl border transition-all cursor-pointer ${
                  goal === g
                    ? 'border-[#4CAF50] bg-[#F1F8EC] text-[#1E3A1E] font-semibold shadow-2xs'
                    : 'border-[#E2EBDC] hover:bg-[#FAFDF7] text-[#4A5568]'
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Step by Step Breakdown Card */}
        <div className="bg-[#FAFDF7] border border-[#DCE8D4] rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#1E3A1E] uppercase tracking-wider">
            Математический расчёт по шагам:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3 bg-white rounded-xl border border-[#EDF3E8]">
              <div className="text-xs text-[#718096]">1. Базовый обмен (BMR)</div>
              <div className="text-lg font-mono font-bold text-[#1E3A1E] mt-0.5 tabular-nums">
                {bmr} ккал
              </div>
              <div className="text-[11px] text-[#718096] mt-1">
                {gender === 'male' ? '10·W + 6.25·H - 5·A + 5' : '10·W + 6.25·H - 5·A - 161'}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#EDF3E8]">
              <div className="text-xs text-[#718096]">2. Расход с активностью (TDEE)</div>
              <div className="text-lg font-mono font-bold text-[#1E3A1E] mt-0.5 tabular-nums">
                {tdee} ккал
              </div>
              <div className="text-[11px] text-[#718096] mt-1">
                BMR × {ACTIVITY_MULTIPLIERS[activityLevel]}
              </div>
            </div>

            <div className="p-3 bg-[#E8F5E9]/60 rounded-xl border border-[#C8E6C9]">
              <div className="text-xs text-[#2E7D32]">3. Целевая норма калорий</div>
              <div className="text-2xl font-mono font-bold text-[#2E7D32] mt-0.5 tabular-nums">
                {targetCalories} ккал
              </div>
              <div className="text-[11px] text-[#2E7D32] mt-1">
                {goal === 'lose' ? 'TDEE × 0.8 (-20%)' : goal === 'gain' ? 'TDEE × 1.15 (+15%)' : 'TDEE (100%)'}
              </div>
            </div>
          </div>

          {/* Computed Macro Distribution */}
          <div className="pt-2 border-t border-[#EDF3E8]">
            <div className="text-xs font-semibold text-[#4A5568] mb-2">
              Распределение макронутриентов (БЖУ):
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-[#EDF3E8]">
                <div className="text-xs text-[#718096]">Белки (1.8 г/кг)</div>
                <div className="font-mono font-bold text-base text-[#2E7D32] tabular-nums">
                  {macros.proteins} г
                </div>
                <div className="text-[10px] text-[#718096]">{macros.proteins * 4} ккал</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#EDF3E8]">
                <div className="text-xs text-[#718096]">Жиры (0.9 г/кг)</div>
                <div className="font-mono font-bold text-base text-[#2E7D32] tabular-nums">
                  {macros.fats} г
                </div>
                <div className="text-[10px] text-[#718096]">{macros.fats * 9} ккал</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#EDF3E8]">
                <div className="text-xs text-[#718096]">Углеводы (остаток)</div>
                <div className="font-mono font-bold text-base text-[#2E7D32] tabular-nums">
                  {macros.carbs} г
                </div>
                <div className="text-[10px] text-[#718096]">{macros.carbs * 4} ккал</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleApplyToProfile}
            className="px-6 py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Применить эти параметры в профиль</span>
          </button>
        </div>
      </div>
    </div>
  );
};
