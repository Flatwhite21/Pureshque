import React, { useState } from 'react';
import {
  Activity,
  Calculator,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Scale,
  Sparkles,
  Target,
  User as UserIcon,
} from 'lucide-react';
import { ActivityLevel, Gender, Goal, Profile, User } from '../types';
import {
  ACTIVITY_LABELS,
  ACTIVITY_MULTIPLIERS,
  calculateDailyNorms,
  GOAL_LABELS,
} from '../utils/calculations';

interface ProfileProps {
  currentUser: User;
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileProps> = ({
  currentUser,
  profile,
  onUpdateProfile,
  onResetData,
}) => {
  const [gender, setGender] = useState<Gender>(profile.gender || 'female');
  const [age, setAge] = useState<number>(profile.age || 26);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 168);
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 62.0);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'medium');
  const [goal, setGoal] = useState<Goal>(profile.goal || 'lose');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live dynamic formula calculation
  const calculatedNorms = calculateDailyNorms(gender, weightKg, heightCm, age, activityLevel, goal);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Profile = {
      ...profile,
      gender,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      activityLevel,
      goal,
      dailyCalorieNorm: calculatedNorms.calories,
      dailyProteinNorm: calculatedNorms.proteins,
      dailyFatNorm: calculatedNorms.fats,
      dailyCarbNorm: calculatedNorms.carbs,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in-50 duration-200">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.firstName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#81C784]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-bold text-2xl">
              {currentUser.firstName[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#1A202C]">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-semibold">
                {currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </span>
            </div>
            <p className="text-xs text-[#718096] mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-[#A0AEC0] mt-1">
              Регистрация: {new Date(currentUser.dateJoined).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Сбросить данные к эталонным для лабораторной работы?')) {
              onResetData();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#718096] hover:bg-[#F1F5F9] border border-[#CBD5E1]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Сбросить демо-данные
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Parameters & Goals */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E7DE] shadow-xs">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#EDF2F7]">
            <Calculator className="w-5 h-5 text-[#4CAF50]" />
            <h2 className="text-xl font-bold text-[#1A202C]">
              Параметры тела и расчет дневной нормы
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Gender Toggle */}
            <div>
              <label className="block text-xs font-bold text-[#4A5568] uppercase mb-2">Пол</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                    gender === 'female'
                      ? 'border-[#4CAF50] bg-[#E8F5E9] text-[#1B5E20] ring-1 ring-[#4CAF50]'
                      : 'border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Женский (-161 ккал)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                    gender === 'male'
                      ? 'border-[#4CAF50] bg-[#E8F5E9] text-[#1B5E20] ring-1 ring-[#4CAF50]'
                      : 'border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  Мужской (+5 ккал)
                </button>
              </div>
            </div>

            {/* Age, Height, Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">Возраст (лет)</label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">Рост (см)</label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A5568] mb-1">Вес (кг)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="250"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] font-bold text-sm text-[#1B5E20]"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-bold text-[#4A5568] uppercase mb-1">
                Уровень физической активности
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] text-xs bg-white focus:ring-2 focus:ring-[#81C784]"
              >
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                  <option key={level} value={level}>
                    {ACTIVITY_LABELS[level]} (x{ACTIVITY_MULTIPLIERS[level]})
                  </option>
                ))}
              </select>
            </div>

            {/* Goal Selector */}
            <div>
              <label className="block text-xs font-bold text-[#4A5568] uppercase mb-1">
                Цель по питанию
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['lose', 'maintain', 'gain'] as Goal[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      goal === g
                        ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] ring-1 ring-[#2E7D32]'
                        : 'border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div>{g === 'lose' ? 'Снижение' : g === 'maintain' ? 'Поддержание' : 'Набор'}</div>
                    <span className="text-[10px] text-[#718096]">
                      {g === 'lose' ? '-20% калорий' : g === 'maintain' ? '0% коррекция' : '+15% калорий'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Параметры успешно сохранены! Дневные нормы пересчитаны.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-bold text-sm shadow-md transition-all"
            >
              Сохранить и применить расчет нормы
            </button>
          </form>
        </div>

        {/* Right Info: Live Formula Inspector */}
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E0E7DE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#1B5E20]">
              <Sparkles className="w-5 h-5 text-[#4CAF50]" />
              <h3 className="font-bold text-base text-[#1A202C]">Формула Миффлина-Сан Жеора</h3>
            </div>

            <p className="text-xs text-[#546E7A] leading-relaxed">
              Золотой стандарт клинической диетологии для расчета базового обмена веществ (BMR):
            </p>

            <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#718096]">Базовый обмен (BMR):</span>
                <strong>{calculatedNorms.bmr} ккал</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Расход с активностью (TDEE):</span>
                <strong>{calculatedNorms.tdee} ккал</strong>
              </div>
              <div className="flex justify-between border-t border-[#EDF2F7] pt-2">
                <span className="text-[#1B5E20] font-bold">Целевая суточная норма:</span>
                <strong className="text-base text-[#1B5E20]">{calculatedNorms.calories} ккал</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAEFE8]">
              <span className="text-xs font-bold text-[#2D3748] uppercase tracking-wider block mb-2">
                Рекомендуемое распределение БЖУ:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-blue-600 block font-semibold">Белки</span>
                  <strong className="text-sm text-blue-900">{calculatedNorms.proteins}г</strong>
                  <span className="text-[10px] text-blue-500 block mt-0.5">~2.0 г/кг</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-600 block font-semibold">Жиры</span>
                  <strong className="text-sm text-amber-900">{calculatedNorms.fats}г</strong>
                  <span className="text-[10px] text-amber-500 block mt-0.5">~0.9 г/кг</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-600 block font-semibold">Углеводы</span>
                  <strong className="text-sm text-emerald-900">{calculatedNorms.carbs}г</strong>
                  <span className="text-[10px] text-emerald-500 block mt-0.5">остаток</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
