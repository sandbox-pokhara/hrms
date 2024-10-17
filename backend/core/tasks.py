import dramatiq
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.utils import timezone
from dramatiq_crontab import cron  # type: ignore

from core.models import AbsenceBalance
from core.models import Settings
from core.models import User
from core.models import TimeLog


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


@cron("0 0 1 * *")
@dramatiq.actor  # type: ignore
def absence_balance_credit_cron():
    absence_balance_credit()


@transaction.atomic
def stop_exceeded_time_logs():
    users = User.objects.all()

    for user in users:
        max_length_hours = user.max_time_log_length
        if max_length_hours == 0:
            continue
        active_logs = TimeLog.objects.filter(user=user, end__isnull=True)
        max_length = timezone.timedelta(hours=max_length_hours)

        for log in active_logs:
            if log.start + max_length < timezone.now():
                log.end = timezone.now()
                log.save()


@cron("*/5 * * * *")
@dramatiq.actor  # type: ignore
def stop_exceeded_time_logs_corn():
    stop_exceeded_time_logs()
