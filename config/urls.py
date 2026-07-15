from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import TenantTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("api/auth/token/", TenantTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.accounts.urls")),
    path("api/", include("apps.pipeline.urls")),
    path("api/", include("apps.catalog.urls")),
    path("api/", include("apps.quotes.urls")),
    path("api/", include("apps.activities.urls")),
    path("api/", include("apps.dashboard.urls")),
]
