from typing import Any
from typing import TypeVar

from core import models
from django.db.models import Model
from rest_framework import serializers
from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer

M = TypeVar("M", bound=Model)


##############################################################################
### Override Model Serializer
##############################################################################
class RequiredFieldsModelSerializer(ModelSerializer[M]):
    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        for _, field in self.fields.items():
            if not isinstance(field, serializers.HiddenField):
                field.required = True


class NotRequiredFieldsModelSerializer(ModelSerializer[M]):
    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        for _, field in self.fields.items():
            if not isinstance(field, serializers.HiddenField):
                field.required = False


##############################################################################
### Model DTO
##############################################################################
class UserDTO(RequiredFieldsModelSerializer[models.User]):
    class Meta:  # type: ignore
        model = models.User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "is_superuser",
        ]


##############################################################################
### Custom DTO
##############################################################################
class GenericDTO(Serializer[Any]):
    detail = CharField()
