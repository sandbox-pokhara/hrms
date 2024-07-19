import django_stubs_ext
from rest_framework.viewsets import GenericViewSet
from rest_framework.viewsets import ModelViewSet

django_stubs_ext.monkeypatch(extra_classes=(ModelViewSet, GenericViewSet))
