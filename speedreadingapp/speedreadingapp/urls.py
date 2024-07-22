from django.contrib import admin
from django.urls import path, include, re_path
from users import views as user_views
from django.contrib.auth import views as auth_views
from . import views
from .views import index
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', views.speed_read_home, name='speed_read_home'),
    path('api/', include('users.urls')),
    path('api/', include('UserLibrary.urls')),
    path('api', include('api.urls')),
    path('api/home/', views.api_home, name='api-home'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]


