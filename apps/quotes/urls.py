from rest_framework.routers import DefaultRouter

from .views import QuoteItemViewSet, QuoteViewSet

router = DefaultRouter()
router.register("quotes", QuoteViewSet, basename="quote")
router.register("quote-items", QuoteItemViewSet, basename="quoteitem")

urlpatterns = router.urls
