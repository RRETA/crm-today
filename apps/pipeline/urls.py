from rest_framework.routers import DefaultRouter

from .views import OpportunityViewSet, StageViewSet

router = DefaultRouter()
router.register("stages", StageViewSet, basename="stage")
router.register("opportunities", OpportunityViewSet, basename="opportunity")

urlpatterns = router.urls
