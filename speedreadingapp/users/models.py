# users/models.py

from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    wpm = models.IntegerField(default=300)
    chunk_size = models.IntegerField(default=1)
    font_size = models.IntegerField(default=30)
    text_color = models.CharField(max_length=7, default='#000000')
    background_color = models.CharField(max_length=7, default='#ffffff')

    def __str__(self):
        return self.user.username
