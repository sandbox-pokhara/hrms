from typing import Any

from django.core.management.base import BaseCommand

from core.tasks import credit_absence_balance


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any):
        credit_absence_balance()
