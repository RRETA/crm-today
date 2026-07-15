from rest_framework import serializers

from .models import Quote, QuoteItem


class QuoteItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)

    class Meta:
        model = QuoteItem
        fields = ("id", "quote", "product", "quantity", "unit_price", "line_total")
        read_only_fields = ("id",)

    def validate(self, attrs):
        if not attrs.get("unit_price"):
            product = attrs.get("product") or getattr(self.instance, "product", None)
            if product:
                attrs["unit_price"] = product.price
        return attrs


class QuoteSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Quote
        fields = (
            "id",
            "opportunity",
            "status",
            "items",
            "total",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
