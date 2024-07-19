from typing import Any
from typing import NotRequired
from typing import TypedDict
from typing import TypeVar

from django.db.models import Model
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import extend_schema_view
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.serializers import Serializer
from rest_framework.viewsets import GenericViewSet as BaseViewSet

from core.serializers import GenericDTO

M = TypeVar("M", bound=Model)


class SerializerClasses(TypedDict):
    parameters: NotRequired[type[Serializer[Any]]]
    request: NotRequired[type[BaseSerializer[Any]]]
    response: type[BaseSerializer[Any]]


class GenericViewSet(BaseViewSet[M]):
    serializer_classes: dict[str, SerializerClasses] = {}

    def get_request_parameter_class(self) -> type[BaseSerializer[M]]:
        serialzier = self.serializer_classes[self.action].get("parameters")
        if serialzier is None:
            raise APIException("Parameter serializer not found.")
        return serialzier

    def get_request_serializer_class(self) -> type[BaseSerializer[M]]:
        serialzier = self.serializer_classes[self.action].get("request")
        if serialzier is None:
            raise APIException("Request serializer not found.")
        return serialzier

    def get_request_body(self, request: Request):
        serializer = self.get_request_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    def get_queries(self, request: Request):
        serializer = self.get_request_parameter_class()(data=request.GET)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    def get_response_serializer_class(self) -> type[BaseSerializer[M]]:
        return self.serializer_classes[self.action]["response"]

    def get_serializer_class(self):
        return self.get_response_serializer_class()


class CreateModelMixin(GenericViewSet[M]):
    def create(self, request: Request, *args: Any, **kwargs: Any):
        serializer_cls = self.get_request_serializer_class()
        serializer = serializer_cls(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        serializer_cls = self.get_response_serializer_class()
        data = serializer_cls(instance=instance).data
        return Response(data, status=status.HTTP_201_CREATED)


class RetrieveModelMixin(GenericViewSet[M]):
    def retrieve(self, request: Request, *args: Any, **kwargs: Any):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ListModelMixin(GenericViewSet[M]):
    def list(self, request: Request, *args: Any, **kwargs: Any):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PartialUpdateModelMixin(GenericViewSet[M]):
    def partial_update(self, request: Request, *args: Any, **kwargs: Any):
        instance = self.get_object()
        serializer_cls = self.get_request_serializer_class()
        serializer = serializer_cls(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        serializer_cls = self.get_response_serializer_class()
        data = serializer_cls(instance=instance).data
        return Response(data)


class UpdateModelMixin(GenericViewSet[M]):
    def update(self, request: Request, *args: Any, **kwargs: Any):
        instance = self.get_object()
        serializer_cls = self.get_request_serializer_class()
        serializer = serializer_cls(instance, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        serializer_cls = self.get_response_serializer_class()
        data = serializer_cls(instance=instance).data
        return Response(data)


class DestroyModelMixin(GenericViewSet[M]):
    def destroy(self, request: Request, *args: Any, **kwargs: Any):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def schema_viewset(view: type[GenericViewSet[M]]) -> type[GenericViewSet[M]]:
    data: dict[str, Any] = {}
    for k, v in view.serializer_classes.items():
        parameters = v.get("parameters")
        parameters = [parameters] if parameters else []
        if k == "create":
            success_code = status.HTTP_201_CREATED
        elif k == "destroy":
            success_code = status.HTTP_204_NO_CONTENT
        else:
            success_code = status.HTTP_200_OK
        data[k] = extend_schema(
            request=v.get("request"),
            responses={
                success_code: v["response"],
                status.HTTP_400_BAD_REQUEST: GenericDTO,
                status.HTTP_403_FORBIDDEN: GenericDTO,
            },
            parameters=parameters,
        )
    return extend_schema_view(**data)(view)
