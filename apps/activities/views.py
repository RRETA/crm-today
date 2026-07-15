from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.core.mixins import TenantQuerySetMixin

from .models import Activity
from .serializers import ActivitySerializer


class ActivityViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["type", "status", "owner", "account", "opportunity"]
    search_fields = ["subject"]
