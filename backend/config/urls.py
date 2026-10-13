from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls_auth')),
    path('api/profile/', include('apps.users.urls_profile')),
    path('api/products/', include('apps.products.urls')),
    path('api/recipes/', include('apps.recipes.urls')),
    path('api/diary/', include('apps.diary.urls')),
    path('api/weight/', include('apps.diary.urls_weight')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/export/', include('apps.exports.urls')),
    path('api/admin/', include('apps.admin_panel.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
