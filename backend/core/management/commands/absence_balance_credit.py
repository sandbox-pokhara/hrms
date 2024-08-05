from typing import Any

from django.core.management.base import BaseCommand

from core.tasks import absence_balance_credit


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any):
        absence_balance_credit()
