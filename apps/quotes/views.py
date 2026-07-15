from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.core.mixins import TenantQuerySetMixin

from .models import Quote, QuoteItem
from .serializers import QuoteItemSerializer, QuoteSerializer


class QuoteViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["opportunity", "status"]


class QuoteItemViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = QuoteItem.objects.all()
    serializer_class = QuoteItemSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["quote", "product"]
