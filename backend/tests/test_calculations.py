import pytest

def calculate_bmr(gender: str, weight_kg: float, height_cm: float, age: int) -> float:
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    return base + 5 if gender == 'male' else base - 161

def calculate_target_calories(bmr: float, activity_multiplier: float, goal: str) -> int:
    tdee = bmr * activity_multiplier
    if goal == 'lose':
        return round(tdee * 0.8)
    elif goal == 'gain':
        return round(tdee * 1.15)
    return round(tdee)

def calculate_macros(target_calories: int, weight_kg: float, protein_rate: float = 1.8, fat_rate: float = 0.9):
    proteins = round(weight_kg * protein_rate)
    fats = round(weight_kg * fat_rate)
    carbs = max(0, round((target_calories - proteins * 4 - fats * 9) / 4))
    return proteins, fats, carbs

def test_mifflin_st_jeor_female_alexandra():
    # Александра: Женщина, 26 лет, 168 см, 62 кг
    bmr = calculate_bmr('female', 62, 168, 26)
    # 620 + 1050 - 130 - 161 = 1379
    assert round(bmr) == 1379

    # Средняя активность 1.55, дефицит -20%
    target = calculate_target_calories(bmr, 1.55, 'lose')
    assert target == 1710

def test_mifflin_st_jeor_male():
    # Мужчина, 30 лет, 180 см, 80 кг
    bmr = calculate_bmr('male', 80, 180, 30)
    # 800 + 1125 - 150 + 5 = 1780
    assert round(bmr) == 1780

    # Поддержание веса при средней активности
    target = calculate_target_calories(bmr, 1.55, 'maintain')
    assert target == round(1780 * 1.55)

def test_macro_distribution():
    target_cals = 1800
    weight = 62.0
    proteins, fats, carbs = calculate_macros(target_cals, weight)

    assert proteins == round(62 * 1.8) # 112g
    assert fats == round(62 * 0.9)     # 56g
    # 1800 - 112*4 - 56*9 = 1800 - 448 - 504 = 848 / 4 = 212
    assert carbs == 212

def test_recipe_nutrition_aggregation():
    ingredients = [
        {"amount_g": 200, "cals": 290, "p": 62.0, "f": 5.0, "c": 0.0},
        {"amount_g": 100, "cals": 110, "p": 4.2, "f": 1.1, "c": 21.3},
    ]
    total_w = sum(i["amount_g"] for i in ingredients)
    total_cals = sum(i["cals"] for i in ingredients)
    servings = 2

    cals_per_100g = round((total_cals / total_w) * 100)
    cals_per_serving = round(total_cals / servings)

    assert total_w == 300
    assert total_cals == 400
    assert cals_per_100g == 133
    assert cals_per_serving == 200
