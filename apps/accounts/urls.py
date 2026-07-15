from rest_framework.routers import DefaultRouter

from .views import AccountViewSet, ContactViewSet

router = DefaultRouter()
router.register("accounts", AccountViewSet, basename="account")
router.register("contacts", ContactViewSet, basename="contact")

urlpatterns = router.urls
