from django.conf import settings
from django.db import models

from apps.core.models import TenantAwareModel


class Account(TenantAwareModel):
    name = models.CharField(max_length=255)
    rfc = models.CharField(max_length=13, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="accounts"
    )

    class Meta(TenantAwareModel.Meta):
        ordering = ["name"]

    def __str__(self):
        return self.name


class Contact(TenantAwareModel):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="contacts")
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    position = models.CharField(max_length=100, blank=True)

    class Meta(TenantAwareModel.Meta):
        ordering = ["name"]

    def __str__(self):
        return self.name
