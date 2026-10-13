from rest_framework import views, permissions, response, status
from apps.users.models import User
from apps.users.serializers import UserSerializer
from apps.products.models import Product
from apps.recipes.models import Recipe

class IsAdminUserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == 'admin' or request.user.is_staff)

class AdminUsersListView(views.APIView):
    permission_classes = [IsAdminUserPermission]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        return response.Response(UserSerializer(users, many=True).data)

class AdminUserBlockView(views.APIView):
    permission_classes = [IsAdminUserPermission]

    def post(self, request, pk):
        try:
            target = User.objects.get(pk=pk)
            target.is_active = not target.is_active
            target.save()
            return response.Response({'status': 'success', 'is_active': target.is_active})
        except User.DoesNotExist:
            return response.Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminBackupView(views.APIView):
    permission_classes = [IsAdminUserPermission]

    def post(self, request):
        # Database backup generation simulation
        backup_file = "pureshque_db_backup_20261013.sql.gz"
        return response.Response({
            'status': 'success',
            'file': backup_file,
            'yandex_disk_synced': True,
        })
