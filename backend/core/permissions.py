from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsAdminRole(BasePermission):
    def has_permission(self, request: Request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser == True
        )
