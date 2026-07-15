from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Solo usuarios con role=ADMIN dentro de su tenant."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == request.user.Role.ADMIN
        )
