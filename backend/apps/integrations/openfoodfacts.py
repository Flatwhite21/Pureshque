import requests

class OpenFoodFactsService:
    BASE_URL = 'https://world.openfoodfacts.org/api/v2/product'

    @classmethod
    def fetch_product_by_barcode(cls, barcode: str):
        try:
            url = f"{cls.BASE_URL}/{barcode}.json"
            resp = requests.get(url, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                if data.get('status') == 1:
                    p = data.get('product', {})
                    nutriments = p.get('nutriments', {})
                    return {
                        'name': p.get('product_name', 'Неизвестный продукт'),
                        'calories_per_100g': float(nutriments.get('energy-kcal_100g', 0.0)),
                        'proteins_per_100g': float(nutriments.get('proteins_100g', 0.0)),
                        'fats_per_100g': float(nutriments.get('fat_100g', 0.0)),
                        'carbs_per_100g': float(nutriments.get('carbohydrates_100g', 0.0)),
                        'category': p.get('categories_tags', ['Общее'])[0],
                    }
        except Exception:
            pass
        return None
