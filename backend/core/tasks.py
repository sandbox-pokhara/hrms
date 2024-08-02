import dramatiq
from django.utils import timezone
from dramatiq_crontab import cron

from core.models import AbsenceBalance
from core.models import User


@cron("0 0 21 * *")
@dramatiq.actor
def absence_credit():
    users = User.objects.all()
    superuser = User.objects.filter(is_superuser=True).first()
    now = timezone.now()

    for user in users:
        AbsenceBalance.objects.create(
            user=user,
            date=now,
            description="Absence credit refill",
            delta=1.5,
            created_by=superuser,
        )
        print(f"Absence credit refilled for {user.username}")
