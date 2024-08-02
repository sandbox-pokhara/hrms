from django.contrib.auth.models import AbstractUser
from django.db import models


class BaseModel(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.__class__.__name__} #{self.pk}"

    class Meta:
        abstract = True


class User(AbstractUser):
    expected_hours_sun = models.IntegerField(
        default=0, null=False, blank=False
    )
    expected_hours_mon = models.IntegerField(
        default=0, null=False, blank=False
    )
    expected_hours_tue = models.IntegerField(
        default=0, null=False, blank=False
    )
    expected_hours_wed = models.IntegerField(
        default=0, null=False, blank=False
    )
    expected_hours_thu = models.IntegerField(
        default=0, null=False, blank=False
    )
    expected_hours_fri = models.IntegerField(
        default=0, null=False, blank=False
    )
    expected_hours_sat = models.IntegerField(
        default=0, null=False, blank=False
    )

    def __str__(self) -> str:
        return self.username


class Project(BaseModel):
    name = models.CharField()

    def __str__(self) -> str:
        return self.name


class Activity(BaseModel):
    name = models.CharField()

    class Meta:  # type: ignore
        verbose_name_plural = "Activities"

    def __str__(self) -> str:
        return self.name


class TimeLog(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="time_logs"
    )
    start = models.DateTimeField()
    end = models.DateTimeField(blank=True, null=True)
    project = models.ForeignKey(
        Project, on_delete=models.PROTECT, related_name="time_logs"
    )
    activity = models.ForeignKey(
        Activity, on_delete=models.PROTECT, related_name="time_logs"
    )

    def __str__(self) -> str:
        return f"{self.user.username}:{self.project.name}:{self.activity.name}"


class Holiday(BaseModel):
    name = models.CharField()
    date = models.DateField()

    def __str__(self) -> str:
        return self.name


class AbsenceBalance(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="absence_balances"
    )
    date = models.DateField()
    description = models.CharField(max_length=500)
    delta = models.FloatField()
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_absence_balances",
    )

    def __str__(self) -> str:
        return self.user.username
