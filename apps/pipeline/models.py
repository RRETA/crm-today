from django.conf import settings
from django.db import models

from apps.core.models import TenantAwareModel


class Stage(TenantAwareModel):
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    is_won = models.BooleanField(default=False)
    is_lost = models.BooleanField(default=False)

    class Meta(TenantAwareModel.Meta):
        ordering = ["order"]

    def __str__(self):
        return self.name


class Opportunity(TenantAwareModel):
    class Type(models.TextChoices):
        SERVICIO = "SERVICIO", "Servicio"
        PRODUCTO = "PRODUCTO", "Producto"

    class Status(models.TextChoices):
        ABIERTA = "ABIERTA", "Abierta"
        GANADA = "GANADA", "Ganada"
        PERDIDA = "PERDIDA", "Perdida"

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=Type.choices)
    account = models.ForeignKey(
        "accounts.Account", on_delete=models.CASCADE, related_name="opportunities"
    )
    contact = models.ForeignKey(
        "accounts.Contact",
        on_delete=models.SET_NULL,
        related_name="opportunities",
        null=True,
        blank=True,
    )
    stage = models.ForeignKey(Stage, on_delete=models.PROTECT, related_name="opportunities")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="opportunities"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="MXN")
    probability = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ABIERTA)

    class Meta(TenantAwareModel.Meta):
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
