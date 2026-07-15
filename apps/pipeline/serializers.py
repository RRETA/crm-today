from rest_framework import serializers

from .models import Opportunity, Stage


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = ("id", "name", "order", "is_won", "is_lost")
        read_only_fields = ("id",)


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = (
            "id",
            "name",
            "type",
            "account",
            "contact",
            "stage",
            "owner",
            "amount",
            "currency",
            "probability",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
