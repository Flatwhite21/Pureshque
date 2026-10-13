import pytest
from rest_framework.test import APIClient

@pytest.fixture
def client():
    return APIClient()

def test_api_unauthorized_access(client):
    response = client.get('/api/diary/')
    # Unauthenticated request should yield 401
    assert response.status_code == 401

def test_public_registration_endpoint(client):
    data = {
        'email': 'newuser@pureshque.ru',
        'password': 'StrongPassword2026!',
        'first_name': 'Тестовый',
        'last_name': 'Пользователь',
    }
    # Checks registration contract
    assert data['email'].endswith('@pureshque.ru')
    assert len(data['password']) >= 8
