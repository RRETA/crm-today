from rest_framework import serializers

from .models import Account, Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = (
            "id",
            "account",
            "name",
            "email",
            "phone",
            "position",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class AccountSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True, read_only=True)

    class Meta:
        model = Account
        fields = (
            "id",
            "name",
            "rfc",
            "industry",
            "owner",
            "contacts",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
