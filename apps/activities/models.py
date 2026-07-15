from django.conf import settings
from django.db import models

from apps.core.models import TenantAwareModel


class Activity(TenantAwareModel):
    class Type(models.TextChoices):
        LLAMADA = "LLAMADA", "Llamada"
        REUNION = "REUNION", "Reunión"
        TAREA = "TAREA", "Tarea"
        EMAIL = "EMAIL", "Email"

    class Status(models.TextChoices):
        PENDIENTE = "PENDIENTE", "Pendiente"
        COMPLETADA = "COMPLETADA", "Completada"
        CANCELADA = "CANCELADA", "Cancelada"

    type = models.CharField(max_length=20, choices=Type.choices)
    subject = models.CharField(max_length=255)
    account = models.ForeignKey(
        "accounts.Account",
        on_delete=models.CASCADE,
        related_name="activities",
        null=True,
        blank=True,
    )
    opportunity = models.ForeignKey(
        "pipeline.Opportunity",
        on_delete=models.CASCADE,
        related_name="activities",
        null=True,
        blank=True,
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="activities"
    )
    due_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDIENTE)

    class Meta(TenantAwareModel.Meta):
        ordering = ["due_date"]

    def __str__(self):
        return self.subject
