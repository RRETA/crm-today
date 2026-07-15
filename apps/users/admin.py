from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Tenant", {"fields": ("tenant", "role")}),
    )
    list_display = ("username", "email", "tenant", "role", "is_staff")
    list_filter = ("tenant", "role", "is_staff")
