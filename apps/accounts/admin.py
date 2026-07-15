from django.contrib import admin

from .models import Account, Contact


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("name", "tenant", "owner", "industry")
    list_filter = ("tenant",)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("name", "account", "tenant", "email")
    list_filter = ("tenant",)
