from core import serializers
from core.models import User
from core.serializers import UserDTO
from core.viewsets import GenericViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response


class UserViewSet(GenericViewSet[User]):
    queryset = User.objects.all()
    lookup_field = "username"

    serializer_classes = {
        "current": {"response": serializers.UserDTO},
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
