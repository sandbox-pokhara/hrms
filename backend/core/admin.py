from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db.models import ExpressionWrapper
from django.db.models import F
from django.db.models import fields
from django.db.models.functions import Coalesce
from django.http import HttpRequest
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _

from core.models import AbsenceBalance
from core.models import Activity
from core.models import Holiday
from core.models import Project
from core.models import Settings
from core.models import TimeLog
from core.models import User


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin[Settings]):
    list_display = ["sick_leave_per_month", "casual_leave_per_month"]


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        *BaseUserAdmin.fieldsets,
        (
            "Expected working hours",
            {
                "fields": (
                    "expected_hours_sun",
                    "expected_hours_mon",
                    "expected_hours_tue",
                    "expected_hours_wed",
                    "expected_hours_thu",
                    "expected_hours_fri",
                    "expected_hours_sat",
                )
            },
        ),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin[Project]):
    search_fields = ["id", "name"]
    list_display = ["id", "name"]

    class Meta:
        model = Project


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin[Activity]):
    search_fields = ["id", "name"]
    list_display = ["id", "name"]

    class Meta:
        model = Activity


@admin.register(TimeLog)
class TimeLogAdmin(admin.ModelAdmin[TimeLog]):
    search_fields = ["user__username", "project__name", "activity__name"]
    list_display = [
        "id",
        "user",
        "date",
        "start",
        "end",
        "duration",
        "project",
        "activity",
    ]
    list_filter = ["user", "date", "project", "activity"]

    def get_queryset(self, request: HttpRequest):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            duration=ExpressionWrapper(
                Coalesce(F("end"), now()) - F("start"),
                output_field=fields.DurationField(),
            )
        )
        return queryset

    @admin.display(description="duration", ordering="duration")
    def duration(self, obj: TimeLog) -> str:
        duration_value = getattr(obj, "duration")
        hours, remainder = divmod(duration_value.total_seconds(), 3600)
        minutes = remainder // 60
        return f"{int(hours)}h{int(minutes)}m"

    class Meta:
        model = TimeLog


@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin[Holiday]):
    search_fields = ["id", "name"]
    list_display = ["id", "name", "date"]

    class Meta:
        model = Holiday


@admin.register(AbsenceBalance)
class AbsenceBalanceAdmin(admin.ModelAdmin[AbsenceBalance]):
    search_fields = ["id", "user__username", "description"]
    list_display = ["id", "user", "date", "description", "delta", "created_by"]

    class Meta:
        model = AbsenceBalance
