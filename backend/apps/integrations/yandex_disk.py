import os
import requests

class YandexDiskService:
    def __init__(self, oauth_token: str = None):
        self.oauth_token = oauth_token or os.environ.get('YANDEX_DISK_TOKEN', '')
        self.base_url = 'https://cloud-api.yandex.net/v1/disk'

    def upload_backup(self, local_file_path: str, remote_folder: str = 'pureshque_backups'):
        """Загрузка резервной копии базы данных на Яндекс.Диск через REST API"""
        if not self.oauth_token:
            return {'status': 'simulated', 'message': 'Токен Яндекс.Диска не задан, бэкап сохранен локально'}

        headers = {'Authorization': f'OAuth {self.oauth_token}'}
        filename = os.path.basename(local_file_path)

        # 1. Запрос URL для загрузки
        params = {'path': f'/{remote_folder}/{filename}', 'overwrite': 'true'}
        res = requests.get(f'{self.base_url}/resources/upload', headers=headers, params=params)

        if res.status_code == 200:
            upload_url = res.json().get('href')
            with open(local_file_path, 'rb') as f:
                upload_res = requests.put(upload_url, data=f)
            return {'status': 'uploaded', 'code': upload_res.status_code}
        return {'status': 'error', 'details': res.text}
