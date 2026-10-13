import pytest

def calculate_mifflin_bmr(gender: str, weight: float, height: float, age: int) -> int:
    base = 10 * weight + 6.25 * height - 5 * age
    return round(base + 5 if gender == 'male' else base - 161)

def test_mifflin_bmr_female():
    # Александра: 26 лет, 62 кг, 168 см
    bmr = calculate_mifflin_bmr('female', 62.0, 168.0, 26)
    assert bmr == 1379

def test_mifflin_tdee_and_deficit():
    bmr = 1379
    tdee = round(bmr * 1.55) # 2137
    assert tdee == 2137
    target_cal = round(tdee * 0.8) # deficit 20%
    assert target_cal == 1710

def test_recipe_kbju():
    # 170g chicken + 80g buckwheat
    chicken_cal = 113 * (170 / 100) # 192.1
    buckwheat_cal = 313 * (80 / 100) # 250.4
    total_cal = chicken_cal + buckwheat_cal
    assert round(total_cal) == 442
