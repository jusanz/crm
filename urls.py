from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework import routers
from . import views
from . import ical_feeds

app_name = "crm"

router = routers.DefaultRouter()
router.register(r"articles", views.ArticleViewSet)

urlpatterns = [
    path("", views.index, name="index"),
    path("new/", views.new, name="new"),
    path("edit/<int:article_pk>/", views.edit, name="edit"),
    path("api/", include(router.urls)),
    path('all_schedules/feed.ics', ical_feeds.AllSchedulesFeed()),
]
