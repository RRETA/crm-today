from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.core.mixins import TenantQuerySetMixin
from apps.core.permissions import IsAdmin

from .models import User
from .serializers import TenantTokenObtainPairSerializer, UserCreateSerializer, UserSerializer


class TenantTokenObtainPairView(TokenObtainPairView):
    serializer_class = TenantTokenObtainPairSerializer


class UserViewSet(TenantQuerySetMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.action in ("list", "retrieve", "me"):
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        return Response(UserSerializer(request.user).data)
