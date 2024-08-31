import datetime
from typing import Optional

from ninja import Field
from ninja import ModelSchema
from ninja import Schema
from pydantic import Field

from core.models import AbsenceBalance
from core.models import Activity
from core.models import Holiday
from core.models import Project
from core.models import TimeLog
from core.models import User


class UserDTO(ModelSchema):
    class Meta:
        model = User
        exclude = ["password"]


class UserListDTO(ModelSchema):
    absence_balance: float

    class Meta:
        model = User
        exclude = ["password", "user_permissions", "groups"]


class TimeLogDTO(ModelSchema):
    project__name: str = Field(..., alias="project.name")
    activity__name: str = Field(..., alias="activity.name")
    user__username: str = Field(..., alias="user.username")

    class Meta:
        model = TimeLog
        fields = "__all__"


class AbsenceBalanceDTO(ModelSchema):
    user__username: str = Field(..., alias="user.username")
    created_by__username: str = Field(..., alias="created_by.username")

    class Meta:
        model = AbsenceBalance
        fields = "__all__"


class RemainingAbsences(Schema):
    value: float


class SubmitAbsence(Schema):
    description: str
    start: datetime.date
    end: datetime.date


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
    date: Optional[str] = None


class CreateUser(Schema):
    username: str
    password: str


class Login(Schema):
    username: str
    password: str


class ChangePassword(Schema):
    current_password: str
    new_password: str


class TimeLogSummaryPerDay(Schema):
    date: datetime.date
    expected_hours: int
    hours_worked: float
    weekday: str
    holiday: str
    absence: str


class TimeLogSummaryDTO(Schema):
    user: str
    summary: list[TimeLogSummaryPerDay]


class CreateProject(Schema):
    project: str


class CreateActivity(Schema):
    activity: str


class TimeLogIds(Schema):
    time_log_ids: list[int]


class EditTimeLogs(Schema):
    time_log_ids: list[int]
    activity_id: Optional[int] = None
    project_id: Optional[int] = None
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None


class AddHoliday(Schema):
    name: str
    date: datetime.date


class EndSessionUserIds(Schema):
    user_ids: list[int]


class AvailableCountries(Schema):
    country_code: str
    name: str


class ImportHolidays(Schema):
    year: int
    country_code: str


class WorkingHoursGraph(Schema):
    date: datetime.date
    hours_worked: float


class WorkingHoursSummary(Schema):
    working_hours_today: float
    working_hours_this_week: float
    working_hours_this_month: float
    working_hours_this_year: float
    working_hours_graph: list[WorkingHoursGraph]
