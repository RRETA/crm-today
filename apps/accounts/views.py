from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.core.mixins import TenantQuerySetMixin

from .models import Account, Contact
from .serializers import AccountSerializer, ContactSerializer


class AccountViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["owner", "industry"]
    search_fields = ["name", "rfc"]


class ContactViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["account"]
    search_fields = ["name", "email"]
