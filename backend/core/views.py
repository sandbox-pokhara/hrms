from typing import Any

from core import serializers
from core.models import User
from core.serializers import UserDTO
from core.viewsets import GenericViewSet
from core.viewsets import schema_viewset
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response


@schema_viewset
class UserViewSet(GenericViewSet[User]):
    queryset = User.objects.all()
    lookup_field = "username"

    serializer_classes = {
        "current": {"response": serializers.UserDTO},
        "create_user": {
            "request": serializers.PostCreateUser,
            "response": serializers.GenericDTO,
        },
    }

    @action(
        detail=False,
        methods=["get"],
        url_path="current",
        permission_classes=[IsAuthenticated],
    )
    def current(self, request: Request):
        serializer = UserDTO(instance=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="create",
        permission_classes=[IsAuthenticated, IsAdminUser],
    )
    def create_user(self, request: Request, *args: Any, **kwargs: Any):
        request_data = self.get_request_body(request)

        user = User.objects.create_user(
            username=request_data["username"],
            password=request_data["password"],
            is_superuser=False,
        )
        user.save()

        return Response(
            {"detail": "User created successfully."},
            status=status.HTTP_200_OK,
        )
