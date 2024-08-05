import dramatiq
from django.db import transaction
from django.utils import timezone
from dramatiq_crontab import cron

from core.models import AbsenceBalance
from core.models import User


@transaction.atomic
def credit_absence_balance():
    users = User.objects.all()
    superuser = User.objects.filter(is_superuser=True).first()
    if superuser is None:
        print("No admin found.")
        return
    now = timezone.now()

    for user in users:
        AbsenceBalance.objects.create(
            user=user,
            date=now,
            description="Sick leave credit",
            delta=1,
        )
        AbsenceBalance.objects.create(
            user=user,
            date=now,
            description="Casual leave credit",
            delta=1,
        )


@cron("0 0 1 * *")
@dramatiq.actor
def credit_absence_balance_cron():
    credit_absence_balance()
