from datetime import timedelta
import dramatiq
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from dramatiq_crontab import cron  # type: ignore

from core.models import AbsenceBalance
from core.models import Settings
from core.models import TimeLog
from core.models import User


@transaction.atomic
def absence_balance_credit():
    users = User.objects.all()
    superuser = User.objects.filter(is_superuser=True).first()
    if superuser is None:
        raise ObjectDoesNotExist("No admin found.")
    now = timezone.now()
    settings = Settings.objects.get(id=1)
    if not settings:
        raise ObjectDoesNotExist("Settings doesn't exist.")

    for user in users:
        AbsenceBalance.objects.create(
            user=user,
            date=now,
            description="Sick leave credit",
            delta=settings.sick_leave_per_month,
            created_by=superuser,
        )
        AbsenceBalance.objects.create(
            user=user,
            date=now,
            description="Casual leave credit",
            delta=settings.casual_leave_per_month,
            created_by=superuser,
        )


def check_time_logs():
    TimeLog.objects.filter(
        user__max_time_log_length__gt=timedelta(seconds=0),
        start__lt=timezone.now() - F("user__max_time_log_length"),
        end__isnull=True,
    ).update(end=timezone.now())


@cron("0 0 1 * *")
@dramatiq.actor  # type: ignore
def absence_balance_credit_cron():
    absence_balance_credit()


@cron("*/5 * * * *")
@dramatiq.actor  # type: ignore
def check_time_logs_cron():
    check_time_logs()
