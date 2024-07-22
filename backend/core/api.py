from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.db import IntegrityError
from django.http import HttpRequest
from django.http import HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from ninja import NinjaAPI
from ninja.pagination import paginate  # type: ignore
from ninja.security import django_auth

from core.models import Activity
from core.models import Holiday
from core.models import Project
from core.models import TimeLog
from core.models import User
from core.schemas import ActivityDTO
from core.schemas import CreateUser
from core.schemas import GenericDTO
from core.schemas import HolidayDTO
from core.schemas import Login
from core.schemas import ProjectDTO
from core.schemas import StartTimeLog
from core.schemas import TimeLogDTO
from core.schemas import UserDTO

api = NinjaAPI(docs_url="/docs/", csrf=True)


@api.post("/csrf/")
@ensure_csrf_cookie
@csrf_exempt
def get_csrf_token(request: HttpRequest):
    return HttpResponse()


@api.get("/projects/", response=list[ProjectDTO], auth=django_auth)
@paginate
def list_projects(request: HttpRequest):
    return Project.objects.all().order_by("-id")


@api.get("/activities/", response=list[ActivityDTO], auth=django_auth)
@paginate
def list_activities(request: HttpRequest):
    return Activity.objects.all().order_by("-id")


@api.get("/users/current/", response=UserDTO, auth=django_auth)
def current_user(request: HttpRequest):
    return request.user


@api.post("/users/", response={200: UserDTO, 400: GenericDTO})
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
    "/time-logs/",
    auth=django_auth,
    response={200: list[TimeLogDTO]},
)
@paginate
def list_time_logs(request: HttpRequest):
    if request.user.is_superuser:  # type: ignore
        objs = TimeLog.objects.all()
    else:
        objs = TimeLog.objects.filter(user=request.user)
    return objs.order_by("-id")


@api.get(
    "/time-logs/current/",
    auth=django_auth,
    response={404: GenericDTO, 200: TimeLogDTO},
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
            begin=timezone.now(),
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
    return Holiday.objects.all().order_by("-id")
