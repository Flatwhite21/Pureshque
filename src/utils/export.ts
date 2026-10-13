import * as XLSX from 'xlsx';
import { DiaryEntry, Profile, Recipe, User } from '../types';

/**
 * Экспорт рецептов в реальный файл Excel (.xlsx)
 */
export function exportRecipesToExcel(recipes: Recipe[], filename = 'pureshque_recipes.xlsx') {
  const flatRows = recipes.map((r, index) => ({
    '№': index + 1,
    'Название блюда': r.title,
    'Описание': r.description,
    'Автор': r.authorName,
    'Количество порций': r.servings,
    'Общий вес (г)': r.totalWeightG,
    'Калории (всего)': r.totalCalories,
    'Белки (всего, г)': r.totalProteins,
    'Жиры (всего, г)': r.totalFats,
    'Углеводы (всего, г)': r.totalCarbs,
    'Калории на 100г': r.caloriesPer100g,
    'Белки на 100г': r.proteinsPer100g,
    'Жиры на 100г': r.fatsPer100g,
    'Углеводы на 100г': r.carbsPer100g,
    'Калории на порцию': r.caloriesPerServing,
    'Белки на порцию': r.proteinsPerServing,
    'Жиры на порцию': r.fatsPerServing,
    'Углеводы на порцию': r.carbsPerServing,
    'Состав (ингредиенты)': r.ingredients.map(i => `${i.productName} (${i.amountG}г)`).join('; '),
    'Дата создания': r.createdAt.slice(0, 10),
  }));

  const worksheet = XLSX.utils.json_to_sheet(flatRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Рецепты');

  // Установка ширины колонок
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 30 },
    { wch: 40 },
    { wch: 18 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 50 },
    { wch: 14 },
  ];

  XLSX.writeFile(workbook, filename);
}

/**
 * Экспорт дневника питания в Excel (.xlsx)
 */
export function exportDiaryToExcel(entries: DiaryEntry[], filename = 'pureshque_diary.xlsx') {
  const flatRows = entries.map((e, index) => ({
    '№': index + 1,
    'Дата': e.date,
    'Приём пищи': e.mealType === 'breakfast' ? 'Завтрак' : e.mealType === 'lunch' ? 'Обед' : e.mealType === 'dinner' ? 'Ужин' : 'Перекус',
    'Продукт / Блюдо': e.name,
    'Количество (г)': e.amountG,
    'Калории (ккал)': e.calories,
    'Белки (г)': e.proteins,
    'Жиры (г)': e.fats,
    'Углеводы (г)': e.carbs,
  }));

  const worksheet = XLSX.utils.json_to_sheet(flatRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Дневник питания');
  XLSX.writeFile(workbook, filename);
}

/**
 * Генерация фирменного HTML-отчёта дневника питания для сохранения в PDF через браузерную печать
 */
export function generatePrintableDiaryHTML(
  user: User,
  profile: Profile,
  date: string,
  entries: DiaryEntry[]
) {
  const totalCalories = entries.reduce((s, e) => s + e.calories, 0);
  const totalProteins = Number(entries.reduce((s, e) => s + e.proteins, 0).toFixed(1));
  const totalFats = Number(entries.reduce((s, e) => s + e.fats, 0).toFixed(1));
  const totalCarbs = Number(entries.reduce((s, e) => s + e.carbs, 0).toFixed(1));

  const mealSections = [
    { type: 'breakfast', title: 'Завтрак' },
    { type: 'lunch', title: 'Обед' },
    { type: 'dinner', title: 'Ужин' },
    { type: 'snack', title: 'Перекусы' },
  ];

  return `
    <div style="font-family: sans-serif; color: #2D3748; padding: 32px; max-width: 800px; margin: 0 auto; background: #fff;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #81C784; padding-bottom: 16px; margin-bottom: 24px;">
        <div>
          <h1 style="margin: 0; color: #2E7D32; font-size: 24px; font-weight: bold;">Pureshque · Дневник питания</h1>
          <p style="margin: 4px 0 0 0; color: #718096; font-size: 14px;">Отчёт для диетолога и личного контроля</p>
        </div>
        <div style="text-align: right; font-size: 13px; color: #718096;">
          <div><strong>Пользователь:</strong> ${user.firstName} ${user.lastName}</div>
          <div><strong>Дата:</strong> ${date}</div>
          <div><strong>Цель:</strong> ${profile.goal === 'lose' ? 'Снижение веса' : profile.goal === 'gain' ? 'Набор массы' : 'Поддержание'}</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #F1F8E9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #558B2F;">Калории</div>
          <div style="font-size: 20px; font-weight: bold; color: #2E7D32;">${totalCalories} / ${profile.dailyCalorieNorm}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #558B2F;">Белки</div>
          <div style="font-size: 20px; font-weight: bold; color: #2E7D32;">${totalProteins}г / ${profile.dailyProteinNorm}г</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #558B2F;">Жиры</div>
          <div style="font-size: 20px; font-weight: bold; color: #2E7D32;">${totalFats}г / ${profile.dailyFatNorm}г</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #558B2F;">Углеводы</div>
          <div style="font-size: 20px; font-weight: bold; color: #2E7D32;">${totalCarbs}г / ${profile.dailyCarbNorm}г</div>
        </div>
      </div>

      ${mealSections
        .map(section => {
          const sectionEntries = entries.filter(e => e.mealType === section.type);
          const mealCalories = sectionEntries.reduce((s, e) => s + e.calories, 0);
          return `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 16px; color: #2E7D32;">${section.title}</h3>
                <span style="font-size: 14px; font-weight: bold; color: #4A5568;">${mealCalories} ккал</span>
              </div>
              ${
                sectionEntries.length === 0
                  ? '<div style="font-size: 13px; color: #A0AEC0; font-style: italic;">Записей нет</div>'
                  : `
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="text-align: left; color: #718096; border-bottom: 1px solid #EDF2F7;">
                      <th style="padding: 6px 0;">Продукт / Блюдо</th>
                      <th style="padding: 6px; text-align: right;">Граммы</th>
                      <th style="padding: 6px; text-align: right;">Калории</th>
                      <th style="padding: 6px; text-align: right;">Б / Ж / У</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sectionEntries
                      .map(
                        e => `
                      <tr style="border-bottom: 1px solid #F7FAFC;">
                        <td style="padding: 6px 0;">${e.name}</td>
                        <td style="padding: 6px; text-align: right;">${e.amountG}г</td>
                        <td style="padding: 6px; text-align: right; font-weight: 600;">${e.calories} ккал</td>
                        <td style="padding: 6px; text-align: right; color: #718096;">${e.proteins}г / ${e.fats}г / ${e.carbs}г</td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              `
              }
            </div>
          `;
        })
        .join('')}

      <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 32px; font-size: 12px; color: #A0AEC0; text-align: center;">
        Сформировано веб-сервисом Pureshque · Разработано для контроля питания и аналитики рациона
      </div>
    </div>
  `;
}
