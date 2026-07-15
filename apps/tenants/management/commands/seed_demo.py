from django.core.management.base import BaseCommand

from apps.tenants.models import Tenant
from apps.users.models import User


class Command(BaseCommand):
    help = "Crea un tenant y un usuario admin de prueba para desarrollo local."

    def handle(self, *args, **options):
        tenant, created = Tenant.objects.get_or_create(
            slug="demo", defaults={"name": "Empresa Demo"}
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Tenant creado: {tenant.name}"))
        else:
            self.stdout.write(f"Tenant ya existía: {tenant.name}")

        if not User.objects.filter(username="admin", tenant=tenant).exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@demo.local",
                password="admin12345",
                tenant=tenant,
                role=User.Role.ADMIN,
            )
            self.stdout.write(self.style.SUCCESS("Usuario admin creado (admin / admin12345)"))
        else:
            self.stdout.write("Usuario admin ya existía")
