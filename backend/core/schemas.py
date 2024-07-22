from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from ninja import Field
from ninja import ModelSchema
from ninja import Schema
from pydantic import Field
from pydantic import field_validator

from core.models import Activity
from core.models import Holiday
from core.models import Project
from core.models import TimeLog
from core.models import User


class UserDTO(ModelSchema):
    class Meta:
        model = User
        exclude = ["password"]


class TimeLogDTO(ModelSchema):
    project__name: str = Field(..., alias="project.name")
    activity__name: str = Field(..., alias="activity.name")
    user__username: str = Field(..., alias="user.username")

    class Meta:
        model = TimeLog
        fields = "__all__"


class ProjectDTO(ModelSchema):
    class Meta:
        model = Project
        fields = "__all__"


class ActivityDTO(ModelSchema):
    class Meta:
        model = Activity
        fields = "__all__"


class HolidayDTO(ModelSchema):
    class Meta:
        model = Holiday
        fields = "__all__"


class GenericDTO(Schema):
    detail: str


class StartTimeLog(Schema):
    project: int
    activity: int


class CreateUser(Schema):
    username: str
    password: str


class Login(Schema):
    username: str
    password: str


class ChangePassword(Schema):
    current_password: str
    new_password: str

    @field_validator("new_password")
    def validate_new_password(cls, value: str) -> str:
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise ValueError(e.messages)
        return value
