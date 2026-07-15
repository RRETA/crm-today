from django.db import models

from apps.core.models import TenantAwareModel


class Quote(TenantAwareModel):
    class Status(models.TextChoices):
        BORRADOR = "BORRADOR", "Borrador"
        ENVIADA = "ENVIADA", "Enviada"
        ACEPTADA = "ACEPTADA", "Aceptada"
        RECHAZADA = "RECHAZADA", "Rechazada"

    opportunity = models.ForeignKey(
        "pipeline.Opportunity", on_delete=models.CASCADE, related_name="quotes"
    )
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.BORRADOR)

    class Meta(TenantAwareModel.Meta):
        ordering = ["-created_at"]

    def __str__(self):
        return f"Cotización #{self.pk} - {self.opportunity.name}"

    @property
    def total(self):
        return sum((item.line_total for item in self.items.all()), start=0)


class QuoteItem(TenantAwareModel):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("catalog.Product", on_delete=models.PROTECT, related_name="+")
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta(TenantAwareModel.Meta):
        ordering = ["id"]

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"

    @property
    def line_total(self):
        return self.quantity * self.unit_price
