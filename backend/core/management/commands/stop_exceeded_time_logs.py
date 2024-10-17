from typing import Any

from django.core.management.base import BaseCommand

from core.tasks import stop_exceeded_time_logs


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any):
        stop_exceeded_time_logs()