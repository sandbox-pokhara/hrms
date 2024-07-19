from typing import Any

from core import serializers
from core.models import User
from core.serializers import PostLogin
from core.serializers import UserDTO
from core.viewsets import GenericViewSet
from django.contrib.auth import authenticate
from django.contrib.auth import login
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response


class UserViewSet(GenericViewSet[User]):
    queryset = User.objects.all()
    lookup_field = "username"

    serializer_classes = {
        "register": {
            "request": serializers.PostRegister,
            "response": serializers.GenericDTO,
        },
        "login": {
            "request": serializers.PostLogin,
            "response": serializers.GenericDTO,
        },
        "current": {"response": serializers.UserDTO},
        "create_user": {
            "request": serializers.PostLogin,
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
        url_path="register",
    )
    def register(self, request: Request, *args: Any, **kwargs: Any):
        request_data = self.get_request_body(request)
        admin_user_exists = User.objects.filter(is_superuser=True).exists()

        if admin_user_exists:
            return Response(
                {"detail": "Admin already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=request_data["username"],
            email=request_data["email"],
            password=request_data["password"],
            is_superuser=True,
        )
        user.save()

        login(request, user)

        return Response(
            {"detail": "User created successfully."}, status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="login",
    )
    def login(self, request: Request, *args: Any, **kwargs: Any):
        request_data = self.get_request_body(request)
        username = request_data["username"]
        password = request_data["password"]

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)  # type: ignore
        return Response(PostLogin(user).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="setup")
    def need_setup(self, request: Request, *args: Any, **kwargs: Any):
        admin_user_exists = User.objects.filter(is_superuser=True).exists()

        if admin_user_exists:
            return Response(
                {"need_setup": False},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"need_setup": True},
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
