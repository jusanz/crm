from rest_framework import serializers

from . import models

class ArticleSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='crm:article-detail',
        read_only=True
    )
    class Meta:
        model = models.Article
        fields = ['json', 'url', 'pk']
