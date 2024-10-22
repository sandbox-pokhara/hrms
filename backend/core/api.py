import datetime
from datetime import timedelta
from typing import Union

import httpx
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models import Case
from django.db.models import DurationField
from django.db.models import ExpressionWrapper
from django.db.models import F
from django.db.models import Sum
from django.db.models import Value
from django.db.models import When
from django.db.models.functions import Coalesce
from django.http import HttpRequest
from django.http import HttpResponse
from django.shortcuts import get_list_or_404
from django.utils import timezone
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import NinjaAPI
from ninja.pagination import paginate  # type: ignore
from ninja.security import django_auth
from ninja.security import django_auth_superuser

from core.models import AbsenceBalance
from core.models import Activity
from core.models import Holiday
from core.models import Project
from core.models import TimeLog
from core.models import User
from core.schemas import AbsenceBalanceDTO
from core.schemas import ActivityDTO
from core.schemas import AddHoliday
from core.schemas import AvailableCountries
from core.schemas import ChangePassword
from core.schemas import CreateActivity
from core.schemas import CreateProject
from core.schemas import CreateUser
from core.schemas import EditTimeLogs
from core.schemas import EndSessionUserIds
from core.schemas import GenericDTO
from core.schemas import HolidayDTO
from core.schemas import ImportHolidays
from core.schemas import Login
from core.schemas import ProjectDTO
from core.schemas import RemainingAbsences
from core.schemas import StartTimeLog
from core.schemas import SubmitAbsence
from core.schemas import TimeLogDTO
from core.schemas import TimeLogIds
from core.schemas import TimeLogSummaryDTO
from core.schemas import TimeLogSummaryPerDay
from core.schemas import UserDTO
from core.schemas import UserListDTO
from core.schemas import WorkingHoursSummary

api = NinjaAPI(docs_url="/docs/", csrf=True)


@api.exception_handler(ValidationError)
def django_validation_error(request: HttpRequest, exc: ValidationError):
    return api.create_response(
        request,
        {
            "detail": [
                {
                    "type": "validation_error",
                    "loc": [],  # impossible to find out
                    "msg": e,
                }
                for e in exc.messages
            ]
        },
        status=422,
    )


@api.post("/csrf/")
@ensure_csrf_cookie
@csrf_exempt
def get_csrf_token(request: HttpRequest):
    return HttpResponse()


@api.get("/projects/", response=list[ProjectDTO], auth=django_auth)
@paginate
def list_projects(request: HttpRequest):
    return Project.objects.all().order_by("-id")


@api.post("/projects/", response=GenericDTO, auth=django_auth)
def create_project(request: HttpRequest, project: CreateProject):
    try:
        Project.objects.create(name=project.project)
        return 200, {"detail": "Project created successfully."}
    except Exception:
        return 400, {"detail": "Something went wrong."}


@api.get("/activities/", response=list[ActivityDTO], auth=django_auth)
@paginate
def list_activities(request: HttpRequest):
    return Activity.objects.all().order_by("-id")


@api.post("/activities/", response=GenericDTO, auth=django_auth)
def create_activity(request: HttpRequest, activity: CreateActivity):
    try:
        Activity.objects.create(name=activity.activity)
        return 200, {"detail": "Activity created successfully."}
    except Exception:
        return 400, {"detail": "Something went wrong."}


@api.get("/users/current/", response=UserDTO, auth=django_auth)
def current_user(request: HttpRequest):
    return request.user


@api.post(
    "/users/", response={200: UserDTO, 400: GenericDTO}, auth=django_auth
)
def create_user(request: HttpRequest, user: CreateUser):
    try:
        user_obj = User.objects.create_user(
            username=user.username,
            password=user.password,
            is_superuser=False,
        )
        user_obj.save()
        return user_obj
    except IntegrityError:
        return 400, {"detail": "Username already exists."}


@api.get(
    "/users/",
    response={200: list[UserListDTO], 400: GenericDTO},
    auth=django_auth_superuser,
)
@paginate
def list_users(request: HttpRequest):
    user_obj = User.objects.annotate(
        absence_balance=Coalesce(Sum("absence_balances__delta"), 0.0)
    )
    return user_obj


@api.post(
    "/users/change-password/",
    auth=django_auth,
    response={200: GenericDTO, 400: GenericDTO},
)
def change_password(request: HttpRequest, data: ChangePassword):
    user = request.user
    if not user.check_password(data.current_password):
        return 400, {"detail": "Current password is incorrect."}
    validate_password(data.new_password)
    user.set_password(data.new_password)
    user.save()
    update_session_auth_hash(request, user)  # type: ignore
    return GenericDTO(detail="Password changed successfully.")


@api.get(
    "/time-logs/",
    auth=django_auth,
    response={200: list[TimeLogDTO]},
)
@paginate
def list_time_logs(request: HttpRequest):
    if request.user.is_superuser:  # type: ignore
        objs = TimeLog.objects.filter(user__is_active=True)
    else:
        objs = TimeLog.objects.filter(user=request.user, user__is_active=True)
    return objs.order_by("-id")


@api.get(
    "/time-logs/current/",
    auth=django_auth,
    response={200: TimeLogDTO, 404: GenericDTO},
)
def current_time_log(request: HttpRequest):
    obj = TimeLog.objects.filter(user=request.user, end=None).first()
    if not obj:
        return 404, {"detail": "Not found."}
    return obj


@api.post(
    "/time-logs/start/",
    auth=django_auth,
    response={200: TimeLogDTO, 400: GenericDTO},
)
def start_time_log(request: HttpRequest, data: StartTimeLog):
    try:
        if TimeLog.objects.filter(user=request.user, end=None).exists():
            return 400, {"detail": "An active session already exists."}
        obj = TimeLog.objects.create(
            user=request.user,
            date=data.date if data.date else timezone.localdate(),
            start=timezone.now(),
            end=None,
            project=Project.objects.get(id=data.project),
            activity=Activity.objects.get(id=data.activity),
        )
        obj.save()
        return obj
    except Project.DoesNotExist:
        return 400, {"detail": "Project does not exist."}
    except Activity.DoesNotExist:
        return 400, {"detail": "Activity does not exist."}


@api.post("/time-logs/end/", auth=django_auth, response=GenericDTO)
def end_time_log(request: HttpRequest):
    TimeLog.objects.filter(user=request.user, end=None).update(
        end=timezone.now()
    )
    return {"detail": "Success."}


@api.post(
    "/time-logs/users/end/", auth=django_auth_superuser, response=GenericDTO
)
def end_users_time_log(request: HttpRequest, data: EndSessionUserIds):
    users = get_list_or_404(User, id__in=data.user_ids)
    updated_count = 0
    for user in users:
        updated_count += TimeLog.objects.filter(
            user=user, end__isnull=True
        ).update(end=timezone.now())
    return {"detail": f"{updated_count} users sessions terminated."}


@api.get(
    "/time-logs/summary/",
    auth=django_auth,
    response={200: list[TimeLogSummaryDTO]},
)
def time_log_summary(
    request: HttpRequest, start: datetime.date, end: datetime.date
):
    # database
    logs = TimeLog.objects.filter(
        date__gte=start,
        date__lte=end,
    )
    absences = AbsenceBalance.objects.filter(
        date__gte=start, date__lte=end, delta=-1
    )
    if request.user.is_superuser:  # type: ignore
        users = User.objects.filter(is_active=True)
    else:
        users = User.objects.filter(id=request.user.pk, is_active=True)
        logs = logs.filter(user=request.user)
        absences = absences.filter(user=request.user)
    logs = logs.values("user", "date", "start", "end")
    holidays = Holiday.objects.filter(date__gte=start, date__lte=end)

    # data generation
    holidays_map = {h.date: h.name for h in holidays}
    absences_map = {
        f"{a.date}_{a.user.username}": a.description for a in absences
    }
    output: list[TimeLogSummaryDTO] = []

    current_time = timezone.now()
    for u in users:
        user_data = TimeLogSummaryDTO(user=u.username, summary=[])
        date = start
        while date <= end:
            logs_per_day = [
                l for l in logs if l["date"] == date and l["user"] == u.pk
            ]
            hours_worked = (
                sum(
                    [
                        (
                            (i["end"] - i["start"]).total_seconds()
                            if i["end"] is not None
                            else (current_time - i["start"]).total_seconds()
                        )
                        for i in logs_per_day
                    ]
                )
                / 3600
            )
            weekday = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][
                date.weekday()
            ]

            holiday = holidays_map.get(date, "")
            # if there is no existing holiday in saturday, mark holiday as saturday
            # TODO: add option to make sunday holiday
            # add a field in settings to choose if saturday and sunday are holidays
            if weekday == "sat" and not holiday:
                holiday = "Saturday"
            absence = absences_map.get(f"{date}_{u.username}", "")
            expected_hours = (
                0
                if holiday or absence
                else getattr(u, f"expected_hours_{weekday}", 0)
            )
            user_data.summary.append(
                TimeLogSummaryPerDay(
                    date=date,
                    hours_worked=hours_worked,
                    weekday=weekday,
                    expected_hours=expected_hours,
                    holiday=holiday,
                    absence=absence,
                )
            )
            date += datetime.timedelta(days=1)
        output.append(user_data)
    return output


@api.post(
    "/time-logs/edit/",
    auth=django_auth_superuser,
    response={200: GenericDTO, 400: GenericDTO},
)
def update_time_logs(request: HttpRequest, data: EditTimeLogs):
    time_logs = TimeLog.objects.filter(id__in=data.time_log_ids)
    update_fields = {}

    if data.activity_id is not None:
        update_fields["activity_id"] = data.activity_id
    if data.project_id is not None:
        update_fields["project_id"] = data.project_id
    if data.start_time is not None:
        update_fields["start"] = data.start_time
    if data.end_time is not None:
        update_fields["end"] = data.end_time

    try:
        updated_count = time_logs.update(**update_fields)
        return 200, {
            "detail": f"{updated_count} time log item(s) updated successfully."
        }
    except IntegrityError:
        return 400, {"detail": f"Invalid payload."}


@api.post(
    "/time-logs/delete/",
    auth=django_auth_superuser,
    response={200: GenericDTO, 400: GenericDTO},
)
def delete_time_logs(request: HttpRequest, data: TimeLogIds):
    time_logs = TimeLog.objects.filter(id__in=data.time_log_ids)
    count, _ = time_logs.delete()
    return 200, {"detail": f"{count} time log item(s) deleted successfully."}


@api.get(
    "/absence-balances/",
    auth=django_auth,
    response={200: list[AbsenceBalanceDTO]},
)
@paginate
def list_absence_balances(request: HttpRequest):
    if request.user.is_superuser:  # type: ignore
        objs = AbsenceBalance.objects.all()
    else:
        objs = AbsenceBalance.objects.filter(user=request.user)
    return objs.order_by("-id")


@api.get(
    "/absence-balances/remaining/",
    auth=django_auth,
    response={200: RemainingAbsences},
)
def remaining_absences(request: HttpRequest):
    obj = AbsenceBalance.objects.filter(user=request.user).aggregate(
        value=Coalesce(Sum("delta"), 0.0)
    )
    return obj


@api.post(
    "/absence-balances/submit/",
    auth=django_auth,
    response={200: GenericDTO, 400: GenericDTO},
)
def submit_absence(request: HttpRequest, data: SubmitAbsence):
    logs = TimeLog.objects.filter(
        start__date__gte=data.start,
        start__date__lte=data.end,
        user=request.user,
    ).values_list("start__date", flat=True)
    existing_absences = AbsenceBalance.objects.filter(
        user=request.user, date__gte=data.start, date__lte=data.end, delta=-1
    ).values_list("date", flat=True)
    holidays = Holiday.objects.filter(
        date__gte=data.start, date__lte=data.end
    ).values_list("date", flat=True)

    date = data.start
    dates_to_submit: list[datetime.date] = []
    while date <= data.end:
        weekday = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][
            date.weekday()
        ]
        # TODO: add option to make sunday holiday
        # add a field in settings to choose if saturday and sunday are holidays
        if (
            weekday == "sat"
            or date in holidays
            or date in existing_absences
            or date in logs
        ):
            date += datetime.timedelta(days=1)
            continue
        dates_to_submit.append(date)

        date += datetime.timedelta(days=1)

    balance = AbsenceBalance.objects.filter(user=request.user).aggregate(
        value=Coalesce(Sum("delta"), 0.0)
    )["value"]
    required = len(dates_to_submit)
    if balance < required:
        return 400, {
            "detail": (
                "You do not have enough balance, "
                f"required={float(required)}, balance={balance}."
            )
        }
    objs = [
        AbsenceBalance(
            user=request.user,
            date=i,
            description=data.description,
            delta=-1,
            created_by=request.user,
        )
        for i in dates_to_submit
    ]
    objs = AbsenceBalance.objects.bulk_create(objs)
    return 200, {"detail": f"Successfully submitted {len(objs)} absences."}


@api.post("/auth/login/", response={200: GenericDTO, 400: GenericDTO})
def auth_login(request: HttpRequest, data: Login):
    user = authenticate(
        request,
        username=data.username,
        password=data.password,
    )
    if user is not None:
        login(request, user)
        return 200, {"detail": "Success."}
    else:
        return 400, {"detail": "Invalid credentials."}


@api.post("/auth/logout/", response=GenericDTO)
def auth_logout(request: HttpRequest):
    logout(request)
    return {"detail": "Success."}


@api.get("/holidays/", response=list[HolidayDTO], auth=django_auth)
@paginate
def list_holidays(request: HttpRequest):
    return Holiday.objects.all().order_by("date")


@api.post(
    "/holidays/",
    auth=django_auth_superuser,
    response={200: GenericDTO, 400: GenericDTO},
)
def create_holiday(request: HttpRequest, data: AddHoliday):
    Holiday.objects.create(name=data.name, date=data.date)
    return 200, {"detail": "Success."}


@api.get(
    "/holidays/import/available-countries/",
    response={200: list[AvailableCountries], 400: GenericDTO},
    auth=django_auth_superuser,
)
async def available_countries(request: HttpRequest):
    url = "https://date.nager.at/Api/v2/AvailableCountries"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            countries = response.json()

            transformed_countries = [
                {"country_code": country["key"], "name": country["value"]}
                for country in countries
            ]
        return 200, transformed_countries
    except httpx.HTTPError as e:
        return 400, {"detail": f"HTTP error occured: {str(e)}."}


@api.post(
    "/holidays/import/",
    auth=django_auth_superuser,
    response={200: list[HolidayDTO], 400: GenericDTO},
)
def import_holidays(request: HttpRequest, data: ImportHolidays):
    url = f"https://date.nager.at/Api/v3/PublicHolidays/{data.year}/{data.country_code}"

    try:
        with httpx.Client() as client:
            response = client.get(url)
            response.raise_for_status()
            holidays = response.json()

            holiday_objects = [
                Holiday(name=holiday["name"], date=holiday["date"])
                for holiday in holidays
            ]

            created_holidays = Holiday.objects.bulk_create(holiday_objects)
        return 200, created_holidays
    except httpx.HTTPError as e:
        return 400, {"detail": f"HTTP error occured: {str(e)}."}


@api.get(
    "/working-hours-summary/",
    response={200: WorkingHoursSummary, 400: GenericDTO},
    auth=django_auth,
)
def working_hours_summary(request: HttpRequest, start_date: datetime.date):
    today = now().date()
    start_of_week = now() - timedelta(days=now().weekday())
    start_of_month = now().replace(day=1)
    start_of_year = now().replace(month=1, day=1)
    # past_30_days = now() - timedelta(days=30)

    working_hours_queryset = TimeLog.objects.filter(user=request.user)

    aggregations = working_hours_queryset.aggregate(
        hours_today=Coalesce(
            Sum(
                Case(
                    When(
                        start__date=today,
                        then=ExpressionWrapper(
                            F("end") - F("start"), output_field=DurationField()
                        ),
                    ),
                    default=Value(timedelta(0)),
                    output_field=DurationField(),
                )
            ),
            timedelta(0),
        ),
        hours_this_week=Coalesce(
            Sum(
                Case(
                    When(
                        start__gte=start_of_week,
                        then=ExpressionWrapper(
                            F("end") - F("start"), output_field=DurationField()
                        ),
                    ),
                    default=Value(timedelta(0)),
                    output_field=DurationField(),
                )
            ),
            timedelta(0),
        ),
        hours_this_month=Coalesce(
            Sum(
                Case(
                    When(
                        start__gte=start_of_month,
                        then=ExpressionWrapper(
                            F("end") - F("start"), output_field=DurationField()
                        ),
                    ),
                    default=Value(timedelta(0)),
                    output_field=DurationField(),
                )
            ),
            timedelta(0),
        ),
        hours_this_year=Coalesce(
            Sum(
                Case(
                    When(
                        start__gte=start_of_year,
                        then=ExpressionWrapper(
                            F("end") - F("start"), output_field=DurationField()
                        ),
                    ),
                    default=Value(timedelta(0)),
                    output_field=DurationField(),
                )
            ),
            timedelta(0),
        ),
    )

    working_hours_graph = (
        working_hours_queryset.filter(start__date__gte=start_date)
        .values("start__date")
        .annotate(
            hours=Coalesce(
                Sum(
                    ExpressionWrapper(
                        F("end") - F("start"), output_field=DurationField()
                    )
                ),
                timedelta(0),
            ),
        )
        .order_by("start__date")
    )

    def timedelta_to_hours(td: Union[timedelta, int]) -> float:
        if isinstance(td, timedelta):
            return td.total_seconds() / 3600
        elif td == 0:
            return 0.0
        raise ValueError("Invalid input for timedelta_to_hours")

    graph_data = [
        {
            "date": item["start__date"],
            "hours_worked": timedelta_to_hours(item["hours"]),
        }
        for item in working_hours_graph
    ]

    return {
        "working_hours_today": timedelta_to_hours(aggregations["hours_today"]),
        "working_hours_this_week": timedelta_to_hours(
            aggregations["hours_this_week"]
        ),
        "working_hours_this_month": timedelta_to_hours(
            aggregations["hours_this_month"]
        ),
        "working_hours_this_year": timedelta_to_hours(
            aggregations["hours_this_year"]
        ),
        "working_hours_graph": graph_data,
    }
