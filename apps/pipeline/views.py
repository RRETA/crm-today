from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.core.mixins import TenantQuerySetMixin

from .models import Opportunity, Stage
from .serializers import OpportunitySerializer, StageSerializer


class StageViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    permission_classes = [IsAuthenticated]


class OpportunityViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["stage", "owner", "account", "status", "type"]
    search_fields = ["name"]
