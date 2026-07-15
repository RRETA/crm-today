from django.urls import path

from .views import (
    ActivitySummaryView,
    FunnelView,
    KpiSummaryView,
    OpportunitySummaryView,
    OwnerPerformanceView,
    PipelineSummaryView,
    QuoteStatusView,
    SalesTrendView,
    TopAccountsView,
)

urlpatterns = [
    path("dashboard/pipeline/", PipelineSummaryView.as_view(), name="dashboard-pipeline"),
    path(
        "dashboard/opportunities/",
        OpportunitySummaryView.as_view(),
        name="dashboard-opportunities",
    ),
    path("dashboard/activities/", ActivitySummaryView.as_view(), name="dashboard-activities"),
    path("dashboard/kpis/", KpiSummaryView.as_view(), name="dashboard-kpis"),
    path("dashboard/sales-trend/", SalesTrendView.as_view(), name="dashboard-sales-trend"),
    path("dashboard/funnel/", FunnelView.as_view(), name="dashboard-funnel"),
    path("dashboard/top-accounts/", TopAccountsView.as_view(), name="dashboard-top-accounts"),
    path(
        "dashboard/owner-performance/",
        OwnerPerformanceView.as_view(),
        name="dashboard-owner-performance",
    ),
    path("dashboard/quotes-status/", QuoteStatusView.as_view(), name="dashboard-quotes-status"),
]
