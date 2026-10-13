import { DiaryEntry, Profile, Recipe, WeightEntry } from '../types';

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates an Excel-compatible CSV file (with UTF-8 BOM) for recipes
 */
export function exportRecipesToCSV(recipes: Recipe[]): void {
  // UTF-8 BOM for Microsoft Excel Russian text encoding
  const BOM = '\uFEFF';
  const headers = [
    'Название блюда',
    'Автор',
    'Порций',
    'Общий вес (г)',
    'Калории (всего)',
    'Белки (всего)',
    'Жиры (всего)',
    'Углеводы (всего)',
    'Ккал / 100г',
    'Б / 100г',
    'Ж / 100г',
    'У / 100г',
    'Ккал / порция',
    'Б / порция',
    'Ж / порция',
    'У / порция',
    'Ингредиенты',
  ];

  const rows = recipes.map((r) => {
    const ingredientsList = r.ingredients
      .map((i) => `${i.productName} (${i.amountG}г)`)
      .join('; ');

    return [
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.authorName}"`,
      r.servings,
      r.totalWeightG,
      r.totalCalories,
      r.totalProteins,
      r.totalFats,
      r.totalCarbs,
      r.caloriesPer100g,
      r.proteinsPer100g,
      r.fatsPer100g,
      r.carbsPer100g,
      r.caloriesPerServing,
      r.proteinsPerServing,
      r.fatsPerServing,
      r.carbsPerServing,
      `"${ingredientsList.replace(/"/g, '""')}"`,
    ].join(';');
  });

  const csvContent = BOM + [headers.join(';'), ...rows].join('\r\n');
  const filename = `Pureshque_Рецепты_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generates printable HTML for Food Diary report and triggers browser print / save to PDF
 */
export function printDiaryReport(
  entries: DiaryEntry[],
  date: string,
  profile: Profile,
  userName: string
): void {
  const mealLabels: Record<string, string> = {
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snack: 'Перекус',
  };

  const dayTotal = entries.reduce(
    (acc, curr) => ({
      calories: acc.calories + curr.calories,
      proteins: acc.proteins + curr.proteins,
      fats: acc.fats + curr.fats,
      carbs: acc.carbs + curr.carbs,
    }),
    { calories: 0, proteins: 0, fats: 0, carbs: 0 }
  );

  const calProgress = Math.round((dayTotal.calories / profile.dailyCalorieNorm) * 100);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для экспорта PDF');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pureshque — Отчет дневника питания за ${date}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 30px; color: #333; line-height: 1.5; }
    .header { border-bottom: 2px solid #81C784; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
    .logo { font-size: 28px; font-weight: bold; color: #2E7D32; }
    .subtitle { color: #666; font-size: 14px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
    .summary-card { background: #F1F8E9; border-radius: 8px; padding: 15px; text-align: center; }
    .summary-value { font-size: 22px; font-weight: bold; color: #2E7D32; }
    .summary-label { font-size: 12px; color: #555; text-transform: uppercase; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    th { background: #E8F5E9; color: #2E7D32; text-align: left; padding: 10px; font-size: 13px; }
    td { padding: 10px; border-bottom: 1px solid #E0E0E0; font-size: 13px; }
    .meal-header { background: #F5F5F5; font-weight: bold; color: #388E3C; }
    .footer { margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #DDD; padding-top: 15px; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🌿 Pureshque</div>
      <div class="subtitle">Сервис расчёта КБЖУ и дневник питания</div>
    </div>
    <div style="text-align: right;">
      <strong>Пользователь:</strong> ${userName}<br>
      <strong>Дата отчёта:</strong> ${date}
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-value">${dayTotal.calories} / ${profile.dailyCalorieNorm}</div>
      <div class="summary-label">Калории (${calProgress}%)</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${Math.round(dayTotal.proteins)}г / ${profile.dailyProteinNorm}г</div>
      <div class="summary-label">Белки</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${Math.round(dayTotal.fats)}г / ${profile.dailyFatNorm}г</div>
      <div class="summary-label">Жиры</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${Math.round(dayTotal.carbs)}г / ${profile.dailyCarbNorm}г</div>
      <div class="summary-label">Углеводы</div>
    </div>
  </div>

  <h3>Детализация рациона по приемам пищи</h3>
  <table>
    <thead>
      <tr>
        <th>Приём пищи / Продукт</th>
        <th>Количество</th>
        <th>Калории (ккал)</th>
        <th>Белки (г)</th>
        <th>Жиры (г)</th>
        <th>Углеводы (г)</th>
      </tr>
    </thead>
    <tbody>
      ${['breakfast', 'lunch', 'dinner', 'snack']
        .map((mealKey) => {
          const mealEntries = entries.filter((e) => e.mealType === mealKey);
          if (mealEntries.length === 0) return '';
          const mealCalories = mealEntries.reduce((s, e) => s + e.calories, 0);
          const mealProteins = mealEntries.reduce((s, e) => s + e.proteins, 0);
          const mealFats = mealEntries.reduce((s, e) => s + e.fats, 0);
          const mealCarbs = mealEntries.reduce((s, e) => s + e.carbs, 0);

          return `
            <tr class="meal-header">
              <td colspan="2">${mealLabels[mealKey]}</td>
              <td>${Math.round(mealCalories)} ккал</td>
              <td>${mealProteins.toFixed(1)} г</td>
              <td>${mealFats.toFixed(1)} г</td>
              <td>${mealCarbs.toFixed(1)} г</td>
            </tr>
            ${mealEntries
              .map(
                (e) => `
              <tr>
                <td style="padding-left: 20px;">${e.productName}</td>
                <td>${e.amountG ? `${e.amountG} г` : `${e.servings} порц.`}</td>
                <td>${Math.round(e.calories)}</td>
                <td>${e.proteins.toFixed(1)}</td>
                <td>${e.fats.toFixed(1)}</td>
                <td>${e.carbs.toFixed(1)}</td>
              </tr>
            `
              )
              .join('')}
          `;
        })
        .join('')}
    </tbody>
  </table>

  <div style="margin-top: 30px; padding: 15px; background: #FFF9C4; border-radius: 8px; font-size: 13px;">
    <strong>Медицинская оговорка:</strong> Данные и расчеты носят информационный характер и сформированы по формуле Миффлина-Сан Жеора. Не заменяют консультацию врача-диетолога.
  </div>

  <div class="footer">
    <div>Сформировано в системе Pureshque &bull; ${new Date().toLocaleDateString('ru-RU')}</div>
    <div>Подпись диетолога / врача: ____________________</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generates printable HTML for Full Analytics Report
 */
export function printAnalyticsReport(
  userName: string,
  profile: Profile,
  weights: WeightEntry[],
  period: string,
  stats: {
    avgCalories: number;
    avgProteins: number;
    avgFats: number;
    avgCarbs: number;
    minCalories: number;
    maxCalories: number;
    daysCount: number;
  }
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для экспорта PDF');
    return;
  }

  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weightKg : profile.weightKg;
  const startWeight = weights.length > 0 ? weights[0].weightKg : profile.weightKg;
  const weightDiff = (currentWeight - startWeight).toFixed(1);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pureshque — Аналитический отчёт по питанию и весу</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 35px; color: #222; }
    .header { border-bottom: 2px solid #4CAF50; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
    .logo { font-size: 26px; font-weight: bold; color: #2E7D32; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .card { background: #F5F7F5; padding: 15px; border-radius: 8px; }
    .card-title { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
    .card-num { font-size: 22px; font-weight: bold; color: #2E7D32; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #E8F5E9; color: #1B5E20; text-align: left; padding: 10px; font-size: 13px; }
    td { padding: 10px; border-bottom: 1px solid #EEE; font-size: 13px; }
    .footer { margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #DDD; padding-top: 15px; display: flex; justify-content: space-between; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🌿 Pureshque — Аналитика рациона</div>
      <div>Период отчета: <strong>${period}</strong></div>
    </div>
    <div style="text-align: right;">
      <strong>Пациент / Клиент:</strong> ${userName}<br>
      <strong>Цель:</strong> ${profile.goal === 'lose' ? 'Снижение веса' : profile.goal === 'gain' ? 'Набор массы' : 'Поддержание'}
    </div>
  </div>

  <h3>Сводная статистика потребления</h3>
  <div class="grid">
    <div class="card">
      <div class="card-title">Средняя калорийность</div>
      <div class="card-num">${stats.avgCalories} ккал</div>
      <small>Рекомендуемая норма: ${profile.dailyCalorieNorm} ккал</small>
    </div>
    <div class="card">
      <div class="card-title">Среднее БЖУ</div>
      <div class="card-num">Б: ${stats.avgProteins}г &bull; Ж: ${stats.avgFats}г &bull; У: ${stats.avgCarbs}г</div>
      <small>Норма: Б ${profile.dailyProteinNorm}г &bull; Ж ${profile.dailyFatNorm}г &bull; У ${profile.dailyCarbNorm}г</small>
    </div>
    <div class="card">
      <div class="card-title">Динамика веса</div>
      <div class="card-num">${currentWeight} кг (${Number(weightDiff) <= 0 ? weightDiff : `+${weightDiff}`} кг)</div>
      <small>Старт: ${startWeight} кг</small>
    </div>
  </div>

  <h3>Экстремумы за выбранный период</h3>
  <table>
    <thead>
      <tr>
        <th>Показатель</th>
        <th>Фактическое значение</th>
        <th>Целевая норма</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Минимальное потребление в день</td>
        <td><strong>${stats.minCalories} ккал</strong></td>
        <td>${profile.dailyCalorieNorm} ккал</td>
        <td>Дефицит зафиксирован</td>
      </tr>
      <tr>
        <td>Максимальное потребление в день</td>
        <td><strong>${stats.maxCalories} ккал</strong></td>
        <td>${profile.dailyCalorieNorm} ккал</td>
        <td>В пределах допустимого диапазона</td>
      </tr>
      <tr>
        <td>Количество дней с записями</td>
        <td><strong>${stats.daysCount} дн.</strong></td>
        <td>—</td>
        <td>Регулярный мониторинг</td>
      </tr>
    </tbody>
  </table>

  <h3>История измерений веса</h3>
  <table>
    <thead>
      <tr>
        <th>Дата взвешивания</th>
        <th>Вес (кг)</th>
        <th>Комментарий</th>
      </tr>
    </thead>
    <tbody>
      ${weights
        .map(
          (w) => `
        <tr>
          <td>${w.date}</td>
          <td><strong>${w.weightKg} кг</strong></td>
          <td>${w.note || '—'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>Сформировано автоматически системой Pureshque &bull; ${new Date().toLocaleDateString('ru-RU')}</div>
    <div>Диетолог / Эксперт: ____________________</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
