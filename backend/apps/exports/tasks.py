import os
from celery import shared_task
from openpyxl import Workbook
from django.conf import settings
from apps.recipes.models import Recipe
from apps.diary.models import DiaryEntry

@shared_task
def generate_recipes_xlsx_task(user_id, file_path):
    wb = Workbook()
    ws = wb.active
    ws.title = "Рецепты"

    headers = [
        "№", "Название", "Автор", "Порций", "Общий вес (г)",
        "Ккал всего", "Белки всего", "Жиры всего", "Углеводы всего",
        "Ккал/100г", "Ккал/порция"
    ]
    ws.append(headers)

    recipes = Recipe.objects.all()
    for idx, r in enumerate(recipes, 1):
        ws.append([
            idx, r.title, r.author.first_name, r.servings, r.total_weight_g,
            r.total_calories, r.total_proteins, r.total_fats, r.total_carbs,
            r.calories_per_100g, r.calories_per_serving
        ])

    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    wb.save(file_path)
    return file_path

@shared_task
def generate_diary_pdf_task(user_id, period_start, period_end, file_path):
    # Simulated WeasyPrint PDF compilation
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as f:
        f.write(f"PDF Export for User {user_id} from {period_start} to {period_end}")
    return file_path
