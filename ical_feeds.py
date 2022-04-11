from django_ical.views import ICalFeed
from django.urls import reverse
import json
from datetime import datetime
from django.contrib.sites.models import Site
from datetime import timezone

from . import models

class AllSchedulesFeed(ICalFeed):
    timezone = 'UTC'

    def product_id(self):
        current_site = Site.objects.get_current()
        site_domain = current_site.domain
        return '-//{}//AllSchedules//JP'.format(site_domain)
    
    def file_name(self): 
        current_site = Site.objects.get_current()
        site_name = current_site.name
        return "{}_all_schedules.ics".format(site_name)

    def items(self):
        return models.Article.objects.filter(json__has_key="schedule").order_by('-json__schedule__start_datetime')

    def item_title(self, item):
        if not "title" in item.json:
            return "_title"
        return item.json["title"]

    def item_description(self, item):
        if not "body" in item.json:
            return "_description"
        return item.json["body"]

    def item_start_datetime(self, item):
        timestamp = item.json["schedule"]["start_datetime"]
        return datetime.fromtimestamp(timestamp, timezone.utc).replace(tzinfo=None)

    def item_end_datetime(self, item):
        if not "end_datetime" in item.json["schedule"]:
            return None
        timestamp = item.json["schedule"]["end_datetime"]
        return datetime.fromtimestamp(timestamp, timezone.utc).replace(tzinfo=None)

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        return reverse('crm:article-detail', args=[item.pk])
