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

from . import models, serializers


class CustomPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = models.Article.objects.none()
    serializer_class = serializers.ArticleSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.SessionAuthentication, authentication.BasicAuthentication]
    #filter_backends = [filters.CustomSearchFilter]
    #filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    #filter_fields = ('json',)
    pagination_class = CustomPagination

    def list(self, request, *args, **kwargs):
        self.queryset = models.Article.objects.all().order_by("-updated_at")
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.queryset = models.Article.objects.filter(owner=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)  # self.perform_create
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        self.queryset = models.Article.objects.filter(owner=request.user)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.queryset = models.Article.objects.filter(owner=request.user)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        self.queryset = models.Article.objects.filter(owner=request.user)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.queryset = models.Article.objects.filter(owner=request.user)
        return super().destroy(self, request, *args, **kwargs)


# https://github.com/zoonaka/dx/blob/master/corporate_number/views.py
# APIView is useful when edit each model
# ListAPIView is suitable for read only view


def index(request):
    current_site = get_current_site(request)
    site_name = current_site.name
    context = {'is_debug': settings.DEBUG, "site_name": site_name}
    return render(request, 'crm/index.html', context)

def new(request):
    current_site = get_current_site(request)
    site_name = current_site.name
    context = {'is_debug': settings.DEBUG, "site_name": site_name}
    return render(request, 'crm/edit.html', context)

def edit(request, article_pk):
    current_site = get_current_site(request)
    site_name = current_site.name
    api_url = reverse("crm:article-detail", args=[article_pk])
    context = {'is_debug': settings.DEBUG, "site_name": site_name, "api_url": api_url}
    return render(request, 'crm/edit.html', context)
