from django.contrib import admin

from .models import Opportunity, Stage


@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ("name", "tenant", "order", "is_won", "is_lost")
    list_filter = ("tenant",)


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ("name", "tenant", "account", "stage", "owner", "amount", "status")
    list_filter = ("tenant", "stage", "status", "type")
