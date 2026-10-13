from django.urls import path
from .views import AdminUsersListView, AdminUserBlockView, AdminBackupView

urlpatterns = [
    path('users/', AdminUsersListView.as_view(), name='admin_users_list'),
    path('users/<int:pk>/block/', AdminUserBlockView.as_view(), name='admin_user_block'),
    path('backups/', AdminBackupView.as_view(), name='admin_backups'),
]
