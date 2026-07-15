from datetime import timedelta

from django.db.models import Avg, Count, F, Q, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Account
from apps.activities.models import Activity
from apps.pipeline.models import Opportunity
from apps.quotes.models import Quote, QuoteItem


class PipelineSummaryView(APIView):
    """Monto y conteo de oportunidades abiertas agrupadas por stage, para el tenant actual."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Opportunity.objects.filter(tenant=request.user.tenant, status=Opportunity.Status.ABIERTA)
            .values("stage__id", "stage__name", "stage__order")
            .annotate(count=Count("id"), amount=Sum("amount"))
            .order_by("stage__order")
        )
        return Response(list(qs))


class OpportunitySummaryView(APIView):
    """Totales de oportunidades por estado (abierta/ganada/perdida) para el tenant actual."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Opportunity.objects.filter(tenant=request.user.tenant)
            .values("status")
            .annotate(count=Count("id"), amount=Sum("amount"))
        )
        return Response(list(qs))


class ActivitySummaryView(APIView):
    """Conteo de actividades pendientes por tipo para el tenant actual."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Activity.objects.filter(tenant=request.user.tenant, status=Activity.Status.PENDIENTE)
            .values("type")
            .annotate(count=Count("id"))
        )
        return Response(list(qs))


class KpiSummaryView(APIView):
    """Indicadores clave: cuentas, pipeline abierto, tasa de cierre, tamaño promedio de trato."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        tenant = request.user.tenant
        opportunities = Opportunity.objects.filter(tenant=tenant)
        open_qs = opportunities.filter(status=Opportunity.Status.ABIERTA)
        won_qs = opportunities.filter(status=Opportunity.Status.GANADA)
        lost_qs = opportunities.filter(status=Opportunity.Status.PERDIDA)

        won_count = won_qs.count()
        lost_count = lost_qs.count()
        decided = won_count + lost_count
        win_rate = round((won_count / decided) * 100, 1) if decided else 0

        quotes_value = (
            QuoteItem.objects.filter(quote__tenant=tenant)
            .aggregate(total=Sum(F("quantity") * F("unit_price")))["total"]
            or 0
        )

        return Response(
            {
                "accounts_count": Account.objects.filter(tenant=tenant).count(),
                "open_opportunities_count": open_qs.count(),
                "open_pipeline_amount": open_qs.aggregate(total=Sum("amount"))["total"] or 0,
                "win_rate": win_rate,
                "avg_deal_size": round(won_qs.aggregate(avg=Avg("amount"))["avg"] or 0, 2),
                "pending_activities_count": Activity.objects.filter(
                    tenant=tenant, status=Activity.Status.PENDIENTE
                ).count(),
                "quotes_value": quotes_value,
            }
        )


class SalesTrendView(APIView):
    """Monto de oportunidades creadas por mes (últimos 6 meses), separado por estado."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        since = timezone.now() - timedelta(days=180)
        qs = (
            Opportunity.objects.filter(tenant=request.user.tenant, created_at__gte=since)
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(
                ganada=Sum("amount", filter=Q(status=Opportunity.Status.GANADA)),
                perdida=Sum("amount", filter=Q(status=Opportunity.Status.PERDIDA)),
                abierta=Sum("amount", filter=Q(status=Opportunity.Status.ABIERTA)),
            )
            .order_by("month")
        )
        return Response(list(qs))


class FunnelView(APIView):
    """Conteo y monto de todas las oportunidades (cualquier estado) agrupadas por etapa."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Opportunity.objects.filter(tenant=request.user.tenant)
            .values("stage__id", "stage__name", "stage__order")
            .annotate(count=Count("id"), amount=Sum("amount"))
            .order_by("stage__order")
        )
        return Response(list(qs))


class TopAccountsView(APIView):
    """Las 5 cuentas con mayor monto acumulado en oportunidades."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Account.objects.filter(tenant=request.user.tenant)
            .annotate(total_amount=Sum("opportunities__amount"), opportunity_count=Count("opportunities"))
            .filter(total_amount__isnull=False)
            .order_by("-total_amount")[:5]
        )
        return Response(
            [
                {
                    "id": account.id,
                    "name": account.name,
                    "total_amount": account.total_amount,
                    "opportunity_count": account.opportunity_count,
                }
                for account in qs
            ]
        )


class OwnerPerformanceView(APIView):
    """Desempeño por propietario: oportunidades totales, ganadas y monto ganado."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Opportunity.objects.filter(tenant=request.user.tenant)
            .values("owner__id", "owner__username")
            .annotate(
                total_count=Count("id"),
                total_amount=Sum("amount"),
                won_count=Count("id", filter=Q(status=Opportunity.Status.GANADA)),
                won_amount=Sum("amount", filter=Q(status=Opportunity.Status.GANADA)),
            )
            .order_by("-won_amount")
        )
        return Response(list(qs))


class QuoteStatusView(APIView):
    """Conteo de cotizaciones agrupadas por estado."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Quote.objects.filter(tenant=request.user.tenant)
            .values("status")
            .annotate(count=Count("id"))
        )
        return Response(list(qs))
