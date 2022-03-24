from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework import routers
from . import views

app_name = "crm"

router = routers.DefaultRouter()
router.register(r"article", views.ArticleViewSet)

urlpatterns = [
    path("", views.index, name="index"),
    path("new/", views.new, name="new"),
    path("edit/<int:article_pk>/", views.edit, name="edit"),
    path("api/", include(router.urls)),
]
