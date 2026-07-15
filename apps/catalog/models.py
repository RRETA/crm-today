from django.db import models

from apps.core.models import TenantAwareModel


class Product(TenantAwareModel):
    class Type(models.TextChoices):
        SERVICIO = "SERVICIO", "Servicio"
        PRODUCTO = "PRODUCTO", "Producto"

    type = models.CharField(max_length=20, choices=Type.choices)
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta(TenantAwareModel.Meta):
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(fields=["tenant", "sku"], name="unique_sku_per_tenant"),
        ]

    def __str__(self):
        return self.name
