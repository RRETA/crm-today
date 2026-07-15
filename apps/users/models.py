from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        VENDEDOR = "VENDEDOR", "Vendedor"

    tenant = models.ForeignKey(
        "tenants.Tenant", on_delete=models.CASCADE, related_name="users"
    )
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VENDEDOR)

    class Meta(AbstractUser.Meta):
        ordering = ["username"]

    def __str__(self):
        return self.username
