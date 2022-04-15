from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db.models import Q
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse

from rest_framework import viewsets
from rest_framework import status
from rest_framework import permissions
from rest_framework import authentication
from rest_framework.response import Response
from rest_framework import pagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics

import django_filters.rest_framework
import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from . import models, serializers


class CustomPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = models.Article.objects.filter(json__has_key="schedule").order_by("-json__schedule__start_datetime")
    serializer_class = serializers.ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.SessionAuthentication, authentication.BasicAuthentication]
    #filter_backends = [filters.CustomSearchFilter]
    #filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    #filter_fields = ('json',)
    pagination_class = CustomPagination

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)  # self.perform_create
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(self, request, *args, **kwargs)


# https://github.com/zoonaka/dx/blob/master/corporate_number/views.py
# APIView is useful when edit each model
# ListAPIView is suitable for read only view


def index(request):
    current_site = get_current_site(request)
    site_name = current_site.name
    context = {'is_debug': settings.DEBUG, "site_name": site_name}
    return render(request, 'crm/schedules.html', context)


class DateView(generics.ListAPIView):
    queryset = models.Article.objects.filter(json__has_key="schedule").order_by("-json__schedule__start_datetime")
    serializer_class = serializers.ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.SessionAuthentication, authentication.BasicAuthentication]

    def list(self, request, year, month=None, day=None, *args, **kwargs):
        tzname = request.session.get('django_timezone')
        if not tzname:
            tzname = settings.TIME_ZONE
        from_dt = datetime(year, month, day, tzinfo=ZoneInfo(tzname))
        to_dt = from_dt + timedelta(days=1)

        queryset = self.get_queryset().filter(
            Q(
                json__schedule__start_datetime__gte=from_dt.timestamp(),
                json__schedule__start_datetime__lt=to_dt.timestamp()
            ) |
            Q(
                json__schedule__end_datetime__gte=from_dt.timestamp(),
                json__schedule__end_datetime__lt=to_dt.timestamp()
            ) |
            Q(
                json__schedule__start_datetime__lt=from_dt.timestamp(),
                json__schedule__end_datetime__gt=to_dt.timestamp()
            )
        )
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return Response(serializer.data)